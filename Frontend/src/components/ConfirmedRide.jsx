import React from "react";

const ConfirmedRide = (props) => {
  const pickupLabel = props.rideDetails?.pickup || "Pickup location";
  const destinationLabel = props.rideDetails?.destination || "Destination";
  const fareValue = props.rideDetails?.fare;

  return (
    <div>
      <h5
        className="p-1 text-center absolute top-0 w-[93%]"
        onClick={() => {
          props.setConfirmRidePanel(false);
        }}
      >
        {" "}
        <i className=" text-xl  text-gray-200 ri-arrow-down-wide-fill"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-5">Confirm your Ride</h3>

      <div className="flex justify-between flex-col items-center">
        <img
          className=" h-20 "
          src="https://i.pinimg.com/474x/8d/21/7b/8d217b1000b642005fea7b6fd6c3d967.jpg"
        ></img>
      </div>
      <div className="w-full mt-5">
        <div className="flex items-center gap-5 p-3 border-b-1">
          <i className=" text-lg ri-map-pin-2-line"></i>
          <div className="">
            <h3 className="text-lg font-medium">{pickupLabel}</h3>
            <p className="text-sm -mt-1 text-gray-600 ">Pickup location</p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-5 p-3 border-b-1">
            <i className="ri-map-pin-2-fill"></i>
            <div className="">
              <h3 className="text-lg font-medium">{destinationLabel}</h3>
              <p className="text-sm -mt-1 text-gray-600 ">Destination</p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-5 p-3 ">
            <i className="ri-cash-fill"></i>
            <div className="">
              <h3 className="text-lg font-medium">
                {typeof fareValue === "number" ? `₹${fareValue}` : "—"}
              </h3>
              <p className="text-sm -mt-1 text-gray-600 ">Cash Cash</p>
            </div>
          </div>
        </div>
      </div>

      {props.rideError ? (
        <p className="mt-3 text-sm text-red-600">{props.rideError}</p>
      ) : null}

      <div>
        <button
          onClick={async () => {
            props.setVehicleFound(true);
            console.log("ConfirmedRide: confirm clicked", props.rideDetails);
            let result = true;
            if (props.submitRide) {
              result = await props.submitRide();
            }
            if (!result) {
              props.setVehicleFound(false);
              return;
            }
            props.setConfirmRidePanel(false);
          }}
          className="w-full bg-green-600 text-white font-semibold p-2 rounded-lg mt-5"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ConfirmedRide;
