import {  useUserContext } from '@/context/userContext';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const Navbar = () => {
    const [name, setName] = useState<String>("");
    const [date, setDate] = useState<String>("")

    const { user, setUser } = useUserContext();

    


    const currentDate = new Date().toLocaleDateString();
    const month= [
        'Jan', 'Feb', 'Mar',
        'Apr', 'May', 'June',
        'July', 'Aug', 'Sept',
        'Oct', 'Nov', 'Dec'
    ]

    useEffect(() => {
        const getuser  = async()=>{
            const token = await localStorage.getItem("token");
            const res = await axios.get("http://localhost:3000/api/v1/user/", {
                headers: {
                    Authorization: token,
                }
            })
            setName(res.data.user.username)

        }
        const newDate = new Date()
        const day = newDate.getDate();
        const mont = newDate.getMonth()
        const year = newDate.getFullYear()
        setDate(`${day}th ${month[mont]}, ${year}`)
        getuser()
    }, [])


    
  return (
    <div className='flex justify-between items-center w-full h-[10vh] bg-slate-900 p-2 border-b-2 border-white'>
        <h1 style={{ fontFamily: 'Doto' }} className='text-white  text-[22px]'>welcome! <span className='font-bold'>{user?.username}</span></h1>
        <p className='text-white font-semibold text-[17px]'>{date}</p>
    </div>
  )
}

export default Navbar