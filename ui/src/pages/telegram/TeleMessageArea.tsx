import React, {useState} from 'react';
import Conversations from "../messages/conversation/Conversations.tsx";
import {ConversationDTO} from "../../redux/conversation/ConversationModel.ts";
import {markConversationAsRead} from "../../redux/conversation/ConversationAction.ts";
import {getAllMessages} from "../../redux/message/MessageAction.ts";
import DummyTeleMessage from "./DummyTeleMessage.tsx";

function TeleMessageArea({telegramConversations}) {

    const [currentTeleConversation, setCurrentTeleConversation] = useState([]);
    const [messages, setMessages] = useState([]);


    const handleOnClickOfConversation = (conv) => {
        markConversationAsRead(conv.id);
        getAllMessages(conv?.id);
        setCurrentTeleConversation(conv);
        setMessages(conv.messages);
    }

    const setDefaultConvName = (conv) => {
        if(!conv?.conversationName) {
            const userNames = conv.users.filter((user) => user.userId).map((usr) => {
                return usr.firstName + " "+ usr.lastName
            });
            console.log(userNames);
            return userNames;
        }
    }

    return (
        <DummyTeleMessage teleConv={telegramConversations}/>
        // <div className="flex flex-row w-full">
        //     {telegramConversations?.length > 0 ? (
        //         <>
        //             <Conversations telegramConversations={telegramConversations} onSelectConversationClick={handleOnClickOfConversation} selectedConvId={currentTeleConversation?.id} messageTitle="Telegram Messages"/>
        //             {currentTeleConversation && (
        //                 <div className={`flex flex-col flex-grow bg-bg-tones-4`}>
        //                     <div className="border-b p-4 h-[55px] flex justify-between items-center backdrop-blur-md bg-gradient-to-r from-bg-tones-4 to-bg-tones-2">
        //                         <div>
        //                             <div className="flex flex-row items-stretch">
        //                                 {setDefaultConvName(currentTeleConversation).map((nameVar) => (
        //                                     <h2 className="font-semibold font-serif text-[1em] mx-2" key={nameVar}>{nameVar}</h2>
        //                                 ))}
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>) }
        //         </>) : <div>No Telegram conversation is selected</div>
        //     }
        // </div>
    );
}

export default TeleMessageArea;