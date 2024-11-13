import { v4 as uuidv4 } from 'uuid';
import {UUID} from "node:crypto";

export interface loginForm {
    loginEmailId: string;
    loginPassword: string;
}

export interface signupForm {
    signupEmailId: string;
    signupPassword: string;
    confirmSignupPassword: string;
}

export interface Contact {
    id: UUID;
    name: string;
    email: string;
}

export interface UserDTO {
    userId: UUID;
    userProfileCreated: string;
    userColor: string;
    firstName: string;
    lastName: Boolean;
    userEmail: string;
}

export enum FileTypes {
    Image = "image",
    Pdf = "pdf",
    Audio = "audio",
    Video = "video",
    Other = "other",
}

export interface TelegramConversation {
    id: any,
    title: string,
    lastMessage: string | undefined,
    date: any,
    unreadCount: number,
    version: any
}