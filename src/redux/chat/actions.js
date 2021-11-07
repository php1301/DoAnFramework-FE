import {
    CHAT_USER, ACTIVE_USER, FULL_USER, ADD_LOGGED_USER, CREATE_GROUP, ADD_MESSAGE, API_FAILED, CHAT_LOGS, CHAT_HISTORY, SET_CHAT_HISTORY, SET_CHAT_LOGS, SET_CONTACTS, ADD_CONTACTS, SET_GROUPS, GROUPS, CONTACTS, SEARCH_CONTACTS, SET_SEARCH_CONTACTS, GET_ACTIVE_USER, SET_CONNECTION, SET_IS_TYPING
} from './constants';

export const addMessage = (groupCode, message) => ({
    type: ADD_MESSAGE,
    payload: {
        groupCode, message
    }
})

export const chatLogs = (groupCode, contactCode) => ({
    type: CHAT_LOGS,
    payload: {
        groupCode, contactCode
    }
})

export const setChatLogs = (payload) => ({
    type: SET_CHAT_LOGS,
    payload
})

export const requestChatHistory = () => ({
    type: CHAT_HISTORY,
})
export const setChatHistory = (payload) => ({
    type: SET_CHAT_HISTORY,
    payload
})

export const requestGroupList = () => ({
    type: GROUPS
})
export const createGroup = (groupData) => ({
    type: CREATE_GROUP,
    payload: groupData
})
export const setGroup = (payload) => ({
    type: SET_GROUPS,
    payload
})

export const requestContactList = () => ({
    type: CONTACTS
})
export const addContact = ({ code, keyword }) => ({
    type: ADD_CONTACTS,
    code,
    keyword,
})
export const searchContact = (payload) => ({
    type: SEARCH_CONTACTS,
    keySearch: payload
})
export const setSearchContact = (payload) => ({
    type: SET_SEARCH_CONTACTS,
    payload
})
export const setContact = (payload) => ({
    type: SET_CONTACTS,
    payload
})

export const chatUser = () => ({
    type: CHAT_USER
});

export const activeUser = (userId) => ({
    type: ACTIVE_USER,
    payload: userId
});

export const getActiveUser = (state) => state.Chat.active_user

export const setFullUser = (fullUser) => ({
    type: FULL_USER,
    payload: fullUser
});

export const addLoggedinUser = (userData) => ({
    type: ADD_LOGGED_USER,
    payload: userData
});

export const setConnection = (connection) => ({
    type: SET_CONNECTION,
    payload: connection
})

export const setIsTyping = (payload) => ({
    type: SET_IS_TYPING,
    payload
})

export const apiError = (error) => ({
    type: API_FAILED,
    payload: error
});