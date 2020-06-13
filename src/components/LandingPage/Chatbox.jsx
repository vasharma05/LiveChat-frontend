import React from 'react'
import {Row, Col, Image} from 'react-bootstrap'


function Chatbox({styles}){
    return(
        <Row className='parent center-row-center' style={{backgroundColor:'#eee'}}>
            <div style={{backgroundColor: 'white', width: '75%'}}>
                <Row className='py-3' style={{backgroundColor: styles.headerBackgroundColor, color: styles.headerTextColor}}>
                    <Col className='col-2 center-col-center'>
                        <Image width='100%' roundedCircle src={styles.bot_picture.length>0 ? styles.bot_picture : require('../../assets/images/chatbot.png')} />  
                    </Col>
                    <Col className='col-10 center-row'>
                        <span className='large'>{styles.chatbotName}</span>
                    </Col>
                </Row>
            </div>  
        </Row>
    )
}

export default Chatbox