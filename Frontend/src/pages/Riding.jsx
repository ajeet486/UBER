import React from 'react'
import { Link, useLocation,useNavigate } from "react-router-dom";
import {useEffect,useContext} from 'react'
import { SocketContext } from '../context/SocketContext';
const Riding = () => {
const navigate=useNavigate()
const location=useLocation();
const {ride}=location.state || {}
// console.log("Ride:", ride);
const {socket}=useContext(SocketContext)
b  
socket.on('ride-ended',()=>{
  navigate('/home') 
})


  return (
    <div className='h-screen'>
<Link to="/home"className="h-10 w-10 right-2 top-2 bg-white flex items-center justify-center rounded-full  fixed ">
  <i className=" text-lg font-medium ri-home-8-line"></i>
</Link>

      <div className="h-1/2 ">
        <img
      className="h-full w-full object-cover"
      src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
     
    />
      </div>

      <div className="h-1/2 p-4">
<div className="flex items-center justify-between">
   <img className=" h-20 " src="https://i.pinimg.com/474x/8d/21/7b/8d217b1000b642005fea7b6fd6c3d967.jpg"></img>
   <div className="text-right">
    <h2 className="text-lg font-medium -mt-1 captalize">{ride?.captain.fullname.firstname}</h2>
    <h4 className="text-xl font-semibold">{ride?.captain.vehicle?.plate}</h4>
    <p className="text-sm text-gray-600">Maruti Suzuki Alto</p>
   </div>
</div>

<div className="flex justify-between flex-col items-center">
  
</div>
<div className="w-full mt-5">


<div>
  <div className="flex items-center gap-5 p-3 border-b-1">
 <i className="ri-map-pin-2-fill"></i>
  <div className="">
    <h3 className="text-lg font-medium">{ride?.destination}</h3>
    <p className="text-sm -mt-1 text-gray-600 ">destination</p>
  </div>
</div>
</div>



<div>
  <div className="flex items-center gap-5 p-3 ">
 <i className="ri-cash-fill"></i>
  <div className="">
    <h3 className="text-lg font-medium">₹{ride?.fare}</h3>
    <p className="text-sm -mt-1 text-gray-600 ">Cash Cash</p>
  </div>
</div>
</div>

</div>

<div>
 
</div>
<button    className="w-full bg-green-600 text-white font-semibold p-2 rounded-lg mt-5">Make a Payment</button>
      </div>
    </div>
  )
}

export default Riding