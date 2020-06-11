import Api from './apiConfig'

export const login = (payload) => Api.post('accounts/login/', payload)
export const signup = (payload) => Api.post('accounts/signup/', payload)