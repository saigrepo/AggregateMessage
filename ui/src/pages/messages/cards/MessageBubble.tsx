import React from "react";
import {UUID} from "node:crypto";

interface MessageBubbleProps {
    messageId: UUID | undefined;
    messageContent: string;
    messageDate: any;
    currentUserId: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ messageId, messageContent, messageDate, currentUserId }) => {
    const isOwnMessage = messageId === currentUserId;

    return (
        <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-md lg:max-w-md px-4 py-2 rounded-lg ${isOwnMessage ? 'bg-bg-tones-4 icon-align-left' : 'bg-gray-200'}`}>
                <p>{messageContent}</p>
                <span className={`text-xs ${isOwnMessage ? 'text-gray-800' : 'text-gray-500'}`}>{new Date(messageDate).toLocaleTimeString()}</span>
            </div>
        </div>
    );
};
export default MessageBubble;