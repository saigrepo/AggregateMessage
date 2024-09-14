import {Search, Edit, Archive, Moon, Settings, Paperclip, Smile, Mic, Send, Sun} from 'lucide-react';
import SearchContacts from "../chat-container/SearchContacts.tsx";

export default function Sidebar({userInfo, darkMode, toggleDarkMode, onContactsSelected, selectedContacts, setSelectedContacts }) {
        const getInitials = () => {
                return (userInfo.firstName.charAt(0) + userInfo.lastName.charAt(0)).toUpperCase();
        }

        const styleForIcon = "w-10 h-10 rounded-full bg-" + userInfo.userColor;

        return (
            <div className={`w-16 ${darkMode ? 'bg-background-dark border-r border-r-gray-500 border-r-2' : 'bg-background-light border-r'} flex flex-col justify-between py-4 h-full`}>
                <div className="flex flex-col items-center space-y-6 ">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center border-2"
                         style={{backgroundColor: userInfo.userColor}}>{getInitials()}</div>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center">
                        <SearchContacts onContactsSelected={onContactsSelected} selectedContacts={selectedContacts} setSelectedContacts={setSelectedContacts}/>
                    </div>
                    {/*<Archive className="text-gray-500" />*/}
                </div>
                <div className="flex flex-col items-center space-y-6 ">
                    {darkMode ? <Sun className="text-gray-500 cursor-pointer" onClick={toggleDarkMode}/> :
                        <Moon className="text-gray-500 cursor-pointer" onClick={toggleDarkMode}/>}
                    <Settings className="text-gray-500" />
                </div>
            </div>
        );
}
