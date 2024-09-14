import {useAppStore} from "../../slices";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {toast} from "sonner";
import {Conversation, Message} from "../../models/model-types.ts";
import ConversationList from "./chat-container/ConversationList.tsx";
import Sidebar from "./sidebar";
import {useSocket} from "../../socket/hooks/useSocket.ts";
import Chatroom from "./chat-container/Chatroom.tsx";
import apiClient from "../../lib/api-client.ts";
import SearchContacts from "./chat-container/SearchContacts.tsx";
import { v4 as uuidv4 } from 'uuid';
import {HOST, SOCKET_HOST} from "../../utils/Constants.ts";

function MessageComponent(props) {
    const { userInfo, darkMode, toggleDarkMode } = useAppStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!userInfo.userProfileCreated) {
            toast("Profile setup is yet to be completed");
            navigate("/profile");
        }
    }, [userInfo, navigate]);

    const converList: Conversation[] = [];

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await apiClient.get(`${HOST}/api/v1/conversation`);
                setConversations(response.data);
            } catch (error) {
                console.error('Error fetching conversations:', error);
                toast.error("Failed to fetch conversations");
            }
        };

        fetchConversations();
    }, []);

    const [conversations, setConversations] = useState<Conversation[]>(converList);
    const [selectedConversation, setSelectedConversation] = useState<Conversation>( null);
    const [messageInput, setMessageInput] = useState("");
    const [messageList, setMessageList] = useState<Message[]>( []);
    const [participants, setParticipants] = useState<string[]>([]);
    const [conversationName, setConversationName] = useState<string>('');

    const handleSelectedConversation = (id: string) => {
        const selected = conversations.find(conv => conv.id === id);
        if (selected) {
            setSelectedConversation(selected);
            setMessageList(selected.messages);
        }
    };

    const { isConnected, socketResponse, sendData } = useSocket(selectedConversation?.id, userInfo.userId);

    // Sending the message to the WebSocket server
    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (messageInput !== "") {
            sendData({
                message: messageInput,
                room: selectedConversation?.id,
            });
            addMessageToList({
                id: Date.now().toString(), // Unique ID for the new message
                sender: userInfo.userEmail,
                content: messageInput,
                time: new Date().toLocaleTimeString(),
                isOwn: true,
            });
            setMessageInput("");
        }
    };

    // Adding message to the chatroom UI
    const addMessageToList = (newMessage: Message) => {
        setMessageList((prevMessages) => [...prevMessages, newMessage]);
        setConversations((prevConversations) => prevConversations.map(conv =>
            conv.id === selectedConversation?.id
                ? { ...conv, messages: [...conv.messages, newMessage] }
                : conv
        ));
    };

    // Fetching new messages from the socket response
    useEffect(() => {
        if (socketResponse && socketResponse.room === selectedConversation?.id) {
            addMessageToList({
                id: Date.now().toString(),
                sender: userInfo.userEmail,
                content: socketResponse.message,
                time: new Date().toLocaleTimeString(),
                isOwn: false,
            });
        }
    }, [socketResponse, selectedConversation]);

    // Create a new chat with selected contacts
    const createConversation = async () => {
        const newConversation: Conversation = {
            id: uuidv4(), // Generate UUID for the conversation
            name: conversationName,
            avatar: '', // Optionally handle avatar
            lastMessage: '',
            time: new Date().toISOString(),
            messages: [],
            participants: selectedContacts, // Pass selected participants
        };

        // Send the conversation to the backend to create a room
        await apiClient.post(`${HOST}/api/v1/conversation/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newConversation),
        });

        setSelectedConversation(newConversation);

        console.log('Conversation created with participants:', participants);
    };
    const [selectedContacts, setSelectedContacts] = useState<string[]>([]);


    return (
        <div className={`flex h-screen ${darkMode ? 'bg-background-dark' : 'bg-background-light'}`}>
            <Sidebar userInfo={userInfo} darkMode={darkMode} toggleDarkMode={() => toggleDarkMode(!darkMode)} onContactsSelected={createConversation}
                     selectedContacts={selectedContacts} setSelectedContacts={setSelectedContacts}/>
            <ConversationList
                darkMode={darkMode}
                conversations={conversations}
                onSelectConversation={handleSelectedConversation}
                selectedId={selectedConversation?.id}
            />
            { selectedConversation ?
            <Chatroom
                selectedConversation={selectedConversation}
                messageList={messageList}
                messageInput={messageInput}
                setMessageInput={setMessageInput}
                sendMessage={sendMessage}
                darkMode={darkMode}
            /> : (
            <div className="flex-grow flex items-center justify-center">
                <p>Select a conversation or start a new one</p>
                <SearchContacts onContactsSelected={createConversation} selectedContacts={selectedContacts} setSelectedContacts={setSelectedContacts}/>
            </div>
            )
            }

        </div>
    );
}

export default MessageComponent;