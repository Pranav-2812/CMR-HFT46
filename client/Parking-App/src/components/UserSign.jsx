import React, { useState } from 'react'
import "../styles/Sign.css"
import { Link, useNavigate } from 'react-router-dom'
const UserSign = (props) => {
    const [creds, setCreds] = useState({ name: "", email: "", password: "", cnf_pass: "", mob: "", vehicle_no: "", vehicle_type: "", city: "" })
    const change = (event) => {
        setCreds({ ...creds, [event.target.name]: event.target.value })
    }
    const navigate = useNavigate();
    const url = import.meta.env.VITE_BACKEND_URL;
    const re = /^([A-Z]{2})(\d{2})([A-Z]{2})(\d{4})$/
    const submit = async (e) => {
        e.preventDefault();
        let {name, email, password,mob,vehicle_no,vehicle_type,city} = creds
        props.setProgress(25)
       
        console.log(name,email,password,mob,vehicle_no,vehicle_type,city)
        
        if(re.test(vehicle_no)){
            props.setProgress(35)
            const response = await fetch(`${url}/auth/Acc/newUser`, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({name,email,password,mob,vehicle_no,vehicle_type,city})
            });
            props.setProgress(50)
            const json = await response.json();
            props.setProgress(75)
            console.log(json)
            if (json.success === true) {
                localStorage.setItem("acc",json.account)
                localStorage.setItem('token', json.jwtToken);
                props.setProgress(100)
                navigate('/DashBoard');
            }
            else {
                props.setProgress(100)
                alert(json.msg);
            }
    
        }
        

    }

    return (
        <div className="sign-main">
            <div className="sign-form-container">
                <h2>SignUp</h2>
                <form onSubmit={submit}>
                    <div className="parts">
                        <div className="first-half">
                            <div className="input-format">
                                <div className="label"><label htmlFor="name">Name</label></div>
                                <input required type='text' name="name" onChange={change} autoComplete="on" value={creds.name} id="name" placeholder="" />
                            </div>
                            <div className="input-format">
                                <div className="label"><label htmlFor="email">Email</label></div>
                                <input required type='email' name="email" onChange={change} autoComplete="on" id="email" value={creds.email} placeholder="" />
                            </div>
                            <div className="input-format">
                                <div className="label">
                                <label htmlFor="password">Password</label>
                                </div>
                                <input required type="password" name="password" onChange={change} autoComplete="on" id="password" value={creds.password} placeholder="" />
                            </div>
                            <div className="input-format">
                                <div className="label"><label htmlFor="cnf_pass">Confirm Password</label>&ensp;&ensp;<p>{(creds.password!==creds.cnf_pass && creds.cnf_pass.length !== 0)?"Passwords Didn't Match":""}</p></div>
                                <input required type='password' name="cnf_pass" onChange={change} autoComplete="on" id="cnf_pass" value={creds.cnf_pass} placeholder="" />
                            </div>

                        </div>
                        <hr></hr>
                        <div className="second-half">
                            <div className="input-format">
                                <div className="label"><label htmlFor="mob">Mobile No</label>&ensp;&ensp;<p>{(creds.mob.length !==10&& creds.mob.length !== 0) ?"Enter Valid Mobile No":""}</p></div>
                                <input required type="number" maxLength={10} value={creds.mob} autoComplete="on" onChange={change} name="mob" id="mob" placeholder="" />
                            </div>
                            <div className="input-format">
                                <div className="label"><label htmlFor="vehicle_no">Vehicle Number</label>&ensp;&ensp;<p>{(re.test(creds.vehicle_no)||creds.vehicle_no.length ===0) ? '' : "Please Enter in Correct format"}</p></div>
                                <input required type="text" name="vehicle_no" id="vehicle_no" onChange={change} autoComplete="on" value={creds.vehicle_no} placeholder="Ex:AB22CD1111" />
                            </div>
                            <div className="input-format">
                               <div className="label"> <label htmlFor="vehicle_type">Vehicle Type</label></div>
                                <select required name='vehicle_type' id='vehicle_type' value={creds.vehicle_type} autoComplete="on" onChange={change}>
                                    <option>Select Type</option>
                                    <option>bike</option>
                                    <option>car</option>
                                </select>
                            </div>
                            <div className="input-format">
                                <div className="label"><label htmlFor="city">City</label></div>
                                <input required type='text' name="city" onChange={change} value={creds.city} autoComplete="on" id="city" placeholder="" />
                            </div>

                        </div>
                    </div>
                    <button className='form-btn' disabled={creds.password !== creds.cnf_pass} type='submit' style={{marginBottom:"0"}}>Register</button>
                    <button className='form-btn' type='reset'style={{marginBottom:"0"}} >Clear</button>
                </form>

                <h3>Already Registered?<Link className='Link' to={"/Login"}>Login</Link></h3>

            </div>
        </div>
    )
}

export default UserSign
