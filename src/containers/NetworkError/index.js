import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Dialog, DialogTitle, DialogContent } from '@material-ui/core'
import * as actions from '../../redux/actions'
import ReconnectingWebSocket from 'reconnecting-websocket'

function NetworkError(props) {
    useEffect(()=>{
        console.log(props.userDetails)
        if(props.userDetails && props.userDetails.user){
            const ws = new ReconnectingWebSocket(`ws://127.0.0.1:8000/ws/room/${props.userDetails.user.username}`)
            ws.onopen = () => {
                console.log('connected in network')
            }
            ws.onclose = () => {
                console.log('disconnected in network')
            }
            ws.onmessage = (e) => {
                const data = e.data
                if(data.command === 'notify_room'){
                    console.log(data)
                }
            }
        }
    }, [props.userDetails])
    console.log(props.userDetails)
    return (
        <Dialog
            open={props.networkError}
            onClose={() => props.retry()}
        >
            <DialogTitle>Network Error</DialogTitle>
            <DialogContent>
                <p>Can't connect to server</p>
            </DialogContent>
        </Dialog>
    )
}
const mapStateToProps = (state)=> {
    return {
        networkError: state.auth.networkError,
        userDetails: state.auth.userDetails
    }
}
const mapDispatchToProps = (dispatch) => ({
    retry: () => dispatch(actions.retryConnection())
})
export default connect(mapStateToProps, mapDispatchToProps)(NetworkError)
