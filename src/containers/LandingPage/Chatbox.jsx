import React from 'react'
import {Row, Col, Image} from 'react-bootstrap'
import SendIcon from '@material-ui/icons/Send';


function Chatbox({styles}){
    return(
        <Row className='parent center-row-center' style={{backgroundColor:'#303030'}}>
            <Col id='chatbox' className='col-md-7 col-10' style={{backgroundColor: 'white', padding: 0}}>
                <Row className='py-3' style={{backgroundColor: styles.headerBackgroundColor, color: styles.headerTextColor}}>
                    <Col className='col-3 center-col-center'>
                        <Image style={{maxHeight: '50px'}} roundedCircle src={styles.bot_picture ? typeof(styles.bot_picture) === 'object' ? URL.createObjectURL(styles.bot_picture) : styles.bot_picture : require('../../assets/images/chatbot.png')} />  
                    </Col>
                    <Col className='ml-2 center-row'>
                        <span className='large'>{styles.chatbotName}</span>
                    </Col>
                </Row>
                <Row className='float center-row-center' style={{backgroundColor: styles.introductionBackgroundColor, color: styles.introductionTextColor }}>
                    <Col className='text-center'>
                        {styles.introductionText}
                    </Col>
                </Row>
                <Row className='py-2'>
                    <Col>
                        <Row className='received-text mt-2'>
                            <div 
                                className='small p-2'
                                style={{
                                    backgroundColor: styles.receiverBackground,
                                    color: styles.receiverTextColor
                                }}
                            >
                                Sample Received Text
                            </div>
                        </Row>
                        <Row className='sent-text mt-2'>
                            <div 
                                className='small p-2'
                                style={{
                                    backgroundColor: styles.senderBackground,
                                    color: styles.senderTextColor
                                }}
                            >
                                Sample Sent Text
                            </div>
                        </Row>
                        <Row className='received-text mt-2'>
                            <div 
                                className='small p-2'
                                style={{
                                    backgroundColor: styles.receiverBackground,
                                    color: styles.receiverTextColor
                                }}
                            >
                                Sample Received Text
                            </div>
                        </Row>
                        <Row className='sent-text mt-2'>
                            <div 
                                className='small p-2'
                                style={{
                                    backgroundColor: styles.senderBackground,
                                    color: styles.senderTextColor
                                }}
                            >
                                Sample Sent Text
                            </div>
                        </Row>
                        <Row className='received-text mt-2'>
                            <div 
                                className='small p-2'
                                style={{
                                    backgroundColor: styles.receiverBackground,
                                    color: styles.receiverTextColor
                                }}
                            >
                                Sample Received Text
                            </div>
                        </Row>
                        <Row className='sent-text mt-2'>
                            <div 
                                className='small p-2'
                                style={{
                                    backgroundColor: styles.senderBackground,
                                    color: styles.senderTextColor
                                }}
                            >
                                Sample Sent Text
                            </div>
                        </Row>
                        <Row className='received-text mt-2'>
                            <div 
                                className='small p-2'
                                style={{
                                    backgroundColor: styles.receiverBackground,
                                    color: styles.receiverTextColor
                                }}
                            >
                                Sample Received Text
                            </div>
                        </Row>
                        <Row className='sent-text mt-2'>
                            <div 
                                className='small p-2'
                                style={{
                                    backgroundColor: styles.senderBackground,
                                    color: styles.senderTextColor
                                }}
                            >
                                Sample Sent Text
                            </div>
                        </Row>
                    </Col>
                </Row>
                <Row className='py-2'>
                    <Col className='col-10'>
                        <input
                            placeholder='Text Input'
                            style={{
                                width:'100%'
                            }}
                        />
                    </Col>
                    <Col className='col-2 center-col-center'>
                        <SendIcon style={{fontSize: '30px', color: 'green'}} />
                    </Col>
                </Row>
            </Col>  
        </Row>
    )
}

export default Chatbox