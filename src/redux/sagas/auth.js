import { takeEvery, put, call } from 'redux-saga/effects'
import * as api from '../../network'
import checkAPIfailure from '../../network/utils'



function* login(request){
    const {payload} = request
    yield put({ type: 'USER_AUTH_START' })
    try {
        console.log('check1')
        const response = yield call(api.login, payload)
        console.log('check2')
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
    }
}

function* authSaga(){
    return(
        yield takeEvery('PUSH_LOGIN', login)
    )
}

export default authSaga