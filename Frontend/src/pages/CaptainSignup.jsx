import React from "react";
import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { CaptainDataContext } from "../context/CaptainContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const CaptainSignup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  // const [captainData, setCaptainData] = useState({});
  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  const { captain, setCaptain } = useContext(CaptainDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();

    const newCaptainData = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email,
      password,
      vehicle: {
        vehicleType: vehicleType,
        plate: vehiclePlate,
        color: vehicleColor,
        capacity: vehicleCapacity,
      },
    };

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/captains/register`,
      newCaptainData,
    );

    if (response.status === 201) {
      const data = response.data;
      setCaptain(data.captain);
      localStorage.setItem("token", data.token);
      navigate("/captain-home");
    }

    setEmail("");
    setFirstName("");
    setLastName("");
    setPassword("");
    setVehicleType("");
    setVehiclePlate("");
    setVehicleColor("");
    setVehicleCapacity("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            className="w-24"
            src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
            alt="Uber Logo"
          />
        </div>

        {/* Card */}
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8 hover:shadow-[0_25px_70px_rgba(0,0,0,0.12)] transition-all duration-300">
          <h1 className="text-4xl font-bold text-center text-black">
            Drive with Uber
          </h1>

          <p className="text-center text-gray-500 mt-2 mb-8">
            Create your captain account and start earning.
          </p>

          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              What's your name
            </h3>

            <div className="flex gap-3 mb-5">
              <input
                required
                className="w-1/2 h-14 bg-gray-50 border border-gray-200 rounded-2xl px-5 text-base focus:outline-none focus:ring-2 focus:ring-black transition-all"
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />

              <input
                required
                className="w-1/2 h-14 bg-gray-50 border border-gray-200 rounded-2xl px-5 text-base focus:outline-none focus:ring-2 focus:ring-black transition-all"
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              What's your email
            </h3>

            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-14 bg-gray-50 border border-gray-200 rounded-2xl px-5 text-base mb-5 focus:outline-none focus:ring-2 focus:ring-black transition-all"
              type="email"
              placeholder="email@example.com"
            />

            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Enter Password
            </h3>

            <input
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 bg-gray-50 border border-gray-200 rounded-2xl px-5 text-base mb-8 focus:outline-none focus:ring-2 focus:ring-black transition-all"
              type="password"
              placeholder="••••••••"
            />

            <div className="border-t border-gray-200 mb-8"></div>

            <h3 className="text-xl font-bold text-black mb-4">
              Vehicle Information
            </h3>

            <div className="flex gap-3 mb-4">
              <select
                required
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-1/2 h-14 bg-gray-50 border border-gray-200 rounded-2xl px-5 text-base focus:outline-none focus:ring-2 focus:ring-black transition-all"
              >
                <option value="">Vehicle Type</option>
                <option value="motorcycle">Moto</option>
                <option value="auto">Auto</option>
                <option value="car">Car</option>
              </select>

              <input
                required
                className="w-1/2 h-14 bg-gray-50 border border-gray-200 rounded-2xl px-5 text-base focus:outline-none focus:ring-2 focus:ring-black transition-all"
                type="text"
                placeholder="Plate number"
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value)}
              />
            </div>

            <div className="flex gap-3 mb-8">
              <input
                required
                className="w-1/2 h-14 bg-gray-50 border border-gray-200 rounded-2xl px-5 text-base focus:outline-none focus:ring-2 focus:ring-black transition-all"
                type="text"
                placeholder="Vehicle color"
                value={vehicleColor}
                onChange={(e) => setVehicleColor(e.target.value)}
              />

              <input
                required
                className="w-1/2 h-14 bg-gray-50 border border-gray-200 rounded-2xl px-5 text-base focus:outline-none focus:ring-2 focus:ring-black transition-all"
                type="text"
                placeholder="Capacity"
                value={vehicleCapacity}
                onChange={(e) => setVehicleCapacity(e.target.value)}
              />
            </div>

            <button className="w-full h-14 bg-black text-white rounded-2xl font-semibold text-lg hover:bg-gray-900 active:scale-[0.98] transition-all duration-200">
              Create Captain Account
            </button>

            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account?
              <Link
                className="text-black font-semibold ml-1 hover:underline"
                to="/captain-login"
              >
                Login here
              </Link>
            </p>
          </form>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6 leading-relaxed px-4">
          This site is protected by reCAPTCHA and the Google Privacy Policy and
          Terms of Service apply.
        </p>
      </div>
    </div>
  );
};

export default CaptainSignup;
