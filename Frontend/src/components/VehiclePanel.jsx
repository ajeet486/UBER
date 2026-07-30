import React from "react";
import { useState } from "react";
const VehiclePanel = (props) => {
  const [selected, setSelected] = useState(null);

  const handleVehicleSelect = (vehicleType, selectedKey) => {
    setSelected(selectedKey);
    props.setVehiclePanel(false);
    props.createRide(vehicleType);
  };

  const formatFare = (value) => {
    if (typeof value === "number") {
      return `₹${value}`;
    }
    return "—";
  };

  return (
    <div>
      <h5
        className="p-1 text-center absolute top-0 w-[93%]"
        onClick={() => {
          props.setVehiclePanel(false);
        }}
      >
        {" "}
        <i className=" text-xl  text-gray-200 ri-arrow-down-wide-fill"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-5">Choose a Vehicle</h3>
      <div
        onClick={() => {
          handleVehicleSelect("car", "ubergo");
        }}
        className={`flex border-2 ${selected === "ubergo" ? "border-black" : "border-transparent"} mb-2 rounded-xl items-center w-full p-3 justify-between cursor-pointer`}
      >
        <img
          className=" h-12 "
          src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=956/height=538/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8yOWZiYjhiMC03NWIxLTRlMmEtODUzMy0zYTM2NGU3MDQyZmEucG5n"
        ></img>

        <div className=" w-1/2">
          <h4 className="font-medium text-base">
            UberGo{" "}
            <span>
              <i className="ri-user-3-fill"></i>4
            </span>
          </h4>
          <h5 className="font-medium text-sm">2 mins away </h5>
          <p className="font-normal text-xs text-gray-600">
            Affordable, compact rides
          </p>
        </div>
        <h2 className="text-xl font-semibold">{formatFare(props.fare?.car)}</h2>
      </div>

      <div
        onClick={() => {
          handleVehicleSelect("motorcycle", "moto");
        }}
        className={`flex border-2 ${selected === "moto" ? "border-black" : "border-transparent"} mb-2 rounded-xl items-center w-full p-3 justify-between cursor-pointer`}
      >
        <img
          className=" h-12 "
          src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=956/height=538/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy85MjAwMTg5YS03MWMwLTRmNmQtYTlkZS0xYjZhODUyMzkwNzkucG5n"
        ></img>

        <div className=" w-1/2">
          <h4 className="font-medium text-base">
            Moto{" "}
            <span>
              <i className="ri-user-3-fill"></i>1
            </span>
          </h4>
          <h5 className="font-medium text-sm">2 mins away </h5>
          <p className="font-normal text-xs text-gray-600">
            Affordable, motorcycle rides
          </p>
        </div>
        <h2 className="text-xl font-semibold">
          {formatFare(props.fare?.motorcycle)}
        </h2>
      </div>

      <div
        onClick={() => {
          handleVehicleSelect("auto", "auto");
        }}
        className={`flex border-2 ${selected === "auto" ? "border-black" : "border-transparent"} mb-2 rounded-xl items-center w-full p-3 justify-between cursor-pointer`}
      >
        <img
          className=" h-16 "
          src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=552/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy9mYzEwMWZmOC04MWExLTQ2YzMtOTk1YS02N2I0YmJkMmYyYmYuanBn"
        ></img>

        <div className=" w-1/2 ml-7">
          <h4 className="font-medium text-base">
            Auto{" "}
            <span>
              <i className="ri-user-3-fill"></i>3
            </span>
          </h4>
          <h5 className="font-medium text-sm">2 mins away </h5>
          <p className="font-normal text-xs text-gray-600">
            Affordable, Auto rides
          </p>
        </div>
        <h2 className="text-xl font-semibold">
          {formatFare(props.fare?.auto)}
        </h2>
      </div>
    </div>
  );
};

export default VehiclePanel;
