const initState = {
    authError: null,
    authLoading: false,
    signinData: null,
    userDetails: null
}

const updateObject = (state, newState) => ({
    ...state, 
    ...newState
})

const userAuthStart = (state, action) => 
    updateObject(state, {
        authLoading:true
    })

const userAuthError = (state, action) => 
    updateObject(state, {
        authError: action.error,
        authLoading: false
    })

const userAuthSuccess = (state, action) => 
    updateObject(state, {
        signinData: action.payload.token,
        userDetails: action.payload.userDetails,
        authLoading: false,
        authError: null
    })

const authReducer = (state=initState, action) => {
    switch(action.type){
        case 'USER_AUTH_START':
            return userAuthStart(state, action)
        case 'USER_AUTH_ERROR':
            return userAuthError(state, action)
        case 'USER_AUTH_SUCCESS':
            return userAuthSuccess(state, action)
        default: 
            return state
    }
}

export default authReducer