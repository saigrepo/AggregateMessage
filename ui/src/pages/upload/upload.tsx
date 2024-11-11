import {Button} from "../../components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../components/ui/dialog";
import {FaPaperclip} from "react-icons/fa6";
import React, {useEffect, useState} from "react";
import ImageUpload from "./ImageUpload.tsx";

export default function Upload({ onUploadedFile }) {
    const [uploadTriggered, setUploadTriggered] = useState(false);

    const handleUpload = (uploadedFiles) => {
        console.log(uploadedFiles)
        onUploadedFile(uploadedFiles);
        setUploadTriggered(true);
    };

    useEffect(() => {
        console.log("from effect");
    }, [uploadTriggered, setUploadTriggered ]);

    return (
        <div className="flex">
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="border-0 bg-transparent rounded-full p-2" variant="outline">
                        <FaPaperclip size={25} />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-center">Upload your files</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <ImageUpload listOfuploadfile={handleUpload} uploadTriggered={setUploadTriggered} />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
