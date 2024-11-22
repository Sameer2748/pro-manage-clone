"use client";

import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { toast } from "sonner";
import axios from "axios";
import BoardCard from "./BoardCard";
import BoardDetails from "./BoardDetails.tsx";

const Boards = () => {
  const [boards, setBoards] = useState<any[]>([]);
  const [show, setShow] = useState<boolean>(false);
  const [selectedBoard, setSelectedBoard] = useState<any>(null); // Track selected board

  useEffect(() => {
    const fetchBoards = async () => {
      const token = await localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/api/v1/board/", {
        headers: {
          Authorization: token || "",
        },
      });
      setBoards(res.data);
    };
    fetchBoards();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    try {
      const token = await localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:3000/api/v1/board/create",
        { name: title, description: description },
        { headers: { Authorization: token || "" } }
      );
      toast.success("Board created successfully");
      setShow(false);
      setBoards([...boards, res.data.board]);
    } catch (error) {
      toast.error("Error in creating the board");
    }
  };

  return (
    <div className="mt-4">
      {!selectedBoard ? (
        <>
          <div className="flex justify-between items-center text-white p-4">
            <h1 className="text-white text-[26px]">Boards</h1>
            <button
              onClick={() => setShow(true)}
              className="w-[8vw] h-[5vh] text-white border-2 border-cyan-400 rounded-xl text-[18px] hover:bg-cyan-400 hover:text-white"
            >
              Create
            </button>
          </div>

          {show && (
            <>
              {/* Overlay */}
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-10"
                onClick={() => setShow(false)}
              ></div>

              {/* Modal */}
              <div className="fixed inset-0 flex justify-center items-center z-20">
                <div className="max-w-md w-full rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black relative">
                  {/* Close Icon */}
                  <IoMdClose
                    size={20}
                    color="white"
                    onClick={() => setShow(false)}
                    className="absolute top-4 right-4 cursor-pointer"
                  />

                  {/* Header */}
                  <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
                    Welcome to Pro Manage
                  </h2>
                  <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
                    Create your own board
                  </p>

                  {/* Form */}
                  <form className="my-8" onSubmit={handleSubmit}>
                    <LabelInputContainer className="mb-4">
                      <Label htmlFor="title">Board Title</Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="Board 1"
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-0"
                      />
                    </LabelInputContainer>
                    <LabelInputContainer className="mb-4">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        name="description"
                        placeholder="Enter the Description"
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-0"
                      />
                    </LabelInputContainer>
                    <button
                      className="bg-gradient-to-br mt-6 from-black dark:from-zinc-900 to-neutral-600 w-full text-white rounded-md h-10 font-medium"
                      type="submit"
                    >
                      Create &rarr;
                    </button>
                  </form>
                </div>
              </div>
            </>
          )}

          <div className="w-full h-auto grid grid-cols-12  gap-6 p-4">
            {boards.map((board, index) => (
              <BoardCard
                key={index}
                title={board.name}
                description={board.description}
                id={board._id}
                onClick={() => setSelectedBoard(board)}
              />
            ))}
          </div>
        </>
      ) : (
        <BoardDetails
          board={selectedBoard}
          onBack={() => setSelectedBoard(null)}
        />
      )}
    </div>
  );
};

export default Boards;

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex flex-col space-y-2 w-full", className)}>
    {children}
  </div>
);
