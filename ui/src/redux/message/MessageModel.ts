import {UUID} from "node:crypto";
import {ConversationDTO} from "../conversation/ConversationModel";
import {UserDTO} from "../../models/model-types.ts";

export interface MessageDTO {
    id: UUID;
    content: string;
    timeStamp: string;
    user: UserDTO;
    readBy: UUID[];
}

export interface WebSocketMessageDTO {
    id: UUID;
    content: string;
    timeStamp: string;
    user: UserDTO;
    conversation: ConversationDTO;
}

export interface SendMessageRequestDTO {
    conversationId: UUID;
    content: string;
}

export type MessageReducerState = {
    messages: MessageDTO[];
    newMessage: MessageDTO;
}