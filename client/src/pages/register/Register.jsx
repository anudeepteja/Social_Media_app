import React, { useRef } from 'react'
import "./register.css"
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

const Register = () => {

  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const navigate = useNavigate()

  const handleClick = async (e) =>{
    e.preventDefault();
    if(passwordAgain.current.value !== password.current.value)
    {
      passwordAgain.current.setCustomValidity("password doesn't match ");
    }else{
      const user = {
        username : username.current.value,
        email : email.current.value,
        password : password.current.value,
      }
      try {
        await axios.post("http://localhost:8800/api/auth/register",user);
        navigate("/login")
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Anudeepsocial</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on Anudeepsocial.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input placeholder="Username" required ref={username} className="loginInput" />
            <input placeholder="Email" required ref={email} type='email' className="loginInput" />
            <input placeholder="Password" required ref={password} type='password' minLength={6} className="loginInput" />
            <input placeholder="Password Again" required ref={passwordAgain} type='password' className="loginInput" />
            <button className="loginButton" type='submit'>Sign Up</button>
            <button className="loginRegisterButton">
              Log into Account
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register