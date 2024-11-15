import React, {useEffect, useRef, useState} from 'react';
import io from "socket.io-client";
import {Card} from "@material-tailwind/react";

function DummyTeleMessage({teleConv}) {
    const [conversations, setConversations] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>({});
    const socket = io("http://localhost:5400", {
        transports: ["websocket"],
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        console.log("messages");
        console.log(messages);
    }, [messages]);


    useEffect(() => {
        setConversations(teleConv);
        // Socket event listeners
        socket.on('telegram-message', (message) => {
            if (selectedChat && message.chatId === selectedChat.id.toString()) {
                setMessages(prev => [...prev, message]);
                scrollToBottom();
            }
        });

        socket.on('message-sent', (message) => {
            if (selectedChat && message.chatId === selectedChat.id.toString()) {
                setMessages(prev => [...prev, message]);
                scrollToBottom();
            }
        });

        socket.on('message-error', (error) => {
            alert(error.error);
        });

        socket.on('chat-history', (history) => {
            setMessages(history);
            scrollToBottom();
        });

        return () => {
            socket.off('telegram-message');
            socket.off('message-sent');
            socket.off('message-error');
            socket.off('chat-history');
        };
    }, [selectedChat]);

    const handleChatSelect = (chat) => {
        setSelectedChat(chat);
        setMessages([]);
        socket.emit('get-chat-history', chat.id);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChat) return;

        socket.emit('send-message', {
            chatId: selectedChat.id,
            message: newMessage
        });

        setNewMessage('');
    };

    return (
        <div className="flex h-full bg-gray-100 w-[1400px]">
            {/* Conversations List */}
            <div className="w-1/4 border-r bg-white overflow-y-auto">
                <div className="p-4">
                    <h2 className="text-xl font-bold mb-4">Telegram Chats</h2>
                    {conversations.map((chat) => (
                        <Card
                            key={chat.id}
                            className={`mb-2 cursor-pointer ${
                                selectedChat?.id === chat.id ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => handleChatSelect(chat)}
                        >
                            <div className="p-4">
                                <h3 className="font-semibold">{chat.title}</h3>
                                {chat.lastMessage && (
                                    <p className="text-sm text-gray-500">{chat.lastMessage}</p>
                                )}
                                {chat.unreadCount > 0 && (
                                    <span className="inline-block px-2 py-1 text-xs bg-blue-500 text-white rounded-full">
                    {chat.unreadCount}
                  </span>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col w-full">
                {selectedChat ? (
                    <>
                        <div className="p-4 border-b bg-white">
                            <h2 className="text-xl font-bold">{selectedChat.title}</h2>
                        </div>

                        <div className="flex-1 p-4 overflow-y-auto">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`mb-4 ${
                                        message.senderId === 'self' ? 'text-right' : 'text-left'
                                    }`}
                                >
                                    <div
                                        className={`inline-block p-2 rounded-lg ${
                                            message.senderId === 'self'
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-200'
                                        }`}
                                    >
                                        {message.message}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {new Date(message.timestamp).toLocaleTimeString()}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
                            <div className="flex">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="flex-1 p-2 border rounded-l focus:outline-none"
                                    placeholder="Type a message..."
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
                                >
                                    Send
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        Select a chat to start messaging
                    </div>
                )}
            </div>
        </div>
    );
}

export default DummyTeleMessage;