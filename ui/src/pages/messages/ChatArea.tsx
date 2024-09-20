import React from "react";
import MessageBubble from "./MessageBubble.tsx";
import {Simulate} from "react-dom/test-utils";
import {Send, Smile} from "lucide-react";

const ChatArea= ({messages, messagedBy, messageInput, setMessageInput, sendMessage}) => (
    <>
        <div className="flex-1 overflow-y-auto p-4 bg-radialPrimarySecondary ">
            {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} currentUserId={messagedBy}/>
            ))}
        </div>
        <div className="bg-polo-blue-50 border-t p-4">
            <div className="flex items-center bg-polo-blue-100 rounded-full px-4 py-2">
                <input
                    type="text"
                    placeholder="Write your message here"
                    className="flex-1 bg-transparent outline-none"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                />
                <div className="flex space-x-2">
                    <Smile className="text-gray-500" />
                </div>
                <button className="ml-2 bg-blue-500 text-white rounded-full p-2" onClick={(e) => sendMessage(e)}>
                    <Send size={16} />
                </button>
            </div>
        </div>
    </>
);

export default ChatArea