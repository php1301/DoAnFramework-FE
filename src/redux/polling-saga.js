import { delay, put, call, take, race, select } from 'redux-saga/effects'
import { apiError, setActiveLists, startPollingActiveLists } from './actions';
import { API_FAILED, START_POLLING_ACTIVE_LIST } from './chat/constants';
function* pollSagaWorker(action) {
    while (true) {
        try {
            const state = select()
            const connection = state.Chat.connection
            console.log("123")
            // yield put(setActiveLists(data));
            yield call(delay, 4000);
        } catch (err) {
            yield put(apiError(err));
        }
    }
}


export function* pollSagaWatcher() {
    while (true) {
        yield take(START_POLLING_ACTIVE_LIST);
        yield race([
            call(pollSagaWorker),
            take(API_FAILED)
        ]);
    }
}