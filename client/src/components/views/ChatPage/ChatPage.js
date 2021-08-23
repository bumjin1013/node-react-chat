import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Icon, Input, Button, Row, Col } from 'antd';
import { io } from 'socket.io-client';
import moment from 'moment';
import { getChats, afterPostMessage } from '../../../_actions/chat_actions';
import ChatCard from './Section/ChatCard';
import axios from 'axios';
import Dropzone from 'react-dropzone';

function ChatPage(props) {
    const dispatch = useDispatch();
    const chat = useSelector(state => state.chat);
    const socket = io("http://localhost:5000"); //connet client-to-server
    const [ChatMessage, setChatMessage] = useState("")

    const messagesEnd = useRef(null);

    const renderCards = () => 
        chat.chats && chat.chats.map((chats) => (
            <ChatCard key={chats._id} {...chats}/>
    ));

    useEffect(() => {
        dispatch(getChats())
   
        socket.on("Output Chat Message", messageFromBackEnd => {
            console.log(messageFromBackEnd);
            dispatch(afterPostMessage(messageFromBackEnd))
        })
    }, [])

    useEffect(() => {

        messagesEnd.current.scrollIntoView({behavior: 'smooth'});
  
      }, [renderCards()])


    const handleSearchCHange = (event) => {
        setChatMessage(event.target.value);
    }

    

    const submitChatMessage = (event) => {
        event.preventDefault();

        let chatMessage = ChatMessage;
        let userId = props.user.userData._id;
        let userName = props.user.userData.name;
        let userImage = props.user.userData.image;
        let nowTime = moment();
        let type = "Text";

        socket.emit("Input Chat Message", {
            chatMessage,
            userId,
            userName,
            userImage,
            nowTime,
            type
        });
        setChatMessage("");
    }

    const onDrop = (files) => {
        console.log(files)


        if (props.user.userData && !props.user.userData.isAuth) {
            return alert('Please Log in first');
        }



        let formData = new FormData;

        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }

        formData.append("file", files[0])

        axios.post('api/chat/uploadfiles', formData, config)
            .then(response => {
                if (response.data.success) {
                    let chatMessage = response.data.url;
                    let userId = props.user.userData._id
                    let userName = props.user.userData.name;
                    let userImage = props.user.userData.image;
                    let nowTime = moment();
                    let type = "VideoOrImage"

                    socket.emit("Input Chat Message", {
                        chatMessage,
                        userId,
                        userName,
                        userImage,
                        nowTime,
                        type
                    });
                }
            })
    }

    return (

    <div>
        <div>
             <p style={{ fontSize: '2rem', textAlign: 'center' }}> Real Time Chat</p>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="infinite-container" style={{ height: '500px', overflowY:' scroll' }}>
                {chat && (
                    <div>{renderCards()}</div>
                )} 
            <div
                ref={messagesEnd}
                style={{ float: "left", clear: "both" }}
                
            />
            </div>

            <Row >
                <Form layout="inline" onSubmit={submitChatMessage}>
                    <Col span={18}>
                         <Input
                            id="message"
                            prefix={<Icon type="message" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Let's start talking"
                            type="text"
                            value={ChatMessage}
                            onChange={handleSearchCHange}

                        />
                    </Col>
                    <Col span={2}>
                        <Dropzone onDrop={onDrop}>
                            {({ getRootProps, getInputProps }) => (
                                <section>
                                    <div {...getRootProps()}>
                                        <input {...getInputProps()} />
                                            <Button>
                                                <Icon type="upload" />
                                            </Button>
                                    </div>
                                </section>
                            )}
                         </Dropzone>       
                    </Col>

                    <Col span={4}>
                        <Button type="primary" style={{ width: '100%' }} onClick={submitChatMessage} htmlType="submit">
                            <Icon type="enter" />
                        </Button>
                    </Col>
                </Form>
             </Row>
         </div>
    </div>
        
    )
}


export default ChatPage;
