import * as types from '../constants'

export const login = (payload) => ({
    type: types.PUSH_LOGIN,
    payload
})

export const signup = (payload) => ({
    type: types.PUSH_SIGNUP,
    payload
})

export const retryConnection = () => ({
    type: types.RETRY_CONNECT
})

export const changePassword = (payload) => ({
    type: types.PUSH_CHANGE_PASSWORD,
    payload
})

export const resetAuthMessage = () =>({
    type: types.RESET_AUTH_MESSAGE
})