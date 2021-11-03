import {
    CHAT_USER, ACTIVE_USER, FULL_USER, ADD_LOGGED_USER, CREATE_GROUP, ADD_MESSAGE, API_FAILED, CHAT_LOGS
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


export const chatUser = () => ({
    type: CHAT_USER
});

export const activeUser = (userId) => ({
    type: ACTIVE_USER,
    payload: userId
});

export const setFullUser = (fullUser) => ({
    type: FULL_USER,
    payload: fullUser
});

export const addLoggedinUser = (userData) => ({
    type: ADD_LOGGED_USER,
    payload: userData
});

export const createGroup = (groupData) => ({
    type: CREATE_GROUP,
    payload: groupData
})

export const apiError = (error) => ({
    type: API_FAILED,
    payload: error
});