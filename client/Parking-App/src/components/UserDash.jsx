import React, { useContext, useEffect, useState } from 'react'
import noteContext from '../Context/Notecontext';
import "../styles/Userdash.css"
import Transaction from './Transaction';
import AOS from "aos"
import "aos/dist/aos.css"
export default function UserDash() {
  const context = useContext(noteContext);
  const [transactions, setTransactions] = useState("");
  const { data, getTransaction ,Fetchdata,setData} = context;
  console.log(data);
  useEffect(() => {
    async function trans() {
      const response = await getTransaction();
      console.log(response);
      if (response.success === true) {
        setTransactions((prev) => response.transaction);
        console.log(response);
      }
      else {
        document.getElementById("bookings").innerHTML = response.msg;
      }
    }
    trans();
  }, [transactions !== ""])
  useEffect(()=>{
    async function getData() {
      const result = await Fetchdata();
      if (result.success === false) {
        alert(result.msg)
      }
      setData((prev) => prev = result);

    }
    getData()
    AOS.init()
  },[])
  return (
    <div className='profile-main'>
      <h1 data-aos="fade-down">Hello, {data ? data.name : "User"}</h1>
      <div className="bookings" id='bookings'>
        <div className="head" data-aos="flip-down" data-aos-duration="1000">
          <h3>Address</h3>
          <h3>&ensp;&ensp;City</h3>
          <h3>&ensp;&ensp;Amount</h3>
          <h3>Duration</h3>
          <h3>Vehicle Number</h3>
          <h3>Date</h3>
        </div>
        {transactions ?
          transactions.map((transaction) => {
            return <Transaction trans={transaction} key={transaction._id} />
          })
          : ""}
      </div>
    </div>
  )
}
