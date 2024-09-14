import {Message} from "../../../models/model-types.ts";
import React from "react";

const MessageBubble: React.FC<{ message: Message }> = ({ message }) => (
    <div className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-xs ${message.isOwn ? 'bg-custom-linearPrimarySecondary-2 text-white' : 'bg-custom-linearPrimarySecondary-1'} rounded-lg p-3`}>
            <p>{message.content}</p>
            <span className="text-xs text-gray-800 mt-1 block">{message.time}</span>
        </div>
    </div>
);

export default MessageBubble;