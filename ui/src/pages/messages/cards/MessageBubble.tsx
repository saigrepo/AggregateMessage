import React, { useState, useEffect } from "react";
import { UUID } from "node:crypto";

interface MessageBubbleProps {
    messageId: UUID | undefined;
    messageContent: string;
    messageDate: any;
    currentUserId: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ messageId, messageContent, messageDate, currentUserId }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [linkTitle, setLinkTitle] = useState<string | null>(null);

    const isOwnMessage = messageId === currentUserId;

    const fetchLinkTitle = async (url: string) => {
        try {
            const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
            const data = await response.json();
            const parser = new DOMParser();
            const doc = parser.parseFromString(data.contents, "text/html");
            const title = doc.querySelector("title")?.innerText || "Link Preview";
            setLinkTitle(title);
        } catch (error) {
            setLinkTitle("Link Preview Unavailable");
        }
    };

    useEffect(() => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        if (urlRegex.test(messageContent)) {
            fetchLinkTitle(messageContent);
        }
    }, [messageContent]);

    const renderMessageContent = () => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        if (urlRegex.test(messageContent)) {
            return (
                <a
                    href={messageContent}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline hover:text-blue-700 break-words"
                >
                    {linkTitle || messageContent}
                </a>
            );
        }

        const contentToDisplay = isExpanded ? messageContent : messageContent.slice(0, 100);
        return (
            <p className="break-words text-gray-800">
                {contentToDisplay}
                {!isExpanded && messageContent.length > 100 && (
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="text-blue-500 ml-2 underline hover:text-blue-700"
                    >
                        Read more
                    </button>
                )}
                {isExpanded && messageContent.length > 100 && (
                    <button
                        onClick={() => setIsExpanded(false)}
                        className="text-blue-500 ml-2 underline hover:text-blue-700"
                    >
                        Read Less
                    </button>
                )}
            </p>
        );
    };

    return (
        <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-4`}>
            <div
                className={`max-w-md lg:max-w-lg px-4 py-3 rounded-lg shadow-sm ${
                    isOwnMessage ? "bg-blue-100 text-right" : "bg-gray-100"
                }`}
                style={{ fontSize: "16px", fontFamily: "Arial, sans-serif" }}
            >
                {renderMessageContent()}
                <span
                    className={`block text-xs mt-2 ${
                        isOwnMessage ? "text-gray-600" : "text-gray-500"
                    }`}
                >
                    {new Date(messageDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
            </div>
        </div>
    );
};

export default MessageBubble;
