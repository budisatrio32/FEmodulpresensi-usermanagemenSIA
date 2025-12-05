'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Send, MessageCircle, Check } from 'lucide-react';
import { findOrCreatePrivateConversation, getMessages, sendMessage, markMessagesAsRead } from '@/lib/chatApi';
import { getNotifications, markAsRead } from '@/lib/notificationApi';
import { getEcho } from '@/lib/echo';
import { useChatContext } from '@/lib/chat-context';

export default function ChatModal({ isOpen, onClose, userName, userNim = '', userId = '', conversationId: propConversationId = null }) {
    // Chat Context for global state
    const { openChat, closeChat } = useChatContext();
    
    // State
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [conversationId, setConversationId] = useState(propConversationId);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [displayNim, setDisplayNim] = useState(userNim);
    
    // Refs
    const messagesEndRef = useRef(null);

    // Get current user ID from profile API
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                // Dynamic import to avoid circular dependencies if any
                const { getProfile } = await import('@/lib/profileApi');
                const profileResponse = await getProfile();
                
                if (profileResponse.status === 'success' && profileResponse.data.id_user_si) {
                    setCurrentUserId(profileResponse.data.id_user_si);
                }
            } catch (error) {
                console.error('Error getting current user:', error);
            }
        };

        fetchCurrentUser();
    }, []);

    useEffect(() => {
        // Only run when modal is open AND conversationId is available
        if (!isOpen || !conversationId) return;

        const dismissConversationNotifications = async () => {
            try {
                // Fetch all unread chat notifications (use 'status: unread' not 'is_read')
                const response = await getNotifications({ type: 'chat', status: 'unread' });
                
                if (response.status === 'success' && response.data?.notifications) {
                    // Filter notifications that belong to this conversation
                    const conversationNotifs = response.data.notifications.filter(
                        notif => notif.metadata?.id_conversation?.toString() === conversationId.toString()
                    );
                    
                    if (conversationNotifs.length > 0) {
                        console.log('[ChatModal] 📧 Dismissing', conversationNotifs.length, 'notifications for conversation', conversationId);
                        
                        // Mark each notification as read (bulk operation)
                        const markPromises = conversationNotifs.map(notif => 
                            markAsRead(notif.id_notification).catch(err => 
                                console.error(`Failed to mark notification ${notif.id_notification}:`, err)
                            )
                        );
                        
                        await Promise.all(markPromises);
                        
                        // Notify navbar to update UI (with notification IDs to remove)
                        const notifIds = conversationNotifs.map(n => n.id_notification);
                        window.dispatchEvent(new CustomEvent('chatNotificationsDismissed', {
                            detail: { notificationIds: notifIds, conversationId }
                        }));
                        console.log('[ChatModal] ✅ Notifications dismissed and event dispatched with IDs:', notifIds);
                    }
                }
            } catch (error) {
                console.error('Error dismissing conversation notifications:', error);
            }
        };

        dismissConversationNotifications();
    }, [isOpen, conversationId]);

    // Find or create conversation and load messages
    useEffect(() => {
        if (!isOpen || !userId || !currentUserId) return;

        const initializeChat = async () => {
            try {
                setLoading(true);
                
                // Find or create private conversation
                const conversationResponse = await findOrCreatePrivateConversation(userId);

                if (conversationResponse.data) {
                    const convId = conversationResponse.data.id_conversation;
                    setConversationId(convId);
                    
                    // Update global chat context
                    openChat(String(convId));

                    // Load existing messages
                    const messagesResponse = await getMessages(convId);

                    if (messagesResponse.data) {
                        // Handle nested response structure: { messages: [...], conversation: {...} }
                        const messagesList = messagesResponse.data.messages || messagesResponse.data;
                        setMessages(messagesList);
                        
                        // Get NIM from conversation info if available
                        if (messagesResponse.data.conversation?.other_participant?.nim) {
                            setDisplayNim(messagesResponse.data.conversation.other_participant.nim);
                        }
                    }

                    // Subscribe to new messages & read events via WebSocket
                    const echo = getEcho();
                    if (echo) {
                        try {
                            console.log('[ChatModal] Subscribing to chat.' + convId);
                            
                            echo.private(`chat.${convId}`)
                                .listen('.NewChatMessage', (e) => {
                                    console.log('[ChatModal] New message received:', e);
                                    // Only add if it's not from current user (to avoid duplicates)
                                    if (e.message.id_user_si !== currentUserId) {
                                        setMessages(prev => {
                                            // Prevent duplicate by checking if message already exists
                                            const exists = prev.some(msg => msg.id_message === e.message.id_message);
                                            if (exists) {
                                                console.log('[ChatModal] Message already exists, skipping');
                                                return prev;
                                            }
                                            console.log('[ChatModal] Adding new message to state');
                                            return [...prev, e.message];
                                        });
                                        
                                        // Auto mark as read setelah 1 detik (simulate user seeing the message)
                                        setTimeout(() => {
                                            markMessagesAsRead(convId, [e.message.id_message])
                                                .catch(err => console.error('Error auto-marking as read:', err));
                                        }, 1000);
                                    }
                                })
                                .listen('.MessageRead', (e) => {
                                    console.log('[ChatModal] Message read event:', e);
                                    // Update read status - IMPORTANT: This fires for SENDER when recipient reads
                                    setMessages(prev => prev.map(msg => {
                                        if (msg.id_message === e.message_id) {
                                            return {
                                                ...msg,
                                                read_status: {
                                                    ...msg.read_status,
                                                    // Increment count (this makes checkmark turn white)
                                                    read_by_count: (msg.read_status?.read_by_count || 0) + 1,
                                                    read_by_users: [...(msg.read_status?.read_by_users || []), e.user_id],
                                                }
                                            };
                                        }
                                        return msg;
                                    }));
                                });
                            
                            console.log('[ChatModal] WebSocket subscribed successfully');
                        } catch (wsError) {
                            console.error('[ChatModal] WebSocket subscription error:', wsError);
                        }
                    } else {
                        console.warn('[ChatModal] Echo not initialized yet');
                    }
                }
            } catch (error) {
                console.error('Error initializing chat:', error);
            } finally {
                setLoading(false);
            }
        };

        initializeChat();

        // Cleanup: leave channel when modal closes
        return () => {
            if (conversationId) {
                const echo = getEcho();
                if (echo) {
                    console.log('[ChatModal] Leaving channel chat.' + conversationId);
                    echo.leave(`chat.${conversationId}`);
                }
                
                closeChat();
                
                console.log('[ChatModal] 📤 Dispatching chatModalClosed event');
                window.dispatchEvent(new Event('chatModalClosed'));
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, userId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        
        // Auto mark unread messages as read when opening chat or new messages arrive
        if (isOpen && conversationId && messages.length > 0 && currentUserId) {
            const unreadMessageIds = messages
                .filter(msg => 
                    msg.id_user_si !== currentUserId && // Bukan pesan sendiri
                    !msg.read_status?.is_read_by_me // Belum dibaca
                )
                .map(msg => msg.id_message);
            
            if (unreadMessageIds.length > 0) {
                // Delay sedikit biar user sempet liat message dulu
                setTimeout(() => {
                    markMessagesAsRead(conversationId, unreadMessageIds)
                        .catch(err => console.error('Error marking messages as read:', err));
                }, 1000);
            }
        }
    }, [messages, isOpen, conversationId, currentUserId]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Handlers
    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!message.trim() || !conversationId) return;

        const messageToSend = message.trim();
        setMessage(''); // Clear input immediately

        try {
            // Send message via API
            const response = await sendMessage(conversationId, messageToSend);
            
            if (response.data) {
                // Add message to local state immediately for smooth UX
                setMessages(prev => [...prev, response.data]);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setMessage(messageToSend); // Restore message if failed
            alert('Gagal mengirim pesan. Silakan coba lagi.');
        }
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (date) => {
        const messageDate = new Date(date);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (messageDate.toDateString() === today.toDateString()) {
            return 'Hari Ini';
        } else if (messageDate.toDateString() === yesterday.toDateString()) {
            return 'Kemarin';
        } else {
            return messageDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        }
    };

    // Group messages by date
    const groupedMessages = messages.reduce((groups, message) => {
        const date = formatDate(message.created_at);
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(message);
        return groups;
    }, {});

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center font-urbanist">
            {/* Backdrop: Hitam transparan (bg-black/70) */}
            <div
                className="absolute inset-0 bg-black/70 transition-opacity backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Window: Rounded & Shadow */}
            <div
                className="relative bg-white w-full max-w-2xl h-[650px] flex flex-col shadow-2xl overflow-hidden rounded-2xl mx-4"
                style={{ fontFamily: 'Urbanist, sans-serif' }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between p-4 border-b"
                    style={{ backgroundColor: '#015023' }}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                            <MessageCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white leading-tight">
                                {userName}
                            </h3>
                            {displayNim && (
                                <p className="text-xs text-white/80">{displayNim}</p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white/10 p-2 rounded-full transition"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-6 h-6 border-2 border-[#015023] border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-sm text-[#015023]">Memuat percakapan...</p>
                            </div>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                                <MessageCircle className="w-12 h-12 text-[#015023] opacity-30 mx-auto mb-2" />
                                <p style={{ color: '#015023', opacity: 0.6 }}>
                                    Belum ada pesan. Mulai percakapan!
                                </p>
                            </div>
                        </div>
                    ) : (
                        Object.entries(groupedMessages).map(([date, msgs]) => (
                            <div key={date} className="mb-6">
                                {/* Date Separator */}
                                <div className="flex items-center justify-center mb-4">
                                    <span
                                        className="px-3 py-1 text-xs font-medium rounded-full bg-gray-200 text-gray-600 shadow-sm"
                                    >
                                        {date}
                                    </span>
                                </div>

                                {/* Messages List */}
                                {msgs.map((msg) => {
                                    const isMe = msg.id_user_si === currentUserId;
                                    const isRead = msg.read_status?.read_by_count > 0;
                                    
                                    return (
                                        <div
                                            key={msg.id_message}
                                            className={`flex mb-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${
                                                    isMe
                                                        ? 'bg-brand-green text-white rounded-tr-sm'
                                                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'
                                                }`}
                                            >
                                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                                                <div className="flex items-center justify-end gap-1 mt-1">
                                                    <p
                                                        className={`text-[10px] ${
                                                            isMe ? 'text-white/70' : 'text-gray-400'
                                                        }`}
                                                    >
                                                        {formatTime(msg.created_at)}
                                                    </p>
                                                    {/* Read Status (Double Check) - Only for sender's messages */}
                                                    {isMe && (
                                                        <div className="flex items-center ml-1">
                                                            {isRead ? (
                                                                // Centang putih (sudah dibaca)
                                                                <div className="flex">
                                                                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                                                    <Check className="w-3 h-3 text-white -ml-2" strokeWidth={3} />
                                                                </div>
                                                            ) : (
                                                                // Centang abu-abu (belum dibaca)
                                                                <div className="flex">
                                                                    <Check className="w-3 h-3 text-white/40" strokeWidth={3} />
                                                                    <Check className="w-3 h-3 text-white/40 -ml-2" strokeWidth={3} />
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
                    <div className="flex items-end gap-3">
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => {
                                // Enter tanpa Shift = kirim pesan
                                // Shift + Enter = buat baris baru
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage(e);
                                }
                            }}
                            placeholder="Ketik pesan..."
                            rows={1}
                            className="flex-1 px-5 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:border-[#015023] focus:ring-1 focus:ring-[#015023] transition resize-none min-h-[48px] max-h-[120px] overflow-y-auto"
                            style={{
                                color: '#015023',
                                fontFamily: 'Urbanist, sans-serif',
                            }}
                            disabled={!conversationId || loading}
                        />
                        <button
                            type="submit"
                            disabled={!message.trim() || !conversationId}
                            className="p-3 rounded-full transition shadow-md disabled:opacity-50 disabled:shadow-none hover:scale-105 active:scale-95 flex-shrink-0"
                            style={{
                                backgroundColor: '#015023',
                                color: 'white',
                            }}
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}