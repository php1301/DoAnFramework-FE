import { all } from 'redux-saga/effects';
import authSaga from './auth/saga';
import chatSaga from './chat/saga';
import { startApp } from './signalr';


export default function* rootSaga(getState) {
    yield all([
        chatSaga(),
        authSaga(),
        startApp(),
    ]);
}
