import { SET_ACTIVE_CALL_LOG, SET_CALL_HISTORY, SET_CALL_USER, SET_CANCEL_CALL, SET_DETAIL_CALL_HISTORY, SET_INCOMING_CALL_URL, SET_JOIN_CALL } from './constants';



const Call = (state, action) => {
    switch (action.type) {
        case SET_CALL_HISTORY:
            return { ...state, callHistoryList: action?.payload };
        case SET_DETAIL_CALL_HISTORY:
            return { ...state, detailCallHistory: action?.payload };
        case SET_CALL_USER:
            return { ...state, callingUser: action?.payload };
        case SET_INCOMING_CALL_URL:
            return { ...state, incomingCallUrl: action?.payload };
        case SET_ACTIVE_CALL_LOG:
            return { ...state, activeCallLog: action?.payload };
        case SET_JOIN_CALL:
            return { ...state, joinCall: action?.payload };
        case SET_CANCEL_CALL:
            return { ...state, cancelCall: action?.payload };
        default: return { ...state };
    }
}

export default Call;