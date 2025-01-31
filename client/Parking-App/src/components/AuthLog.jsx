import React, { useEffect } from 'react'
import "../styles/AuthSign.css"
import userlogo from "../asset/userlogo.png"
import ownerlogo from "../asset/ownerlogo.png"
import { Link } from 'react-router-dom'
import AOS from "aos"
import "aos/dist/aos.css"
const AuthLog = () => {
    useEffect(()=>{
        AOS.init()
    },[])
    return (
        <div className='sign' data-aos="fade-down-right">
            <div className="container">
                <div className="box" data-aos="fade-up" data-aos-duration="1500">
                    <img src={userlogo}></img>
                    <h3><Link className='box-txt' to={"/UserLog"}>User</Link></h3>
                </div>

                <div className="box" data-aos="fade-down" data-aos-duration="1500">
                    <img src={ownerlogo}></img>
                    <h3><Link className='box-txt' to={"/ownerLog"}>Owner</Link></h3>
                </div>
            </div>
        </div>
    )
}

export default AuthLog
