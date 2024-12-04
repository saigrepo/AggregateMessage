import React, {useEffect, useRef, useState} from "react";
import {Search} from 'lucide-react';
import {useAppStore} from "../../../slices";
import ConversationCard from "../cards/ConversationCard.tsx";

const Conversations = ({ conversations, onSelectConversationClick, selectedConvId, messageTitle, setMessage, handleConvDelete }) => {
    const {userInfo} = useAppStore();
    const [width, setWidth] = useState(300);
    const sidebarRef = useRef(null);
    const [searchConv, setSearchConv] = useState("");
    const [isResizing, setIsResizing] = useState(false);
    const [filteredConversations, setFilteredConversations] = useState(conversations);


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
        setFilteredConversations(conversations);
    }, []);

    useEffect(() => {
        setFilteredConversations(conversations)
    }, [setMessage, onSelectConversationClick]);

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

    const handleMessageRead = (convId: string) => {
        setFilteredConversations((prev) =>
            prev.map((conv) => {
                if (conv.id === convId) {
                    const updatedMessages = conv.messages.map((msg) =>
                        msg.readBy.includes(userInfo.userId) ? msg : { ...msg, readBy: [...msg.readBy, userInfo.userId] }
                    );
                    return { ...conv, messages: updatedMessages };
                }
                return conv;
            })
        );
    };

    return (
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
                {(filteredConversations && filteredConversations.length > 0) ? filteredConversations.map((conv) => (
                        <ConversationCard key={conv?.id} onMessageRead={handleMessageRead} onSelectConversationClick={onSelectConversationClick} conv={conv} userInfo={userInfo} selectedConvId={selectedConvId} deleteConv={handleConvDelete} />
                    )) : <div className="flex items-center justify-center font-semibold">No Conversation found for the user</div>}
            </div>
            <div
                className="absolute top-0 right-0 w-0.5 h-full cursor-col-resize hover:bg-gray-400"
                onMouseDown={startResizing}
            />
        </div>
    );
};

export default Conversations;