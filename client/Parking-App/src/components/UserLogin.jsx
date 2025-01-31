import React, { useEffect, useState } from 'react'
import "../styles/Login.css"
import { Link, useNavigate } from 'react-router-dom'
import AOS from "aos"
import "aos/dist/aos.css"
const UserLogin = (props) => {
    const [logcred, setlogcred] = useState({email:"",password:""})
    const change = (event)=>{
        setlogcred({...logcred,[event.target.name]:event.target.value})
    }
    const navigate = useNavigate();
    const url = import.meta.env.VITE_BACKEND_URL;
    const submit = async(e)=>{
        e.preventDefault();
        const {email,password} = logcred;
        props.setProgress(25)
        const response = await fetch(`${url}/auth/login/userac`, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email,password})
            
        });
        props.setProgress(50)
        const json = await response.json();
       
        props.setProgress(75)
       console.log(json);
        if (json.success === true) {
            
            localStorage.setItem('token', json.jwtToken);
            localStorage.setItem("acc",json.account)
            props.setProgress(100)
            navigate('/DashBoard');
        }
        else {
            props.setProgress(100)
            alert(json.msg)
        }
    }
    useEffect(()=>{
        AOS.init();
    },[])
    return (
        <div className="form-container" data-aos="fade-down-right">
            
            <div className="login-form-container">
                <h2>Login</h2>
                <form onSubmit={submit}>
                    <div className="input-format">
                       <div className="label"> <label htmlFor="email">Email</label>&ensp;&ensp;<p>{}</p></div>
                        <input required autoComplete='on' type='email' name="email" value={logcred.email} onChange={change} id="email" placeholder="" />
                    </div>
                    <div className="input-format">
                        <div className="label"><label htmlFor="password">Password</label></div>
                        <input required autoComplete='on' type='password' name="password" value={logcred.password}onChange={change} id="password" placeholder="" />
                    </div>
                    <button className='form-btn' type='submit'>Login</button>
                </form>
                
                <h3>Not registered?<Link className='Link' to={"/AuthSign"}>Register Here!</Link></h3>
            </div>
            
        </div>
    )
}

export default UserLogin
