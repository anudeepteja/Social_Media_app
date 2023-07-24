import React, { useContext, useRef } from 'react'
import "./login.css"
import { loginCall } from '../../apiCalls';
import {AuthContext} from "../../context/AuthContext"


const Login = () => {
  const email = useRef();
  const password = useRef();
  const {user , isFetching , error , dispatch} = useContext(AuthContext);

  const handleClick = (e) =>{
    e.preventDefault();
    loginCall({email:email.current.value , password:password.current.value} , dispatch );
    //console.log("first")
  }

  //console.log(user);

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
            <input placeholder="Email" type='email' className="loginInput" required ref={email} />
            <input placeholder="Password" type="password" className="loginInput" required ref={password} minLength={6} />
            <button className="loginButton" disabled={isFetching}>{isFetching ? "loading" : "Log In"}</button>
            <span className="loginForgot">Forgot Password?</span>
            <button className="loginRegisterButton">
            {isFetching ? "loading" : "Create a New Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login