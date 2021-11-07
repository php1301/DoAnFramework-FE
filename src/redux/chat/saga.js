import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import { APIClient, setAuthorization } from '../../helpers/apiClient';


import {
    CREATE_GROUP,
    ADD_MESSAGE,
    CHAT_LOGS,
    CHAT_HISTORY,
    CONTACTS,
    SEARCH_CONTACTS,
    ADD_CONTACTS,
} from './constants';


import {
    activeUser,
    apiError, setChatHistory, setChatLogs, setContact, setSearchContact,
} from './actions';
import { AddContact, AddGroup, GetChatBoardInfo, GetChatHistory, GetContact, GetMessageByContact, GetMessageByGroup, SearchContact, SendMessage } from '../../helpers/api-constant';



const create = new APIClient().create;
const get = new APIClient().get;



export function* getChatBoardInfo(groupCode, contactCode) {
    try {
        const data = yield call(get, GetChatBoardInfo, {
            params: {
                groupCode,
                contactCode
            }
        });
        yield put(activeUser(JSON.parse(data?.data)))
    }
    catch (e) {
        yield put(apiError(e));

    }
}
export function* getContactList() {
    try {
        setAuthorization()
        const response = yield call(get, GetContact);
        const data = JSON.parse(response.data)
        yield put(setContact(data))
    }
    catch (e) {
        yield put(apiError(e));
    }
}

export function* searchContact(payload) {
    try {
        const { keySearch } = payload
        setAuthorization()
        const response = yield call(get, SearchContact, {
            params: {
                keySearch
            }
        });
        const data = JSON.parse(response.data)
        yield put(setSearchContact(data))
    } catch (e) {
        yield put(apiError(e));
    }
}
export function* addContact(payload) {
    try {
        const { code, keyword } = payload
        setAuthorization()
        const response = yield call(create, AddContact, { Code: code });
        console.log("Sent", response)
        yield call(getContactList);
        yield call(searchContact, { keySearch: keyword })
    }
    catch (e) {
        yield put(apiError(e));
    }
}

export function* createGroup(payload) {
    try {
        const { name: groupName, members: memberInNewGroup
        } = payload.payload;
        const data = {
            Name: groupName,
            Users: memberInNewGroup,
        }
        setAuthorization()
        const response = yield call(create, AddGroup, data)
        yield call(getChatHistory);
        console.log("Sent", response)
    }
    catch (e) {
        yield put(apiError(e));
    }
}

export function* getMessage(payload) {
    const { groupCode, contactCode } = payload?.payload;
    setAuthorization()
    if (groupCode) {
        const data = yield call(getMessageByGroup, groupCode);
        yield put(setChatLogs(data))
        yield call(getChatBoardInfo, groupCode)
    }
    else if (contactCode) {
        const data = yield call(getMessageByContact, contactCode);
        yield put(setChatLogs(data))
        yield call(getChatBoardInfo, null, contactCode)
    }

}

export function* getChatHistory() {
    try {
        setAuthorization()
        const response = yield call(get, GetChatHistory);
        const data = JSON.parse(response.data)
        yield put(setChatHistory(data))
    }
    catch (e) {
        yield put(apiError(e));
    }
}

export function* getMessageByGroup(groupCode) {
    try {
        const response = yield call(get, GetMessageByGroup + "/" + groupCode);
        return response
    }
    catch (e) {
        yield put(apiError(e));
    }

}

export function* getMessageByContact(contactCode) {
    try {
        const response = yield call(get, GetMessageByContact + "/" + contactCode);
        return response
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
        yield put(apiError(error));
    }
}


export function* watchAddMessage() {
    yield takeEvery(ADD_MESSAGE, addMessage);
}

export function* watchChatLogs() {
    yield takeEvery(CHAT_LOGS, getMessage);
}
export function* watchChatHistory() {
    yield takeEvery(CHAT_HISTORY, getChatHistory);
}
export function* watchGetContacts() {
    yield takeEvery(CONTACTS, getContactList);
}
export function* watchSearchContact() {
    yield takeEvery(SEARCH_CONTACTS, searchContact);
}
export function* watchAddContact() {
    yield takeEvery(ADD_CONTACTS, addContact);
}
export function* watchCreateGroup() {
    yield takeEvery(CREATE_GROUP, createGroup);
}

function* chatSaga() {
    yield all([
        fork(watchAddMessage),
        fork(watchChatLogs),
        fork(watchChatHistory),
        fork(watchGetContacts),
        fork(watchSearchContact),
        fork(watchAddContact),
        fork(watchCreateGroup),
    ]);
}

export default chatSaga;