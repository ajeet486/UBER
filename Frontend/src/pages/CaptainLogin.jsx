import React from 'react'
import {Link} from 'react-router-dom'
import {useState} from 'react'
const CaptainLogin = () => {
    const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [captainData,setCaptainData]=useState({});
  const submitHandler=(e)=>{
    e.preventDefault();
    setCaptainData({
      email:email,
      password:password
    })
    console.log(captainData);
  setEmail('');
  setPassword('');
  
  }
  return (
     <div className="p-7 h-screen flex flex-col justify-between">
        <div>
     <img  className="w-16 ml-1 mb-3" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTs9l7FkJyLm6OW3rJ9OuMc01U9YuJ2Krctpo5AqttE-aqLprArenaU_Gk&s=10" alt="Uber Logo"  />
      <form onSubmit={(e)=>{
        submitHandler(e);
      }}>
        <h3 className="text-lg font-medium mb-2">What's your email</h3>
        <input
         required
         value={email}
         onChange={(e)=>{
  setEmail(e.target.value)
         }}
         className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base"
         type="email"
          placeholder="email@example.com"
           />
        <h3 className="text-lg font-medium mb-2">Enter Password</h3>
        <input
         required
          value={password}
         onChange={(e)=>{
  setPassword(e.target.value)
         }}
         className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base"
         type="password"
          placeholder="••••••••"
           />
        <button   
        className="bg-[#111] text-white font-semibold mb-2 rounded px-4 py-2 w-full text-lg placeholder:text-base">Login</button>
        <p className="text-center"> Want to Join a fleet?
        <Link className="text-blue-600" to='/captain-signup'> Register as a Captain</Link>
        </p>
      </form>
      </div>
      <div>
        <Link to="/login"    className="bg-[#d5622d] flex flex-center items-center justify-center text-white font-semibold mb-7 rounded px-4 py-2 w-full text-lg placeholder:text-base">Sign in as User</Link>
      </div>
    </div>
  )
}

export default CaptainLogin;