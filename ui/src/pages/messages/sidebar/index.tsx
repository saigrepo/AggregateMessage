import {Moon, Settings, Sun} from 'lucide-react';
import SearchContacts from "../chat-container/SearchContacts.tsx";
import { RiLogoutCircleRLine } from "react-icons/ri";
import {useNavigate} from "react-router-dom";

export default function Sidebar({userInfo, setUserInfo, darkMode, toggleDarkMode, onContactsSelected, selectedContacts, setSelectedContacts }) {
        const getInitials = () => {
                return (userInfo.firstName.charAt(0) + userInfo.lastName.charAt(0)).toUpperCase();
        }

        const navigate = useNavigate();

        const handleLogOut = () => {
            setUserInfo(undefined);
            localStorage.clear();
            navigate("/auth");
        }

        return (
            <div className={`w-16 ${darkMode ? 'bg-background-dark border-r border-r-gray-500 border-r-2' : 'bg-background-light border-r'} flex flex-col justify-between py-4 h-full`}>
                <div className="flex flex-col items-center space-y-6 ">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center border-2"
                         style={{backgroundColor: userInfo.userColor}}>{getInitials()}</div>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center">
                        <SearchContacts onContactsSelected={onContactsSelected} selectedContacts={selectedContacts} setSelectedContacts={setSelectedContacts}/>
                    </div>
                </div>
                <div className="flex flex-col items-center space-y-6 ">
                    {darkMode ? <Sun size={30} className="text-gray-500 cursor-pointer" onClick={toggleDarkMode}/> :
                        <Moon size={30} className="text-gray-500 cursor-pointer" onClick={toggleDarkMode}/>}
                    <RiLogoutCircleRLine className="cursor-pointer" size={30} onClick={handleLogOut} />
                </div>
            </div>
        );
}
