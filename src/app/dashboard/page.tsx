"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaSignOutAlt } from "react-icons/fa";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { TbDeviceAnalytics } from "react-icons/tb";
import { CiSettings } from "react-icons/ci";
import Boards from "@/components/Boards";
import Settings from "@/components/Settings";
import { RecoilRoot } from "recoil";

import { User,UserContext } from "@/context/userContext";
import axios from "axios";
import Analytics from "@/components/Analytics";
interface TaskCounts {
  backlogs: number;
  todos: number;
  inprogress: number;
  done: number;
}


const Page = () => {
  // Define state to track which component to show
  const [activeComponent, setActiveComponent] = useState<string>("Component1");
  const [user, setUser] = useState<User | null>(null);
  console.log(user);
  const [all, setAll] = useState<TaskCounts>({
    backlogs: 0,
    todos: 0,
    inprogress: 0,
    done: 0,
  });
  
  


  // Components to display based on sidebar link click
  const renderComponent = () => {
    switch (activeComponent) {
      case "Component1":
        return <Boards />;
      case "Component3":
        return <Settings />;
      default:
        return <Component1 />;
    }
  };
 
  useEffect(() => {
    const check = async()=>{
        const token = await localStorage.getItem("token")
        if(!token){
            window.location.href = "/signUp"
        }
        const getuser  = async()=>{
          const token = await localStorage.getItem("token");
          const res = await axios.get("http://localhost:3000/api/v1/user/", {
              headers: {
                  Authorization: token,
              }
          })
          setUser(res.data.user)
      }
      getuser()
    }
    check();
  }, [])
  

  const handleLogout = async()=>{
    await localStorage.removeItem("token")
    window.location.href = "/signUp"
    toast.success("Logged Out successfully")
    setUser(null)
  }

  return (
    <UserContext.Provider value={{ user, setUser,all, setAll }}>
    <div className="flex h-screen bg-slate-900  ">
      {/* Sidebar */}
      <div className="w-[15%] text- flex flex-col  justify-between  border-r-1 border-white">
        <div>
            <div className="w-full h-[10vh] flex justify-center items-center ">
        <h2 className="text-2xl font- text-white text-center">Pro Manage</h2>
            </div>
        <ul className="flex flex-col gap-4">
          <li>
            <button
              className="w-full h-[6vh] hover:bg-gray-600  p-2 rounded text-white text-[18px] flex justify-start pl-[20%] items-center gap-2"
              onClick={() => setActiveComponent("Component1")}
            >
                <MdOutlineSpaceDashboard size={20} color="white" />
              Boards
            </button>
          </li>
         
          <li>
            <button
              className="w-full h-[6vh] hover:bg-gray-600  p-2 rounded text-white text-[18px] flex justify-start pl-[20%] items-center gap-2"
              onClick={() => setActiveComponent("Component3")}
            >
                <CiSettings size={22} color="white" />
              Settings
            </button>
          </li>
        </ul>
        </div>
        <div className="mb-10  w-full flex items-center gap-2 justify-center" onClick={handleLogout}>
            <FaSignOutAlt fontWeight={"light"} color="red"/>
            <button className=" text-red-700 "> Log out</button>
        </div>

      </div>

      {/* Main Content Area */}
      <div className="w-[85%] bg-white-100 overflow-hidden">
      
        <Navbar/>
        {renderComponent()}
      </div>
    </div>
        </UserContext.Provider>
  );
};

const Component1 = () => (
  <div>
    <h1>Component 1</h1>
    <p>This is the content for Component 1.</p>
  </div>
);



export default Page;
