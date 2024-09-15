import React from "react";
import MessageBubble from "./MessageBubble.tsx";
import {Message} from "postcss";
import {Simulate} from "react-dom/test-utils";
import mouseDown = Simulate.mouseDown;
import {Conversation} from "../../../models/model-types.ts";

const ChatArea: React.FC<{messages: Message[], messagedBy: string}>= ({messages, messagedBy}) => (
    <div className="flex-1 overflow-y-auto p-4 bg-radialPrimarySecondary ">
        {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} currentUserId={messagedBy}/>
        ))}
    </div>
);

export default ChatArea