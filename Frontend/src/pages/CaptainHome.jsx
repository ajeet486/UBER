import React, { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SocketContext } from "../context/SocketContext";
import { CaptainDataContext } from "../context/CaptainContext";
import axios from "axios";
const CaptainHome = () => {
  const [ridePopUpPanel, setRidePopUpPanel] = useState(false);
  const [confirmRidePopUpPanel, setConfirmRidePopUpPanel] = useState(false);
  const [ride, setRide] = useState(null);

  const ridePopUpPanelRef = useRef(null);
  const confirmRidePopUpPanelRef = useRef(null);

  const { socket } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext);

  useEffect(() => {
    if (!socket || !captain?._id) return;

    const joinCaptainChannel = () => {
      socket.emit("join", { userType: "captain", userId: captain._id });
    };

    joinCaptainChannel();
    socket.on("connect", joinCaptainChannel);

    const updateLocation = () => {
      if (!navigator.geolocation) return;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(
            "Updating location:",
            position.coords.latitude,
            position.coords.longitude,
          );
          socket.emit("update-location-captain", {
            userId: captain._id,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        },
        () => {},
        { enableHighAccuracy: true },
      );
    };

    updateLocation();
    const intervalId = setInterval(updateLocation, 10000);

    const handleNewRide = (data) => {
      setRide(data);
      setRidePopUpPanel(true);
    };

    socket.on("new-ride", handleNewRide);

    return () => {
      clearInterval(intervalId);
      socket.off("new-ride", handleNewRide);
      socket.off("connect", joinCaptainChannel);
    };
  }, [socket, captain]);

  useGSAP(() => {
    if (ridePopUpPanel) {
      gsap.to(ridePopUpPanelRef.current, {
        transform: "translateY(0)",
        duration: 0.3,
      });
    } else {
      gsap.to(ridePopUpPanelRef.current, {
        transform: "translateY(100%)",
        duration: 0.3,
      });
    }
  }, [ridePopUpPanel]);

  useGSAP(() => {
    if (confirmRidePopUpPanel) {
      gsap.to(confirmRidePopUpPanelRef.current, {
        transform: "translateY(0)",
        duration: 0.3,
      });
    } else {
      gsap.to(confirmRidePopUpPanelRef.current, {
        transform: "translateY(100%)",
        duration: 0.3,
      });
    }
  }, [confirmRidePopUpPanel]);

  const handleAcceptRide = async () => {
    const userId =
      ride?.user?._id?.toString() ||
      (typeof ride?.user === "string" ? ride.user : undefined);

    try {
      const confirmedRide = await confirmRide();
      if (!confirmedRide) {
        console.warn("CaptainHome: confirmRide failed, no confirmed ride returned", {
          ride,
        });
        return;
      }

      setRidePopUpPanel(false);
      setConfirmRidePopUpPanel(true);

      if (socket && userId) {
        console.log("CaptainHome: emitting ride-accepted to server", {
          userId,
          rideId: confirmedRide?._id,
        });
        socket.emit("ride-accepted", {
          userId,
          ride: confirmedRide,
        });
      } else {
        console.warn("CaptainHome: missing userId, cannot emit ride-accepted", {
          userId,
          ride,
        });
      }
    } catch (error) {
      console.error("Error accepting ride:", error);
    }
  };

  async function confirmRide() {
    if (!ride?._id || !captain?._id) {
      console.error("Missing ride or captain id for confirmRide", {
        ride,
        captain,
      });
      return null;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
        {
          rideId: ride._id,
          captainId: captain._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const confirmedRide = response.data?.ride || response.data;
      setRide(confirmedRide);
      return confirmedRide;
    } catch (error) {
      console.error("Error confirming ride:", error);
      return null;
    }
  }

  return (
    <div className="h-screen bg-transparent overflow-hidden">
      {/* HEADER */}
      {!confirmRidePopUpPanel && (
        <div className="fixed w-full z-20 p-4 top-0 flex items-center justify-between">
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
      )}

      {/* MAP */}
      <div className="h-1/2">
        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt="Map"
        />
      </div>

      {/* CAPTAIN DETAILS */}
      <div>
        <CaptainDetails />
      </div>

      {/* NEW RIDE POPUP */}
      <div
        ref={ridePopUpPanelRef}
        className="fixed w-full z-30 bottom-0 translate-y-full bg-white px-3 py-10 pt-12 rounded-t-3xl shadow-2xl"
      >
        <RidePopUp
          ride={ride}
          setRidePopUpPanel={setRidePopUpPanel}
          setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
          onAcceptRide={handleAcceptRide}
          confirmRide={confirmRide}
        />
      </div>

      {/* CONFIRM RIDE POPUP */}
      <div
        ref={confirmRidePopUpPanelRef}
        className="fixed w-full h-screen z-50 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <ConfirmRidePopUp
          ride={ride}
          setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
          setRidePopUpPanel={setRidePopUpPanel}
          confirmRide={confirmRide}
        />
      </div>
    </div>
  );
};

export default CaptainHome;
