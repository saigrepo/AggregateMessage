import React, { useState, useRef, useEffect } from "react";
import { Search } from 'lucide-react';
import { FaImage } from "react-icons/fa";

const Conversations = ({ conversations, onSelectConversation, selectedConvId }) => {
    const [width, setWidth] = useState(300); // Default width
    const sidebarRef = useRef(null);
    const [isResizing, setIsResizing] = useState(false);

    const formatTime = (time) => {
        const date = new Date(time);
        return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    };

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
                if (newWidth > 200 && newWidth < 600) {
                    setWidth(newWidth);
                }
            }
        },
        [isResizing]
    );

    const getInitials = (conv) => {
        if(conv?.name != null ){
            return (conv?.name.charAt(0)).toUpperCase();
        }
        return (<FaImage />)
    }

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
            style={{ width: `${width}px` }}
        >
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
                {conversations.map((conv) => (
                    <div
                        key={conv?.id}
                        className={`flex items-center justify-between p-3 hover:bg-gray-100 cursor-pointer ${
                            selectedConvId === conv?.id ? 'bg-gray-100' : ''
                        }`}
                        onClick={() => onSelectConversation(conv?.id)}
                    >
                        <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 mr-2"
                             >{getInitials(conv)}</div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-medium text-sm truncate">{conv?.name}</h3>
                                <span className="text-xs text-gray-500 ml-2">{formatTime(conv?.time)}</span>
                            </div>
                            <p className="text-sm text-gray-500 truncate mt-1">
                                {conv?.lastMessage}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <div
                className="absolute top-0 right-0 w-0.5 h-full cursor-col-resize hover:bg-gray-400"
                onMouseDown={startResizing}
            />
        </div>
    );
};

export default Conversations;