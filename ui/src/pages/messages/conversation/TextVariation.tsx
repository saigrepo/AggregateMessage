import {MdOutlineGeneratingTokens} from "react-icons/md";
import React, {useEffect, useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "../../../components/ui/dialog.tsx";
import {Button} from "../../../components/ui/button.tsx";
import {Textarea} from "../../../components/ui/textarea.tsx";
import apiClient from "../../../lib/api-client.ts";
import { IoReloadSharp } from "react-icons/io5";


interface TextVariationProps {
    messageText: string
    setMessageInput: any
}

interface VariationResponse {
    professional: string,
    casual: string,
    friendly: string,
    formal: string
}

export const TextVariation: React.FC<TextVariationProps> = ({messageText, setMessageInput}) => {

    const [selectedVariation, setSelectedVariation] = useState("Professional");
    const [messageTextValue, setMessageTextValue] = useState("");
    const [generatedText, setGeneratedText] = useState(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [generated, setGenerated] = useState(false);


    const handleMessageChange = (event) => {
        setMessageTextValue(event.target.value);
    }

    useEffect(() => {
        setMessageTextValue(messageText);
        console.log(messageText);
    }, []);

    useEffect(() => {
        setMessageTextValue(messageText);
    }, [messageText, setOpen, open]);

    useEffect(() => {
        if(generatedText!=null) {
            updateSelectedVariation(generatedText);
        }
    }, [selectedVariation]);

    const handleClick = async () => {
        setLoading(true);
        try{
            const textResponse = await apiClient.post("http://localhost:8080/api/text/generate-variations", {
                "text": messageTextValue
            });
            console.log(textResponse.data);
            setGeneratedText(textResponse.data);
            updateSelectedVariation(textResponse.data);
        } catch (e) {
            console.log(e);
            throw new Error(e);
        } finally {
            setLoading(false);
        }
    }

    const updateSelectedVariation = (genText: VariationResponse) => {
        if(selectedVariation == 'Professional') {
            const prof = genText.professional.replace(/^"|"$/g, '');
            if(prof.length==0 || prof.includes("[version]")) {
                setMessageTextValue("Try again, Not able to generate :(");
                setGenerated(false);
            } else{
                setMessageTextValue(prof);
                setGenerated(true);
            }
        } else if(selectedVariation == 'Casual') {
            const casualString = genText.casual.replace(/^"|"$/g, '');
            if(casualString.length==0 || casualString.includes("[version]")) {
                setMessageTextValue("Try again, Not able to generate :(");
                setGenerated(false);

            } else{
                setMessageTextValue(casualString);
                setGenerated(true);
            }
        } else if(selectedVariation == 'Friendly') {
            const friendlyString = genText.casual.replace(/^"|"$/g, '');
            if(friendlyString.length==0 || friendlyString.includes("[version]")) {
                setMessageTextValue("Try again, Not able to generate :(");
                setGenerated(false);
            } else{
                setMessageTextValue(friendlyString);
                setGenerated(true);
            }
        } else if(selectedVariation == 'Formal') {
            const formalString = genText.formal.replace(/^"|"$/g, '');
            if(formalString.length==0 || formalString.includes("[version]")) {
                setMessageTextValue("Try again, Not able to generate :(");
                setGenerated(false);
            } else{
                setMessageTextValue(formalString);
                setGenerated(true);
            }
        }
    }

    const handleGeneratedMessage = () => {
        setMessageInput(messageTextValue);
    }

    return (
        <div className="flex">
            <Dialog onOpenChange={(op) => setOpen(op)}>
                <DialogTrigger asChild>
                    <Button className="ml-2 p-2 rounded-full border-0 bg-transparent" variant="outline">
                        <MdOutlineGeneratingTokens size={25} />
                    </Button>
                </DialogTrigger>
                <DialogContent className="w-full h-[350px] sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="text-center">Generate variations of your Message</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col justify-center p-2">
                        <div className="flex flex-row justify-center mt-[-2px] mb-5">
                            <ul className="flex flex-row justify-center">
                                <li className="p-[2px] mr-2"><button className={`border-0 p-[2px] text-[1em] rounded-md hover:bg-gray-400 hover:text-white ${selectedVariation === "Professional" ? "bg-gray-600 text-white" : ""}`} onClick={(e) => setSelectedVariation("Professional")}>Professional</button></li>
                                <li className="p-[2px] mr-2"><button className={`border-0 p-[2px] text-[1em] rounded-md hover:bg-gray-400 hover:text-white ${selectedVariation === "Casual" ? "bg-gray-600 text-white" : ""}`} onClick={(e) => setSelectedVariation("Casual")}>Casual</button></li>
                                <li className="p-[2px] mr-2"><button className={`border-0 p-[2px] text-[1em] rounded-md hover:bg-gray-600 hover:text-white ${selectedVariation === "Friendly" ? "bg-gray-600 text-white" : ""}`} onClick={(e) => setSelectedVariation("Friendly")}>Friendly</button></li>
                                <li className="p-[2px]"><button className={`border-0 p-[2px] text-[1em] rounded-md hover:bg-gray-600 hover:text-white ${selectedVariation === "Formal" ? "bg-gray-600 text-white" : ""}`} onClick={(e) => setSelectedVariation("Formal")}>Formal</button></li>
                            </ul>
                        </div>
                        <Textarea className={`flex-1 bg-transparent outline-none border-2 rounded-md mx-1 p-2 overflow-auto
                        ${loading ? 'animate-pulse bg-gradient-to-r from-purple-200 via-pink-200 to-red-300 text-white' : '' }`} value={messageTextValue} onChange={handleMessageChange}/>
                        {loading && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="relative">
                                    <span className="text-4xl animate-bounce text-yellow-400">✨</span>
                                </div>
                            </div>
                        )}
                        { !generated &&  (<div className="flex justify-center mt-3">
                            <button className="rounded-full" onClick={() => setMessageTextValue(messageText)}><IoReloadSharp/></button>
                        </div>)}
                    </div>
                    <DialogFooter>
                        <Button onClick={handleClick}>Generate</Button>
                        {(generated) ? <Button onClick={handleGeneratedMessage}>Add to Message</Button> : <div></div>}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};