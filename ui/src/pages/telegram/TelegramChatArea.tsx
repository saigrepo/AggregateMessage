import React, {useEffect, useRef} from 'react';
import MessageBubble from "../messages/cards/MessageBubble.tsx";
import {Textarea} from "../../components/ui/textarea.tsx";
import {TextVariation} from "../messages/conversation/TextVariation.tsx";
import {Send} from "lucide-react";

function TelegramChatArea({messages, currentUserId, onSendMessage, messageInput, setMessageInput}) {
    const teleChatEndRef = useRef<HTMLDivElement>({} as HTMLDivElement);

    useEffect(() => {
        teleChatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (messageInput.trim()) {
            onSendMessage(messageInput.trim());
            setMessageInput(""); // Clear the input after sending
        }
    };

    const handleKeyPressSendMessage = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            if (messageInput.trim()) {
                onSendMessage(messageInput.trim());
                setMessageInput(""); // Clear the input
            }
        }
    };

    return (<>
        <div className="flex-1 overflow-y-auto p-4 bg-bg-tones-2">
            {messages.length > 0 ? (
                messages.map((msg) => (
                    <MessageBubble
                        key={msg?.chatId}
                        messageDate={msg.date * 1000} messageId={msg?.senderId} messageContent={msg.message}
                        currentUserId={currentUserId}
                    />
                ))
            ) : (
                <div className="flex justify-center mt-80">No Messages. Start a conversation!</div>
            )}
            <div ref={teleChatEndRef}></div> {}
        </div>

        <div className="border-t p-2 bg-bg-tones-2">
            <form onSubmit={handleSendMessage} className="flex items-center rounded-full px-2 py-2">
                <Textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Write your message here"
                    className="flex-1 bg-transparent outline-none border-2 rounded-md mx-1 p-2 overflow-auto"
                    onKeyDown={handleKeyPressSendMessage}
                />
                <TextVariation messageText={messageInput} setMessageInput={setMessageInput} />
                <button type="submit" key= "sendText" className="ml-2 p-2 rounded-full">
                    <Send size={25} />
                </button>
            </form>
        </div>
    </>);
}

export default TelegramChatArea;