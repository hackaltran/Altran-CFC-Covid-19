import * as ActionTypes from './ActionTypes';

export const user = (state = {
    isLoading: false,
    errorMess: null,
    user: []
}, action) => {
    switch(action.type) {
        case ActionTypes.USER_FETCH:
            return {...state, isLoading: false, errMess: null, user: action.payload, isRegister: false }

        case ActionTypes.USER_ADD:
            return {...state, isLoading: false, errMess: null, user: action.payload, isRegister: false }

        case ActionTypes.USER_REGISTER:
            return {...state, isLoading: false, errMess: null, user: [], isRegister: true }

        case ActionTypes.USER_LOGOUT:
            return {...state, isLoading: false, errMess: null, user: [], isRegister: false }

        case ActionTypes.USER_LOADING:
            return {...state, isLoading: true, errMess: null, user: [], isRegister: false }

        case ActionTypes.USER_FAILED:
            return {...state, isLoading: false, errMess: action.payload, user: [], isRegister: false }

        default:
            return state;
    }
};