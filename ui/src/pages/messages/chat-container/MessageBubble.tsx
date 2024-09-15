import {Message} from "../../../models/model-types.ts";
import React from "react";


const MessageBubble = ({ message, currentUserId }) => {
    const isOwn = message.messagedBy === currentUserId;

    const username = "sample";

    return (
        <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-xs ${isOwn ? 'bg-custom-linearPrimarySecondary-2 text-white' : 'bg-custom-linearPrimarySecondary-1'} rounded-lg p-3`}>
                {!isOwn && <p className="font-bold text-sm mb-1">{username}</p>}
                <p>{message.content}</p>
                <span className="text-xs text-gray-800 mt-1 block">{message.time}</span>
            </div>
        </div>
    );
};

export default MessageBubble;