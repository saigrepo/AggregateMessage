import React, {useEffect, useRef, useState} from "react";
import {Search} from 'lucide-react';
import io from "socket.io-client";
import {useAppStore} from "../../slices";
import TelegramConversationCard from "../messages/cards/TelegramConversationCard.tsx";
import TelegramChatArea from "./TelegramChatArea.tsx";
import SearchUsers from "../messages/SearchUsers.tsx";
import Dashboard from "./Dashboard.tsx";

const TelegramConversations = ({ conversations, messageTitle, dbConv }) => {
    const {userInfo} = useAppStore();
    const [width, setWidth] = useState(300);
    const sidebarRef = useRef(null);
    const [searchConv, setSearchConv] = useState("");
    const [isResizing, setIsResizing] = useState(false);
    const [filteredConversations, setFilteredConversations] = useState([]);
    const [selectedConv, setSelectedConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const socket = io("http://localhost:5400", {
        transports: ["websocket"],
    });


    const startResizing = React.useCallback((mouseDownEvent) => {
        mouseDownEvent.preventDefault();
        setIsResizing(true);
    }, []);

    const stopResizing = React.useCallback(() => {
        setIsResizing(false);
    }, []);

    const resize = React.useCallback(
        (mouseMoveEvent) => {
            if (isResizing) {
                const newWidth = mouseMoveEvent.clientX - sidebarRef.current.getBoundingClientRect().left;
                if (newWidth > 300 && newWidth < 600) {
                    setWidth(newWidth);
                }
            }
        },
        [isResizing]
    );

    useEffect(() => {
        if(conversations && conversations.length > 0) {
            setFilteredConversations(conversations);
        } else {
            if(dbConv) {
                setFilteredConversations((prev) => [...prev, dbConv])
            }
        }

    }, []);

    useEffect(() => {
        if(conversations && conversations.length > 0) {
            setFilteredConversations(conversations);
        } else {
            setFilteredConversations(dbConv)
        }

    }, [conversations, messages]);


    useEffect(() => {
        window.addEventListener("mousemove", resize);
        window.addEventListener("mouseup", stopResizing);
        return () => {
            window.removeEventListener("mousemove", resize);
            window.removeEventListener("mouseup", stopResizing);
        };
    }, [resize, stopResizing]);


    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchConv(query);
        const filtered = conversations.filter((conv) =>
            conv.createdBy.firstName.toLowerCase().includes(query) ||
            conv.createdBy.lastName.toLowerCase().includes(query) ||
            conv.createdBy.userEmail.toLowerCase().includes(query)
        );
        setFilteredConversations(filtered);
        console.log(userInfo);
    }


    useEffect(() => {

        if (!selectedConv) return;

        socket.emit('get-chat-history', selectedConv.id);

        const handleTelegramMessage = (message) => {
            if (message.chatId === selectedConv.id.toString()) {
                setMessages((prev) => [...prev, message]);
            }
        };

        const handleChatHistory = (chatMessages) => {
            setMessages(chatMessages);
        };

        socket.on('message-sent', (message) => {
            if (selectedConv && message.chatId === selectedConv.id.toString()) {
                setMessages(prev => [...prev, message]);
            }
        });

        socket.on('telegram-message', handleTelegramMessage);
        socket.on('chat-history', handleChatHistory);

        socket.on('disconnect',  () => {
            socket.off('telegram-message');
            socket.off('message-sent');
            socket.off('message-error');
            socket.off('chat-history');
        });
    }, [selectedConv]);

    const handleChatSelect = (chat) => {
        if (selectedConv?.id === chat.id) return; // Prevent redundant updates

        setSelectedConv(chat);
        setMessages([]); // Clear messages temporarily while fetching new ones
    };

    const handleSendMessage = (e) => {
        if (!newMessage.trim() || !selectedConv) return;

        const tempMessage = {
            chatId: selectedConv.id,
            message: newMessage,
            senderId: userInfo?.telegramId,
            timestamp: Date.now(),
        };

        // Update the UI optimistically
        setMessages((prev) => [...prev, tempMessage]);

        socket.emit('send-message', tempMessage);

        setNewMessage('');
    };


    const calculateLastSeen = (dateTime) => {
        const lastSeenDate = new Date(dateTime * 1000);
        const currentDate = new Date();

        const diffMs = currentDate - lastSeenDate;

        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);
        const diffWeeks = Math.floor(diffDays / 7);

        if (diffSeconds < 60) return `${diffSeconds} seconds ago`;
        if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffWeeks < 4) return `${diffWeeks} weeks ago`;

        return `on ${lastSeenDate.toLocaleDateString()} at ${lastSeenDate.toLocaleTimeString()}`;
    };

    return (
        <>
            <div
                ref={sidebarRef}
                className="bg-white border-r overflow-hidden flex flex-col h-full relative"
                style={{ width: `${width}px` }}>
                <div className="p-4 border-b sticky top-0 bg-white z-10">
                    <div className="relative text-2xl font-semibold opacity-75 font-sans">
                        <h1>{messageTitle}</h1>
                    </div>
                </div>
                <div className="p-4 border-b sticky top-0 bg-white z-10">
                    <div className="relative">
                        <input
                            disabled={filteredConversations?.length === 0}
                            type="text"
                            placeholder="Search"
                            className="w-full pl-8 pr-4 py-2 rounded-lg bg-bg-tones-3 text-sm"
                            value={searchConv}
                            onChange={handleSearch}
                        />
                        <Search className="absolute left-2 top-2.5 text-gray-400 w-4 h-4"/>
                    </div>
                </div>
                <div key='conv-div-1' className="flex-grow overflow-y-auto divide-y">
                    {(filteredConversations && filteredConversations?.length > 0) ? filteredConversations.map((conv) => (
                        <TelegramConversationCard
                            key={conv?.id}
                            onSelectConversationClick={handleChatSelect}
                            conv={conv}
                            userInfo={userInfo}
                            selectedConvId={selectedConv?.id}
                        />
                    )) : <div className="flex flex-wrap justify-center font-semibold mt-40">No Conversation found for the user</div>}
                </div>
                <div
                    className="absolute top-0 right-0 w-0.5 h-full cursor-col-resize hover:bg-gray-400"
                    onMouseDown={startResizing}
                />
            </div>
            {selectedConv ? (<div className={`flex flex-col flex-grow bg-bg-tones-4`}>
                <div className="border-b p-4 h-[55px] flex justify-between items-center backdrop-blur-md bg-gradient-to-r from-bg-tones-4 to-bg-tones-2">
                    <div>
                        <div className="flex flex-row items-stretch">
                            <h2 className="font-semibold font-serif text-[1em] mx-2" key={selectedConv?.id}>{selectedConv?.title}</h2>
                        </div>
                        <p className="text-sm text-gray-500 mx-2">Last seen {calculateLastSeen(selectedConv?.date)}</p>
                    </div>
                </div>
                <TelegramChatArea messages={messages} currentUserId={userInfo.telegramId} onSendMessage={handleSendMessage} setMessageInput={setNewMessage} messageInput={newMessage} />
            </div>) :
                (
                    <div className="flex-grow flex items-center justify-center">
                    <p>Select a conversation or start a new one</p>
                    <Dashboard setTelegramConv={conversations} />
                    </div>
                )
            }
    </>
    );
};

export default TelegramConversations;