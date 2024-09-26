export const HOST = import.meta.env.VITE_SPRING_SERVER_URL as string;
export const SOCKET_HOST = import.meta.env.VITE_SPRING_SOCKET_URL as string;

export const AUTH_ROUTES = "api/v1/auth";
export const USERS_ROUTES = "api/v1/users";
export const FILE_UPLOAD_ROUTE = `${HOST}/api/v1/upload`;
export const FILE_DELETE_ROUTE = `${HOST}/api/v1/delete`;


export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;

export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;

export const CURRENT_USER_ROUTE = `${USERS_ROUTES}/user`;

export const UPDATE_USER_ROUTE = `${USERS_ROUTES}/user`;
export const SEARCH_CONTACTS_ROUTE = `${USERS_ROUTES}/search`;

export const CREATE_CONVERSATION_ROUTE =  `${HOST}/api/v1/conversation/create`;

export const GET_CONVERSATIONS_ROUTE = `${HOST}/api/v1/conversation/convs`;

export const DELETE_CONVERSATION_ROUTE = `${HOST}/api/v1/conversation`;

export const AUTHORIZATION_PREFIX = 'Bearer ';