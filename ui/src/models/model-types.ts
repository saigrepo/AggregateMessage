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
    id: string;
    name: string;
    avatar: string;
    lastMessage: string;
    time: string;
    unreadCount?: number;
    messages: Message[];
}