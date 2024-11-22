import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { toast } from "sonner";
import axios from "axios";
import { useUserContext } from "@/context/userContext";

const Settings = () => {

  const [show, setShow] = useState<boolean>(false);
  const [username, setName] = useState<String>("");
  const [email, setEmail] = useState<String>("");
  const [password, setPassword] = useState<String>("");
  const [agpassword, setAgPassword] = useState<String>("");
  const { user, setUser } = useUserContext();
  

  const handleupdate = async () => {
    try {
      if (agpassword !== password) {
        toast("Password is not Correct");
        return;
      } 
      type RequestBody = {
            username?: String;
            email?: String;
            password?: String;
        };

        // Initialize requestBody with the correct type
        const requestBody: RequestBody = {};
      if (username !== "") requestBody.username = username;
      if (email !== "") requestBody.email = email;
      if (password !== "") requestBody.password = password;


      const res = await axios.post(
        "https://pro-manage-backend-psi.vercel.app/api/v1/user/update",
        requestBody,
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(res.data);
      setUser({id:res.data.user._id,username:res.data.user.username, email:res.data.user.email})
      setName("");
      setEmail("");
      setPassword("");
      setAgPassword("");
      toast("Profile Updated Successfully");

    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col h-[70vh] w-full  gap-4 mt-3 ml-4 justify-center items-center">
      <h1 className="text-white text-[20px]">Settings</h1>
      <div className="w-[400px] flex flex-col gap-4">
        <div className="flex  items-center border border-gray-500 rounded-xl p-3 gap-2">
          <FaUser />
          <input
            onChange={(e) => setName(e.target.value)}
            className="border-none bg-transparent focus:outline-none focus:ring-0 placeholder-gray-500 text-white"
            type="text"
            placeholder="Name"
            value={username}
          />
        </div>
        <div className="flex  items-center border border-gray-500 rounded-xl p-3 gap-2">
          <IoMdMail />
          <input
            onChange={(e) => setEmail(e.target.value)}
            className="border-none bg-transparent focus:outline-none focus:ring-0 placeholder-gray-500 text-white"
            type="email"
            placeholder="Upadte Email"
            value={email}
          />
        </div>
        <div className="flex  items-center border border-gray-500 rounded-xl p-3 gap-2">
          <RiLockPasswordFill />
          <input
            onChange={(e) => setPassword(e.target.value)}
            className="w-[90%] border-none bg-transparent focus:outline-none focus:ring-0 placeholder-gray-500 text-white"
            type={show ? "text" : "password"}
            placeholder="New Password"
            value={password}
          />
          {show ? (
            <FaEye onClick={() => setShow(!show)} />
          ) : (
            <FaEyeSlash onClick={() => setShow(!show)} />
          )}
        </div>
        <div className="flex  items-center border border-gray-500 rounded-xl p-3 gap-2">
          <RiLockPasswordFill />
          <input
            onChange={(e) => setAgPassword(e.target.value)}
            className="w-[90%] border-none bg-transparent focus:outline-none focus:ring-0 placeholder-gray-500 text-white"
            type={show ? "text" : "password"}
            placeholder="New Password"
            value={agpassword}
          />
          {show ? (
            <FaEye onClick={() => setShow(!show)} />
          ) : (
            <FaEyeSlash onClick={() => setShow(!show)} />
          )}
        </div>
      </div>
      <button
  onClick={handleupdate}
  disabled={
    username.trim() === "" &&
    email.trim() === "" &&
    (password.trim() === "" || agpassword.trim() === "")
  }
  className={`w-[400px] h-[5vh] rounded-xl text-white text-[20px] ${
    username.trim() === "" &&
    email.trim() === "" &&
    (password.trim() === "" || agpassword.trim() === "")
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-cyan-400 cursor-pointer"
  }`}
>
  Update
</button>


    </div>
  );
};

export default Settings;
