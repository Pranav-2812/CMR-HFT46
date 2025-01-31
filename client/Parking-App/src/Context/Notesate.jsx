import React, { useState } from 'react'
import noteContext from './Notecontext'
// import io from "socket.io-client";
const Notesate = (props) => {
  // const socket = io("${url}/",{
  //   transports:["websocket"]
  // });
  const ola_api_key = import.meta.env.VITE_OLA_API_KEY;
  const url = import.meta.env.VITE_BACKEND_URL;
  const [data,setData] = useState(null);
  const [available, setAvail] = useState(null);
  const Fetchdata = async () => {
    props.setProgress(25)
    const response = await fetch(`${url}/auth/AccInfo/${localStorage.getItem('acc')}`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token")
      }


    });
    props.setProgress(50)
    const json = await response.json();
    props.setProgress(75)
    if (json.success === true) {
      props.setProgress(100)
      if (localStorage.getItem('acc') === "user") {
        return json.user

      } else {
        return json.owner
      }
    }
    else {
      console.log(json.error);
    }
  }
  const isAvailable = async (id,city= null) => {
    props.setProgress(25)

    const response = await fetch(`${url}/status/isAvailable/${id}`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token")
      },
      body:JSON.stringify({city})
    });
    props.setProgress(50)
    const json = await response.json();
    props.setProgress(75)
    if (json.success === true) {
      props.setProgress(100);
      return json;
    }
    else {
      console.log(json.error);
      return false;
    }
  }
  const isAvailableGen = async (city) => {
    props.setProgress(25)

    const response = await fetch(`${url}/status/isAvailable`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json"
      },
      body:JSON.stringify({city})
    });
    props.setProgress(50)
    const json = await response.json();
    props.setProgress(75)
    if (json.success === true) {
      props.setProgress(100);
      return json;
    }
    else {
      props.setProgress(100);
      return json;
    }
  }
  const getBikeSlots = async (locid) => {
    props.setProgress(25)
    const response = await fetch(`${url}/status/getLocation/bikeslots/${locid}`, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token")
      }
    });
    props.setProgress(50)
    const json = await response.json();
    props.setProgress(75)
    if (json.success === true) {
      props.setProgress(100);
      return json

    }
    else {
      console.log(json.error);
    }
  }
  const getCarSlots = async (locid) => {
    props.setProgress(25)
    const response = await fetch(`${url}/status/getLocation/carslots/${locid}`, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token")
      }
    });
    props.setProgress(50)
    const json = await response.json();
    props.setProgress(75)
    if (json.success === true) {
      props.setProgress(100);
      return json

    }
    else {
      console.log(json.error);
    }
  }
  const updateSlot = async (id,duration) => {
    props.setProgress(25);
    const response = await fetch(`${url}/status/location/slot/update/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token")
      },
      body: JSON.stringify({duration})
    });
    props.setProgress(50);
    const json = await response.json();
    props.setProgress(75);
    if (json.success === true) {
      props.setProgress(100);
      return json;
    }
    else {
      props.setProgress(100);

      console.log(json.error);
      return json;
    }
  }
  const bookSlot = async (slotId,dur,type)=>{
    props.setProgress(25);
    const response = await fetch(`${url}/status/book/slot/${slotId}`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "auth-token":localStorage.getItem("token")
      },
      body:JSON.stringify({duration:dur,type:type})
    });
    props.setProgress(50);
    const json = await response.json();
    props.setProgress(75);
    if(json.success === true){
      props.setProgress(100);
      return json;
    }
    else {
      props.setProgress(100);

      console.log(json.error);
      return json;
    }
  }

  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        props.setProgress(25);
        if (result.state === "granted" || result.state === "prompt") {
          props.setProgress(50);
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const latitude = position.coords.latitude;
              const longitude = position.coords.longitude;
              props.setProgress(75);
              localStorage.setItem('coordinates',JSON.stringify({lat:latitude,lng:longitude}));
              try {
                const response = await fetch(`https://api.olamaps.io/places/v1/reverse-geocode?latlng=${latitude},${longitude}&api_key=${ola_api_key}`);
                const data = await response.json();
                props.setProgress(100);
                resolve(data); // Resolving the data so getLocation can receive it
              } catch (error) {
                reject(`Failed to fetch location data: ${error.message}`);
              }
            },
            (error) => {
              props.setProgress(100);
              reject(`Error getting location: ${error.message, error.POSITION_UNAVAILABLE} (Code: ${error.code})`);
            },
            { enableHighAccuracy: true }
          );
        } else {
          props.setProgress(50);
          // alert("Geolocation permission denied or not granted.");
          props.setProgress(100);
          reject("Permission denied");
        }
      }).catch((error) => {
        props.setProgress(50);
        console.error("Error querying permission:", error);
        props.setProgress(100);
        reject("Error querying permission");
      });
    });
  };
  const deleteAC = async(type)=>{
    props.setProgress(25);
    const response = await fetch(`${url}/auth/delete/${type}`,{
      method:"DELETE",
      headers:{
        "auth-token":localStorage.getItem("token")
      }
    });
    props.setProgress(50);
    const json = await response.json();
    props.setProgress(75);
    if(json.success === true){
      props.setProgress(100);
      return json;
    }
    else {
      props.setProgress(100);
      console.log(json.error);
      return json;
    }
  }
  const getTransaction = async()=>{
    props.setProgress(25);
    const response = await fetch(`${url}/usr/usr/transactions`,{
      method:"GET",
      headers:{
        "auth-token":localStorage.getItem("token")
      }
    });
    props.setProgress(50);
    const json = await response.json();
    props.setProgress(75);
    if(json.success === true){
      props.setProgress(100);
      return json;
    }
    else {
      props.setProgress(100);
      console.log(json.error);
      return json;
    }
  }
  return (
    <div>
      <noteContext.Provider value={{ Fetchdata,data,available,setData,setAvail,bookSlot, isAvailable,isAvailableGen, updateSlot,getUserLocation,getBikeSlots,getCarSlots,deleteAC ,getTransaction}}>{props.children}</noteContext.Provider>
    </div>
  )
}

export default Notesate
