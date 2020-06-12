import React from 'react'
import {Row, Col, Image} from 'react-bootstrap'


function Chatbox({styles}){
    return(
        <Row className='parent py-2 center-row-center' style={{backgroundColor:'#eee'}}>
            <Col className='col-10 offset-1' style={{backgroundColor: 'white'}}>
                <Row>
                    <Col className='col-2'>
                        <Image src={styles.bot_picture.length>0 ? styles.bot_picture : }  
                    </Col>
                </Row>
            </Col>  
        </Row>
    )
}

export default Chatbox