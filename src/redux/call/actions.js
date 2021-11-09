import { API_FAILED, CALL_HISTORY, CALL_USER, CANCEL_CALL, DETAILS_CALL_HISTORY, JOIN_CALL, SET_ACTIVE_CALL_LOG, SET_CALL_HISTORY, SET_CALL_USER, SET_CANCEL_CALL, SET_DETAIL_CALL_HISTORY, SET_INCOMING_CALL_URL, SET_JOIN_CALL } from './constants';
import {
} from './constants';

export const callUser = (userCode) => ({
    type: CALL_USER,
    payload: {
        userCode
    }
})
export const setCallUser = (payload) => ({
    type: SET_CALL_USER,
    payload,
})
export const setActiveCallLog = (payload) => ({
    type: SET_ACTIVE_CALL_LOG,
    payload,
})
export const callHistory = (userCode) => ({
    type: CALL_HISTORY,
    payload: {
        userCode
    }
})
export const setCallHistory = (payload) => ({
    type: SET_CALL_HISTORY,
    payload,
})
export const getDetailsCallHistory = (key) => ({
    type: DETAILS_CALL_HISTORY,
    payload: key,
})
export const setDetailsCallHistory = (payload) => ({
    type: SET_DETAIL_CALL_HISTORY,
    payload,
})

export const setIncomingCallUrl = (payload) => ({
    type: SET_INCOMING_CALL_URL,
    payload,
})

export const joinVideoCall = (url) => ({
    type: JOIN_CALL,
    payload: {
        url
    }
})
export const setJoinVideoCall = () => ({
    type: SET_JOIN_CALL
})
export const cancelVideoCall = (url) => ({
    type: CANCEL_CALL,
    payload: {
        url
    }
})
export const setCancelVideoCall = () => ({
    type: SET_CANCEL_CALL
})

export const apiError = (error) => ({
    type: API_FAILED,
    payload: error
});