import React, { useState } from 'react';
import {DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "../../components/ui/dialog.tsx";
import { useAppStore } from "../../slices";
import { Dialog } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import apiClient from "../../lib/api-client.ts";
import {UPDATE_USER_ROUTE} from "../../utils/Constants.ts";
import {toast} from "sonner";

interface UserForm {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword: string
}

function UpdateUser() {
    const { userInfo, setUserInfo } = useAppStore();
    const [isEditing, setIsEditing] = useState(false);

    const { register, handleSubmit, formState: { errors }, watch, reset } = useForm({
        defaultValues: {
            firstName: userInfo.firstName ?? '',
            lastName: userInfo.lastName ?? '',
            email: userInfo.userEmail ?? '',
            password: '',
            confirmPassword: ''
        }
    });

    const getInitials = () => {
        return `${userInfo?.firstName?.charAt(0)?.toUpperCase() ?? ''}${userInfo?.lastName?.charAt(0)?.toUpperCase() ?? ''}`
    }

    const isDarkShade = (hexColor) => {
        if (!hexColor) return false;
        const rgb = hexColor
            .replace("#", "")
            .match(/.{1,2}/g)
            .map((hex) => parseInt(hex, 16));
        const [r, g, b] = rgb.map((value) => value / 255);
        const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        return luminance < 0.5;
    };

    const onSubmit = async (data: UserForm) => {
        console.log('Saving user data:', data);
        try {
            let updateUserModel = {
                "firstName": data.firstName,
                "lastName": data.lastName,
                "email": data.email
            };
            updateUserModel = data.password!='' ? {...updateUserModel, "password": data.password} : updateUserModel;
            const response = await apiClient.put(UPDATE_USER_ROUTE + "/" + userInfo.userId, updateUserModel, {withCredentials: true});
            if (response.status == 200) {
                toast.success("Profile Updated Successfully");
                setUserInfo(response.data);
            }
        } catch (e) {
            console.log(e);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        reset({
            firstName: userInfo.firstName ?? '',
            lastName: userInfo.lastName ?? '',
            email: userInfo.emailId ?? '',
            password: '',
            confirmPassword: ''
        });
        setIsEditing(false);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    className={`w-10 h-10 font-serif rounded-full flex items-center justify-center border-2 ${isDarkShade(userInfo?.userColor) ? 'text-white' : 'text-gray-800'}`}
                    style={{backgroundColor: userInfo?.userColor}}
                >
                    {getInitials()}
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-[600px] min-h-[400px]">
                <DialogHeader>
                    <div className="flex flex-row justify-between items-center">
                        <DialogTitle>
                            <label
                            className={`w-10 h-10 font-serif rounded-full flex items-center justify-center border-2 ${isDarkShade(userInfo?.userColor) ? 'text-white' : 'text-gray-800'}`}
                            style={{backgroundColor: userInfo?.userColor}}>
                            {getInitials()}
                        </label></DialogTitle>
                        <button
                            type="button"
                            onClick={() => setIsEditing(!isEditing)}
                            className="border-2 rounded-lg p-1 bg-telegram-1 text-white w-[70px] mr-4">
                            {isEditing ? 'Cancel' : 'Edit'}
                        </button>
                    </div>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="mb-2 text-sm">First Name</label>
                            <input
                                {...register("firstName", {
                                    required: "First name is required",
                                    disabled: !isEditing
                                })}
                                placeholder="First Name"
                                className={`border-2 rounded-lg p-2 ${!isEditing ? 'bg-gray-100' : ''}`}/>
                            {errors.firstName && <span className="text-red-500 text-xs">{errors.firstName.message}</span>}
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-2 text-sm">Last Name</label>
                            <input
                                {...register("lastName", {
                                    required: "Last name is required",
                                    disabled: !isEditing
                                })}
                                placeholder="Last Name"
                                className={`border-2 rounded-lg p-2 ${!isEditing ? 'bg-gray-100' : ''}`}
                            />
                            {errors.lastName && <span className="text-red-500 text-xs">{errors.lastName.message}</span>}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 text-sm">Email</label>
                        <input
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                },
                                disabled: true // Email typically can't be changed
                            })}
                            placeholder="Email"
                            className="border-2 rounded-lg p-2 bg-gray-100"
                        />
                        {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
                    </div>

                    {isEditing && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="mb-2 text-sm">New Password</label>
                                    <input
                                        type="password"
                                        {...register("password", {
                                            minLength: {
                                                value: 6,
                                                message: "Password must be at least 6 characters"
                                            }
                                        })}
                                        placeholder="New Password"
                                        className="border-2 rounded-lg p-2"/>
                                    {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
                                </div>
                                <div className="flex flex-col">
                                    <label className="mb-2 text-sm">Confirm Password</label>
                                    <input
                                        type="password"
                                        {...register("confirmPassword" )}
                                        placeholder="Confirm Password"
                                        className="border-2 rounded-lg p-2"/>
                                    {errors.confirmPassword && <span className="text-red-500 text-xs">{errors.confirmPassword.message}</span>}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="border-2 rounded-lg p-2 text-gray-600 hover:bg-gray-100">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="border-2 rounded-lg p-2 bg-telegram-1 text-white hover:bg-opacity-90">
                                    Save Changes
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default UpdateUser;