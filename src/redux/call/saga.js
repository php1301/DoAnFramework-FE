import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import { APIClient, setAuthorization } from '../../helpers/apiClient';

import { Call, CancelVideoCall, GetCallHistory, GetCallHistoryById, JoinVideoCall, } from '../../helpers/api-constant';
import { setCallHistory, setCallUser, setCancelVideoCall, setDetailsCallHistory, setJoinVideoCall, apiError } from './actions';
import { CALL_HISTORY, CALL_USER, CANCEL_CALL, DETAILS_CALL_HISTORY, JOIN_CALL } from './constants';



const get = new APIClient().get;



export function* getCallHistorySaga() {
    try {
        setAuthorization()
        const response = yield call(get, GetCallHistory)
        const data = JSON.parse(response?.data)
        yield put(setCallHistory(data))
    }
    catch (e) {
        yield put(apiError(e));

    }
}
export function* getDetailsCallHistorySaga(payload) {
    try {
        setAuthorization()
        const { payload: key } = payload
        const response = yield call(get, GetCallHistoryById + "/" + key);
        const data = JSON.parse(response?.data)
        yield put(setDetailsCallHistory(data))
    }
    catch (e) {
        yield put(apiError(e));

    }
}
export function* callUserSaga(payload) {
    try {
        setAuthorization()
        const { userCode } = payload?.payload
        const response = yield call(get, Call + "/" + userCode);
        const data = JSON.parse(response?.data)
        yield put(setCallUser(data))
    }
    catch (e) {
        yield put(apiError(e));
    }
}



export function* joinCallSaga(payload) {
    try {
        const { url } = payload?.payload
        setAuthorization()
        const response = yield call(get, JoinVideoCall, {
            params: {
                url: url
            }
        });
        const data = JSON.parse(response?.data)
        yield put(setJoinVideoCall(data))
    }
    catch (e) {
        yield put(apiError(e));
    }
}

export function* cancelCallSaga(payload) {
    try {
        setAuthorization()
        const { url } = payload?.payload
        const response = yield call(get, CancelVideoCall, {
            params: {
                url: url
            }
        });
        const data = JSON.parse(response?.data)
        yield put(setCancelVideoCall(data));
        yield put(setCallUser(null));
    }
    catch (e) {
        yield put(apiError(e));
    }
}


export function* watchGetCallHistory() {
    yield takeEvery(CALL_HISTORY, getCallHistorySaga);
}

export function* watchGetDetailsCallHistory() {
    yield takeEvery(DETAILS_CALL_HISTORY, getDetailsCallHistorySaga);
}
export function* watchCallUser() {
    yield takeEvery(CALL_USER, callUserSaga);
}
export function* watchJoinCall() {
    yield takeEvery(JOIN_CALL, joinCallSaga);
}
export function* watchCancelCall() {
    yield takeEvery(CANCEL_CALL, cancelCallSaga);
}
function* callSaga() {
    yield all([
        fork(watchGetCallHistory),
        fork(watchGetDetailsCallHistory),
        fork(watchCallUser),
        fork(watchJoinCall),
        fork(watchCancelCall),
    ]);
}

export default callSaga;