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
    CHANGE_GROUP_AVATAR,
    REMOVE_MESSAGE,
} from './constants';


import {
    activeUser,
    apiError, setChatHistory, setChatLogs, setContact, setSearchContact,
} from './actions';
import { AddContact, AddGroup, GetChatBoardInfo, GetChatHistory, GetContact, GetMessageByContact, GetMessageByGroup, RemoveMessage, SearchContact, SendMessage, UpdateGroupAvatar } from '../../helpers/api-constant';



const create = new APIClient().create;
const get = new APIClient().get;
const update = new APIClient().update;
const remove = new APIClient().delete;



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
    const { groupCode, contactCode, setActive } = payload?.payload;
    setAuthorization()
    if (groupCode) {
        const data = yield call(getMessageByGroup, groupCode);
        yield put(setChatLogs(data))
        if (setActive)
            yield call(getChatBoardInfo, groupCode)
    }
    else if (contactCode) {
        const data = yield call(getMessageByContact, contactCode);
        yield put(setChatLogs(data))
        if (setActive)
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

export function* changeGroupAvatar(payload) {
    try {
        setAuthorization()
        const { Avatar, groupCode } = payload.payload
        if (Avatar) {
            yield call(update, UpdateGroupAvatar, { Avatar, Code: groupCode })
            yield call(getChatBoardInfo, groupCode)
            yield call(getChatHistory)
        }
    }
    catch (e) {

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

function* removeMessage(payload) {
    try {
        const { groupCode, messageId } = payload?.payload;

        setAuthorization()
        const response = yield call(create, RemoveMessage, {}, {
            params: {
                groupCode: groupCode === null ? "" : groupCode,
                messageId: messageId === null ? "" : messageId
            }
        });
        console.log("Removed", response)

    }
    catch (error) {
        yield put(apiError(error));
    }
}
function* addMessage(payload) {
    try {
        const { groupCode, formData } = payload?.payload;

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
export function* watchRemoveMessage(){
    yield takeEvery(REMOVE_MESSAGE, removeMessage)
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
export function* watchChangeGroupAvatar() {
    yield takeEvery(CHANGE_GROUP_AVATAR, changeGroupAvatar);
}
function* chatSaga() {
    yield all([
        fork(watchAddMessage),
        fork(watchRemoveMessage),
        fork(watchChatLogs),
        fork(watchChatHistory),
        fork(watchGetContacts),
        fork(watchSearchContact),
        fork(watchAddContact),
        fork(watchCreateGroup),
        fork(watchChangeGroupAvatar),
    ]);
}

export default chatSaga;