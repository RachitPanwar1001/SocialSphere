import React from 'react'
import { useState , useContext } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';

function Login() {
    const [userName , setUserName] = useState("");
    const [password , setPassword] = useState("");
    const {setAuthState} = useContext(AuthContext);

    const navigate = useNavigate();

    const Login = ()=>{
        axios.post("http://localhost:3001/auth/login" , {userName , password}).then((response)=>{
          if(response.data.error){
            alert(response.data.error);
          }
          else{
            localStorage.setItem("accessToken" , response.data.token)
            setAuthState({
              userName : response.data.user,
              id : response.data.id,

            });
            navigate("/" , )
          }
        })

    }

    return (
        <div className='loginContainer'>
            <label>Username : </label>
            <input type="text" onChange={(event)=>{
                setUserName(event.target.value);
            }}/>
            <label>Password : </label>
            <input type="password" onChange={(event)=>{
                setPassword(event.target.value);
            }}/>

            <button onClick = {Login}>Login</button>
        </div>
    )
}

export default Login
