import React, { useContext, useEffect, useState } from 'react'
import noteContext from '../Context/Notecontext'
import "../styles/SlotGrid.css";
import { useNavigate, useLocation } from 'react-router-dom';
import Slots from './Slots';
export default function CarSlotGrid() {
    const context = useContext(noteContext);
    const { getCarSlots} = context;
    let [slots, setSlots] = useState("");
    const [msg, setMsg] = useState("")
    const [loc,setLoc] = useState({});
    const location = useLocation();
    useEffect(() => {
      async function status() {
        const id = localStorage.getItem("locId");
        const result = await getCarSlots(id);
        setSlots((prev) => prev = result.cars);
        setLoc((prev)=>prev=result.location);
        localStorage.setItem("carSlots", JSON.stringify(slots));
        console.log(slots, result)
      }
      status();
    }, [slots !== ""])
    // useEffect(() => {
    //   // if(localStorage.getItem("slots")){
    //   //   console.log(JSON.parse(localStorage.getItem("slots")));
    //   //   setSlots((prev)=>JSON.parse(localStorage.getItem("slots")));
    //   // }
    //   async function reload() {
    //     const result = await getCarSlots(id);
    //     setSlots((prev) => prev = result);
    //     localStorage.setItem("carSlots", JSON.stringify(slots));
    //     console.log(slots, result)
    //   }
    //   reload();
    // }, [document.location.reload])
  
    useEffect(()=>{
        if(location.pathname === "/Dashboard"){
            localStorage.removeItem("carSlots");
        }
    },[location.pathname]);
    return (
      <>
        {msg ? <h1>{msg}</h1> :
          <div className='grid_main'>
            <h2>Car Parking Slots</h2>
            <div className='SlorGrid' >
              {slots ? <div className='content'>{slots.map((slot) => {
                return <Slots key={slot._id} info={slot} loc={loc} type={"car"}/>
              })}</div> : "No Slot available"}
  
            </div>
          </div>}
      </>
    )
  }
