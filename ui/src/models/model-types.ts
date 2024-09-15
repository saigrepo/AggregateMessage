import { v4 as uuidv4 } from 'uuid';

export interface loginForm {
    loginEmailId: string;
    loginPassword: string;
}

export interface signupForm {
    signupEmailId: string;
    signupPassword: string;
    confirmSignupPassword: string;
}

export interface Message {
    id: string;
    sender: string;
    content: string;
    time: string;
    isOwn?: boolean;
}

export interface Conversation  {
    id: uuidv4;
    name: string;
    avatar: string;
    lastMessage: string;
    time: string;
    unreadCount?: number;
    messages: Message[];
    participants?: Contact[];
}

export interface Contact {
    id: string;
    name: string;
    email: string;
}