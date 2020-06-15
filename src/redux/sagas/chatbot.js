import {takeEvery, select, call, put} from 'redux-saga/effects'
import * as api from '../../network'
import checkAPIfailure from '../../network/utils'

const gettoken = state => state.auth.signinData

function* getChatbotDetails(request){
    let token = yield select(gettoken)
    try{
        const response = yield call(api.getChatbotDetails, token)
        const checkResponse = checkAPIfailure(response)
        if(checkResponse.detail === 'success'){
            yield put({type: 'SET_CHATBOT_DETAILS', payload: checkResponse.chatbot_details})
        }else if(checkResponse.detail === 'No chatbot details found'){
            yield put({type: 'SET_CHATBOT_MESSAGE', payload: checkResponse.detail})
        }else{
            console.log(checkResponse)
        }
    }catch(error){
        console.log(error)
    }
}

function* chatSaga(){
    return [
        yield takeEvery('GET_CHATBOT_DETAILS', getChatbotDetails)
    ]
}

export default chatSaga