import React from "react";
import { AiOutlineDelete } from "react-icons/ai";

const ChatHeader = ({ name, lastSeen, handleDelete }) => (
    <div className="bg-polo-blue-50 border-b p-4 flex justify-between items-center backdrop-blur-md bg-gradient-to-r from-10%">
        <div>
            <h2 className="font-semibold text-lg">{name}</h2>
            <p className="text-sm text-gray-500">Last seen {lastSeen}</p>
        </div>
        <div className="flex space-x-2">
            <AiOutlineDelete  size={25} className="cursor-pointer"
                              onClick={handleDelete}
            />
        </div>
    </div>
);

export default ChatHeader;