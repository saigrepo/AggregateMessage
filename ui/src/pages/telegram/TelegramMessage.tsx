import io from "socket.io-client";
import React, {useEffect, useState} from "react";
import axios from "axios";

function TelegramMessageComponent(props) {

    const  [loading, setLoading] = useState(false);
    const socket = io("http://localhost:5400", {
        transports: ["websocket"], // Specify transport methods
    });

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        console.log("Connecting to socket");
        socket.connect();
    }, []);

    useEffect(() => {
        // Listen for new messages from the server
        socket.on("newTelegramMessage", (newMessage) => {
            console.log("inside socket");
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        return () => {
            socket.off("newTelegramMessage");
        };
    }, []);

    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await axios.get('http://localhost:5400/api/telegram-conversations');
                if (response.data.success) {
                    setConversations(response.data.conversations);
                } else {
                    console.error("Failed to fetch conversations");
                }
            } catch (error) {
                console.error("Error fetching conversations:", error);
            }
        };

        fetchConversations();
    }, []);


    return (
        <div>
            <h2>Your Telegram Conversations</h2>

        </div>
    );



}

export default TelegramMessageComponent;