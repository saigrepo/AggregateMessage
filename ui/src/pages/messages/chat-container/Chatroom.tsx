import React from 'react';
import ChatHeader from "./ChatHeader.tsx";
import ChatArea from "./ChatArea.tsx";
import InputArea from "./InputArea.tsx";

function Chatroom({ selectedConversation, messageList, messageInput, setMessageInput, sendMessage, darkMode, handleDeleteConv }) {

    const getLastSeen = (conTime) => {
        const date = new Date(conTime);
        const now = new Date();
        const diffMs = now - date; // difference in milliseconds
        const diffMins = Math.floor(diffMs / 60000); // convert to minutes

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} mins`;
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hr`;

        return `${Math.floor(diffMins / 1440)} day(s)`;
    }

    return (
        <div className={`flex flex-col flex-grow ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <ChatHeader name={selectedConversation.name} lastSeen={getLastSeen(selectedConversation?.time)} handleDelete={()=>handleDeleteConv(selectedConversation?.id)} />
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