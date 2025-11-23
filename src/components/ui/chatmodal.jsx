'use client';

import { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Send, User } from 'lucide-react';

export default function ChatModal({ isOpen, onClose, userName, userNim = '', userId = '' }) {
	const [message, setMessage] = useState('');
	const messagesEndRef = useRef(null);
	const [messages, setMessages] = useState([]);
	
	// Dummy data chat per user (nanti diganti dengan API call)
	const dummyChats = {
		'2021110001': [
			{
				id: 1,
				sender: 'Andi Pratama',
				text: 'Pak, mau tanya tentang tugas minggu ini',
				timestamp: new Date('2025-11-13T10:30:00'),
				isMe: false,
			},
			{
				id: 2,
				sender: 'You',
				text: 'Silakan, ada yang bisa saya bantu?',
				timestamp: new Date('2025-11-13T10:32:00'),
				isMe: true,
			},
		],
		'2021110002': [
			{
				id: 1,
				sender: 'Budi Santoso',
				text: 'Selamat pagi pak',
				timestamp: new Date('2025-11-14T08:15:00'),
				isMe: false,
			},
		],
		'2021110003': [
			{
				id: 1,
				sender: 'Citra Dewi',
				text: 'Pak, saya izin tidak bisa hadir hari ini',
				timestamp: new Date('2025-11-14T07:00:00'),
				isMe: false,
			},
			{
				id: 2,
				sender: 'You',
				text: 'Baik, silakan kirim surat keterangan ya',
				timestamp: new Date('2025-11-14T07:05:00'),
				isMe: true,
			},
			{
				id: 3,
				sender: 'Citra Dewi',
				text: 'Siap pak, terima kasih',
				timestamp: new Date('2025-11-14T07:10:00'),
				isMe: false,
			},
		],
		// Default chat untuk user yang belum pernah chat
		'default': []
	};

	// Load messages ketika modal dibuka atau userId berubah
	useEffect(() => {
		if (isOpen && userId) {
			// TODO: Nanti ganti dengan API call
			// const fetchMessages = async () => {
			//   const response = await fetch(`/api/chat/users/${userId}/messages`);
			//   const data = await response.json();
			//   setMessages(data.messages);
			// };
			// fetchMessages();
			
			// Sementara pakai dummy data
			const userMessages = dummyChats[userId] || dummyChats['default'];
			setMessages(userMessages);
		}
	}, [isOpen, userId]);

	// Scroll to bottom when messages change
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	// Prevent body scroll when modal is open
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

	const handleSendMessage = (e) => {
		e.preventDefault();
		if (!message.trim()) return;

		const newMessage = {
			id: messages.length + 1,
			sender: 'You',
			text: message,
			timestamp: new Date(),
			isMe: true,
		};

		// Update local state
		setMessages([...messages, newMessage]);
		setMessage('');

		// TODO: Nanti kirim ke backend
		// const sendToBackend = async () => {
		//   await fetch(`/api/chat/users/${userId}/messages`, {
		//     method: 'POST',
		//     headers: { 'Content-Type': 'application/json' },
		//     body: JSON.stringify({
		//       text: message,
		//       receiverId: userId
		//     })
		//   });
		// };
		// sendToBackend();
	};

	const formatTime = (date) => {
		return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
	};

	const formatDate = (date) => {
		const today = new Date();
		const messageDate = new Date(date);
		
		if (messageDate.toDateString() === today.toDateString()) {
			return 'Hari Ini';
		}
		
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);
		if (messageDate.toDateString() === yesterday.toDateString()) {
			return 'Kemarin';
		}
		
		return messageDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
	};

	// Group messages by date
	const groupedMessages = messages.reduce((groups, message) => {
		const dateKey = message.timestamp.toDateString();
		if (!groups[dateKey]) {
			groups[dateKey] = [];
		}
		groups[dateKey].push(message);
		return groups;
	}, {});

	if (!isOpen) return null;

	return (
		<>
			{/* Backdrop */}
			<div 
				className="fixed inset-0 z-40 transition-opacity flex items-center justify-center"
				style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
				onClick={onClose}
			>
				{/* Chat Modal */}
				<div 
					className="bg-white shadow-2xl flex flex-col rounded-lg overflow-hidden"
					style={{
						width: '600px',
						height: '700px',
						borderRadius: '16px',
						maxHeight: '90vh',
						maxWidth: '90vw',
					}}
					onClick={(e) => e.stopPropagation()}
				>
					{/* Chat Header */}
					<div 
						className="p-5 border-b border-gray-200 flex items-center justify-between"
						style={{ backgroundColor: '#015023' }}
					>
						<div className="flex items-center gap-3">
							<div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
								<User className="w-6 h-6 text-white" />
							</div>
							<div>
								<h3 className="font-bold text-white text-lg" style={{ fontFamily: 'Urbanist, sans-serif' }}>
									{userName}
								</h3>
								{userNim && (
									<p className="text-sm text-white opacity-80" style={{ fontFamily: 'Urbanist, sans-serif' }}>
										NIM: {userNim}
									</p>
								)}
							</div>
						</div>
						<button
							onClick={onClose}
							className="text-white hover:bg-brand-yellow hover:bg-opacity-10 p-2 rounded-lg transition"
						>
							<X className="w-6 h-6" />
						</button>
					</div>

					{/* Messages Area */}
					<div className="flex-1 overflow-y-auto p-5 space-y-4" style={{ backgroundColor: '#f9fafb' }}>
							{Object.entries(groupedMessages).map(([dateKey, dateMessages]) => (
								<div key={dateKey}>
									{/* Date Separator */}
									<div className="flex items-center gap-3 my-4">
										<div className="flex-1 h-px" style={{ backgroundColor: '#015023', opacity: 0.2 }}></div>
										<span className="text-xs font-medium px-2 py-1 rounded-lg" style={{ 
											backgroundColor: '#f3f4f6', 
											color: '#015023',
											fontFamily: 'Urbanist, sans-serif'
										}}>
											{formatDate(new Date(dateKey))}
										</span>
										<div className="flex-1 h-px" style={{ backgroundColor: '#015023', opacity: 0.2 }}></div>
									</div>

									{/* Messages for this date */}
									{dateMessages.map((msg) => (
										<div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} mb-3`}>
											<div className={`max-w-[75%] ${msg.isMe ? 'items-end' : 'items-start'} flex flex-col`}>
												{!msg.isMe && (
													<span className="text-xs font-semibold mb-1 px-1" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
														{msg.sender}
													</span>
												)}
												<div className="flex items-end gap-2">
													{msg.isMe && (
														<span className="text-xs" style={{ color: '#015023', opacity: 0.5, fontFamily: 'Urbanist, sans-serif' }}>
															{formatTime(msg.timestamp)}
														</span>
													)}
													<div 
														className="px-3 py-2 rounded-2xl shadow-sm text-sm"
														style={{
															backgroundColor: msg.isMe ? '#015023' : '#f3f4f6',
															color: msg.isMe ? 'white' : '#015023',
															fontFamily: 'Urbanist, sans-serif',
															borderRadius: msg.isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px'
														}}
													>
														{msg.text}
													</div>
													{!msg.isMe && (
														<span className="text-xs" style={{ color: '#015023', opacity: 0.5, fontFamily: 'Urbanist, sans-serif' }}>
															{formatTime(msg.timestamp)}
														</span>
													)}
												</div>
											</div>
										</div>
									))}
								</div>
							))}
							<div ref={messagesEndRef} />
					</div>

					{/* Message Input */}
					<div className="p-4 border-t border-gray-200 bg-white">
							<form onSubmit={handleSendMessage} className="flex gap-2">
								<input
									type="text"
									value={message}
									onChange={(e) => setMessage(e.target.value)}
									placeholder="Ketik pesan..."
									className="flex-1 px-3 py-2 border-2 rounded-xl text-sm focus:outline-none focus:border-opacity-100"
									style={{
										fontFamily: 'Urbanist, sans-serif',
										borderColor: '#015023',
										borderRadius: '12px',
										opacity: 0.7
									}}
								/>
								<button
									type="submit"
									disabled={!message.trim()}
									className="px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
									style={{
										backgroundColor: '#015023',
										color: 'white',
										fontFamily: 'Urbanist, sans-serif',
										borderRadius: '12px'
									}}
								>
									<Send className="w-4 h-4" />
							</button>
						</form>
					</div>
				</div>
			</div>
		</>
	);
}