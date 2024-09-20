import React from 'react';
import ChatArea from "./ChatArea.tsx";
import {ConversationDTO} from "../../redux/conversation/ConversationModel.ts";
import {AiOutlineDelete} from "react-icons/ai";
import {useAppStore} from "../../slices";

function Chatroom({ selectedConversation, messageList, messageInput, setMessageInput, sendMessage, darkMode, handleDeleteConv }) {

    const {userInfo} = useAppStore();

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

    const setDefaultConvName = (conv: ConversationDTO) => {
        if(!conv?.conversationName) {
            const user = conv.users.filter((user) => user.userId)[0];
            return user.firstName +" " + user.lastName;
        }
    }


    return (
        <div className={`flex flex-col flex-grow ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="bg-polo-blue-50 border-b p-4 flex justify-between items-center backdrop-blur-md bg-gradient-to-r from-10%">
                <div>
                    <h2 className="font-semibold text-lg">{setDefaultConvName(selectedConversation)}</h2>
                    <p className="text-sm text-gray-500">Last seen {getLastSeen(selectedConversation?.time)}</p>
                </div>
                <div className="flex space-x-2">
                    <AiOutlineDelete  size={25} className="cursor-pointer"
                                      onClick={()=>handleDeleteConv(selectedConversation?.id)}
                    />
                </div>
            </div>
            <ChatArea messages={messageList} messagedBy={userInfo.userId}  messageInput={messageInput}
                      setMessageInput={setMessageInput}
                      sendMessage={sendMessage}/>
        </div>
    );
}

export default Chatroom;