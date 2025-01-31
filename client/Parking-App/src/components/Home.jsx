import React, { useEffect } from 'react'
import "../styles/Home.css"
import  a from "../../public/1.jpeg"
import AOS from "aos"
import "aos/dist/aos.css"
const Home = () => {
  useEffect(()=>{
    AOS.init()

  },[])
  return (
    <div className='home'>
      <img src={a} data-aos="fade-right" data-aos-duration="1000"/>
      <div className="home-content" data-aos="fade-left" data-aos-duration="1000">
        <h1>Welcome to Park.me</h1>
      </div>
    </div>
  )
}

export default Home
