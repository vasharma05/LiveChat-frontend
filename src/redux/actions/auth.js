import * as types from '../constants'

export const login = (payload) => ({
    type: types.PUSH_LOGIN,
    payload
})