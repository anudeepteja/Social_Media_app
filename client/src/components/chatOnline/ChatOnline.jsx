import React, { useEffect, useState } from 'react'
import "./chatOnline.css"
import axios from 'axios'

const ChatOnline = ({onlineUsers , currentId , setCurrentChat}) => {

  const [friends, setFriends] = useState([])
  const [onlineFriends, setOnlineFriends] = useState([])
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  console.log("in chat onlie")
  console.log(onlineUsers);
  useEffect(()=>{
    const getFriends = async ()=>{
      const res = await axios.get("http://localhost:8800/api/users/friends/"+currentId)
      setFriends(res.data)
    }
    getFriends();
  },[currentId])

  useEffect(()=>{
    setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
  },[friends , onlineUsers])

  const handleClick = async (user) =>{
    try {
      const res = await axios.get(`http://localhost:8800/api/conversations/find/${currentId}/${user._id}`);
      setCurrentChat(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='chatOnline'>
      {onlineFriends.map((o) => (
        <div className="chatOnlineFriend" onClick={()=>handleClick(o)}>
          <div className="chatOnlineImgContainer">
            <img className='chatOnlineImg' src={o?.profilePicture ? PF+o.profilePicture : PF+"person/noAvatar.png"} alt="" />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">{o?.username}</span>
        </div>
      ))}

    </div>
  )
}

export default ChatOnline