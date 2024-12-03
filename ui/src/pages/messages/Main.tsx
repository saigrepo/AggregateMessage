import {useAppStore} from "../../slices";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "sonner";
import SearchUsers from "./SearchUsers.tsx";
import {Contact} from "../../models/model-types.ts";
import {RiLogoutCircleRLine} from "react-icons/ri";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/Store.ts";
import {createConversation} from "../../redux/conversation/ConversationAction.ts";
import {MessageDTO} from "../../redux/message/MessageModel.ts";
import {ConversationDTO} from "../../redux/conversation/ConversationModel.ts";
import Dashboard from "../telegram/Dashboard.tsx";
import {HiSwitchHorizontal} from "react-icons/hi";
import MessageArea from "./MessageArea.tsx";
import {Button} from "../../components/ui/button.tsx";
import TelegramConversations from "../telegram/TelegramConversations.tsx";
import UpdateUser from "../profile/UpdateUser.tsx";


function MainComponent() {

    const { userInfo, setUserInfo } = useAppStore();
    const [loading, setLoading] = useState(false);
    const [showTelegram, setShowTelegram] = useState(false);
    const [telegramConv, setTelegramConv] = useState([]);
    const navigate = useNavigate();
    const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
    const [currentConversation, setCurrentConversation] = useState<ConversationDTO>();
    const [messages, setMessages] =useState<MessageDTO[]>();
    const conversationState = useSelector((state: RootState) => state?.conversation);
    const dispatch: AppDispatch = useDispatch();
    const token: string | null = localStorage.getItem("jwtToken");
    const [teleConv, setTeleConv] = useState([]);
    const [fetchLatestConvs, setFetchLatestConvs] = useState(false);


    useEffect(() => {
        getConv();
    }, []);

    useEffect(() => {
        if(fetchLatestConvs) {
            getConv();
        }
    }, [fetchLatestConvs, setFetchLatestConvs]);

    useEffect(() => {
        if (!userInfo?.userProfileCreated) {
            toast("Profile setup is yet to be completed");
            navigate("/profile");
        }
    }, [userInfo, navigate]);


    const handleLogOut = () => {
        setUserInfo(null);
        localStorage.clear();
        navigate("/auth");
    }


    const getInitials = () => {
        return userInfo?.firstName.charAt(0).toUpperCase() + userInfo?.lastName.charAt(0).toUpperCase()
    }

    const handleSelectedContacts =() => {
        if(selectedContacts.length == 1) {
            dispatch(createConversation(selectedContacts[0].id, token))
        }
        setCurrentConversation(conversationState?.createdConversation);
        setMessages(conversationState?.createdConversation?.messages);
        console.log("New conversation");
        console.log(conversationState?.createdConversation);
    }

    const getConv = async () => {
        try {
            const res = await fetch("http://localhost:5400/api/telegram-get-conversations",
                {
                    method: "GET"
                });
            const data = await res.json();
            if(data?.success) {
                setTeleConv([...data?.conversations]);
            }
        } catch (err) {
            console.error("error in getCOnv metthd", err.message);
        }
    }


    return (
        <div className={`flex h-[95vh] w-[95vw] bg-bg-tones-2 border-4 rounded-lg border-white-800 ml-10 mt-5`}>
            {loading ? (
                <div className="flex items-center justify-center w-full h-full">
                    <p>Loading conversations...</p>
                </div>
            ) : ( <>
                <div className="w-15 flex flex-col justify-between py-4 h-full border-r-2 bg-bg-tones-4">
                    <div className="flex flex-col items-center justify-between h-[180px]">
                        <UpdateUser />
                        <SearchUsers onContactsSelected={handleSelectedContacts} setSelectedContacts={setSelectedContacts} selectedContacts={selectedContacts} />
                        <Dashboard setTelegramConv={setTelegramConv} dbConv={teleConv} setFetchLatestConvs={setFetchLatestConvs}/>
                    </div>
                    <div className="flex flex-col items-center justify-between h-[100px]">
                        <Button variant="outline" disabled={!userInfo?.telegramLoggedIn} className="border-0 bg-transparent" onClick={() => setShowTelegram((prevState) => !prevState)}>
                            <HiSwitchHorizontal size={28} />
                            <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    Next (Not Yet Enabled)
                </span>
                        </Button>
                        <Button variant="outline" className="mb-2.5 border-0  bg-transparent" onClick={handleLogOut}>
                            <RiLogoutCircleRLine size={28} />
                        </Button>
                    </div>
                </div>
                    {!showTelegram ? (
                            <MessageArea userInfo={userInfo} setMessages={setMessages} dispatch={dispatch} messages={messages}
                            selectedContacts={selectedContacts} setSelectedContacts={selectedContacts} setCurrentConversation={setCurrentConversation}
                            token={token} conversationState={conversationState} currentConversation={currentConversation}/>
                    ) :
                    <>
                        <TelegramConversations conversations={telegramConv} messageTitle="Telegram" dbConv={teleConv} setConversations={setTelegramConv}/>
                    </>}
            </>
            )}
        </div>);



}

export default MainComponent;