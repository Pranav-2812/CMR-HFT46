import React, { useState } from 'react'
import "../styles/OwnerSign.css"
import { Link, useNavigate } from 'react-router-dom'
const OwnerSign = (props) => {
    const [creds, setCreds] = useState({name:"", email:"",password:"",cnf_pass:"",mob:"",city:""})
    const change = (event)=>{
        setCreds({...creds, [event.target.name]:event.target.value});
    }
    const navigate = useNavigate();
    const url = import.meta.env.VITE_BACKEND_URL;
    const submit = async(e)=>{
        e.preventDefault();
        const{name, email,password, mob,city} = creds;
        const response = await fetch(`${url}/auth/Acc/Owner`, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name,email,password,mob,city})
            
        });
        props.setProgress(50)
        const json = await response.json();
        props.setProgress(75)
        console.log(json)
        if (json.success === true) {
            
            localStorage.setItem('token', json.jwtToken);
            props.setProgress(100)
            navigate('/');
        }
        else {
            console.log(json.error);
        }
    }
    return (
        <div className='owner-sign'>
            <div className="owner-sign-conatiner">
                <h2>Owner Registration</h2>
                <form onSubmit={submit}>
                    <div className="input-format">
                        <div className="label"><label htmlFor="name">Name</label>&ensp;<p>{(creds.name.length <3&&creds.name.length !==0)?"Name can't be this short":""}</p></div>
                        <input required autoComplete="on" onChange={change} value={creds.name} type='text' name="name" id="name" placeholder="Full Name" />
                    </div>
                    <div className="input-format">
                        <label htmlFor="email">Email</label>
                        <input required autoComplete="on" onChange={change} value={creds.email} type='email' name="email" id="email" placeholder="Email" />
                    </div>
                    <div className="input-format">
                        <label htmlFor="password">Password</label>
                        <input required autoComplete="on" onChange={change} value={creds.password} type='password' name="password" id="password" placeholder="Password" />
                    </div>
                    <div className="input-format">
                        <div className="label"><label htmlFor="cnf_pass">Confirm Password</label>&ensp;<p>{(creds.password!==creds.cnf_pass && creds.cnf_pass.length !== 0) ?"Password didn't match":""}</p></div>
                        <input required autoComplete="on" onChange={change} value={creds.cnf_pass} type='password' name="cnf_pass" id="cnf_pass" placeholder="Confirm Password" />
                    </div>
                    <div className="input-format">
                        <div className="label"><label htmlFor="mob">Mobile No</label>&ensp;<p>{(creds.mob.length !==10&& creds.mob.length !== 0)?"Enter valid Mob no":
                            ""}</p></div>
                        <input  required autoComplete="on" onChange={change} value={creds.mob} type='number' maxLength={10} name="mob" id="mob" placeholder="Mobile Number" />
                    </div>
                    <div className="input-format">
                        <label htmlFor="city">City</label>
                        <input required autoComplete="on" onChange={change} value={creds.city} type='text'  name="city" id="city" placeholder="City" />
                    </div>
                    <button className='form-btn' disabled={(creds.password !== creds.cnf_pass )} type='submit'>Regsiter</button>
                </form>
                
                <h3>Already Registered?<Link className='Link' to={"/AuthLog"}>Login</Link></h3>
            </div>

        </div>
    )
}

export default OwnerSign

