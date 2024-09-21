import {useAppStore} from "../../slices";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "sonner";
import {AUTHORIZATION_PREFIX} from "../../utils/Constants.ts";
import SearchUsers from "./SearchUsers.tsx";
import {Contact} from "../../models/model-types.ts";
import {RiLogoutCircleRLine} from "react-icons/ri";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/Store.ts";
import {
    createConversation,
    getUserConversations,
    markConversationAsRead
} from "../../redux/conversation/ConversationAction.ts";
import {Client, over, Subscription} from "stompjs";
import {MessageDTO, WebSocketMessageDTO} from "../../redux/message/MessageModel.ts";
import {ConversationDTO} from "../../redux/conversation/ConversationModel.ts";
import {createMessage, getAllMessages} from "../../redux/message/MessageAction.ts";
import Conversations from "./Conversations.tsx";
import conversations from "./Conversations.tsx";
import Chatroom from "./Chatroom.tsx";
import {AiOutlineDelete} from "react-icons/ai";
import ChatArea from "./ChatArea.tsx";


function MessageComponent(props) {

    const messageState = useSelector((state: RootState) => state.message);

    const conversationState = useSelector((state: RootState) => state?.conversation);
    const dispatch: AppDispatch = useDispatch();
    const { userInfo, setUserInfo } = useAppStore();
    const [loading, setLoading] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
    const navigate = useNavigate();
    const token: string | null = localStorage.getItem("jwtToken");
    let [stompClient, setStompClient] = useState<Client>();
    const [subscribeTry, setSubscribeTry] = useState<number>(1);
    const [messageReceived, setMessageReceived] = useState<boolean>(false);
    const [newMessageContent, setNewMessageContent] = useState<string>("");
    const [currentConversation, setCurrentConversation] = useState<ConversationDTO>();
    const [conversations, setConversations] = useState<ConversationDTO[]>();
    const [messages, setMessages] =useState<MessageDTO[]>();


    useEffect(() => {
        if (!userInfo.userProfileCreated) {
            toast("Profile setup is yet to be completed");
            navigate("/profile");
        }
    }, [userInfo, navigate]);


    const handleLogOut = () => {
        setUserInfo(undefined);
        localStorage.clear();
        navigate("/auth");
    }


    useEffect(() => {
        console.log("Initiating WebSocket connection...");
        connect();
    }, []);

    useEffect(() => {
        if (token) {
            dispatch(getUserConversations(token));
        }
    }, [conversationState?.createdConversation, conversationState?.createdGroup, dispatch, token, messageState?.newMessage, conversationState?.deletedConversation, conversationState?.editedGroup, conversationState?.markedAsReadConversation]);


    useEffect(() => {
        setConversations(conversationState?.conversations);
    }, [conversationState?.conversations]);

    useEffect(() => {
        setMessages(messageState?.messages);
    }, [messageState?.messages]);

    useEffect(() => {
        if (messageReceived && currentConversation?.id && token) {
            console.log("fetch")
            dispatch(markConversationAsRead(currentConversation?.id, token));
            dispatch(getAllMessages(currentConversation.id, token));
        }
        if (token) {
            console.log("fetch")
            dispatch(getUserConversations(token));
        }
        setMessageReceived(false);
    }, [messageReceived, messageState?.newMessage]);

    const helperToDTO = (user) => {
        const tempUser = {
            id: user.userId,
            emailId: user.userEmail,
            firstName: user.firstName,
            lastName: user.lastName
        }
        return tempUser;
    }

    useEffect(() => {
        if (messageState?.newMessage && stompClient && currentConversation && isConnected) {
            const webSocketMessage: WebSocketMessageDTO = {...messageState.newMessage,
                user: helperToDTO(messageState.newMessage.user),
                conversation: {...currentConversation, users: currentConversation.users.map(user => helperToDTO(user)) }};
            stompClient.send("/app/messages", {}, JSON.stringify(webSocketMessage));
        }
        if(messages!=null) {
            setMessages([...messages, messageState?.newMessage]);
        }
    }, [messageState?.newMessage]);

    useEffect(() => {
        console.log("Attempting to subscribe to ws: ", subscribeTry);
        if (isConnected && stompClient && stompClient.connected) {
            const subscription: Subscription = stompClient.subscribe("/topic/" + userInfo.userId.toString(), onMessageReceive);

            return () => subscription.unsubscribe();
        } else {
            const timeout = setTimeout(() => setSubscribeTry(subscribeTry + 1), 500);
            return () => clearTimeout(timeout);
        }
    }, [subscribeTry, isConnected, stompClient]);

    const onMessageReceive = () => {
        setMessageReceived(true);
    };

    const onSendMessage = (e) => {
        console.log(newMessageContent);
        if (currentConversation?.id && token) {
            dispatch(createMessage({conversationId: currentConversation?.id, content: newMessageContent}, token));
            setNewMessageContent("");
        }
    };

    const connect =()=>{
        const headers = {
                    Authorization: `${AUTHORIZATION_PREFIX}${token}`
                };
        let Sock = new WebSocket('ws://localhost:6910/ws');
        const client = over(Sock);
        setStompClient(client);
        client.connect(headers, onConnect, onError);
    }

    const onConnect = (val) => {
        console.log("Connected", val);
        setTimeout(() => setIsConnected(true), 1000);
    };

    const onError = (error: any) => {
        console.error("WebSocket connection error", error);
    };

    const handleSelectedContacts =() => {
        if(selectedContacts.length == 1) {
            dispatch(createConversation(selectedContacts[0].id, token))
        }
        setCurrentConversation(conversationState?.createdConversation);
        setMessages(conversationState?.createdConversation?.messages);
        console.log("New conversation");
        console.log(conversationState?.createdConversation);
    }
    const handleOnClickOfConversation = (conv: ConversationDTO) => {
        if(token) {
            dispatch(markConversationAsRead(conv.id, token));
            dispatch(getAllMessages(conv?.id, token));
        }
        setCurrentConversation(conv);
        setMessages(conv.messages);
    }

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
        <div className={`flex h-[95vh] w-[95vw] bg-background-light border-4 rounded-lg border-white-800 ml-10 mt-5`}>
            {loading ? (
                <div className="flex items-center justify-center w-full h-full">
                    <p>Loading conversations...</p> {/* You can replace this with a spinner */}
                </div>
            ) : ( <>
                <div className="w-15 flex flex-col justify-between py-4 h-full border-r-2">
                    <div className="flex flex-col items-center">
                        <SearchUsers onContactsSelected={handleSelectedContacts} setSelectedContacts={setSelectedContacts} selectedContacts={selectedContacts} />
                    </div>
                    <div className="flex flex-col items-center">
                        <RiLogoutCircleRLine className="cursor-pointer" size={28} onClick={handleLogOut} />
                    </div>
                </div>
                {conversations?.length > 0 ? (
                        <>
                            <Conversations conversations={conversations} onSelectConversationClick={handleOnClickOfConversation} selectedConvId={currentConversation?.id}/>
                            {currentConversation ? (
                                <div className={`flex flex-col flex-grow bg-white`}>
                                    <div className="bg-polo-blue-50 border-b p-4 flex justify-between items-center backdrop-blur-md bg-gradient-to-r from-10%">
                                        <div>
                                            <h2 className="font-semibold text-lg">{setDefaultConvName(currentConversation)}</h2>
                                            <p className="text-sm text-gray-500">Last seen {getLastSeen("")}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <AiOutlineDelete  size={25} className="cursor-pointer"
                                                              onClick={() => console.log("handle delete")}
                                            />
                                        </div>
                                    </div>
                                    <ChatArea
                                        messages={messages}
                                        currentUserId={userInfo.userId}
                                        onSendMessage={onSendMessage}
                                        messageInput={newMessageContent}
                                        setMessageInput={setNewMessageContent}
                                    />
                                </div>
                            ) : (
                                <div className="flex-grow flex items-center justify-center">
                                    <p>Select a conversation or start a new one</p>
                                    <SearchUsers onContactsSelected={handleSelectedContacts} setSelectedContacts={setSelectedContacts} selectedContacts={selectedContacts} />
                                </div>
                            )}
                        </>
                ) : (
                    <div className="flex-grow flex items-center justify-center">
                        <p>Select a conversation or start a new one</p>
                        <SearchUsers onContactsSelected={handleSelectedContacts} setSelectedContacts={setSelectedContacts} selectedContacts={selectedContacts} />
                    </div>
                )}
            </>
            )}
        </div>);



}

export default MessageComponent;