import React from "react";
import MessageBubble from "./MessageBubble.tsx";
import {Message} from "postcss";
import {Simulate} from "react-dom/test-utils";
import mouseDown = Simulate.mouseDown;

const ChatArea= ({messages, darkMode}) => (
    <div className="flex-1 overflow-y-auto p-4 bg-radialPrimarySecondary ">
        {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg}/>
        ))}
    </div>
);

export default ChatArea