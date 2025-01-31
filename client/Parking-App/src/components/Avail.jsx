// import React, { useContext, useState } from 'react'
// import "../styles/Login.css"
// import "../styles/Avail.css"
// import JSConfetti from 'js-confetti';
// import noteContext from '../Context/Notecontext';
// import { Link } from 'react-router-dom';
// import MP from './MP';
// export default function Avail(props) {
//   const context = useContext(noteContext);
//   const { isAvailableGen } = context;
//   const [city, setCity] = useState("");
//   const [locationResult, setlocationResult] = useState(false);
//   const [resMsg, setResMsg] = useState("");
//   const ola_api_key = import.meta.env.VITE_OLA_API_KEY;
//   const change = (e) => {
//     setCity((prev => e.target.value));
//   }
//   const submit = (e) => {
//     e.preventDefault();
//     alert(city);
//   }
//   const jsConfetti = new JSConfetti();
//   const getUserLocation = () => {

//     navigator.permissions.query({ name: "geolocation" }).then((result) => {
//       console.log("Permission state:", result.state); // Log permission state
//       props.setProgress(25);
//       if (result.state === "granted" || result.state === "prompt") {
//         props.setProgress(50);
//         navigator.geolocation.getCurrentPosition(
//           async (position) => {
//             const latitude = position.coords.latitude;
//             const longitude = position.coords.longitude;
//             props.setProgress(75);
//             console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
//             props.setProgress(100);
//             if (latitude && longitude) {
//               const response = await fetch(`https://api.olamaps.io/places/v1/reverse-geocode?latlng=19.11243253660445%2C77.29558649801858&api_key=${ola_api_key}`);
//               const data = await response.json();
//               setCity((prev) => data.results[0].address_components[3].short_name);
//               const result = await isAvailableGen(data.results[0].address_components[3].short_name);
//               if (result.success === true) {
//                 setlocationResult((prev) => true);
//                 setTimeout(() => {
//                   jsConfetti.addConfetti()
//                 }, 1000);
//                 console.log(result.location);
//                 setResMsg((prev) => result);
//               }
//               else {
//                 setResMsg((prev) => result);
//                 console.log(result.msg);
//               }
//             }
//           },
//           (error) => {
//             // Log detailed error message and code
//             props.setProgress(75);
//             console.log(`Error getting location: ${error.message, error.POSITION_UNAVAILABLE} (Code: ${error.code})`);
//             props.setProgress(100);
//           },
//           { enableHighAccuracy: true }
//         );
//       } else {
//         props.setProgress(50);
//         console.log("Geolocation permission denied or not granted.");
//         props.setProgress(100);
//       }
//     }).catch((error) => {
//       props.setProgress(50);
//       console.error("Error querying permission:", error);
//       props.setProgress(100);
//     });

//   }
//   return (
//     <>

//       <div className='form-container' >
//         {!locationResult ?
//           <div className="login-form-container">
//             <h2>Check Availability</h2>

//             <button className='form-btn' onClick={getUserLocation}><i className="fa-solid fa-location-dot"></i>&ensp;&ensp;From current Location</button>

//             <form className='avail-form' onSubmit={submit}>
//               <hr />
//               <div className="input-format">
//                 <div className="label"> <label htmlFor="city">Enter City</label>&ensp;&ensp;<p>{ }</p></div>
//                 <input required autoComplete='on' type='text' name="city" value={city} onChange={change} id="city" placeholder="" />
//               </div>
//               <button className='form-btn' id='check-btn' type='submit'>Check</button>
//             </form>
//           </div> :
//           resMsg.location ?
//             !localStorage.getItem("token") ?
//               <div className="login-form-container">
//                 {resMsg.location.length} + locations available in  {city}
//                 <br />
//                 <Link to={"/login"}>Login</Link> to continue..
//               </div>
//               :
//               <MP location={resMsg.location} />
//             :
//             resMsg.msg ?
//              <div className="login-form-container">
//                 {resMsg.msg} 
//              </div>
//              :
//              "Some Error occured on our side!"
//           }
//       </div>

//     </>
//   )
// }

import React, { useContext, useEffect, useState } from 'react';
import  AOS from "aos"
import "aos/dist/aos.css"
import "../styles/Login.css";
import "../styles/Avail.css";
import JSConfetti from 'js-confetti';
import noteContext from '../Context/Notecontext';
import { Link, useNavigate } from 'react-router-dom';
import MP from './MP';

