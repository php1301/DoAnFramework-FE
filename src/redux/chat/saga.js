import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import { APIClient, setAuthorization } from '../../helpers/apiClient';


import {
    CREATE_GROUP,
    ADD_MESSAGE,
    CHAT_LOGS,
} from './constants';


import {
    apiError
} from './actions';
import { GetMessageByContact, GetMessageByGroup, SendMessage } from '../../helpers/api-constant';



const create = new APIClient().create;
const get = new APIClient().get;

export function* getMessage(payload) {
    console.log("run")
    const { groupCode, contactCode } = payload?.payload;
    setAuthorization()
    if (groupCode) {
        yield call(getMessageByGroup, groupCode);
    }
    else if (contactCode) {
        yield call(getMessageByContact, contactCode);
    }
}

export function* getMessageByGroup(groupCode) {
    try {
        const response = yield call(get, GetMessageByGroup + "/" + groupCode);
        console.log("Sent", response)
    }
    catch (e) {
        yield put(apiError(e));
    }

}

export function* getMessageByContact(contactCode) {
    try {
        const response = yield call(get, GetMessageByContact + "/" + contactCode);
        console.log("Sent", response)
    }
    catch (e) {
        yield put(apiError(e));
    }
}


function* addMessage(payload) {
    try {
        const { groupCode, message } = payload?.payload;
        const formData = new FormData();

        formData.append("data", JSON.stringify({
            SendTo: groupCode,
            Content: message.trim(),
            Type: "text"
        }));
        setAuthorization()
        const response = yield call(create, SendMessage, formData, {
            params: {
                groupCode: groupCode === null ? "" : groupCode
            }
        });
        console.log("Sent", response)


    }
    catch (error) {
        console.log(error)
        yield put(apiError(error));
    }
}


export function* watchAddMessage() {
    yield takeEvery(ADD_MESSAGE, addMessage);
}

export function* watchChatLogs() {
    yield takeEvery(CHAT_LOGS, getMessage);
}

function* chatSaga() {
    yield all([
        fork(watchAddMessage),
        fork(watchChatLogs),
    ]);
}

export default chatSaga;