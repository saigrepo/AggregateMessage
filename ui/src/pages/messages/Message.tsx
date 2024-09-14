import {useAppStore} from "../../slices";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {toast} from "sonner";
import {Conversation, Message} from "../../models/model-types.ts";
import ConversationList from "./chat-container/ConversationList.tsx";
import Sidebar from "./sidebar";
import ChatArea from "./chat-container/ChatArea.tsx";
import ChatHeader from "./chat-container/ChatHeader.tsx";
import InputArea from "./chat-container/InputArea.tsx";

function MessageComponent(props) {
    const {userInfo, darkMode, toggleDarkMode} = useAppStore();
    const navigate = useNavigate();

    useEffect(()=> {
        if(!userInfo.userProfileCreated) {
            toast("Profile setup is yet to be completed");
            navigate("/profile")
        }
    }, [userInfo, navigate])

    const converList:Conversation[] = [
        {
            id: '1',
            name: 'Design Team',
            avatar: '/api/placeholder/32',
            lastMessage: 'Ok next week then.',
            time: '5:00 pm',
            messages: [
                { id: '1', sender: 'User', content: 'Hey there', time: '1:00 pm', isOwn: true },
                { id: '2', sender: 'Design Team', content: 'I got a new dog', time: '2:00 pm' },
            ]
        },
        {
            id: '2',
            name: 'Elijah Sabrina',
            avatar: '/api/placeholder/32',
            lastMessage: 'Recording 23s',
            time: '6:20 pm',
            unreadCount: 2,
            messages: [
                { id: '1', sender: 'Elijah Sabrina', content: 'Hey, how are you?', time: '6:00 pm' },
                { id: '2', sender: 'User', content: 'I\'m good, thanks!', time: '6:10 pm', isOwn: true },
            ]
        },
    ]
    const [conversations, setConversations] = useState<Conversation[]>(converList);
    const [selectedConversation, setSelectedConversation] = useState<Conversation>(conversations[0]);
    const handleSelectedConversation = (id) => {
        const selected = conversations.find(conv => conv.id === id);
        if (selected) {
            setSelectedConversation(selected);
        }
    }

    const [messages, setMessages] = useState<string[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const client = useStompClient();

    const handleSendMessage = () => {
        if (client && newMessage) {
            client.send('/app/send', {}, newMessage); // Send message to the server
            setNewMessage('');
        }
    };

    const handleMessage = (msg: any) => {
        setMessages((prevMessages) => [...prevMessages, msg.body]); // Update messages state
    };

    React.useEffect(() => {
        if (client) {
            client.connect({}, () => {
                client.subscribe('/topic/messages', handleMessage); // Subscribe to message topic
            });
        }
    }, [client]);
    return (
        <div className={`flex h-screen ${darkMode ? 'bg-background-dark' : 'bg-background-light'}`}>
            <Sidebar userInfo={userInfo} darkMode={darkMode} toggleDarkMode={()=>toggleDarkMode(!darkMode)} />
            <ConversationList darkMode={darkMode} conversations={conversations} onSelectConversation={handleSelectedConversation} selectedId={selectedConversation?.id}/>
            <div className="flex-1 flex flex-col">
                <ChatHeader name="Design Team" lastSeen="Dec 16, 2019" darkMode={darkMode}/>
                <ChatArea messages={selectedConversation?.messages} darkMode={darkMode}/>
                <InputArea darkMode={darkMode}/>
            </div>
        </div>
    );
}

export default MessageComponent;