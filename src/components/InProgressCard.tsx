import axios from "axios";
import React, { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { BsArrowUpSquareFill } from "react-icons/bs";
import { BsArrowDownSquareFill } from "react-icons/bs";
import { toast } from "sonner";
import Loading from "./Loading";

const InProgressCard =({ 
  todo,
  handleChange,
  handleRemove,
  itemKey,
  loading
}: {
  todo: any;
  handleChange: (id: string, to: string, from: string, key: number) => void;
  handleRemove:(id:number, type:string) => void;
  itemKey: number; // Correctly typed the prop
  loading: boolean; // Correctly typed the prop
})=> {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [checkList, setCheckList] = useState(todo.checkList || []);
  const [edit, setEdit] = useState<boolean>();
  const [copied, setCopied] = useState<boolean>(false);

  const [checkedTask, setCheckedTask] = useState<number>(0)

  
  useEffect(() => {
    setCheckList(todo.checkList || []);
    setCheckedTask(
      todo?.checkList?.filter((task) => task.isDone).length
    );
  }, [todo]);

  // Handle checkbox change
  const handleCheckboxChange = async (index:number) => {
    const updatedCheckList = [...checkList];
    updatedCheckList[index].isDone = !updatedCheckList[index].isDone;

    setCheckList(updatedCheckList);

    // Call API to update checklist on backend
    try {
      setCheckedTask(updatedCheckList.filter(todo=> todo.isDone).length);
      const response = await axios.post(`https://pro-manage-backend-psi.vercel.app/api/v1/todo/update/${todo._id}`, {
        checkId: updatedCheckList[index]._id,
      }, {
        headers: {
          Authorization: `${localStorage.getItem('token')}`, // Include token for auth
        },
      });

      console.log('Checklist updated:', response.data);
    } catch (error:any) {
      console.error('Error updating checklist:', error.response?.data || error.message);
    }
  };

  

const toggleCollapse = () => {
  setIsCollapsed(!isCollapsed);
};
const handleDelete = async()=>{
  try {
    const response = await axios.delete(
      `https://pro-manage-backend-psi.vercel.app/api/v1/todo/delete/${todo._id}`,
      {
        headers: {
          Authorization: `${localStorage.getItem("token")}`, // Include token for auth
        },
      }
    );
    handleRemove(itemKey, 'inProgress'); // Update the parent component's state to remove the deleted todo
    setEdit(false); // Close the card when deleted
    console.log("Todo deleted:", response.data);
    toast("Todo Deleted")
  } catch (error: any) {
    console.error(
      "Error deleting todo:",
      error.response?.data || error.message
    );
  }
}
const handleCopy = ()=>{
  navigator.clipboard.writeText(`http://localhost:3001/dashboard/s/${todo._id}`);
  setCopied(true);
  setEdit(false)
  setTimeout(() => setCopied(false), 2000);
}
if (loading) {
  return <Loading />;
}
return (
  <div className="bg-white w-[95%] auto p-4 rounded-lg shadow-md flex flex-col justify-between relative">
     {
        copied && (
          <div className="fixed top-5 right-2 bg-white shadow-lg border border-gray-300 rounded-lg w-[200px] p-3 z-10">
            Link Copied!
          </div>
        )
      }
    {/* Header Section */}
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="bg-red-800 w-[10px] h-[10px] rounded-full"></div>
        <p className="text-[9px] text-black cursor-pointer font-semibold">
          {todo.priority}
        </p>
      </div>
      <BsThreeDots className="cursor-pointer" color="black" size={20} onClick={()=> setEdit(!edit)} />
    </div>
    <h1 className="text-[20px] text-black">{todo?.title}</h1>
    {edit && (
  <div className="absolute top-9 right-2 bg-white shadow-lg border border-gray-300 rounded-lg w-[150px] p-3 z-10 flex flex-col gap-3">
          {/* <p className="text-black cursor-pointer">Edit</p> */}
          <p className="text-black cursor-pointer"  onClick={handleCopy}>Share</p>
          <p className="text-red-600 cursor-pointer" onClick={handleDelete}>Delete</p>
        </div>
      )}
    {/* Body Section checklists */}
    <div className="h-auto flex-grow flex flex-col justify-center items-center">
    <div className="w-full h-[50px] flex justify-between items-center rounded mb-2">
      <h1 className="text-black">CheckList ({checkedTask}/{todo?.checkList?.length || 0})</h1>
      <div className="gap-3 flex">
        {!isCollapsed ? (
          <BsArrowUpSquareFill
            className="cursor-pointer"
            color="gray"
            size={26}
            onClick={toggleCollapse}
          />
        ) : (
          <BsArrowDownSquareFill
            className="cursor-pointer"
            color="gray"
            size={26}
            onClick={toggleCollapse}
          />
        )}
      </div>
    </div>

    {!isCollapsed && (
       <div className="w-full h-auto rounded flex flex-col m-3 mt-0">
            <div className=" flex flex-col gap-3">
    {checkList && checkList.map((item:{isDone:boolean, title:string}, index:number) => (
      <div key={index} className="w-full h-auto flex gap-3 border border-gray-400 p-2 rounded-xl">
        <input
          type="checkbox"
          className="text-black w-[1rem] h-[1rem] mt-2"
          checked={item.isDone}
          onChange={() => handleCheckboxChange(index)}
        />
        <p className="text-black w-[90%] break-words">{item.title}</p>
      </div>
    ))}
  </div>
      </div>
    )}
  </div>

    {/* Footer Section */}
    <div className="flex justify-between items-center">
      <button className="bg-red-700 text-white px-3 py-1 rounded">
        Feb 10th
      </button>
      <div className="flex gap-2">
        <button className="bg-gray-300 text-[14px] text-gray-800 px-2 py-1 rounded" onClick={()=> handleChange(todo?._id, "backlog","inProgress",itemKey)}>Backlog</button>
        <button className="bg-gray-300 text-[14px] text-gray-800 px-2 py-1 rounded" onClick={()=> handleChange(todo?._id, "todo","inProgress",itemKey)}>Todo</button>
        <button className="bg-gray-300 text-[14px] text-gray-800 px-2 py-1 rounded" onClick={()=> handleChange(todo?._id, "done","inProgress",itemKey)}>Done</button>
      </div>
    </div>
  </div>
  );
};

export default InProgressCard;
