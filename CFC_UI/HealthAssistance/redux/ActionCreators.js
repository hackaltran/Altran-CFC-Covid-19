import * as ActionTypes from './ActionTypes';
import { baseUrl } from '../shared/baseUrl';


// user actions 
export const fetchUser = (userId) => (dispatch) => {
    if (userId != null) {
        // dispatch(userLoading());
        return fetch(baseUrl + 'api/user/' + userId)
        .then(response => {
            if (response.ok) {
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
        error => {
            var errMess = new Error(error.message)
            throw errMess;
        })
        .then(response => response.json())
        .then(user =>
            dispatch(addUser(Object.assign({symptomDataLen : user.symptom && user.symptom.length ? user.symptom.length : 0}, user)))
        )
        .catch(error => dispatch(userFailed(error.message))) 
    } else {
        dispatch(userFailed('InValid Login'))
    }
}

// register user
export const registerUser = (userObj) => (dispatch) => {
    dispatch(userLoading());
    return fetch(baseUrl + 'api/user/signup', {
            method: 'POST',
            body: JSON.stringify(userObj),
            headers: {
                'Content-Type': 'application/json'
            },
            creadentials: 'same-origin'
        })
        .then(response => {
            if (response.ok) {
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
        error => {
            var errMess = new Error(error.message)
            throw errMess;
        })
        .then(response => response.json())
        .then(user => (user.success) ? dispatch(registerFirstUser(user)) : dispatch(userFailed(error.message)))
        .catch(error => dispatch(userFailed(error.message))) 
}

// login user
export const loginUser = (userObj) => (dispatch) => {
    dispatch(userLoading());
    return fetch(baseUrl + 'api/user/signin', {
            method: 'POST',
            body: JSON.stringify(userObj),
            headers: {
                'Content-Type': 'application/json'
            },
            creadentials: 'same-origin'
        })
        .then(response => {
            if (response.ok) {
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
        error => {
            var errMess = new Error(error.message)
            throw errMess;
        })
        .then(response => response.json())
        .then(user => (user.success) ? dispatch(addUser(user)) : dispatch(userFailed(error.message)))
        .catch(error => dispatch(userFailed(error.message))) 
}

// logout 
export const logout = () => (dispatch) => {
    dispatch(userLoading());
    dispatch(userLogout());
}

export const userLogout = () => ({
    type: ActionTypes.USER_LOGOUT
});

export const userLoading = () => ({
    type: ActionTypes.USER_LOADING
});

export const userFailed = (errMess) => ({
    type: ActionTypes.USER_FAILED,
    payload: errMess
});

export const addUser = (user) => ({
    type: ActionTypes.USER_ADD,
    payload: user
});

export const registerFirstUser = (user) => ({
    type: ActionTypes.USER_REGISTER,
    payload: user
});

export const userRegisterSuccess = (user) => ({
    type: ActionTypes.USER_REGISTER_SUCCESS,
    payload: user
});