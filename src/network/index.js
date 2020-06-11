import Api from './apiConfig'

export const login = (payload) => Api.post('accounts/login/', payload)