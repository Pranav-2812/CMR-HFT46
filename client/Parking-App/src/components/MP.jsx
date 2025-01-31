import React, { useContext, useEffect, useRef, useState } from 'react'
import "../styles/MP.css"
import noteContext from '../Context/Notecontext'
import LocGrid from './LocGrid'
import AOS from "aos"
import "aos/dist/aos.css"
import olaMaps from '../Service/olaMaps'
import userlogo from "../asset/userlogo.png"
import ownerlogo from "../asset/ownerlogo.png"
import { Link, useNavigate } from 'react-router-dom'
import "../styles/Modal.css"
const MP = (props) => {
  const profDashRef = useRef(null);
  const mapRef = useRef("map");
  const [disp, setDisp] = useState(false);
  const [data, setMpData] = useState("");
  const [available, setMpAvail] = useState("");
  const [modal, setModal] = useState(false);
  // Modal open/close handlers
  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  // Handle outside click to close modal
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modal && e.target.classList.contains("booking_modal")) {
        closeModal();
      }
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [modal]);
  const click = () => {
    if (disp === true) {
      profDashRef.current.setAttribute("class", "prof-dash")
      setDisp(false)
    }
    else {
      profDashRef.current.setAttribute("class", "prof-dash-after")
      setDisp(true)
    }

  }
  const context = useContext(noteContext);
  const { Fetchdata, setData, setAvail, getUserLocation, isAvailableGen,deleteAC } = context;
  const navigate = useNavigate();
  useEffect(() => {
    async function getData() {
      const result = await Fetchdata();
      if (result.success === false) {
        alert(result.msg)
      }
      setData((prev) => prev = result);
      setMpData((prev) => prev = result);

    }
    getData()
    AOS.init();
  }, [data !== ""]);

  useEffect(() => {

    async function getLocation() {
      try {
        const locationData = await getUserLocation(); // Waits for the promise to resolve

        if (locationData) {
          const cityName = locationData.results[0].address_components[3].short_name;

          const result = await isAvailableGen(cityName);
          // console.log(result);
          handleResult(result);
          if (result.success === true) {
            document.getElementById('disp-msg').style.display = "none";
          }
          const myMap = olaMaps.init({
            style: "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
            container: mapRef.current || mapRef.current.className,
            center: [locationData.results[0].geometry.location.lng, locationData.results[0].geometry.location.lat],
            zoom: 10,
          })
          const popup = olaMaps.addPopup({ offset: [0, -30], anchor: 'bottom' }).setHTML('<div>Current location</div>')
          olaMaps.addMarker({ offset: [10, -10], anchor: 'bottom', color: ["yellow"] })
            .setLngLat([locationData.results[0].geometry.location.lng, locationData.results[0].geometry.location.lat])
            .setPopup(popup)
            .addTo(myMap);
          result.location.forEach((loc) => {
            const popup = olaMaps.addPopup({ offset: [0, -30], anchor: 'bottom' }).setHTML(`<div>${loc.address}</div>`)
            olaMaps.addMarker({ anchor: "bottom", color: "red", text: loc.address })
              .setLngLat([loc.longitude.$numberDecimal, loc.latitude.$numberDecimal])
              .setPopup(popup)
              .addTo(myMap);
            // console.log(loc.latitude.$numberDecimal,loc.longitude.$numberDecimal);
          })
        }
      } catch (error) {
        console.log("Error getting location:", error); // Logs the error
        console.log("Unable to retrieve location. Permission denied or an error occurred.");

        if (document.getElementById('disp-msg')) {
          document.getElementById("loc_grid").style.display = "none";
          document.getElementById('disp-msg').style.display = "flex";
        }
      }
    }


    getLocation();


  }, [])

  // useEffect(()=>{
  //   if(document.getElementById('disp-msg').style.display==="flex"){
  //     document.getElementById("loc_grid").style.display = "none;"
  //   }

  // },[])

  const handleResult = (res) => {
    setAvail((prev) => prev = res);
    setMpAvail((prev) => prev = res);
  }
  const deleteAcc = async()=>{
    const type = localStorage.getItem("acc");
    const resonse = await deleteAC(type);
    if(resonse.success === true){
      alert("Account Deleted Successfully!");
      localStorage.clear();
      navigate("/Home")
    }
    else{
      console.log(resonse);
    }
  }
  return (
    <div className='MP' >
      <div className="main-dash" >
        <div className="main-content" >
          {available || props.location ? available.location || props.location.resMsg.location ?
            <div className='loc_grid' id='loc_grid'>
              <h2 data-aos="fade-down" data-aos-duration="1000">Available Parking Locations</h2>

              <div className="grid">
                {available.location.map((loc, i) => {
                  return <LocGrid key={loc._id} loc={loc} setProgress={props.setProgress} user={data} />
                    ||
                    props.location.resMsg.location.map((loc, i) => {
                      return <LocGrid key={loc._id} loc={loc} setProgress={props.setProgress} user={data} />
                    })
                })}
              </div>




            </div>
            : <h2>Sorry,we are trying to get you there!</h2> :
            ""
          }
          <div className="disp-msg" id='disp-msg' >
            <iframe src="https://lottie.host/embed/e98eaa1c-73cc-47ea-b1e1-105aa590e5a3/iu115agwnG.json" ></iframe>

          </div>
          <div className="map" id='map' ref={mapRef}></div>
        </div>

        <div className="prof-dash" ref={profDashRef} >
          <i className="fa-solid fa-angle-left" onClick={click}></i>
          {data ? localStorage.getItem("acc") === "user" ?
            <div className='user' data-aos="fade-left" data-aos-duration="2500">
              <Link to={"/Dashboard/user/dash"}><img src={userlogo} className='prof-logo' title='Profile'></img></Link>
              <p><b>Name:</b> {data.name}</p>
              <p><b>Email:</b> {data.email}</p>
              <p><b>Mob No</b>: {data.Mob_no}</p>
              <p><b>City:</b> {data.city}</p>
              <p><b>Total Vehicles:</b> {data.vehicles}</p>
              <p><b>Vehicle Type :</b>{data.vehicle_type}</p>
              <button type='button' onClick={openModal}>Delete Account</button>
            </div>
            : <div className='owner' data-aos="fade-left" data-aos-duration="2500">
              <Link to={"/"}><img src={ownerlogo} className='prof-logo' title='Profile'></img></Link>
              <p><b>Name:</b> {data.name}</p>
              <p><b>UCC:</b> {data.ucc}</p>
              <p><b>Email:</b> {data.email}</p>
              <p><b>Mob No:</b> {data.Mob_no}</p>
              <p><b>City:</b> {data.city}</p>
              <p><b>Locations:</b> {data.locations}</p>
              <button type='button' onClick={openModal}>Delete Account</button>
            </div>
            : <p>Loading data...</p>}
        </div>
      </div>
      {modal?(
        <div className="booking_modal">
          <div className="modal_content">
            <h3>Are you Sure?</h3>
            <button type='button' className='del-btn' onClick={deleteAcc}>Yes</button>
          </div>
        </div>
      ):""}
    </div>
  )
}

export default MP
