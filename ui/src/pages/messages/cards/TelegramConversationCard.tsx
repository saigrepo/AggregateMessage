import React, {useEffect, useState} from "react";
import {X} from "lucide-react";
import {ConversationDTO} from "../../../redux/conversation/ConversationModel.ts";

const ConversationCard = ({ conv, onSelectConversationClick, userInfo, selectedConvId, handleDeleteClick }) => {
    const [hoveredConvId, setHoveredConvId] = useState(null);

    const getInitials = (conv) => {
        return conv?.title?.charAt(0);
    }

    const isLastMessageReadByUser = (conv) => {
        return true;
    };

    const truncateTitleAndMessage = (title: string) => {
        if(title && title?.length > 20) {
            return title.substring(0,16) + "...";
        }
        return title;
    }

    return (
        <div
            key={conv?.id}
            className={`flex justify-between gap-2 rounded-lg overflow-hidden border border-slate-100 group hover:pr-0 pr-2 hover:border-slate-900 transition-all ${conv?.id === selectedConvId ? 'bg-gradient-to-r from-bg-tones-1 to-bg-tones-2' : ''}`}
            onClick={() => onSelectConversationClick(conv)}
            onMouseEnter={() => setHoveredConvId(conv?.id)}
            onMouseLeave={() => setHoveredConvId(null)}>
            <div key={conv?.id} className="flex items-center flex-1 p-2">
                <div key={conv?.id} className="w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white mr-2">{getInitials(conv)}</div>
                <div className={`flex-1 min-w-0`}>
                    <div className="flex justify-between items-baseline">
                        <h3 className="font-medium text-sm truncate pr-1">{truncateTitleAndMessage(conv?.title)}</h3>
                        <span className={`text-xs p-1  ${conv?.unreadCount > 0 ? 'border-1 rounded bg-green-200 text-black-900' : 'text-gray-500'} ml-2`}>
                                    {conv.unreadCount > 0 ? `${conv?.unreadCount}` : 'All read'}
                                </span>
                    </div>
                    <p className={`text-sm mt-1 ${isLastMessageReadByUser(conv) ? 'text-gray-500' : 'text-black-900'} truncate`}>
                        {truncateTitleAndMessage(conv.lastMessage)}
                    </p>
                </div>
            </div>
            <button
                onClick={() => handleDeleteClick(conv.id)}
                className="bg-red-500 text-white transition-all overflow-clip items-center justify-center px-2 hidden group-hover:flex">
                <X size={20} />
            </button>

        </div>
    );
};

export default ConversationCard;
