import moment from 'moment'
import React from 'react'
import { Comment, Avatar, Tooltip } from 'antd';

function ChatCard(props) {
    
  console.log(props);
    
    return (
        <div style={{width: '100%' }}>
            <Comment
                author={props.sender.name}
                avatar={
                    <Avatar
                        src={props.sender.image} alt={props.sender.name}
                />
                }
            content={
                <p>
                    {props.message}
                </p>
            }
            datetime={
                <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                    <span>{moment().fromNow()}</span>
                </Tooltip>
            }    
            />        
        </div>

       
    )
}

export default ChatCard
