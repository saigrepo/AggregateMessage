import React, {useEffect, useState} from "react";
import {X} from "lucide-react";
import {ConversationDTO} from "../../../redux/conversation/ConversationModel.ts";

const ConversationCard = ({ conv, onSelectConversationClick, userInfo, selectedConvId }) => {
    const [hoveredConvId, setHoveredConvId] = useState(null);

    const getInitials = (conv: ConversationDTO) => {
        if(conv?.conversationName != null ){
            return (conv?.conversationName.charAt(0))?.toUpperCase();
        }
        return conv?.users[0].firstName.charAt(0).toUpperCase();
    }

    const setDefaultConvName = (conv: ConversationDTO) => {
        if(!conv?.conversationName) {
            const user = conv.users.filter((user) => user.userId)[0];
            return user.firstName +" " + user.lastName;
        }
    }

    const getLastMessage = (conv: ConversationDTO) => {
        return conv.messages.length > 0 ? conv.messages.at(-1)?.content.substring(0, 35) : "placeholder dummy last message" ;
    }



    const isLastMessageReadByUser = (conv: ConversationDTO) => {
        const lastMessage = conv.messages.length > 0 ? conv.messages.at(-1) : null;
        if (lastMessage) {
            return lastMessage.readBy.includes(userInfo.userId);
        }
        return true; // If no messages, we consider it "read"
    };

    const getUnreadCount = (conv: ConversationDTO) => {
        return conv.messages.filter((msg) => !msg.readBy.includes(userInfo.userId)).length;
    };
    const handleDeleteClick = (convId) => {
        console.log("deleted");
    };


    return (
        <div
            key={conv?.id}
            className={`flex justify-between gap-2 rounded-lg overflow-hidden border border-slate-100 group hover:pr-0 pr-2 hover:border-slate-900 transition-all ${conv?.id === selectedConvId ? 'bg-gradient-to-r from-blue-200 to-cyan-200' : ''}`}
            onClick={() => onSelectConversationClick(conv)}
            onMouseEnter={() => setHoveredConvId(conv.id)}
            onMouseLeave={() => setHoveredConvId(null)}>
            <div className="flex items-center flex-1 p-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white mr-2">{getInitials(conv)}</div>
                <div className={`flex-1 min-w-0`}>
                    <div className="flex justify-between items-baseline">
                        <h3 className="font-medium text-sm truncate">{setDefaultConvName(conv)}</h3>
                        <span className={`text-xs p-1  ${getUnreadCount(conv) > 0 ? 'border-1 rounded bg-green-200 text-black-900' : 'text-gray-500'} ml-2`}>
                                    {getUnreadCount(conv) > 0 ? `${getUnreadCount(conv)}` : 'All read'}
                                </span>
                    </div>
                    <p className={`text-sm mt-1 ${isLastMessageReadByUser(conv) ? 'text-gray-500' : 'text-black-900'} truncate`}>
                        {getLastMessage(conv)}
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