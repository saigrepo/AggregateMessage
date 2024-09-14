import {useCallback, useState} from 'react';
import { Input } from "../../components/ui/input.tsx";
import { Label } from "@radix-ui/react-label";
import { Button } from "../../components/ui/button.tsx";
import {useAppStore} from "../../slices";
import apiClient from "../../lib/api-client.ts";
import {UPDATE_USER_ROUTE} from "../../utils/Constants.ts";
import {toast} from "sonner";
import {useNavigate} from "react-router-dom";

function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

export default function Profile() {
    const {userInfo, setUserInfo } = useAppStore();
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [hsl, setHSL] = useState({
        hue: 0, saturation: 0, light: 0
    })
    const selectedColor = hslToHex(hsl.hue, 100, 130);

    const getInitials = () => {
        return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    };

    const handleHueChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const {id, value} = e.target;
        setHSL((prevState)=> ({
            ...prevState, [id]:Number(value)
        }));
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const updateUserModel = {
                "firstName": firstName,
                "lastName": lastName,
                "userColor": selectedColor,
                "userProfileCreated": true
            };
            const response = await apiClient.put(UPDATE_USER_ROUTE + "/" + userInfo.userId, updateUserModel, {withCredentials: true});
            if (response.status==200) {
                toast.success("Profile Created Succesfully");
                setUserInfo(response.data);
                navigate("/MessageComponent");
            }
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className="min-h-screen bg-polo-blue-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-700 text-opacity-65">
                        Profile Setup
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <Label htmlFor="firstName" className="sr-only">First Name</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="lastName" className="sr-only">Last Name</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="Mail Id" className="sr-only">Email Id</Label>
                            <Input
                                id="emailId"
                                name="email"
                                type="text"
                                readOnly={true}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-400 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                value={userInfo.userEmail}
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="hue" className="block text-sm font-medium text-gray-700 mb-2">
                            Choose Avatar Color
                        </Label>
                        <input
                            id="hue"
                            type="range"
                            min="0"
                            max="360"
                            value={hsl.hue}
                            onChange={handleHueChange}
                            className="w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    <div className="flex justify-center">
                        <div
                            className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg"
                            style={{ backgroundColor: selectedColor }}>
                            {getInitials()}
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Save Settings
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}