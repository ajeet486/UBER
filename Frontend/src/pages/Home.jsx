import React, { useState, useRef, useEffect, useContext } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axios from "axios";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmedRide from "../components/ConfirmedRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import { SocketContext } from "../context/SocketContext";
import { UserDataContext } from "../context/UserContext";
import { CaptainDataContext } from "../context/CaptainContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [pickup, serPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const [fare, setFare] = useState(null);
  const [rideDetails, setRideDetails] = useState(null);
  const [rideError, setRideError] = useState("");
  const [ride, setRide] = useState("");
  const [selectedVehicleType, setSelectedVehicleType] = useState(null);
  const confirmRidePanelRef = useRef(null);
  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const vehiclePanelRef = useRef(null);
  const logoRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);

  // Fetch suggestions for pickup field
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserDataContext);

  useEffect(() => {
    if (!socket || !user?._id) return;

    const joinUserChannel = () => {
      console.log("Home: joining socket as user", {
        userId: user._id,
        socketId: socket.id,
      });
      socket.emit("join", { userType: "user", userId: user._id });
    };

    joinUserChannel();
    socket.on("connect", joinUserChannel);

    const handleRideStatus = (data) => {

      console.log("Home: ride status event received", data);
      setConfirmRidePanel(false);
      setVehiclePanel(false);
      setVehicleFound(false);
      setRideDetails(data);
      setWaitingForDriver(true);
    };

    const handleRideStarted = (rideData) => {
      console.log("Home: ride started event received", rideData);
      setWaitingForDriver(false);
      setRideDetails(rideData);
      navigate("/riding", { state: { ride: rideData } });
    };

    socket.on("ride-accepted", handleRideStatus);
    socket.on("ride-confirmed", handleRideStatus);
    socket.on("ride-started", handleRideStarted);

    console.log(
      "Home: registered socket ride event listeners for user",
      user._id,
    );

    return () => {
      socket.off("ride-accepted", handleRideStatus);
      socket.off("ride-confirmed", handleRideStatus);
      socket.off("ride-started", handleRideStarted);
    };
  }, [socket, user]);

  useEffect(() => {
    if (pickup.length > 2 && activeField === "pickup") {
      fetchSuggestions(pickup);
    }
  }, [pickup, activeField]);

  // Fetch suggestions for destination field
  useEffect(() => {
    if (destination.length > 2 && activeField === "destination") {
      fetchSuggestions(destination);
    }
  }, [destination, activeField]);

  const fetchSuggestions = async (input) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get--suggestions`,
        {
          params: { input },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      // Backend returns suggestions in data.data field
      const suggestions = response.data.data || [];
      // Extract formatted address from suggestion objects
      const formattedSuggestions = suggestions.map((item) => item.formatted);
      setSuggestions(formattedSuggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (activeField === "pickup") {
      serPickup(suggestion);
    } else if (activeField === "destination") {
      setDestination(suggestion);
    }
    // setPanelOpen(false);
    setActiveField(null);
    setSuggestions([]);
  };

  const submitHandler = (e) => {
    e.preventDefault();
  };

  useGSAP(
    function () {
      if (panelOpen) {
        gsap.to(panelRef.current, {
          height: "70%",
          opacity: 1,
          padding: 24,
        });

        gsap.to(panelCloseRef.current, {
          opacity: 1,
        });

        gsap.to(logoRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.3,
        });
      } else {
        gsap.to(panelRef.current, {
          height: "0",
          opacity: 0,
          padding: 0,
        });

        gsap.to(panelCloseRef.current, {
          opacity: 0,
        });

        gsap.to(logoRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.3,
        });
      }
    },
    [panelOpen],
  );

  useGSAP(
    function () {
      if (vehiclePanel) {
        gsap.to(vehiclePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(vehiclePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [vehiclePanel],
  );

  useGSAP(
    function () {
      if (confirmRidePanel) {
        gsap.to(confirmRidePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(confirmRidePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [confirmRidePanel],
  );

  useGSAP(
    function () {
      if (vehicleFound) {
        gsap.to(vehicleFoundRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(vehicleFoundRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [vehicleFound],
  );

  useGSAP(
    function () {
      if (waitingForDriver) {
        gsap.to(waitingForDriverRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(waitingForDriverRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [waitingForDriver],
  );

  async function findTrip() {
    setVehiclePanel(true);
    setPanelOpen(false);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/get-fare`,
        {
          params: {
            pickup,
            destination,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      console.log("Fare response:", response.data);
      setFare(response.data?.fare || null);
    } catch (error) {
      console.error("Error fetching fare:", error);
      setFare(null);
    }
  }

  // Prepare ride creation flow: open confirm panel and store selected vehicle.
  function createRide(vehicleType) {
    setRideError("");
    setVehiclePanel(false);
    setConfirmRidePanel(true);
    setSelectedVehicleType(vehicleType);
  }

  // Called when user confirms the ride in ConfirmedRide component.
  async function submitRide() {
    setRideError("");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/create`,
        {
          pickup,
          destination,
          vehicleType: selectedVehicleType,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setRideDetails(response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating ride:", error);
      setRideError("Unable to create ride right now.");
      return null;
    }
  }

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Uber Logo */}{" "}
      <img
        ref={logoRef}
        className="w-16 absolute left-5 top-3 z-20"
        src="https://images.seeklogo.com/logo-png/33/2/uber-logo-png_seeklogo-338872.png"
        alt="Uber"
      />
      {/* Background */}
      <div className="h-screen w-screen">
        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt="Map"
        />
      </div>
      {/* Main Content */}
      <div className="flex flex-col justify-end absolute h-screen top-0 w-full">
        <div className="h-[32%] p-5 bg-white rounded-t-3xl shadow-2xl relative">
          <h5
            ref={panelCloseRef}
            onClick={() => {
              setPanelOpen(false);
            }}
            className="absolute right-6 opacity-0 top-6 text-2xl cursor-pointer"
          >
            <i className="ri-arrow-down-s-line"></i>
          </h5>

          <h4 className="text-2xl font-semibold">Find a trip</h4>

          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
            className="relative"
          >
            {/* Uber-style markers */}
            <div className="absolute left-4 top-8 flex flex-col items-center z-10">
              <div className="w-3 h-3 rounded-full bg-black"></div>
              <div className="w-[2px] h-10 bg-gray-400"></div>
              <div className="w-3 h-3 bg-black"></div>
            </div>

            <input
              onClick={() => {
                setPanelOpen(true);
                setActiveField("pickup");
              }}
              value={pickup}
              onChange={(e) => {
                serPickup(e.target.value);
              }}
              className="bg-[#f3f3f3] px-12 py-3 text-base rounded-lg w-full mt-5 border border-transparent focus:border-black outline-none transition-all"
              type="text"
              placeholder="Add a pick-up location"
            />

            <input
              onClick={() => {
                setPanelOpen(true);
                setActiveField("destination");
              }}
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
              }}
              className="bg-[#f3f3f3] px-12 py-3 text-base rounded-lg w-full mt-3 border border-transparent focus:border-black outline-none transition-all"
              type="text"
              placeholder="Enter your destination"
            />
          </form>
          <button
            onClick={findTrip}
            type="submit"
            className="w-full mt-5 bg-black text-white py-3 rounded-xl font-semibold text-lg hover:bg-gray-900 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl m-b-3 "
          >
            Find Trip
          </button>
        </div>

        {/* // location search panel */}

        <div ref={panelRef} className="bg-white h-0 overflow-hidden">
          <LocationSearchPanel
            setPanelOpen={setPanelOpen}
            setVehiclePanel={setVehiclePanel}
            suggestions={suggestions}
            onSuggestionClick={handleSuggestionClick}
          />
        </div>
      </div>
      {/* // vehicle panel */}
      <div
        ref={vehiclePanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white rounded-t-3xl shadow-2xl px-3 py-6"
      >
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4"></div>

        <VehiclePanel
          createRide={createRide}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehiclePanel={setVehiclePanel}
          fare={fare}
        />
      </div>
      <div
        ref={confirmRidePanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white rounded-t-3xl shadow-2xl px-3 py-6"
      >
        <ConfirmedRide
          setConfirmRidePanel={setConfirmRidePanel}
          setVehicleFound={setVehicleFound}
          rideDetails={rideDetails}
          rideError={rideError}
          submitRide={submitRide}
        ></ConfirmedRide>
      </div>
      <div
        ref={vehicleFoundRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white rounded-t-3xl shadow-2xl px-3 py-6"
      >
        <LookingForDriver
          rideDetails={rideDetails}
          setVehicleFound={setVehicleFound}
        ></LookingForDriver>
      </div>
     {waitingForDriver && (
  <div
    className="fixed w-full z-10 bottom-0 bg-white rounded-t-3xl shadow-2xl px-3 py-6"
  >
    <WaitingForDriver
      setWaitingForDriver={setWaitingForDriver}
      rideDetails={rideDetails}
    />
  </div>
)}
    </div>
  );
};

export default Home;
