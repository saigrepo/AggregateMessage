import * as actionTypes from './ConversationActionType';
import {ConversationDTO, ConversationReducerState} from "./ConversationModel";
import {Action} from "../CommonModel";

const initialState: ConversationReducerState = {
    conversations: [],
    createdConversation: null,
    deletedConversation: null,
    editedGroup: null,
    markedAsReadConversation: null,
    createdGroup: null
};

const conversationReducer = (state: ConversationReducerState = initialState, action: Action): ConversationReducerState => {
    switch (action.type) {
        case actionTypes.CREATE_CONVERSATION:
            return {...state, createdConversation: action.payload};
        case actionTypes.CREATE_GROUP:
            return {...state, createdGroup: action.payload};
        case actionTypes.GET_ALL_CONVERSATIONS:
            return {...state, conversations: Array.from(action.payload)};
        case actionTypes.DELETE_CONVERSATION:
            return {...state, deletedConversation: action.payload};
        case actionTypes.ADD_MEMBER_TO_GROUP:
            return {...state, editedGroup: action.payload};
        case actionTypes.REMOVE_MEMBER_FROM_GROUP:
            return {...state, editedGroup: action.payload};
        case actionTypes.MARK_CONVERSATION_AS_READ:
            return {...state, markedAsReadConversation: action.payload};
    }
    return state;
};

export default conversationReducer;