export default function Avail(props) {
  const context = useContext(noteContext);
  const { isAvailableGen, getUserLocation } = context;
  const [city, setCity] = useState("");
  const [locationResult, setLocationResult] = useState("");
  const [resMsg, setResMsg] = useState("");

  const jsConfetti = new JSConfetti();
  const navigate = useNavigate();
  const change = (e) => {
    setCity(e.target.value);
  };

  const submit = async (e) => {
    e.preventDefault();
    const result = await isAvailableGen(city);
    handleLocationResult(result);
  };

  const handleLocationResult = (result) => {
    if (result.success) {
      setLocationResult((prev) => result);
      if (result.location) {
        document.getElementById("avail-main").style.display = "none";
        document.getElementById("success-msg").style.display = "block";
        jsConfetti.addConfetti();
      }
    } else {
      setLocationResult((prev) => result);
      document.getElementById("avail-main").style.display = "none";
      document.getElementById("fail-msg").style.display = "block";
    }
  };
  const getLocation = async () => {
    const data = await getUserLocation();
    if (data) {
      const cityName = data.results[0].address_components[3].short_name;
      setCity(cityName);
      const result = await isAvailableGen(cityName);
      handleLocationResult(result);
    }
    else {
      alert("Permission denied!");
    }
  }
  useEffect(()=>{
    AOS.init();
  },[])
  // const getUserLocation = () => {
  //   navigator.permissions.query({ name: "geolocation" }).then((result) => {
  //     props.setProgress(25);
  //     if (result.state === "granted" || result.state === "prompt") {
  //       props.setProgress(50);
  //       navigator.geolocation.getCurrentPosition(
  //         async (position) => {
  //           const latitude = position.coords.latitude;
  //           const longitude = position.coords.longitude;
  //           props.setProgress(75);
  //           console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
  //           props.setProgress(100);
  //           const response = await fetch(`https://api.olamaps.io/places/v1/reverse-geocode?latlng=${latitude},${longitude}&api_key=${ola_api_key}`);
  //           const data = await response.json();
  //           const cityName = data.results[0].address_components[3].short_name;
  //           setCity(cityName);
  //           const result = await isAvailableGen(cityName);
  //           handleLocationResult(result);
  //         },
  //         (error) => {
  //           props.setProgress(75);
  //           console.log(`Error getting location: ${error.message, error.POSITION_UNAVAILABLE} (Code: ${error.code})`);
  //           props.setProgress(100);
  //         },
  //         { enableHighAccuracy: true }
  //       );
  //     } else {
  //       props.setProgress(50);
  //       console.log("Geolocation permission denied or not granted.");
  //       props.setProgress(100);
  //     }
  //   }).catch((error) => {
  //     props.setProgress(50);
  //     console.error("Error querying permission:", error);
  //     props.setProgress(100);
  //   });
  // };

  return (
    <div className='form-container' data-aos="fade-up-right" data-aos-duration="1000">
      <div className="login-form-container" id='avail-main'>
        <h2>Check Availability</h2>
        <button className='form-btn' onClick={getLocation}>
          <i className="fa-solid fa-location-dot"></i>&ensp;&ensp;From current Location
        </button>
        <form className='avail-form' onSubmit={submit}>
          <hr />
          <div className="input-format">
            <div className="label">
              <label htmlFor="city">Enter City</label>&ensp;&ensp;
              <p>{ }</p>
            </div>
            <input
              required
              autoComplete='on'
              type='text'
              name="city"
              value={city}
              onChange={change}
              id="city"
              placeholder=""
            />
          </div>
          <button className='form-btn' id='check-btn' type='submit'>Check</button>
        </form>
      </div>
      <div className="login-form-container" id='success-msg'>
        {!localStorage.getItem("token") ?
          <>
            <h2>{locationResult.city_name ? locationResult.city_name.locations : ""} {locationResult.city_name ? locationResult.city_name.locations > 1 ? "locations" : "location" : ""} available in {city} </h2>
            <br />
            <Link to={"/UserLog"}>Login</Link> to continue...
          </>
          :
          // ()=>{return <MP location={locationResult}/>}
          navigate("/Dashboard")
        }
      </div>
      <div className="login-form-container" id='fail-msg'>
        <h3>{locationResult.msg}</h3>
      </div>
    </div>
  );
}
