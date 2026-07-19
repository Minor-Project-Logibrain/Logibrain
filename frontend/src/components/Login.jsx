import React, { useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock,faEye,faEyeSlash, } from "@fortawesome/free-solid-svg-icons";


const Login = () => {
  const [showpass,setShowpass] = useState(false);
  const toggel = ()=>{
  setShowpass(!showpass);
}
  return (
    <div>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-full max-w-md bg-white font-bold rounded-2xl shadow-xl p-8">
            <h1 className="font-bold text-3xl text-center text-gray-800">Welcome Back</h1>
            <p className="mt-2 text-center text-gray-500 ">Login to your account</p>
            <form className="mt-8 space-y-5">
                <div>
                    <label htmlFor="" className="text-sm mb-2 block text-gray-700 ">Email</label>
                    <input type="email" className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>
                <div className="logo">
                  <img src="" alt="" />
                </div>
                <div>
                    <label htmlFor="" className="text-sm block text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <input type={showpass?'text':'password'} className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
                      <FontAwesomeIcon icon={showpass ? faEyeSlash:faEye} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer" onClick={toggel}/>
                    </div>
                </div>
                
                <div className='text-ceter'>
                    <button className='w-full text-white bg-blue-500 py-3 rounded-lg hover:bg-blue-700 transition'>Login</button>
                </div>
                <div className='flex items-center justify-between text-sm'>
                    <a href="" className='text-blue-500 hover:underline'>Forgot Password?</a>
                    <p className='text-gray-600'>Don't have a account? {" "}<a className='text-blue-600 font-semibold'>Sign-up</a></p>
                </div>
            </form>
        </div>

      </div>
    </div>
  )
}

export default Login
