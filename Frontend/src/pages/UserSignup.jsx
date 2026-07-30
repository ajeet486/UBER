import React from "react";
import { Link,useNavigate } from "react-router-dom";
import { useState,useContext } from "react";
import axios from 'axios'
import {UserDataContext} from '../context/UserContext'
const UserSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userData, setUserData] = useState({});

  const navigate=useNavigate();

  const {user,setUser}=useContext(UserDataContext)

  const submitHandler = async(e) => {
    e.preventDefault();
    const newUserData = {
    fullname: {
      firstname:firstName,
      lastname:lastName,
    },
    email,
    password,
  };

  const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`,newUserData);

  if(response.status===201){
  const data =response.data
  setUser(data.user)
   localStorage.setItem('token',data.token)
  navigate('/home')
  }
  
    setEmail("");
    setFirstName("");
    setLastName("");
    setPassword("");
  };
  return (
    <div className="p-7 h-screen flex flex-col justify-between">
      <div>
        <img
          className="w-16 ml-8 mb-10"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt="Uber Logo"
        />
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
            Create Account
          </button>
          <p className="text-center">
            {" "}
            Already have a Account?
            <Link className="text-blue-600" to="/login">
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
  );
};

export default UserSignup;
