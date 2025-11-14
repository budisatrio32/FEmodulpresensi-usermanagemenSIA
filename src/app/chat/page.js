'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/ui/navigation-menu';
import { ArrowLeft, Send, User, MessageCircle } from 'lucide-react';
import { PrimaryButton } from '@/components/ui/button';

export default function ChatPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const messagesEndRef = useRef(null);
	
	const userName = searchParams.get('user') || 'User';
	const userNim = searchParams.get('nim') || '';
	
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState([
		{
			id: 1,
			sender: 'Larry',
			text: 'Permisi mas, saya Prihastomo Budi Satrio dari TRPL angkatan 24 kelas A2 PPW, saya mau tanya terkait tempat pengumpulan tugas ppw pertemuan minggu ini di mana ya mas? Terima Kasih',
			timestamp: new Date('2025-10-25T18:42:00'),
			isMe: false,
		},
		{
			id: 2,
			sender: 'Adiel Boanerge',
			text: 'Bisa di cek kembali',
			timestamp: new Date('2025-10-25T19:22:00'),
			isMe: true,
		},
		{
			id: 3,
			sender: 'Larry',
			text: 'Terima kasih mass 🙏',
			timestamp: new Date('2025-10-25T20:34:00'),
			isMe: false,
		},
		{
			id: 4,
			sender: 'Larry',
			text: 'Permisi mas, tempat pengumpulan tugas ppw pertemuan minggu ini belum ada ya?',
			timestamp: new Date('2025-11-14T09:38:00'),
			isMe: false,
		},
		{
			id: 5,
			sender: 'Adiel Boanerge',
			text: 'Busa di cdk kembali',
			timestamp: new Date('2025-11-14T09:43:00'),
			isMe: true,
		},
		{
			id: 6,
			sender: 'Larry',
			text: 'oke mas terima kasih',
			timestamp: new Date('2025-11-14T12:48:00'),
			isMe: false,
		},
	]);

	// Scroll to bottom when messages change
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

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

		setMessages([...messages, newMessage]);
		setMessage('');
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

	return (
		<div className="min-h-screen bg-brand-light-sage">
			<Navbar />
			<div className="container mx-auto px-4 py-8 max-w-5xl h-screen flex flex-col">
				
				{/* Back Button */}
				<button
					onClick={() => router.back()}
					className="flex items-center gap-2 mb-6 font-medium hover:opacity-80 transition"
					style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}
				>
					<ArrowLeft className="w-5 h-5" />
					Kembali
				</button>

				{/* Chat Container */}
				<div className="bg-white rounded-2xl shadow-lg flex flex-col flex-1 overflow-hidden" style={{ borderRadius: '16px' }}>
					
					{/* Chat Header */}
					<div className="p-6 border-b border-gray-200">
						<div className="flex items-center gap-4">
							<div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#015023' }}>
								<User className="w-6 h-6 text-white" />
							</div>
							<div>
								<h2 className="text-xl font-bold" style={{ color: '#015023', fontFamily: 'Urbanist, sans-serif' }}>
									{userName}
								</h2>
								{userNim && (
									<p className="text-sm" style={{ color: '#015023', opacity: 0.6, fontFamily: 'Urbanist, sans-serif' }}>
										NIM: {userNim}
									</p>
								)}
							</div>
						</div>
					</div>

					{/* Messages Area */}
					<div className="flex-1 overflow-y-auto p-6 space-y-6">
						{Object.entries(groupedMessages).map(([dateKey, dateMessages]) => (
							<div key={dateKey}>
								{/* Date Separator */}
								<div className="flex items-center gap-4 my-6">
									<div className="flex-1 h-px" style={{ backgroundColor: '#015023', opacity: 0.2 }}></div>
									<span className="text-sm font-medium px-3 py-1 rounded-lg" style={{ 
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
									<div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} mb-4`}>
										<div className={`max-w-[70%] ${msg.isMe ? 'items-end' : 'items-start'} flex flex-col`}>
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
													className="px-4 py-3 rounded-2xl shadow-sm"
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
					<div className="p-4 border-t border-gray-200">
						<form onSubmit={handleSendMessage} className="flex gap-3">
							<input
								type="text"
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								placeholder="Ketik pesan..."
								className="flex-1 px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-opacity-100"
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
								className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
								style={{
									backgroundColor: '#015023',
									color: 'white',
									fontFamily: 'Urbanist, sans-serif',
									borderRadius: '12px'
								}}
							>
								<Send className="w-5 h-5" />
								Kirim
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
