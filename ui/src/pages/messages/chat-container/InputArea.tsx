import {Mic, Paperclip, Send, Smile} from "lucide-react";

const InputArea = ({darkMode}) => (

    <div className="bg-polo-blue-50 border-t p-4">
        <div className="flex items-center bg-polo-blue-100 rounded-full px-4 py-2">
            <input
                type="text"
                placeholder="Write your message here"
                className="flex-1 bg-transparent outline-none"
            />
            <div className="flex space-x-2">
                <Paperclip className="text-gray-500" />
                <Smile className="text-gray-500" />
                <Mic className="text-gray-500" />
            </div>
            <button className="ml-2 bg-blue-500 text-white rounded-full p-2">
                <Send size={16} />
            </button>
        </div>
    </div>
);

export default InputArea;