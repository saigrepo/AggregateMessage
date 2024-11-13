import React, {useEffect, useState} from "react";
import {Dialog, DialogTitle, DialogTrigger} from "@radix-ui/react-dialog";
import {Button} from "../../components/ui/button.js";
import { PhoneInput } from 'react-international-phone';
import {DialogContent, DialogFooter, DialogHeader} from "../../components/ui/dialog.js";
import { RiTelegramLine } from "react-icons/ri";
import {Input} from "../../components/ui/input.tsx";
import {Checkbox} from "../../components/ui/checkbox.tsx";
import {useAppStore} from "../../slices";
import {toast} from "sonner";
import TelegramMessageComponent from "./TelegramMessage.tsx";
import {TelegramConversation} from "../../models/model-types.ts";

function TelegramLogin() {
    const [isOpen, setIsOpen] = useState(false);
    const [password, setPassword] = useState("");
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
    const [phoneNumber, setPhoneNumber] = useState("+91 ");
    const [phoneCode, setPhoneCode] = useState("");
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [phoneCodeHash, setPhoneCodeHash] = useState("");
    const { sessionString, setTelegramLogin, isLoggedIn, userInfo, setUserInfo } = useAppStore();
    const [loading, setLoading] = useState(false);
    const [conversations, setConversations] = useState<TelegramConversation[]>([]);
    const [fetching, setFetching] = useState(false);
    const [filtered, setFiltered] = useState<TelegramConversation[]>([]);


    useEffect(() => {
        console.log("Updated User Info");
        console.log(sessionString);
        console.log(userInfo);
    }, [userInfo, setUserInfo]);


    const handleSendCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5400/api/telegram-login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    phoneNumber,
                }),
            });

            const data = await response.json();
            if (data.success) {
                setIsCodeSent(true);
                setPhoneCodeHash(data.phoneCodeHash);
            } else {
                toast.error("Failed to send code. Please try again.");
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSendCodeWithPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5400/api/telegram-login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    phoneNumber,
                    password
                }),
            });

            const data = await response.json();
            if (data.success) {
                toast.success("Successfully sent code in!");
                setIsCodeSent(true);
                setPhoneCodeHash(data.phoneCodeHash);
            } else if (data.requiresSignUp) {
                toast.error("You need to sign up for Telegram first.");
            } else {
                toast.error("Failed to verify code. Please try again.");
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    const handle2FA = (checked) => {
        setTwoFactorEnabled(checked);
        if (!checked) {
            setPassword("");
        }
    }

    const handleSubmitCode = async (e) => {
        e.preventDefault();
        const jsonBody = password!=null && password!='' ? {
            phoneNumber,
            phoneCode,
            phoneCodeHash,
            password
        } : {
            phoneNumber,
            phoneCode,
            phoneCodeHash
        }
        let response: Response | null = null;
        if(twoFactorEnabled) {
            await fetch("http://localhost:5400/api/telegram-login-twoFactor", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(jsonBody),
            });
        } else {
            response = await fetch("http://localhost:5400/api/telegram-login-code", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(jsonBody),
            });
        }

        if (response!=null) {
            const data = await response.json();
            if (data.success) {
                toast.success("Successfully logged in!");
                localStorage.setItem("telegramToken", data?.sessionString);
                setUserInfo({...userInfo, telegramSessionString: data?.sessionString, telegramLoggedIn: true});
                setIsOpen(false);
                toast.success("Telegram Sign up success full for user");
            } else if (data.requiresSignUp) {
                toast.error("You need to sign up for Telegram first.");
            } else {
                toast.error("Failed to verify code. Please try again.");
            }
        } else {
            toast.error("Failed to login. Please try again.");
        }
    };

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
                    console.error("Failed to fetch conversations");
                }
            } catch (error) {
                console.error("Error fetching conversations:", error);
            } finally {
                setFetching(false);
            }
        };
        console.log(conversations.length);
        if(userInfo?.telegramLoggedIn && (conversations.length == 0)) {
            fetchConversations();
        }
    }, []);

    const handleProceed = () => {

    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="bg-transparent border-0">
                    <RiTelegramLine size={28}/>
                </Button>
            </DialogTrigger>
            {!userInfo?.telegramLoggedIn ?
                <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        <div className="flex flex-col items-center">
                            <RiTelegramLine size={50} color="#1b86c7c7"/>
                            <h1 className="text-xl">Telegram login</h1>
                        </div>
                    </DialogTitle>
                </DialogHeader>
                <div>
                    {!isCodeSent ? (
                        <div className="w-full space-y-6">
                            <div className="w-full p-2">
                                <Input
                                    type="tel"
                                    className="w-full mb-2 flex flex-row border border-neutral-200 rounded-lg bg-white px-4 py-2 text-sm"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                                <Input
                                    type="password"
                                    placeholder="Password..."
                                    className={`w-full mt-2 rounded-lg ${!twoFactorEnabled ? 'bg-gray-100' : ''}`}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={!twoFactorEnabled}
                                />
                            </div>
                            <div className="w-full px-4 flex items-center space-x-2">
                                <Checkbox
                                    id="2fa"
                                    checked={twoFactorEnabled}
                                    onCheckedChange={handle2FA}
                                />
                                <label htmlFor="2fa" className="text-base">
                                    Enable Two-Factor Authentication
                                </label>
                            </div>
                            {loading && (<div className="flex justify-center items-center">
                                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>)}
                        </div>
                    ) : (
                        <div className="mt-2 relative flex flex-col items-center justify-center">
                            <Input
                                type="password"
                                placeholder="Enter verification code..."
                                className="flex justify-center w-full pl-2 pr-4 py-2 rounded-lg"
                                value={phoneCode}
                                onChange={(e) => setPhoneCode(e.target.value)}
                            />
                            {loading && (<div className="flex justify-center items-center">
                                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>)}
                        </div>
                    )}
                </div>
                <DialogFooter>
                    {!isCodeSent ? (
                        <button
                            onClick={!twoFactorEnabled ? handleSendCode : handleSendCodeWithPassword}
                            type="submit"
                            className="border-2 bg-gray-400 rounded-md text-white p-1">
                            {!twoFactorEnabled ? "Send Code" : "Login with Password"}
                        </button>
                    ) : (
                        <div className="flex flex-row justify-between">
                            <button
                                className="border-1 bg-gray-400 rounded-md text-white p-1 mr-2 hover:bg-gray-600"
                                onClick={handleSendCode}
                                type="submit">
                                Retry Send Code
                            </button>
                            <button
                                className="border-1 bg-gray-400 rounded-md text-white p-1 hover:bg-gray-600"
                                onClick={handleSubmitCode}
                                type="submit">
                                Verify Code
                            </button>
                        </div>
                    )}
                </DialogFooter>
            </DialogContent>
                : <DialogContent className="sm:max-w-605px">
                    <DialogHeader>
                        <DialogTitle>
                            <div className="flex flex-col items-center">
                                <RiTelegramLine size={50} color="#1b86c7c7"/>
                                <h1 className="text-xl">Select Chats</h1>
                            </div>
                        </DialogTitle>
                        <TelegramMessageComponent conversations={conversations} setFiltered={setFiltered} filtered={filtered} fetching={fetching}/>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="submit" onClick={handleProceed}>Proceed</Button>
                    </DialogFooter>
                </DialogContent>}
        </Dialog>
    );
}

export default TelegramLogin;