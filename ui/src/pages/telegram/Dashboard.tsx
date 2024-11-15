import React, {useEffect, useState} from "react";
import {Dialog, DialogTitle, DialogTrigger} from "@radix-ui/react-dialog";
import {Button} from "../../components/ui/button.js";
import {DialogContent, DialogFooter, DialogHeader} from "../../components/ui/dialog.js";
import { RiTelegramLine } from "react-icons/ri";
import {useAppStore} from "../../slices";
import {TelegramConversation} from "../../models/model-types.ts";
import Login from "./Login.tsx";
import ContactsComponent from "./ContactsComponent.tsx";
import {FaTentArrowDownToLine} from "react-icons/fa6";
import {PiUserListFill} from "react-icons/pi";
import {toast} from "sonner";
import axios from "axios";

function Dashboard({setTelegramConv}) {
    const [isOpen, setIsOpen] = useState(false);
    const [conversations, setConversations] = useState<TelegramConversation[]>([]);
    const [fetching, setFetching] = useState(false);
    const [filtered, setFiltered] = useState([]);
    const {userInfo, setUserInfo} = useAppStore();
    const [selectLogin, setSelectLogin] = useState(false);
    const [loadTeleConv, setLoadTeleConv] = useState(false);



    useEffect(() => {
        const fetchConversations = async () => {
            setFetching(true);
            try {
                const response = await fetch("http://localhost:5400/api/telegram-conversations", {
                    method: "GET"
                });
                const data = await response.json();
                if (data.success) {
                    setConversations(data?.conversations);
                    console.log(data.conversations);
                } else {
                    if(data?.keyExpired) {
                        localStorage.removeItem("telegramToken");
                        setSelectLogin(true);
                        setLoadTeleConv(false);
                        toast.error("Login to telegram api again!!");
                        console.error(data.message);
                    }
                    console.error("Failed to fetch Telegram conversations");
                }
            } catch (error) {
                console.error("Error fetching Telegram conversations:", error);
            } finally {
                setFetching(false);
            }
        };
        console.log(conversations.length);
        if(userInfo?.telegramLoggedIn && (conversations.length == 0)) {
            fetchConversations();
        }
    }, []);

    const handleProceed = async () => {
        const filterConv = conversations.filter((conv) => filtered.includes(conv.id));
        await insertToDb(filterConv);
        console.log(filterConv);
        setIsOpen(false);
        setTelegramConv(filterConv);
    }

    const insertToDb = async (filterConv) => {
        const res = await fetch("http://localhost:5400/api/telegram-insert-conversation",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "conversations": filterConv
                })

            });
        return res.json;
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="bg-transparent border-0">
                    <RiTelegramLine size={28}/>
                </Button>
            </DialogTrigger>
            {!selectLogin && !loadTeleConv? (
                <DialogContent className="sm:max-w-[415px]">
                    <DialogHeader>
                        <DialogTitle>
                            <div className="flex flex-col items-center">
                                <RiTelegramLine size={50} color="#1b86c7c7"/>
                                <h1 className="text-xl">Telegram Dashboard</h1>
                            </div>
                        </DialogTitle>
                        <div className="flex flex-row justify-between p-1">
                            <div className="flex flex-col items-center">
                                <Button className="mx-16 mt-8 mb-1" disabled={userInfo?.telegramLoggedIn} onClick={() => setSelectLogin(true)}>
                                    <FaTentArrowDownToLine size={28} color="#1b86c7c7"/>
                                </Button>
                                <span className="p-2">Login to Telegram</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <Button className="mx-16 mt-8 mb-1" disabled={!userInfo?.telegramLoggedIn} onClick={()=> setLoadTeleConv(true)}>
                                    <PiUserListFill size={28} color="#1b86c7c7"/>
                                </Button>
                                <span className="p-2">Fetch Contacts</span>
                            </div>
                        </div>
                    </DialogHeader>
                </DialogContent>
            ) : (selectLogin && !loadTeleConv) ?
                <Login setIsOpen={setIsOpen} setLoadTeleConv={setLoadTeleConv} disable={!userInfo?.telegramLoggedIn} setSelectLogin={setSelectLogin}/>
                : <ContactsComponent setLoadTeleConv={setLoadTeleConv} handleProceed={handleProceed} disable={userInfo?.telegramLoggedIn} conversations={conversations} setFiltered={setFiltered} filtered={filtered} fetching={fetching} />
            }
        </Dialog>
    );
}

export default Dashboard;