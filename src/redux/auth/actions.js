import {
    LOGIN_USER,
    LOGIN_USER_SUCCESS,
    LOGOUT_USER,
    REGISTER_USER,
    REGISTER_USER_SUCCESS,
    FORGET_PASSWORD,
    FORGET_PASSWORD_SUCCESS,
    API_FAILED,
    SET_PROFILE,
    UPDATE_PROFILE,
    GET_PROFILE,
    UPDATE_HUB_CONNECTION
} from './constants';


export const loginUser = (username, password, history) => ({
    type: LOGIN_USER,
    payload: { username, password, history }
});

export const loginUserSuccess = (user) => ({
    type: LOGIN_USER_SUCCESS,
    payload: user
});

export const registerUser = (user, history) => ({
    type: REGISTER_USER,
    payload: { user, history }
});

export const registerUserSuccess = (user) => ({
    type: REGISTER_USER_SUCCESS,
    payload: user
});

export const logoutUser = (history) => ({
    type: LOGOUT_USER,
    payload: { history }
});

export const forgetPassword = (email) => ({
    type: FORGET_PASSWORD,
    payload: { email }
});

export const forgetPasswordSuccess = (passwordResetStatus) => ({
    type: FORGET_PASSWORD_SUCCESS,
    payload: passwordResetStatus
});


export const updateHubConnection = (key) => ({
    type: UPDATE_HUB_CONNECTION,
    payload: {
        key
    }
})

export const requestUserProfile = () => ({
    type: GET_PROFILE,
})

export const setUserProfile = (payload) => ({
    type: SET_PROFILE,
    payload,
})

export const updateUserProfile = (payload) => ({
    type: UPDATE_PROFILE,
    payload,
})

export const apiError = (error) => ({
    type: API_FAILED,
    payload: error
});