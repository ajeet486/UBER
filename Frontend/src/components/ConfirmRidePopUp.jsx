import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ConfirmRidePopUp = (props) => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      console.log("ConfirmRidePopUp: submitting start-ride", {
        rideId: props.ride?._id,
        otp,
      });


      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/start-ride`,
        {
          params: {
            rideId: props.ride?._id,
            otp: otp,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.status === 200) {
        console.log("response",response.data)
        props.setConfirmRidePopUpPanel(false);
        props.setRidePopUpPanel(false);
        navigate("/captain-riding",{state:{ride:response.data}});
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.messages ||
        err.message ||
        "Unable to start ride.";
      console.error("start-ride failed", message, err?.response || err);
      setErrorMessage(message);
    }
  };

  return (
    <div>
      <h5
        className="p-1 text-center absolute top-0 w-[93%]"
        onClick={() => {
          props.setConfirmRidePopUpPanel(false);
        }}
      >
        {" "}
        <i className=" text-xl  text-gray-200 ri-arrow-down-wide-fill"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-5">
        Confirm this ride to Start{" "}
      </h3>

      <div className="flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-4">
        <div className="flex items-center  gap-3 mt-4">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src="https://cdn-icons-png.flaticon.com/512/6522/6522516.png"
          ></img>
          <h2 className="text-lg font-medium capitalize">
            {props.ride?.user.fullname.firstname}
          </h2>
        </div>
        <h5 className="text-lg font-semibold">2.2 KM</h5>
      </div>
      <div className="flex justify-between flex-col items-center"></div>
      <div className="w-full mt-5">
        <div className="flex items-center gap-5 p-3 border-b-1">
          <i className=" text-lg ri-map-pin-2-line"></i>
          <div className="">
            <h3 className="text-lg font-medium">{props.ride?.pickup}</h3>
            <p className="text-sm -mt-1 text-gray-600 ">pickup</p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-5 p-3 border-b-1">
            <i className="ri-map-pin-2-fill"></i>
            <div className="">
              <h3 className="text-lg font-medium">{props.ride?.destination}</h3>
              <p className="text-sm -mt-1 text-gray-600 ">destination</p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-5 p-3 ">
            <i className="ri-cash-fill"></i>
            <div className="">
              <h3 className="text-lg font-medium">{props.ride?.fare}</h3>
              <p className="text-sm -mt-1 text-gray-600 ">Cash Cash</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 ">
        <form onSubmit={submitHandler}>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="bg-[#f3f3f3] px-6 py-4 font-mono text-base rounded-lg w-full mt-5 border border-transparent focus:border-black outline-none transition-all"
            type="text"
            placeholder="Enter OTP"
          ></input>
          {errorMessage ? (
            <p className="mt-3 text-sm text-red-600">{errorMessage}</p>
          ) : null}

          <button
            type="submit"
            className="w-full flex justify-center bg-green-600 text-white font-semibold p-2 rounded-lg mt-5"
          >
            Confirm
          </button>

          <button
            onClick={() => {
              props.setConfirmRidePopUpPanel(false);
              props.setRidePopUpPanel(false);
            }}
            className="w-full bg-red-500 text-white-700 font-semibold p-2 rounded-lg mt-5"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConfirmRidePopUp;
