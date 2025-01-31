import React, { useState } from 'react'
import "../styles/Login.css"
import { Link, useNavigate } from 'react-router-dom'
const OLog = (props) => {
    const navigate = useNavigate();
    const[logcreds, setlogcreds] = useState({name:"", ucc:"",password:""});
    const[msg, setmsg] = useState("");
    const change = (event)=>{
        setlogcreds({...logcreds,[event.target.name]:event.target.value});
    }
    const url = import.meta.env.VITE_BACKEND_URL;
    const submit = async(e)=>{
        e.preventDefault();
        const{name, ucc, password} = logcreds;
        console.log(name, logcreds.name)
        props.setProgress(25)
        const response = await fetch(`${url}/auth/login/ownerac`, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name,ucc,password})
        });
        props.setProgress(50)
        const json = await response.json();
        props.setProgress(75)
        console.log(json)
        if (json.success === true) {
            
            localStorage.setItem('token', json.jwtToken);
            localStorage.setItem("acc",json.account)
            props.setProgress(100)
            navigate('/DashBoard');
        }
        else {
            console.log(json.error);
        }
    }
   
    return (
        <div className="form-container">

            <div className="login-form-container">
                <h2>Login</h2>
                <form onSubmit={submit}>
                    <div className="input-format">
                        <div className="label"><label htmlFor="name">Username</label>&ensp;<p>{(logcreds.name.length<3 && logcreds.name.length !==0)?"Enter valid name":""}</p></div>
                        <input required autoComplete='on' onChange={change} value={logcreds.name} type='text' name="name" id="name" placeholder="" />
                    </div>
                    <div className="input-format">
                        <div className="label"><label htmlFor="ucc">Unique Client Code</label>&ensp;<p>{(logcreds.ucc.length <10 && logcreds.ucc.length !==0)?"Enter valid UCC":""}</p></div>
                        <input required autoComplete='on' onChange={change} value={logcreds.ucc} type='text' name="ucc" id="pasuccsword" placeholder="" />
                    </div>
                    <div className="input-format">
                        <div className="label"><label htmlFor="password">Password</label>&ensp;<p>{msg}</p></div>
                        <input required autoComplete='on' onChange={change} value={logcreds.password} type='password' name="password" id="password" placeholder="" />
                    </div>
                    <button type='submit' disabled={logcreds.password.length ===0} className='form-btn'>Login</button>
                </form>
                
                <h3>Not registered?<Link className='Link' to={"/AuthSign"}>Register Here!</Link></h3>
            </div>

        </div>
    )
}

export default OLog
