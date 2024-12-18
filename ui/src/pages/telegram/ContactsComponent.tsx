import io from "socket.io-client";
import React, {useEffect, useState} from "react";
import {Checkbox} from "../../components/ui/checkbox.tsx";
import {Check, Search} from "lucide-react";
import {TelegramConversation} from "../../models/model-types.ts";
import {Input} from "../../components/ui/input.tsx";
import {DialogContent, DialogFooter, DialogHeader} from "../../components/ui/dialog.tsx";
import {DialogTitle} from "@radix-ui/react-dialog";
import {RiTelegramLine} from "react-icons/ri";
import {Button} from "../../components/ui/button.tsx";
import {RxReload} from "react-icons/rx";
import * as Toolbar from "@radix-ui/react-toolbar";
import {userInfo} from "os";

function ContactsComponent({conversations, filtered, setFiltered, fetching, handleProceed, setLoadTeleConv, dbConv, setReloadConv}) {

    const [currentPage, setCurrentPage] = useState(1);
    const [loadConv, setLoadConv] = useState<TelegramConversation[]>(conversations);
    const [searchQuery, setSearchQuery] = useState("");
    const [stateBeforeSelect, setStateBeforeSelect] = useState([]);
    const conversationsPerPage = 5;


    const socket = io("http://localhost:5400", {
        transports: ["websocket"],
    });

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        setLoadConv(conversations);
        if(dbConv) {
            setFiltered((prev) => [...prev, ...dbConv.map((conv) => conv.id)]);
        }
        console.log("Connecting to socket");
        socket.connect();
    }, []);

    useEffect(() => {
        socket.on("newTelegramMessage", (newMessage) => {
            console.log("inside socket");
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        return () => {
            socket.off("newTelegramMessage");
        };
    }, []);

    const handleInputChange = (e) => {
        const str = e.target.value.toLowerCase();
        setSearchQuery(e.target.value);
        setLoadConv(conversations.filter((conv) => conv.title.toLowerCase().includes(str)));
    }

    const handleCheckboxChange = (conversationId) => {
        setFiltered((prev) =>
            prev.includes(conversationId) || dbConv?.includes(conversationId)
                ? prev.filter((id) => id !== conversationId)
                : [...prev, conversationId]
        );
    };

    const handleSelectAll = (checked) => {
        if(checked) {
            setStateBeforeSelect(filtered);
            setFiltered(loadConv.map((conv) => conv.id));
        } else {
            setFiltered(stateBeforeSelect);
        }
    }

    const indexOfLastConversation = currentPage * conversationsPerPage;
    const indexOfFirstConversation = indexOfLastConversation - conversationsPerPage;
    const currentConversations = loadConv.slice(indexOfFirstConversation, indexOfLastConversation);
    const totalPages = Math.ceil(loadConv.length / conversationsPerPage);

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };
    const goToPreviousPage = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    const getLastMessage = (conversation) =>{
        return conversation?.lastMessage ? conversation?.lastMessage?.substring(0,100) +"..." : "No Messages";
    }

    return (
        <DialogContent className="sm:max-w-605px">
            <DialogHeader>
                <DialogTitle>
                    <div className="flex flex-col items-center">
                        <RiTelegramLine size={50} color="#1b86c7c7"/>
                        <h1 className="text-xl">Select Chats</h1>
                    </div>
                </DialogTitle>
                <div className="flex flex-col justify-centerjustify-center p-2 overflow-y-auto">
                    {fetching ?
                        (<div className="flex justify-center items-center">
                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>)
                        :
                        <>
                            <div className="flex flex-col justify-center overflow-y-auto mx-10" >
                                <div className="my-3 mx-10 flex flex-row relative">
                                    <div className="w-full max-w-sm min-w-[150px]">
                                        <div className="relative flex items-center">
                                            <Checkbox className="absolute w-5 h-5 left-[-40px] top-2.5"
                                                      onCheckedChange={(checked) => handleSelectAll(checked)}
                                            />
                                            <Search className="absolute w-5 h-5 top-2.5 left-2.5"/>
                                            <input
                                                className="w-full bg-transparent rounded-md pl-10 pr-3 py-2"
                                                          placeholder="Search..." id="telegram-conversation"
                                                          value={searchQuery}
                                                          onChange={handleInputChange} />
                                            <RxReload className="relative w-5 h-5 right-[-30px] hover:animate-spin" onClick={() => setReloadConv((prev) => !prev) }/>
                                        </div>
                                    </div>
                                </div>
                                {currentConversations.map((conversation) => (
                                    <div key={conversation.id} className="flex items-center space-x-2 py-2">
                                        <Checkbox
                                            id={conversation.id}
                                            checked={filtered.includes(conversation.id)}
                                            onCheckedChange={() => handleCheckboxChange(conversation.id)}
                                        />
                                        <div className="flex flex-col items-stretch">
                                            <label className="text-gray-700 text-[1rem] flex-grow">{conversation.title || "Unnamed Chat/Conversation"}</label>
                                            <span className="text-gray-300 text-[10px] flex-grow">{getLastMessage(conversation)}</span>
                                        </div>
                                        {filtered.includes(conversation.id) && (
                                            <Check className="w-4 h-4 text-green-500" />
                                        )}
                                    </div>
                                ))}
                                <div className="flex justify-around items-center ml-5 mt-3">
                                    <button
                                        onClick={goToPreviousPage}
                                        disabled={currentPage === 1}
                                        className=" flex p-2 py-1 rounded bg-telegram-1 text-white hover:bg-indigo-400 disabled:bg-gray-300">
                                        Previous
                                    </button>
                                    <span className="flex text-gray-500 p-3">{currentPage} of {totalPages}</span>
                                    <button
                                        onClick={goToNextPage}
                                        disabled={currentPage === totalPages}
                                        className="flex p-2 py-1 rounded bg-telegram-1 text-white hover:bg-indigo-400 disabled:bg-gray-300">
                                        Next
                                    </button>
                                </div>
                            </div>
                        </>

                    }
                </div>
            </DialogHeader>
            <DialogFooter className="flex flex-row sm:justify-between sm:m-2">
                <Button className="flex" type="submit" onClick={()=> setLoadTeleConv(false)}>back</Button>
                <Button className="flex" type="submit" onClick={handleProceed}>Proceed</Button>
            </DialogFooter>
        </DialogContent>
    );



}

export default ContactsComponent;