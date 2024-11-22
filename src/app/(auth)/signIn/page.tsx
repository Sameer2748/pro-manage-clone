"use client";

import { CiMail } from "react-icons/ci";
import { RiLockPasswordLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { redirect } from "next/navigation";

const page = () => {
    const [email, setEmail] = useState<String>("");
    const [password, setPassword] = useState<String>("");

    useEffect(()=>{
      const check = async()=>{
        const token = await localStorage.getItem("token")
        if(token){
          window.location.href = "/dashboard"
        }
      }
      check()
    })

    const handlePost = async()=>{
        try {
            const res = await axios.post('http://localhost:3000/api/v1/user/signIn', {email, password})
            console.log(res.data);
            const token = res.data.token;

            await localStorage.setItem('token', token);
            toast.success(res.data.message)
            window.location.href = "/dashboard"
            
        } catch (error) {
            console.log("error in login with this credentials", error);
            toast.error("Error in login with this credentials")
        }
    }
    
  return (
    <div className="flex ">
      <div className="w-[60%] h-screen">
        <img className="w-[100%] h-[100%]" src="/auth.png" alt="" />
      </div>
      <div className="w-[40%] h-screen flex justify-center items-center">
        <div className="w-[70%] h-[60%] p-2 flex flex-col justify-between items-center">
          <h1 className="text-black text-[40px] font-bold text-center mb-5">Login</h1>
          <div className="flex flex-col  gap-8 items-center w-full h-full pt-12">
            <div className="w-full border border-gray-500 flex  items-center p-3 rounded-xl gap-2">
              <CiMail color="black" />
              <input className="focus:outline-none focus:ring-0 text-black font-[16px] w-full" onChange={(e)=> setEmail(e.target.value)} type="text" placeholder="Email" />
            </div>
            <div className="w-full border border-gray-500 flex  items-center p-3 rounded-xl gap-2">
              <RiLockPasswordLine color="black" />
              <input className="focus:outline-none focus:ring-0 text-black font-[16px] w-full" onChange={(e)=> setPassword(e.target.value)} type="text" placeholder="password" />
            </div>
          </div>
          <div className="w-full  flex flex-col justify-between items-center gap-6">
            <button className="w-full h-[5vh] bg-blue-400 text-white rounded-xl text-[18px]" onClick={handlePost}>Login</button>
            <p className="text-black text-[18px]">Have no account yet?</p>
            <button className="w-full h-[5vh] border border-blue-400 text-blue-400 text-[18px] rounded-xl" onClick={()=> redirect('/signUp')}>Register</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page