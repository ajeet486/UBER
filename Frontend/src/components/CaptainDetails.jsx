import React  ,{useContext}from 'react'
import {CaptainDataContext} from '../context/CaptainContext'
const CaptainDetails = () => {
  const { captain } = useContext(CaptainDataContext);




  
  return (
    <div>
      <div className="h-1/2 p-5 -mt-6 bg-white rounded-t-3xl shadow-2xl relative z-10">

        {/* USER + EARNINGS */}
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl shadow-sm">

          <div className="flex items-center gap-3">
            <img
              className="h-12 w-12 rounded-full object-cover border-2 border-gray-300"
              src="https://img.magnific.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80"
            />

            <div>
              <h4 className="text-lg font-semibold capitalize">{captain.fullname.firstname + " " + captain.fullname.lastname}</h4>
              <p className="text-xs text-gray-500">Captain</p>
            </div>
          </div>

          <div className="text-right">
            <h4 className="text-xl font-bold text-green-600">₹295.2</h4>
            <p className="text-xs text-gray-500">Total Earned</p>
          </div>

        </div>

        {/* STATS */}
        <div className="flex justify-between mt-6">

          <div className="text-center bg-gray-50 p-3 rounded-2xl w-1/3 mx-1 shadow-sm">
            <i className="text-2xl text-blue-500 ri-time-line"></i>
            <h5 className="text-lg font-semibold mt-1">10.2</h5>
            <p className="text-xs text-gray-500">Hours Online</p>
          </div>

          <div className="text-center bg-gray-50 p-3 rounded-2xl w-1/3 mx-1 shadow-sm">
            <i className="text-2xl text-green-500 ri-speed-up-line"></i>
            <h5 className="text-lg font-semibold mt-1">10.2</h5>
            <p className="text-xs text-gray-500">Trips</p>
          </div>

          <div className="text-center bg-gray-50 p-3 rounded-2xl w-1/3 mx-1 shadow-sm">
            <i className="text-2xl text-purple-500 ri-booklet-line"></i>
            <h5 className="text-lg font-semibold mt-1">10.2</h5>
            <p className="text-xs text-gray-500">Rating</p>
          </div>
</div>
        </div>
    </div>
  )
}

export default CaptainDetails