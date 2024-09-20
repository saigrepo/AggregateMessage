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
