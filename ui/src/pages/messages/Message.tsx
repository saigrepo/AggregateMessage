import {useAppStore} from "../../slices";
import {useEffect, useState} from "react";
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
import {WebSocketMessageDTO} from "../../redux/message/MessageModel.ts";
import {ConversationDTO} from "../../redux/conversation/ConversationModel.ts";
import {createMessage} from "../../redux/message/MessageAction.ts";
import Conversations from "./Conversations.tsx";
import conversations from "./Conversations.tsx";
import Chatroom from "./Chatroom.tsx";


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
    const [newMessage, setNewMessage] = useState<string>("");
    const [currentConversation, setCurrentConversation] = useState<ConversationDTO>();
    const [conversations, setConversations] = useState<ConversationDTO[]>();
    const [messageContent, setMessageContent] = useState("");




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
        if (messageState?.newMessage && stompClient && currentConversation && isConnected) {
            const webSocketMessage: WebSocketMessageDTO = {...messageState.newMessage, conversation: currentConversation};
            stompClient.send("/app/messages", {}, JSON.stringify(webSocketMessage));
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

    const onSendMessage = () => {
        if (currentConversation?.id && token) {
            dispatch(createMessage({conversationId: currentConversation?.id, content: newMessage}, token));
            setNewMessage("");
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
        console.log("New conversation");
        console.log(conversationState?.createdConversation);
    }
    const handleOnClickOfConversation = (conv: ConversationDTO) => {
        if(token) {
            dispatch(markConversationAsRead(conv.id, token));
        }
        setCurrentConversation(conv);
    }


    return (
        <div className={`flex h-screen bg-background-light border-4 rounded-lg border-white-800 `}>
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
                                <Chatroom
                                    selectedConversation={currentConversation}
                                    messageList={currentConversation.messages}
                                    messageInput={messageContent}
                                    setMessageInput={setMessageContent}
                                    sendMessage={() => console.log("handle send message")}
                                    handleDeleteConv={() => console.log("handle delete")}
                                />
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