import { Search } from 'lucide-react';
import {Conversation} from "../../../models/model-types.ts";
import React from "react";

const ConversationList= ({conversations, onSelectConversation, selectedConvId, darkMode}) => (
    <div className="w-64 bg-polo-blue-50 border-r overflow-y-auto">
        <div className="p-4 border-b">
            <h1 className="text-xl font-semibold">Messages</h1>
            <div className="mt-2 relative">
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-8 pr-4 py-2 rounded-full"
                />
                <Search className="absolute left-2 top-2.5 text-gray-400 w-4 h-4"/>
            </div>
        </div>
        <div className="p-2">
            {conversations.map((conv) => (
                <div key={conv?.id} className={`flex items-center p-2 hover:bg-polo-blue-100 rounded-lg cursor-pointer ${selectedConvId == conv?.id ? 'bg-gray-200' : ''}`} onClick={() => onSelectConversation(conv.id)}>
                    {/*<img src={conv.avatar} alt={conv.name} className="w-10 h-10 rounded-full mr-3"/>*/}
                    <div className="flex-1">
                        <h3 className="font-medium">{conv?.name}</h3>
                        <p className="text-sm text-gray-500 truncate">{conv?.lastMessage}</p>
                    </div>
                    <div className="text-xs text-gray-500">{conv?.time}</div>
                    {conv?.unreadCount && (
                        <div
                            className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {conv?.unreadCount}
                        </div>
                    )}
                </div>
            ))}
        </div>
    </div>
);

export default ConversationList;