import React, { useState, useRef, useEffect } from "react";
import {Search, X} from 'lucide-react';
import { FaImage } from "react-icons/fa";
import {ConversationDTO} from "../../../redux/conversation/ConversationModel.ts";
import {useAppStore} from "../../../slices";
import ConversationCard from "../cards/ConversationCard.tsx";

const Conversations = ({ conversations, onSelectConversationClick, selectedConvId }) => {
    const {userInfo} = useAppStore();
    const [width, setWidth] = useState(300);
    const sidebarRef = useRef(null);

    const [isResizing, setIsResizing] = useState(false);


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
        window.addEventListener("mousemove", resize);
        window.addEventListener("mouseup", stopResizing);
        return () => {
            window.removeEventListener("mousemove", resize);
            window.removeEventListener("mouseup", stopResizing);
        };
    }, [resize, stopResizing]);

    return (
        <div
            ref={sidebarRef}
            className="bg-white border-r overflow-hidden flex flex-col h-full relative"
            style={{ width: `${width}px` }}>
            <div className="p-4 border-b sticky top-0 bg-white z-10">
                <div className="relative text-2xl font-semibold opacity-75">
                   <h1>Messages</h1>
                </div>
            </div>
            <div className="p-4 border-b sticky top-0 bg-white z-10">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full pl-8 pr-4 py-2 rounded-lg bg-gray-100 text-sm"
                    />
                    <Search className="absolute left-2 top-2.5 text-gray-400 w-4 h-4"/>
                </div>
            </div>
            <div className="flex-grow overflow-y-auto divide-y">
                {(conversations && conversations.length > 0) ? conversations.map((conv) => (
                        <ConversationCard onSelectConversationClick={onSelectConversationClick} conv={conv} userInfo={userInfo} selectedConvId={selectedConvId} />
                    )) : <div>No Conversation found for the user</div>}
            </div>
            <div
                className="absolute top-0 right-0 w-0.5 h-full cursor-col-resize hover:bg-gray-400"
                onMouseDown={startResizing}
            />
        </div>
    );
};

export default Conversations;