import React from "react";
import "./message.css";
import {format} from "timeago.js"

const Message = ({message , own}) => {
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img src="https://images.unsplash.com/photo-1534330207526-8e81f10ec6fc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c29saXR1ZGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60" alt="" className="messageImg" />
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
};

export default Message;
