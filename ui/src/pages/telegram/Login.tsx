import React, {useEffect, useState} from 'react';
import {DialogContent, DialogFooter, DialogHeader} from "../../components/ui/dialog.tsx";
import {DialogTitle} from "@radix-ui/react-dialog";
import {RiTelegramLine} from "react-icons/ri";
import {Input} from "../../components/ui/input.tsx";
import {Checkbox} from "../../components/ui/checkbox.tsx";
import {toast} from "sonner";
import {useAppStore} from "../../slices";
import {Button} from "../../components/ui/button.tsx";

function Login({setIsOpen, setSelectLogin, setLoadTeleConv}) {

    const [password, setPassword] = useState("");
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
    const [phoneNumber, setPhoneNumber] = useState("+91 ");
    const [phoneCode, setPhoneCode] = useState("");
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [phoneCodeHash, setPhoneCodeHash] = useState("");
    const { userInfo, setUserInfo } = useAppStore();
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        console.log("Updated User Info");
        console.log(userInfo);
    }, [userInfo, setUserInfo]);


    const handleSendCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const sessionString = localStorage.getItem("telegramToken")
            const response = await fetch("http://localhost:5400/api/telegram-login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    phoneNumber,
                    sessionString
                }),
            });

            const data = await response.json();
            if (data.success) {
                if(data?.alreadyConnected) {
                    setUserInfo({...userInfo, telegramSessionString: sessionString, telegramId: data?.telegramId, telegramLoggedIn: true});
                } else{
                    setIsCodeSent(true);
                    setPhoneCodeHash(data.phoneCodeHash);
                }
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
            await fetch("http://localhost:5400/api/telegram-verify-twoFactor", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(jsonBody),
            });
        } else {
            response = await fetch("http://localhost:5400/api/telegram-verify-code", {
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
                localStorage.setItem("telegramToken", data?.token);
                await persistToDb(data?.telegramId, phoneNumber)
                setUserInfo({...userInfo, telegramSessionString: data?.token, telegramId: data?.telegramId, telegramLoggedIn: true});
                setSelectLogin(false);
                setLoadTeleConv(true);
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

    const persistToDb = async (telegramId, phoneNumber) => {
        try {
            const emailId = userInfo.userEmail;
            const res = await fetch("http://localhost:5400/api/telegram-insert-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    telegramId,
                    phoneNumber,
                    emailId
                }),
            });
            if(!(await res.json())?.success) {
                console.error("error inserting the data");
            }
        } catch (err) {
            console.error("error was thrown wile inserting user", err.messages);
        }
    }


    return (
        <>
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
                <DialogFooter className="flex flex-row sm:justify-between">
                    {!isCodeSent ? (
                            <>
                                <Button className="flex"
                                        onClick={()=> setSelectLogin(false)}>
                                    Back
                                </Button>
                                <Button className="flex"
                                        onClick={!twoFactorEnabled ? handleSendCode : handleSendCodeWithPassword}
                                        type="submit">
                                    {!twoFactorEnabled ? "Send Code" : "Login with Password"}
                                </Button>
                            </>
                    ) : (
                        <>
                        <Button className="flex"
                                onClick={()=> setIsCodeSent(false)}>
                            Back
                        </Button>
                        <div className=" w-[150px] flex flex-row justify-between">
                            <Button className="flex"
                                onClick={handleSendCode}
                                type="submit">
                                Retry
                            </Button>
                            <Button className="flex"
                                onClick={handleSubmitCode}
                                type="submit">
                                Verify
                            </Button>
                        </div>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </>
    );
}

export default Login;