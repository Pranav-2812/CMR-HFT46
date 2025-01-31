import React, { useContext, useEffect } from 'react'
import "../styles/Navbar.css"
import { Link, useNavigate } from 'react-router-dom'

const Navbar = (props) => {
  const navigate = useNavigate()

  const Logout = () => {
    props.setProgress(50);
    localStorage.clear();

    props.setProgress(100);
    navigate("/Home")
  }
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate("/Home");
    }
  }, [])

  return (
    <div className='main'>
      <div className="logo">PARK.ME</div>
      <div className="elements">
        <ul>
          <li className='links'><Link className='link-txt' to={"/Home"}>HOME</Link></li>
          <li className='links'><Link className='link-txt' to={"/About"}>ABOUT</Link></li>
          <li className='links'><Link className='link-txt' to={"/AvailCheck"}>AVAILABILITY</Link></li>
          <li className='links'><Link className='link-txt' to={"/ListLand"}>LIST&nbsp;LAND</Link></li>
        </ul>
        {!localStorage.getItem("token") ? <div className="btns">
          <Link className='nav-btn' to={"/AuthSign"}><span className='link-btn' >SIGN UP</span></Link>
          <Link className='nav-btn' to={"/AuthLog"}><span className='link-btn' >LOGIN</span></Link>
        </div> : <button className='logout' onClick={Logout}>Log Out!</button>}

      </div>


    </div>
  )
}

export default Navbar
