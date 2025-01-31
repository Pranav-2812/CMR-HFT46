import React, { useEffect } from 'react'
import "../styles/Userdash.css"
import AOS from "aos"
import "aos/dist/aos.css"
export default function Transaction(props) {
  useEffect(()=>{
    AOS.init();
  },[])
  return (
    <div className='trans-main' data-aos="flip-down" data-aos-duration="1000">
      <h3>{props.trans.location}</h3>
      <h3>{props.trans.city}</h3>
      <h3>{props.trans.charges}</h3>
      <h3>&ensp;&ensp;&ensp;&ensp;{props.trans.duration}</h3>
      <h3>{props.trans.vehicle_number}</h3>
      <h3>{props.trans.date.split('T')[0]}</h3>
    </div>
  )
}

