import * as actionTypes from './ConversationActionType';
import {UUID} from "node:crypto";
import {ConversationDTO, GroupConversationRequestDTO} from "./ConversationModel";
import {AppDispatch} from "../Store";
import {AUTHORIZATION_PREFIX, HOST} from "../../utils/Constants.ts";

const CONVERSATION_PATH = 'api/v1/conversations';

export const createConversation = (userId: UUID , token: string) => async (dispatch: AppDispatch): Promise<void> => {
    try {
        const res: Response = await fetch(`${HOST}/${CONVERSATION_PATH}/single`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${AUTHORIZATION_PREFIX}${token}`,
            },
            body: JSON.stringify(userId),
        });

        const resData: ConversationDTO = await res.json();
        console.log('Created single conversation: ', resData);
        dispatch({type: actionTypes.CREATE_CONVERSATION, payload: resData});
    } catch (error: any) {
        console.error('Creating single conversation failed: ', error);
    }
};

export const createGroupConversation = (data: GroupConversationRequestDTO, token: string) => async (dispatch: AppDispatch): Promise<void> => {
    try {
        const res: Response = await fetch(`${HOST}/${CONVERSATION_PATH}/group`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${AUTHORIZATION_PREFIX}${token}`,
            },
            body: JSON.stringify(data),
        });

        const resData: ConversationDTO = await res.json();
        console.log('Created group conversation: ', resData);
        dispatch({type: actionTypes.CREATE_GROUP, payload: resData});
    } catch (error: any) {
        console.error('Creating group conversation failed: ', error);
    }
};

export const getUserConversations = (token: string) => async (dispatch: AppDispatch): Promise<void> => {
    try {
        const res: Response = await fetch(`${HOST}/${CONVERSATION_PATH}/user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${AUTHORIZATION_PREFIX}${token}`,
            }
        });

        const resData: ConversationDTO[] = await res.json();
        console.log('Getting user conversations: ', resData);
        dispatch({type: actionTypes.GET_ALL_CONVERSATIONS, payload: resData});
    } catch (error: any) {
        console.error('Getting user conversations failed: ', error);
    }
};

export const deleteConversation = (id: UUID, token: string) => async (dispatch: AppDispatch): Promise<void> => {
    try {
        const res: Response = await fetch(`${HOST}/${CONVERSATION_PATH}/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${AUTHORIZATION_PREFIX}${token}`,
            }
        });

        const resData: string = await res.json();
        console.log('Deleted conversation: ', resData);
        dispatch({type: actionTypes.DELETE_CONVERSATION, payload: resData});
    } catch (error: any) {
        console.error('Deleting conversation failed: ', error);
    }
};

export const addUserToGroupConversation = (conversationId: UUID, userId: UUID, token: string) => async (dispatch: AppDispatch): Promise<void> => {
    try {
        const res: Response = await fetch(`${HOST}/${CONVERSATION_PATH}/${conversationId}/add/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${AUTHORIZATION_PREFIX}${token}`,
            }
        });

        const resData: ConversationDTO = await res.json();
        console.log('Added user to group conversation: ', resData);
        dispatch({type: actionTypes.ADD_MEMBER_TO_GROUP, payload: resData});
    } catch (error: any) {
        console.error('Adding user to group conversation failed: ', error);
    }
};

export const removeUserFromGroupConversation = (conversationId: UUID, userId: UUID, token: string) => async (dispatch: AppDispatch): Promise<void> => {
    try {
        const res: Response = await fetch(`${HOST}/${CONVERSATION_PATH}/${conversationId}/remove/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${AUTHORIZATION_PREFIX}${token}`,
            }
        });

        const resData: ConversationDTO = await res.json();
        console.log('Removed user from group conversation: ', resData);
        dispatch({type: actionTypes.ADD_MEMBER_TO_GROUP, payload: resData});
    } catch (error: any) {
        console.error('Removing user from group conversation failed: ', error);
    }
};

export const markConversationAsRead = (conversationId: UUID, token: string) => async (dispatch: AppDispatch): Promise<void> => {
    try {
        const res: Response = await fetch(`${HOST}/${CONVERSATION_PATH}/${conversationId}/markAsRead`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${AUTHORIZATION_PREFIX}${token}`,
            }
        });

        const resData: ConversationDTO = await res.json();
        console.log('Marked conversation as read: ', resData);
        dispatch({type: actionTypes.MARK_CONVERSATION_AS_READ, payload: resData});
    } catch (error: any) {
        console.error('Marking conversation as read failed, ', error);
    }
};