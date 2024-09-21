import {UUID} from "node:crypto";
import {MessageDTO} from "../message/MessageModel";
import {UserDTO} from "../../models/model-types.ts";

export interface GroupConversationRequestDTO {
    userIds: UUID[];
    conversationName: string;
}

export interface ConversationDTO {
    id: UUID;
    conversationName: string;
    isGroup: boolean;
    admins: UserDTO[];
    users: UserDTO[];
    createdBy: UserDTO[];
    messages: MessageDTO[];
    updatedOn?: String;
}

export type ConversationReducerState = {
    conversations: ConversationDTO[] | [];
    createdConversation: ConversationDTO | null;
    deletedConversation: string | null;
    editedGroup: ConversationDTO | null;
    markedAsReadConversation: ConversationDTO | null;
    createdGroup: ConversationDTO | null;
}