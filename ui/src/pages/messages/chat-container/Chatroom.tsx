import React from 'react';
import ChatHeader from "./ChatHeader.tsx";
import ChatArea from "./ChatArea.tsx";
import InputArea from "./InputArea.tsx";

function Chatroom({ selectedConversation, messageList, messageInput, setMessageInput, sendMessage, darkMode }) {
    const name="Design Team"
    const lastSeen="Dec 16, 2019"

    return (
        <div className={`flex flex-col flex-grow ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <ChatHeader name={selectedConversation.name} lastSeen="Online" />
            <ChatArea messages={messageList} />
            <InputArea
                messageInput={messageInput}
                setMessageInput={setMessageInput}
                sendMessage={sendMessage}
            />
        </div>
    );
}

export default Chatroom;