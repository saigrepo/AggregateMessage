import React, {useEffect, useState} from 'react';
import Conversations from "./conversation/Conversations.tsx";
import ChatArea from "./ChatArea.tsx";
import SearchUsers from "./SearchUsers.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/Store.ts";
import {Client, over, Subscription} from "stompjs";
import {ConversationDTO} from "../../redux/conversation/ConversationModel.ts";
import {WebSocketMessageDTO} from "../../redux/message/MessageModel.ts";
import {
    createConversation,
    getUserConversations,
    markConversationAsRead
} from "../../redux/conversation/ConversationAction.ts";
import {createMessage, getAllMessages} from "../../redux/message/MessageAction.ts";
import {AUTHORIZATION_PREFIX, DELETE_CONVERSATION_ROUTE} from "../../utils/Constants.ts";
import apiClient from "../../lib/api-client.ts";

function MessageArea({userInfo, currentConversation, setCurrentConversation, messages, conversationState, token, dispatch, setMessages, setSelectedContacts, selectedContacts}) {

    const messageState = useSelector((state: RootState) => state.message);

    const [isConnected, setIsConnected] = useState(false);
    let [stompClient, setStompClient] = useState<Client>();
    const [subscribeTry, setSubscribeTry] = useState<number>(1);
    const [messageReceived, setMessageReceived] = useState<boolean>(false);
    const [newMessageContent, setNewMessageContent] = useState<string>("");
    const [conversations, setConversations] = useState<ConversationDTO[]>();


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
            dispatch(markConversationAsRead(currentConversation?.id, token));
            dispatch(getAllMessages(currentConversation.id, token));
        }
        if (token) {
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
                user: helperToDTO(messageState.newMessage.user) as any,
                conversation: {...currentConversation, users: currentConversation.users.map(user => helperToDTO(user)) }};
            stompClient.send("/app/messages", {}, JSON.stringify(webSocketMessage));
        }
        if(messages!=null) {
            setMessages([...messages, messageState?.newMessage]);
        }
        if (token) {
            dispatch(getUserConversations(token));
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

    const onSendMessage = (msg) => {
        console.log(msg);
        if (currentConversation?.id && token) {
            dispatch(createMessage({conversationId: currentConversation?.id, content: msg}, token));
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

    const getLastSeen = (messages) => {
        const lastReadMessage = messages.filter((msg) => msg.readBy.includes(userInfo.userId)).at(-1);
        if (!lastReadMessage) return 'Never seen'; // Handle case if no messages were read

        const diffMins = Math.floor((new Date().getTime() - new Date(lastReadMessage.timeStamp).getTime()) / 60000); // Difference in minutes

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} mins`;
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hr`;

        return `${Math.floor(diffMins / 1440)} day(s)`;
    };

    const setDefaultConvName = (conv: ConversationDTO) => {
        if(!conv?.conversationName) {
            const userNames = conv.users.filter((user) => user.userId).map((usr) => {
                return usr.firstName + " "+ usr.lastName
            });
            console.log(userNames);
            return userNames;
        }
    }


    const handleConvDelete = async (convId) => {
        console.log('handleConvDelete: ' + convId);
        const up = conversations.filter((conv) => conv.id !== convId);
        try {
            const delRes = await apiClient.delete(DELETE_CONVERSATION_ROUTE + convId, {withCredentials:true});
            console.log(delRes);
        } catch (e) {
            console.error(e);
        }
        setConversations(up);
        handleOnClickOfConversation(up[0]);
    }


    return (
        <div className="flex flex-row w-full">
            {conversations?.length > 0 ? (
            <>
                <Conversations conversations={conversations} onSelectConversationClick={handleOnClickOfConversation} selectedConvId={currentConversation?.id} messageTitle="Message" setMessage={setConversations} handleConvDelete={handleConvDelete}/>
                {currentConversation ? (
                    <div className={`flex flex-col flex-grow bg-bg-tones-4`}>
                        <div className="border-b p-4 h-[55px] flex justify-between items-center backdrop-blur-md bg-gradient-to-r from-bg-tones-4 to-bg-tones-2">
                            <div>
                                <div className="flex flex-row items-stretch">
                                    {setDefaultConvName(currentConversation).map((nameVar) => (
                                        <h2 className="font-semibold font-serif text-[1em] mx-2" key={nameVar}>{nameVar}</h2>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-500 mx-2">Last seen {getLastSeen(currentConversation?.messages)}</p>
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
            )
            }
        </div>
    );
}

export default MessageArea;