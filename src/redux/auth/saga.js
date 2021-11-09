import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import Cookie from "js-cookie"
import { APIClient, setAuthorization } from '../../helpers/apiClient';
import { getFirebaseBackend } from "../../helpers/firebase";


import {
    LOGIN_USER,
    LOGOUT_USER,
    REGISTER_USER,
    FORGET_PASSWORD,
    GET_PROFILE,
    UPDATE_PROFILE,
    UPDATE_HUB_CONNECTION
} from './constants';


import {
    loginUserSuccess,
    registerUserSuccess,
    forgetPasswordSuccess,
    apiError,
    setUserProfile
} from './actions';

import { GetProfile, PostHubConnection, UpdateProfile } from '../../helpers/api-constant';

//Initilize firebase
const fireBaseBackend = getFirebaseBackend();


/**
 * Sets the session
 * @param {*} user 
 */

const create = new APIClient().create;
const get = new APIClient().get;
const update = new APIClient().update;

/**
 * Login the user
 * @param {*} payload - username and password 
 */
function* login({ payload: { username, password, history } }) {
    try {
        if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
            const response = yield call(fireBaseBackend.loginUser, username, password);
            yield put(loginUserSuccess(response));

        } else {
            const response = yield call(create, '/Auth/auths/login', { username, password });
            const data = JSON.parse(response.data)
            localStorage.setItem("authUser", data.User);
            localStorage.setItem("authFullName", data.FullName);
            Cookie.set("token", data.Token);
            yield put(loginUserSuccess(response));
        }
        history.go(0)
        history.push('/dashboard');
    } catch (error) {
        yield put(apiError(error));
    }
}


/**
 * Logout the user
 * @param {*} param0 
 */
function* logout({ payload: { history } }) {
    try {
        localStorage.removeItem("authUser");
        Cookie.remove("token");
        if (process.env.REACT_APP_DEFAULTAUTH === 'firebase') {
            yield call(fireBaseBackend.logout);
        }
        yield call(() => {
            history.push("/login");
        });
    } catch (error) { }
}

/**
 * Register the user
 */
function* register({ payload: { user, history } }) {
    try {
        const email = user.email;
        const password = user.password;
        if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
            const response = yield call(fireBaseBackend.registerUser, email, password);
            yield put(registerUserSuccess(response));
        } else {
            console.log(history)
            const response = yield call(create, '/Auth/auths/sign-up', user);
            yield put(registerUserSuccess(response));
            yield call(() => {
                history.push("/login");
            });
        }

    } catch (error) {
        yield put(apiError(error));
    }
}

/**
 * forget password
 */
function* forgetPassword({ payload: { email } }) {
    try {
        if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
            const response = yield call(fireBaseBackend.forgetPassword, email);
            if (response) {
                yield put(
                    forgetPasswordSuccess(
                        "Reset link are sended to your mailbox, check there first"
                    )
                );
            }
        } else {
            const response = yield call(create, '/forget-pwd', { email });
            yield put(forgetPasswordSuccess(response));
        }
    } catch (error) {
        yield put(apiError(error));
    }
}


function* getProfile() {
    try {
        setAuthorization()
        const response = yield call(get, GetProfile)
        yield put(setUserProfile(JSON.parse(response?.data)))
    }
    catch (e) {
        yield put(apiError(e));
    }
}

function* updateHubConnection(payload) {
    try {
        console.log(payload)
        const { key } = payload?.payload
        setAuthorization()
        yield call(create, PostHubConnection, {}, {
            params: {
                key
            }
        })
    }
    catch (e) {
        yield put(apiError(e));
    }
}

function* updateProfile(payload) {
    try {
        setAuthorization()
        const { payload: data } = payload
        yield call(update, UpdateProfile, data)
        yield call(getProfile)
    }
    catch (e) {
        yield put(apiError(e));
    }
}

export function* watchLoginUser() {
    yield takeEvery(LOGIN_USER, login);
}

export function* watchLogoutUser() {
    yield takeEvery(LOGOUT_USER, logout);
}

export function* watchRegisterUser() {
    yield takeEvery(REGISTER_USER, register);
}

export function* watchForgetPassword() {
    yield takeEvery(FORGET_PASSWORD, forgetPassword);
}

export function* watchGetProfile() {
    yield takeEvery(GET_PROFILE, getProfile)
}
export function* watchUpdateProfile() {
    yield takeEvery(UPDATE_PROFILE, updateProfile)
}

export function* watchUpdateHubConnection() {
    yield takeEvery(UPDATE_HUB_CONNECTION, updateHubConnection)
}
function* authSaga() {
    yield all([
        fork(watchLoginUser),
        fork(watchLogoutUser),
        fork(watchRegisterUser),
        fork(watchForgetPassword),
        fork(watchGetProfile),
        fork(watchUpdateProfile),
        fork(watchUpdateHubConnection),
    ]);
}

export default authSaga;