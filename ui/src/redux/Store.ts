import {combineReducers} from "redux";
import {configureStore} from "@reduxjs/toolkit";
import conversationReducer from "./conversation/ConversationReducer";
import messageReducer from "./message/MessageReducer";

const rootReducer = combineReducers({
    conversation: conversationReducer,
    message: messageReducer,
});

export const store = configureStore({
    reducer: rootReducer
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch