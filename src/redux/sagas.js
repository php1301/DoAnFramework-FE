import { all } from 'redux-saga/effects';
import authSaga from './auth/saga';
import { startApp } from './signalr';


export default function* rootSaga(getState) {
    yield all([
        authSaga(),
        startApp(),
    ]);
}
