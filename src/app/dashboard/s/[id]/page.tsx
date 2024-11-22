"use client";

import Loading from "@/components/Loading";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

const page = () => {
  const params = useParams();
  const { id } = params;
  const [todo, setTodo] = useState<{}>({});
  const [checkedTask, setCheckedTask] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:3000/api/v1/todo/anyone/${id}`
      );
      setTodo(res.data.todo);
      setCheckedTask(
        res.data.todo.checkList?.filter((task) => task.isDone).length
      );
      setLoading(false);
    };

    fetch();
    const interval = setInterval(fetch, 60000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [id]);
  const formatDate = (date: Date | null) => {
    date = new Date(date);
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return ""; // Return empty string if it's an invalid date
    }

    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options); // Format as "Nov 21"
  };

  return (
    <div className=" flex flex-col  w-full h-screen ">
      <div className=" text-[28px] p-4 pl-6 w-full h-auto bg-gray-500">
        Pro Manage
      </div>
      <div className="w-full h-[80%] flex flex-col justify-center items-center  ">
        {loading ? (
          <div className="w-[360px] md:w-[400px] lg:w-[450px] h-[90%] border border-gray-400 rounded-xl p-4 justify-center items-center animate-pulse">
            <div className="flex items-center gap-2">
              <div className="bg-gray-300 w-[10px] h-[10px] rounded-full"></div>
              <div className="bg-gray-300 h-[16px] w-[100px] rounded"></div>
            </div>

            <div className="bg-gray-300 h-[24px] w-[80%] mt-2 rounded"></div>

            {/* Body Section checklists */}
            <div className="h-auto flex-grow flex flex-col justify-center items-center mt-4">
              <div className="w-full h-[50px] flex justify-between items-center mb-2">
                <div className="bg-gray-300 h-[20px] w-[150px] rounded"></div>
              </div>

              <div className="w-full h-auto flex flex-col m-3 mt-0">
                <div className="flex flex-col gap-3 w-[320px] md:w-[380px] lg:w-[400px] max-w-[400px] max-h-[380px] overflow-hidden">
                  {/* Skeleton checklist items */}
                  {[...Array(4)].map((_, index) => (
                    <div
                      key={index}
                      className="w-full h-auto flex gap-3 border border-gray-300 p-2 rounded-xl"
                    >
                      <div className="bg-gray-300 w-[1rem] h-[1rem] rounded"></div>
                      <div className="bg-gray-300 w-[90%] h-[20px] rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 w-full items-center mt-4">
              <div className="bg-gray-300 h-[20px] w-[80px] rounded"></div>
              <div className="bg-gray-300 w-[100px] h-[30px] rounded-xl"></div>
            </div>
          </div>
        ) : (
          <div className="w-[360px] md:w-[400px] lg:w-[450px] h-[90%] border border-gray-400 rounded-xl p-4 justify-center items-center ">
            <div className="flex items-center gap-2">
              <div className="bg-red-800 w-[10px] h-[10px] rounded-full"></div>
              <p className="text-[14px] text-black cursor-pointer font-semibold ">
                {todo.priority}
              </p>
            </div>
            <h1 className="text-black text-[20px] mt-2">{todo.title}</h1>
            {/* Body Section checklists */}
            <div className="h-auto flex-grow flex flex-col justify-center items-center">
              <div className="w-full h-[50px] flex justify-between items-center rounded mb-2">
                <h1 className="text-black">
                  CheckList ({checkedTask}/{todo?.checkList?.length || 0})
                </h1>
              </div>

              <div className="w-full h-auto rounded flex flex-col m-3 mt-0">
                <div className=" flex flex-col gap-3 w-[320px] md:w-[380px] lg:w-[400px] max-w-[400px] max-h-[380px] overflow-y-scroll ">
                  {todo?.checkList &&
                    todo?.checkList.map(
                      (
                        item: { isDone: boolean; title: string },
                        index: number
                      ) => (
                        <div
                          key={index}
                          className="w-full h-auto flex gap-3 border border-gray-400 p-2 rounded-xl"
                        >
                          <input
                            type="checkbox"
                            className="text-black w-[1rem] h-[1rem] mt-2"
                            checked={item.isDone}
                            readOnly
                          />
                          <p className="text-black w-[90%] break-words">
                            {item.title}
                          </p>
                        </div>
                      )
                    )}
                </div>
              </div>
            </div>

            <div className="flex gap-2 w-full items-center mt-2">
              <p className="text-black text-[20px]">Due Date</p>
              <button className="w-[100px] h-[30px] bg-red-600 text-white rounded-xl ">
                {formatDate(todo.dueDate)}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
