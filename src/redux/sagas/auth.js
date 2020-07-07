import { takeEvery, put, call } from 'redux-saga/effects'
import * as api from '../../network'
import checkAPIfailure from '../../network/utils'
import * as types from '../constants'


function* login(request){
    const {payload} = request
    yield put({ type: 'USER_AUTH_START' })
    try {
        const response = yield call(api.login, payload)
        const checkResponse = checkAPIfailure(response)
        console.log('-----------------------------', response)
        console.log('-----------------------------', checkResponse)
        if(response.status === 203){
            yield put({type: 'USER_AUTH_ERROR', error: checkResponse.error})
        }else if(response.status === 200){
            yield put({type: 'USER_AUTH_SUCCESS', payload: checkResponse})
        }
    }catch(error){
        console.error(error)
        yield put({type: 'NETWORK_ERROR'})
    }
}

function* signup(request){
    const {payload} = request
    yield put({ type: 'USER_AUTH_START' })
    try {
        const response = yield call(api.signup, payload)
        const checkResponse = checkAPIfailure(response)
        console.log('-----------------------------', response)
        console.log('-----------------------------', checkResponse)
        if(response.status === 203){
            yield put({type: 'USER_AUTH_ERROR', error: checkResponse.error})
        }else if(response.status === 201){
            yield put({type: 'USER_AUTH_SUCCESS', payload: checkResponse})
        }
    }catch(error){
        console.log('============',error)
        yield put({type: 'NETWORK_ERROR'})
    }
}

function* changePassword(request){
    console.log(request)
    try{
        const response = yield call(api.changePassword, request.payload)
        const checkResponse = checkAPIfailure(response)
        if(checkResponse.detail === 'success'){
            yield put({type: 'SET_AUTH_MESSAGE', message:'Password changed successfully'})
        }else{
            yield put({type: 'SET_AUTH_MESSAGE', message: checkResponse.detail})
        }
    }catch{
        yield put({type: 'NETWORK_ERROR'})
    }
}

function* authSaga(){
    return [
        yield takeEvery('PUSH_LOGIN', login),
        yield takeEvery('PUSH_SIGNUP', signup),
        yield takeEvery(types.PUSH_CHANGE_PASSWORD, changePassword)
    ]
}

export default authSaga