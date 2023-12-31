import React, { useContext, useEffect, useRef, useState } from 'react'
import "./messenger.css"
import Topbar from "../../components/topbar/Topbar"
import Conversation from '../../components/conversation/Conversation'
import Message from '../../components/message/Message'
import ChatOnline from '../../components/chatOnline/ChatOnline'
import { AuthContext } from '../../context/AuthContext'
import axios from "axios";
import {io} from "socket.io-client"

const Messenger = () => {

    const [conversations , setConversations] = useState([]);
    const [currentChat , setCurrentChat] = useState(null);
    const [messages , setMessages] = useState([]);
    const [newMessage , setNewMessage] = useState("");
    const [arrivalMessage , setArrivalMessage] = useState(null);
    const [onlineUsers , setOnlineUsers] = useState([]);
    const socket = useRef()
    const {user} = useContext(AuthContext);
    const scrollRef = useRef();

    useEffect(()=>{
        socket.current = io("ws://localhost:8900");
        socket.current.on("getMessage" , (data) => {
            setArrivalMessage({
                sender:data.senderId,
                text:data.text,
                createdAt: Date.now()
            })
        })
    } , [])

    useEffect(() => {
        //console.log("arrival message changed")
        arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) &&
        setMessages((prev) => [...prev , arrivalMessage])
    }, [arrivalMessage , currentChat])
    

    useEffect(()=>{
        socket.current.emit("addUser",user._id);
        socket.current.on("getUsers" , (users)=>{
            //console.log("IN messenger")
            //console.log(users);
            //console.log(user);
            //console.log(user.followings.filter((f) => users.some((u) => u.userId === f)));
            setOnlineUsers(
                user.followings.filter((f) => users.some((u) => u.userId === f))
              );  
            //console.log(onlineUsers);
            //console.log("Out messenger")
        })
    },[user])

    useEffect(() => {
      const getConversations = async () => {
        try {
            const res = await axios.get("http://localhost:8800/api/conversations/"+user._id);
            setConversations(res.data);
        } catch (error) {
            console.log(error);
        }
      }

      getConversations();
    }, [user._id])
    
    useEffect(() => {
      const getMessages = async () => {
        try {
            const res = await axios.get("http://localhost:8800/api/messages/"+currentChat?._id);
            setMessages(res.data);
        } catch (error) {
            console.log(error)
        }
      }
      getMessages();
    }, [currentChat])
    

    useEffect(() => {
      scrollRef.current?.scrollIntoView({behavior:"smooth"});
    }, [messages])
    
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = {
            sender: user._id,
            text: newMessage,
            conversationId: currentChat._id
        }

        const receiverId = currentChat.members.find(member => member !== user._id);

        socket.current.emit("sendMessage" , {
            senderId: user._id,
            receiverId,
            text: newMessage,
        })

        try {
            const res = await axios.post("http://localhost:8800/api/messages" , message );
            setMessages([...messages , res.data]);
            setNewMessage("");
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <>
        <Topbar />
        <div className="messenger">
            <div className="chatMenu">
                <div className="chatMenuWrapper">
                    <input placeholder='search for Friends' className="chatMenuIntput" />
                    {conversations.map((c ,i) => (
                        <div onClick={() => setCurrentChat(c)}>
                            <Conversation conversation={c} currentUser={user}  />
                        </div>
                    ))}
                </div>
            </div>
            <div className="chatBox">
                <div className="chatBoxWrapper">
                      { currentChat ?
                          <>
                              <div className="chatBoxTop">
                                {messages.map((m)=>(
                                    <div ref={scrollRef}>
                                        <Message message={m} own={m.sender === user._id}/>
                                    </div>
                                ))}
                              </div>
                              <div className="chatBoxBottom">
                                  <textarea className='chatMessageInput' placeholder='Write SomeThing....' onChange={(e) => setNewMessage(e.target.value)} value={newMessage} ></textarea>
                                  <button className="chatSubmitButton" onClick={handleSubmit}>Send</button>
                              </div>
                          </> : <span className='noConversationText'>Open a conversation to start a chat</span>
                      }
                </div>
            </div>
            <div className="chatOnline">
                <div className="chatOnlineWrapper">
                    <ChatOnline onlineUsers={onlineUsers} currentId={user._id} setCurrentChat={setCurrentChat} />
                </div>
            </div>
        </div>
    </>
  )
}

export default Messenger