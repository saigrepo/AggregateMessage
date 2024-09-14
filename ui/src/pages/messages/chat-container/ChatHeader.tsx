import React from "react";
import {Edit, Search} from "lucide-react";

const ChatHeader: React.FC<{ name: string; lastSeen: string; darkMode: boolean }> = ({ name, lastSeen, darkMode }) => (
    <div className="bg-polo-blue-50 border-b p-4 flex justify-between items-center backdrop-blur-md bg-gradient-to-r from-10%">
        <div>
            <h2 className="font-semibold text-lg">{name}</h2>
            <p className="text-sm text-gray-500">Last seen {lastSeen}</p>
        </div>
        <div className="flex space-x-2">
            <Search className="text-gray-500" />
        </div>
    </div>
);

export default ChatHeader;