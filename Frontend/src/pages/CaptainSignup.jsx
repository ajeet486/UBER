import React from 'react'
import {Link} from 'react-router-dom'
import { useState } from 'react';
const CaptainSignup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userData, setUserData] = useState({});
    const submitHandler = (e) => {
      e.preventDefault();
      const newUserData = {
      fullName: {
        firstName,
        lastName,
      },
      email,
      password,
    };
  
    setUserData(newUserData);
    
      setEmail("");
      setFirstName("");
      setLastName("");
      setPassword("");
    };
  return (
  <div className="p-7 h-screen flex flex-col justify-between">
      <div>
        <img  className="w-16 ml-1 mb-3" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTs9l7FkJyLm6OW3rJ9OuMc01U9YuJ2Krctpo5AqttE-aqLprArenaU_Gk&s=10" alt="Uber Logo"  />
        <form
          onSubmit={(e) => {
            submitHandler(e);
          }}
        >
          <h3 className="text-base font-base mb-2">What's your name</h3>
          <div className="flex gap-4 mb-5">
            <input
              required
              className="bg-[#eeeeee]  w-1/2 rounded px-4 py-2 border  text-base placeholder:text-sm"
              type="text"
              placeholder="first name"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
            />
            <input
              required
              className="bg-[#eeeeee]  rounded px-4 py-2 border  w-1/2 text-base placeholder:text-sm"
              type="text"
              placeholder="last name"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
            />
          </div>
          <h3 className="text-base font-medium mb-2">What's your email</h3>
          <input
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="bg-[#eeeeee] mb-5 rounded px-4 py-2 border w-full text-base placeholder:text-sm"
            type="email"
            placeholder="email@example.com"
          />
          <h3 className="text-base font-medium mb-2">Enter Password</h3>
          <input
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-base placeholder:text-sm"
            type="password"
            placeholder="••••••••"
          />
          <button className="bg-[#111] text-white font-semibold mb-2 rounded px-4 py-2 w-full text-lg placeholder:text-base">
            Login
          </button>
          <p className="text-center">
            {" "}
            Already have a Account?
            <Link className="text-blue-600" to="/captain-login">
              {" "}
              Login here
            </Link>
          </p>
        </form>
      </div>
      <div>
        <p className="text-[11px] font-base text-base">
         This site is protected by reCAPTCHA and the <span className="underline"> Google Privacy</span> Policy and <span className="underline">Terms of Service Apply</span>.
        </p>
      </div>
    </div>
  )
}

export default CaptainSignup;