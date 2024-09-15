import {useAppStore} from "../../slices";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {toast} from "sonner";
import {Contact, Conversation, Message} from "../../models/model-types.ts";
import Conversations from "./chat-container/Conversations.tsx";
import Sidebar from "./sidebar";
import {useSocket} from "../../socket/hooks/useSocket.ts";
import Chatroom from "./chat-container/Chatroom.tsx";
import apiClient from "../../lib/api-client.ts";
import SearchContacts from "./chat-container/SearchContacts.tsx";
import { v4 as uuidv4 } from 'uuid';
import {
    CREATE_CONVERSATION_ROUTE,
    DELETE_CONVERSATION_ROUTE,
    GET_CONVERSATIONS_ROUTE,
    HOST,
    SOCKET_HOST
} from "../../utils/Constants.ts";

function MessageComponent(props) {
    const { userInfo, setUserInfo, darkMode, toggleDarkMode } = useAppStore();
    const [selectedConversation, setSelectedConversation] = useState<Conversation>( null);

    const { isConnected, socketResponse, sendData, socket } = useSocket(selectedConversation?.id, userInfo.userId);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true); // Add this state
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messageInput, setMessageInput] = useState("");
    const [messageList, setMessageList] = useState<Message[]>( []);
    const [participants, setParticipants] = useState<string[]>([]);
    const [conversationName, setConversationName] = useState<string>('');
    const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);



    useEffect(() => {
        if (!userInfo.userProfileCreated) {
            toast("Profile setup is yet to be completed");
            navigate("/profile");
        }
    }, [userInfo, navigate]);

    useEffect(() => {
        const fetchConversations = async () => {
            if (!isConnected) return;  // Wait until socket is connected

            setLoading(true);
            try {
                const response = await apiClient.get(`${GET_CONVERSATIONS_ROUTE}/${userInfo.userId}`);
                setConversations(response.data);
            } catch (error) {
                console.error('Error fetching conversations:', error);
                toast.error("Failed to fetch conversations");
            } finally {
                setLoading(false);
            }
        };

        if (isConnected) {
            fetchConversations();
        }
    }, [isConnected]);


    const handleSelectedConversation = (id: string) => {
        const selected = conversations.find(conv => conv?.id === id);
        if (selected) {
            setSelectedConversation(selected);
            setMessageList(selected.messages);
        }
    };


    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (messageInput !== "") {
            sendData({
                message: messageInput,
                selectedConversationId: selectedConversation?.id,
            });
            addMessageToList({
                id: uuidv4(),
                sender: userInfo.userEmail,
                content: messageInput,
                time: new Date().toLocaleTimeString(),
                messagedBy: userInfo.userId,
            });
            setMessageInput("");
        }
    };

    const addMessageToList = (newMessage: Message) => {
        setMessageList((prevMessages) => [...prevMessages, newMessage]);
        setConversations((prevConversations) => prevConversations.map(conv =>
            conv.id === selectedConversation?.id
                ? { ...conv, messages: [...conv.messages, newMessage] }
                : conv
        ));
    };



    useEffect(() => {
        if (socketResponse && socketResponse.room === selectedConversation?.id) {
            addMessageToList({
                id: uuidv4(),
                sender: userInfo.userEmail,
                content: socketResponse.message,
                time: new Date().toLocaleTimeString(),
                messagedBy: userInfo.userId,
            });
        }
    }, [socketResponse, selectedConversation]);

    const createConvHeading = (seleCon) => {
        let gro = "New group";
        seleCon.forEach(con => {
            gro += " "+con.name.split(" ")[0]
        })
        return gro;
    }

    const createConversation = async () => {
        const converHeading = (conversationName.length == 0) ? (selectedContacts.length > 1 ? createConvHeading(selectedContacts) : selectedContacts[0].name) : conversationName
        const str = [userInfo.userId];
        selectedContacts.forEach(se => {
            str.push(se.id);
        });

        const response = await apiClient.post(CREATE_CONVERSATION_ROUTE, {
            id: uuidv4(),
            name: converHeading,
            avatar: '',
            lastMessage: '',
            createdAt: new Date().toISOString(),
            messages: [],
            participants: str, // Pass selected participants
        }, {withCredentials: true});
        const newConversation: Conversation = response.data;
        setConversations((prevState) => [...prevState, newConversation]);
        setSelectedConversation(newConversation);
        setParticipants(str);

        console.log('Conversation created with participants:', participants);
    };

    const handleDeleteConv = async (convId) => {
        try {
            const resp = await apiClient.post(`${DELETE_CONVERSATION_ROUTE}/${convId}`, {withCredentials: true});
            if(resp.data){
                const updatedConversations = conversations.filter(conv => conv.id !== convId);
                setConversations(updatedConversations);
                if(selectedConversation?.id == convId) {
                    setSelectedConversation(null);
                }
                toast.success("Conversation deleted")
            }
        } catch (error) {
            console.log("unable to delete the conversation", error);
            toast.error("unable to delete the conversation")

        }
    }

    useEffect(() => {
        if (selectedConversation) {
            socket.emit('join_conversation', selectedConversation.id);

            socket.on('read_message', (message) => {
                console.log("rm", message);
                setMessageList((prevMessages) => [...prevMessages, message]);
            });

            return () => {
                socket.off('receive_message');
            };
        }
    }, [selectedConversation]);

    return (
        <div className={`flex h-screen ${darkMode ? 'bg-background-dark' : 'bg-background-light'}`}>
            {loading ? (
                <div className="flex items-center justify-center w-full h-full">
                    <p>Loading conversations...</p> {/* You can replace this with a spinner */}
                </div>
            ) : (
                <>
                    <Sidebar
                        userInfo={userInfo}
                        setUserInfo={setUserInfo}
                        darkMode={darkMode}
                        toggleDarkMode={() => toggleDarkMode(!darkMode)}
                        onContactsSelected={createConversation}
                        selectedContacts={selectedContacts}
                        setSelectedContacts={setSelectedContacts}
                    />
                    <Conversations
                        darkMode={darkMode}
                        conversations={conversations}
                        onSelectConversation={handleSelectedConversation}
                        selectedId={selectedConversation?.id}
                    />
                    {selectedConversation ? (
                        <Chatroom
                            selectedConversation={selectedConversation}
                            messageList={messageList}
                            messageInput={messageInput}
                            setMessageInput={setMessageInput}
                            sendMessage={sendMessage}
                            darkMode={darkMode}
                            handleDeleteConv={handleDeleteConv}
                        />
                    ) : (
                        <div className="flex-grow flex items-center justify-center">
                            <p>Select a conversation or start a new one</p>
                            <SearchContacts
                                onContactsSelected={createConversation}
                                selectedContacts={selectedContacts}
                                setSelectedContacts={setSelectedContacts}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default MessageComponent;