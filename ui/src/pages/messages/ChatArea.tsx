import React, { useState, useEffect } from "react";
import { Send, Smile } from "lucide-react";
import { Textarea } from "../../components/ui/textarea.tsx";
import MessageBubble from "./MessageBubble.tsx";
import {MessageDTO} from "../../redux/message/MessageModel.ts";

interface ChatAreaProps {
    messages: MessageDTO[];
    currentUserId: string;
    onSendMessage: (content: string) => void;
    setMessageInput: any;
    messageInput: any;
}

const ChatArea: React.FC<ChatAreaProps> = ({ messages, currentUserId, onSendMessage, setMessageInput, messageInput }) => {

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (messageInput.trim()) {
            onSendMessage(messageInput.trim());
        }
    };

    const handleKeyPressSendMessage = (e) => {
        if (e.key == "Enter" ) {
            if(e.shiftKey) {
                onSendMessage(messageInput.trim());
            }
        }
    };

    return (
        <>
            {messages.length > 0 ? (
                <div className="flex-1 overflow-y-auto p-4 bg-radialPrimarySecondary">
                    {messages.map((msg) => (
                        <MessageBubble key={msg?.id} message={msg} currentUserId={currentUserId} />
                    ))}
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto p-4 bg-radialPrimarySecondary">
                    No Messages Start conversation
                </div>
            )}
            <div className="border-t p-2">
                <form onSubmit={handleSendMessage} className="flex items-center rounded-full px-2 py-2">
                    <div className="flex space-x-2">
                        <Smile className="text-gray-500" />
                    </div>
                    <Textarea
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Write your message here"
                        className="flex-1 bg-transparent outline-none border-2 rounded-2xl mx-1 p-2 overflow-auto"
                        onKeyDown={handleKeyPressSendMessage}
                    />
                    <button type="submit" className="ml-2 bg-blue-500 text-white rounded-full p-2">
                        <Send size={16} />
                    </button>
                </form>
            </div>
        </>
    );
};

export default ChatArea;