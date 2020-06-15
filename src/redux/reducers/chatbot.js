import * as types from '../constants'

let initState = {
    message: null,
    chatbotDetails:null
}

const updateObject = (state, newState) => ({
    ...state,
    ...newState
})

const setChatbotDetails = (state, action) =>
    updateObject(state, {
        message: null,
        chatbotDetails: action.payload
    })

const setChatbotMessage = (state,action) => 
    updateObject(state, {
        message: action.payload,
        chatbotDetails: null
    })

function chatbotReducer(state=initState, action){
    switch(action.type){
        case types.SET_CHATBOT_DETAILS:
            return setChatbotDetails(state, action)
        case types.SET_CHATBOT_MESSAGE:
            return setChatbotMessage(state, action)
        default:
            return state
    }
}

export default chatbotReducer