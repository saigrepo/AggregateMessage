import React, {useEffect, useRef, useState} from "react";
import {Send} from "lucide-react";
import {Textarea} from "../../components/ui/textarea.tsx";
import MessageBubble from "./cards/MessageBubble.tsx";
import {MessageDTO} from "../../redux/message/MessageModel.ts";
import Upload from "../upload/upload.tsx";
import {TextVariation} from "./conversation/TextVariation.tsx";


interface ChatAreaProps {
    messages: MessageDTO[];
    currentUserId: string;
    onSendMessage: (content: string) => void;
    setMessageInput: any;
    messageInput: any;
}

const ChatArea: React.FC<ChatAreaProps> = ({
                                               messages,
                                               currentUserId,
                                               onSendMessage,
                                               setMessageInput,
                                               messageInput
                                           }) => {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const chatEndRef = useRef<HTMLDivElement>({} as HTMLDivElement);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    useEffect(() => {
        console.log(uploadedFiles);
        uploadedFiles.map(up => {
            setMessageInput(up.trim());
            onSendMessage(up.trim());
        })
    }, [uploadedFiles, setUploadedFiles]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (messageInput.trim()) {
            onSendMessage(messageInput.trim());
            setMessageInput(""); // Clear the input after sending
        }
    };

    const handleKeyPressSendMessage = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (messageInput.trim()) {
                onSendMessage(messageInput.trim());
                setMessageInput(""); // Clear the input
            }
        }
    };

    const renderFilePreviews = () => {
        return uploadedFiles.map((file, index) => (
            <img
                key={index}
                src={URL.createObjectURL(file)}
                alt={`Preview ${index}`}
                className="h-24 w-24 object-cover rounded-md mr-2"
            />
        ));
    };

    return (
        <>
            <div className="flex-1 overflow-y-auto p-4 bg-bg-tones-2">
                {messages.length > 0 ? (
                    messages.map((msg) => (
                        <MessageBubble
                            key={msg?.id}
                            messageDate={msg.timeStamp} messageId={msg?.user.userId} messageContent={msg.content}
                            currentUserId={currentUserId}
                        />
                    ))
                ) : (
                    <div className="flex items-center justify-center">No Messages. Start a conversation!</div>
                )}
                <div ref={chatEndRef}></div> {}
            </div>

            <div className="border-t p-2 bg-bg-tones-2">
                <form onSubmit={handleSendMessage} className="flex items-center rounded-full px-2 py-2">
                    <div className="flex space-x-2">
                        <Upload onUploadedFile={setUploadedFiles} />
                    </div>
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
        </>
    );
};

export default ChatArea;
