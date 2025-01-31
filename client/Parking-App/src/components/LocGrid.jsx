import React, { useState, useEffect ,useContext } from 'react'
import { useNavigate } from "react-router-dom"
import noteContext from '../Context/Notecontext'
import "../styles/LocGrid.css"
import "../styles/Modal.css"
import testimg from "../asset/test.jpg"
import AOS from 'aos'
import "aos/dist/aos.css"
import CarSlotGrid from './CarSlotGrid'
const LocGrid = (props) => {
  const navigate = useNavigate();
  // const context = useContext(noteContext);
  // const { getCarSlots, getBikeSlots } = context;
  const [modal, setModal] = useState(false);
  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);
  // let [slots, setSlots] = useState("");
  useEffect(() => {
    AOS.init();
  }, [])
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modal && e.target.classList.contains("booking_modal")) {
        closeModal();
      }
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [modal]);
  const Enter = () => {
    localStorage.setItem("locId",props.loc._id);
    if (props.loc.location_type === "both") {
      openModal();
    }
    else {
      getParkingSlots(props.loc.location_type);
    }
  }
  const getParkingSlots = async (type) => {
    if (type === "car") {
      navigate("/Dashboard/location/car_slots");
    }
    else if (type === "bike") {
      navigate("/Dashboard/location/bike_slots");
    }
    else {
      console.log("Some Error Ocurred!");
    }

  }
  return (
    <>

      <div className='locGrid' onClick={Enter} data-aos="fade-right" data-aos-duration="900">
        <img src={testimg}></img>
        <h3><i className="fa-solid fa-location-dot"></i>&ensp;{props.loc.address}</h3>
        <h4>{props.loc.location_type === "both" ? "Type : car , bike" : `Type: ${props.loc.location_type}`}</h4>
      </div>

      {modal ?

        <div className="booking_modal" >
          <div className="modal_content">
            <div className="modal_header" data-aos="fade-right" data-aos-duration="1200">
              <h3>Vehicle Type</h3>
              <span className="close_btn" onClick={closeModal}>&times;</span>
            </div>
            <hr />
            <div className="modal_body" data-aos="fade-left" data-aos-duration="1200">
              <div className="modal_body">
                <span className='locgrid_span' onClick={() => getParkingSlots("car")}>Car</span>
                <span className='locgrid_span' onClick={() => getParkingSlots("bike")}>Bike</span>
              </div>

            </div>
          </div>
        </div>
        :
        ""}
    </>

  )
}

export default LocGrid
