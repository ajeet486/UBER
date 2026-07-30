import React, { useState,useRef } from 'react'
import { Link,useLocation } from 'react-router-dom'
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import FinishRide from '../components/FinishRide'

const CaptainRiding = () => {
const [finishRidePanel,setFinishRidePanel]=useState(false)
const location=useLocation()
const rideData=location.state?.ride
const finishRidePanelRef=useRef(null)
   useGSAP(() => {
    if (finishRidePanel) {
      gsap.to(finishRidePanelRef.current, {
        transform: "translateY(0)",
        duration: 0.3
      })
    } else {
      gsap.to(finishRidePanelRef.current, {
        transform: "translateY(100%)",
        duration: 0.3
      })
    }
  }, [finishRidePanel])

console.log(location.state)
console.log("Captain riding ride data:", rideData);
  return (
 <div className='h-screen bg-transparent overflow-hidden relative'>

      {/* HEADER */}
      {/* {!confirmRidePopUpPanel && ( */}
        <div className='fixed w-full z-20 p-4 top-0 flex items-center justify-between'>

          <img
            className="w-16 drop-shadow-md"
            src="https://images.seeklogo.com/logo-png/33/2/uber-logo-png_seeklogo-338872.png"
            alt="Uber"
          />

          <Link
            to="/captain-home"
            className="h-11 w-11 bg-black/70 text-white flex items-center justify-center rounded-full shadow-lg backdrop-blur-md"
          >
            <i className="text-lg font-medium ri-logout-box-line"></i>
          </Link>

        </div>
      

      {/* MAP */}
      <div className="h-4/5">
        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt="Map"
        />
      </div>

      <div className="h-1/5 p-6 flex items-center relative bg-yellow-400 justify-between"
      onClick={()=>{
        setFinishRidePanel(true)
      }}
      >
         <h5
        className="p-1 text-center absolute top-0 w-[95%]"
        onClick={() => {
          
        }}
      >
        {" "}
        <i className=" text-xl  text-gray-200 ri-arrow-down-wide-fill"></i>
      </h5>
           <h4 className="text-xl font-semibold">4 KM away</h4>
           <button   className="w-full bg-green-500 text-white-700 font-semibold p-2 px-10 rounded-lg ">Complete Ride</button>
      </div>
  
   <div
        ref={finishRidePanelRef}
        className="fixed w-full z-30 bottom-0 translate-y-full bg-white px-3 py-10 pt-12 rounded-t-3xl shadow-2xl"
      >
        <FinishRide setFinishRidePanel={setFinishRidePanel} ride={rideData}
        
        />
      </div>
    </div>
  )
}

export default CaptainRiding