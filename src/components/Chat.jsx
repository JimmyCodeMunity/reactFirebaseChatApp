import React, { useContext } from 'react';
import adduser from '../images/add-user.png'
import call from '../images/phone-call.png'
import video from '../images/video-camera.png'
import menu from '../images/menu.png'
import Messages from './Messages';
import Input from './Input';
import { ChatContext } from '../context/ChatContext';

const Chat = () => {
  const {data} = useContext(ChatContext)
  return (
    <div className="chat">
      <div className="chatInfo">
        <span>{data.user.displayName}</span>
        <div className="chatIcons">
          <img src={video} alt="" />
          <img src={call} alt="" />
          <img src={adduser} alt="" />
          <img src={menu} alt="" />
        </div>
      </div>

      <Messages />
      <Input/>
    </div>
  );
}

export default Chat;
