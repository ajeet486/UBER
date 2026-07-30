import React from "react";

const WaitingForDriver = (props) => {
  const rideData = props.rideDetails || {};
  const captain = rideData.captainDetails || rideData.captain || null;

  const captainName =
    captain?.fullname?.firstname || captain?.firstname
      ? [
          captain?.fullname?.firstname || captain?.firstname || "",
          captain?.fullname?.lastname || captain?.lastname || "",
        ]
          .filter(Boolean)
          .join(" ")
      : captain?.name || "Waiting for captain";
  const vehiclePlate =
    captain?.vehicle?.plate || rideData?.vehiclePlate || "--";
  const vehicleType =
    captain?.vehicle?.vehicleType || rideData?.vehicleType || "vehicle";

  return (
    <div>
      <h5
        className="p-1 text-center absolute top-0 w-[93%]"
        onClick={() => {
          props.setWaitingForDriver(false);
        }}
      >  
        <i className="text-xl text-gray-200 ri-arrow-down-wide-fill"></i>
      </h5>

      <div className="flex items-center justify-between">
        <img
          className="h-20"
          src="https://i.pinimg.com/474x/8d/21/7b/8d217b1000b642005fea7b6fd6c3d967.jpg"
          alt="Captain"
        />
        <div className="text-right">
          <h2 className="text-lg font-medium -mt-1">{captainName}</h2>
          <h4 className="text-xl font-semibold">{vehiclePlate}</h4>
          <p className="text-sm text-gray-600 capitalize">{vehicleType}</p>
          <h1 className="text-xl font-semibold">
            {props.rideDetails?.otp || ""}
          </h1>
        </div>
      </div>

      <div className="w-full mt-5">
        <div className="flex items-center gap-5 p-3 border-b">
          <i className="text-lg ri-map-pin-2-line"></i>
          <div>
            <h3 className="text-lg font-medium">
              {props.rideDetails?.pickup || "Pickup location"}
            </h3>
            <p className="text-sm -mt-1 text-gray-600">Pickup</p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-5 p-3 border-b">
            <i className="ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">
                {props.rideDetails?.destination || "Destination"}
              </h3>
              <p className="text-sm -mt-1 text-gray-600">Destination</p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-5 p-3">
            <i className="ri-cash-fill"></i>
            <div>
              <h3 className="text-lg font-medium">
                ₹{props.rideDetails?.fare || 0}
              </h3>
              <p className="text-sm -mt-1 text-gray-600">Cash</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingForDriver;
