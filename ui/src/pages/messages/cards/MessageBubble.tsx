import React, { useState, useEffect } from "react";
import { UUID } from "node:crypto";

interface MessageBubbleProps {
    messageId: UUID | undefined;
    messageContent: string;
    messageDate: any;
    currentUserId: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
                                                         messageId,
                                                         messageContent,
                                                         messageDate,
                                                         currentUserId
                                                     }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [linkTitle, setLinkTitle] = useState<string | null>(null);
    const [isImage, setIsImage] = useState(false);

    const isOwnMessage = messageId === currentUserId;

    const isImageUrl = (url: string) => {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 's3.amazonaws.com'];
        return imageExtensions.some(ext => url.toLowerCase().includes(ext));
    };

    const fetchLinkTitle = async (url: string) => {
        try {
            if (isImageUrl(url)) {
                setIsImage(true);
                return;
            }

            const response = await fetch(`http://localhost:5400/proxy?url=${encodeURIComponent(url)}`, {
                method: "GET"
            });
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
        const urls = messageContent.match(urlRegex);

        if (urls && urls.length > 0) {
            fetchLinkTitle(urls[0]);
        }
    }, [messageContent]);

    const renderMessageContent = () => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urls = messageContent.match(urlRegex);

        if (urls && isImage) {
            return (
                <a
                    href={urls[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        src={urls[0]}
                        alt="Uploaded Image"
                        className="max-w-full h-auto rounded-lg"
                    />
                </a>
            );
        }

        if (urls) {
            return (
                <a
                    href={urls[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-500 underline hover:text-blue-700 break-words"
                >
                    {linkTitle || urls[0]}
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
                    isOwnMessage ? "#8E8ADA text-right" : "#C9C9C9"
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