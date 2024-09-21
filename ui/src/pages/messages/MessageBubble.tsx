import React from "react";
import {MessageDTO} from "../../redux/message/MessageModel.ts";

interface MessageBubbleProps {
    message: MessageDTO;
    currentUserId: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, currentUserId }) => {
    const isOwnMessage = message.user?.userId === currentUserId;

    return (
        <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isOwnMessage ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                <p>{message.content}</p>
                <span className="text-xs text-gray-500">{new Date(message.timeStamp).toLocaleTimeString()}</span>
            </div>
        </div>
    );
};

export default MessageBubble;