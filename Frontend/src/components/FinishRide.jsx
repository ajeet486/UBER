import React from 'react'
import { Link,useNavigate } from 'react-router-dom';
import axios from "axios"
const FinishRide = (props) => {
  const navigate=useNavigate()
async function endRide(){
console.log("ride =", props.ride);
console.log("rideId =", props.ride?._id);
console.log("otp =", props.ride?.otp);
try{
  const response=await  axios.post(`${import.meta.env.VITE_BASE_URL}/rides/end-ride`,
    {
      
        rideId:props.ride?._id
      },{
      headers:{
        Authorization :`Bearer ${localStorage.getItem('token')}`
      }
    }
  )

  if(response.status===200){
    props.setFinishRidePanel(false)
   
    navigate('/captain-home')
  }
}
catch(err){
   console.log(err.response?.data);
    console.log(err.response?.status);
}
}
   
  return (
   <div > 
       <h5
        className="p-1 text-center absolute top-0 w-[93%]"
        onClick={() => {
          props.setFinishRidePanel(false);
        }}
      >
        {" "}
        <i className=" text-xl  text-gray-200 ri-arrow-down-wide-fill"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-5">Finish this ride </h3>

<div className="flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-4">
  <div className="flex items-center  gap-3 mt-4">
    <img className="h-10 w-10 rounded-full object-cover" src="https://cdn-icons-png.flaticon.com/512/6522/6522516.png"></img>
    <h2 className="text-lg font-medium">{props.ride?.user.fullname.firstname}</h2>
  </div>
  <h5 className="text-lg font-semibold">2.2 KM</h5>
</div>
      <div className="flex justify-between flex-col items-center">
       
      </div>
      <div className="w-full mt-5">
        <div className="flex items-center gap-5 p-3 border-b-1">
          <i className=" text-lg ri-map-pin-2-line"></i>
          <div className="">
            <h3 className="text-lg font-medium">{props.ride?.pickup}</h3>
            <p className="text-sm -mt-1 text-gray-600 ">
              pickup
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-5 p-3 border-b-1">
            <i className="ri-map-pin-2-fill"></i>
            <div className="">
              <h3 className="text-lg font-medium">{props.ride?.destination}</h3>
              <p className="text-sm -mt-1 text-gray-600 ">
                destination
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-5 p-3 ">
            <i className="ri-cash-fill"></i>
            <div className="">
              <h3 className="text-lg font-medium">₹{props.ride?.fare}</h3>
              <p className="text-sm -mt-1 text-gray-600 ">Cash Cash</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 ">
         <button
          onClick={endRide}
          className="w-full flex justify-center bg-green-600 text-lg text-white font-semibold p-2 rounded-lg mt-5"
        >
          Finish Ride
        </button>
        <p className=" mt-10 text-xs ml-4 ">click on finish ride button  if you have completed payment.</p>
      </div>
      </div>
  )
}

export default FinishRide