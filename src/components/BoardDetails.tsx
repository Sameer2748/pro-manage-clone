import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import { useState, useEffect, Suspense } from "react";
import { VscCollapseAll } from "react-icons/vsc";
import axios from "axios";
import { IoMdAdd } from "react-icons/io";
import { IoMdRemove } from "react-icons/io";
import { cn } from "@/lib/utils";
import { IoMdClose } from "react-icons/io";
import { toast } from "sonner";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { IoTrashBinSharp } from "react-icons/io5";
import BacklogsCard from "./BacklogsCard";
import TodoCard from "./TodoCard";
import InProgressCard from "./InProgressCard";
import DoneCard from "./DoneCard";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const BoardDetails = ({
  board,
  onBack,
}: {
  board: any;
  onBack: () => void;
}) => {
  const currboard = board;
  const [todos, setTodos] = useState<[{}]>([{}]);
  const [backlogs, setBacklogs] = useState<[{}]>([{}]);
  const [inProgress, setInProgress] = useState<[{}]>([{}]);
  const [done, setDone] = useState<[{}]>([{}]);
  const [createTodo, setCreateTodo] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [priority, setPriority] = useState<string>("");
  const [colltodo, setCollTodo] = useState<boolean>(false);
  const [collbacklog, setCollBacklog] = useState<boolean>(false);
  const [collinprogress, setCollInProgress] = useState<boolean>(false);
  const [colldone, setCollDone] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // State for selected date
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false); // State to control visibility of date picker

  // Function to modify the selected date (e.g., adding days, changing month)
 

  // Handle date change
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date); // Set the date without modifying it
    setIsDatePickerOpen(false); // Close the date picker after selecting the date
  };

  // Toggle date picker visibility
  const toggleDatePicker = () => {
    setIsDatePickerOpen(!isDatePickerOpen);
  };

  // Format the date for display (e.g., "Feb 12")
  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options); // Format as "Feb 12"
  };

  const [checklist, setChecklist] = useState([{}]);

  const handleAddItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setChecklist([...checklist, { id: Date.now(), title: "", isDone: false }]);
  };

  const handleRemoveItem = (id: number) => {
    setChecklist(checklist.filter((item) => item.id !== id));
  };

  const handleInputChange = (id: number, value: string) => {
    setChecklist(
      checklist.map((item) =>
        item.id === id ? { ...item, title: value } : item
      )
    );
  };

  const handleCheckboxChange = (id: number) => {
    setChecklist(
      checklist.map((item) =>
        item.id === id ? { ...item, isDone: !item.isDone } : item
      )
    );
  };

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const token = await localStorage.getItem("token");
      console.log(token, board._id);

      const res = await axios.post(
        `https://pro-manage-backend-psi.vercel.app/api/v1/todo/`,
        { boardId: board._id },
        { headers: { Authorization: token || "" } }
      );
      console.log(res.data.todos);

      const alltodos = res.data.todos;
      // filter them
      const todo = alltodos.filter((intodo: any) => intodo.todo === true);
      console.log(todo);
      setTodos(todo);
      const backlogs = await alltodos.filter(
        (intodo: any) => intodo.backlog === true
      );
      setBacklogs(backlogs);
      console.log(backlogs);
      const inprogress = await alltodos.filter(
        (intodo: any) => intodo.inProgress === true
      );
      setInProgress(inprogress);
      console.log(inprogress);
      const done = await alltodos.filter((intodo: any) => intodo.done === true);

      await new Promise((r) => setTimeout(r, 1000));
      setDone(done);
      setLoading(false);
      console.log(done);
    };
    fetch();
  }, [currboard._id]);
  const handleCreateTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const token = await localStorage.getItem("token");
      const res = await axios.post(
        "https://pro-manage-backend-psi.vercel.app/api/v1/todo/create",
        {
          title: title,
          priority: priority,
          checkList: checklist,
          boardId: board._id,
          dueDate: selectedDate,
        },
        { headers: { Authorization: token || "" } }
      );
      console.log(res.data);
      toast.success("Todo created successfully");
      setTodos([...todos, res.data.todo]);
      setCreateTodo(false);
    } catch (error) {
      toast.error("Error in creating the board");
      setCreateTodo(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    try {
      const token = await localStorage.getItem("token");
      await axios.post(
        "https://pro-manage-backend-psi.vercel.app/api/v1/board/create",
        { name: title, description: description },
        { headers: { Authorization: token || "" } }
      );
      toast.success("Board created successfully");
      setCreateTodo(false);
    } catch (error) {
      toast.error("Error in creating the board");
      setCreateTodo(false);
    }
  };

  const handleChange = async (
    id: string,
    to: string,
    from: string,
    key: number
  ) => {
    // Define a map to dynamically access state setters and their respective lists
    const listMap = {
      backlog: { list: backlogs, setter: setBacklogs },
      todo: { list: todos, setter: setTodos },
      inProgress: { list: inProgress, setter: setInProgress },
      done: { list: done, setter: setDone },
    };

    // Get the source and target lists and their setters
    const fromList = listMap[from]?.list || [];
    const fromSetter = listMap[from]?.setter;

    const toList = listMap[to]?.list || [];
    const toSetter = listMap[to]?.setter;

    if (fromSetter && toSetter) {
      // Find the item by key or id in the from list
      const itemToMove = fromList.find((_, index) => index === key);

      if (itemToMove) {
        // Remove item from source list
        fromSetter(fromList.filter((_, index) => index !== key));

        // Add the item to the target list
        toSetter([...toList, itemToMove]);

        console.log(`${to} added`);
      } else {
        console.log(`Item with key ${key} not found in ${from}`);
      }
    } else {
      console.log(`Invalid from or to list specified`);
    }
    let newStatus = {
      backlog: false,
      todo: false,
      inProgress: false,
      done: false,
    };

    if (to === "backlog") {
      newStatus.backlog = true;
    } else if (to === "todo") {
      newStatus.todo = true;
    } else if (to === "inProgress") {
      newStatus.inProgress = true;
    } else if (to === "done") {
      newStatus.done = true;
    }

    try {
      const res = await axios.post(
        `https://pro-manage-backend-psi.vercel.app/api/v1/todo/updatetodo/${id}`,
        newStatus,
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`, // Include token for auth
          },
        }
      );
      console.log(res.data);

      toast("updated");
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemove = (id: number, type: string) => {
    try {
      switch (type) {
        case "todo":
          setTodos((prevTodos) => {
            const updatedTodos = [...prevTodos]; // Create a copy to avoid mutating state directly
            updatedTodos.splice(id, 1); // Remove 1 item at the specified index
            return updatedTodos;
          });
          break;

        case "backlog":
          setBacklogs((prevTodos) => {
            const updatedtodos = [...prevTodos];
            updatedtodos.splice(id, 1);
            return updatedtodos;
          });
          break;
        case "inProgress":
          setInProgress((prevTodos) => {
            const updatedtodos = [...prevTodos];
            updatedtodos.splice(id, 1);
            return updatedtodos;
          });
          break;
        case "done":
          setDone((prevTodos) => {
            const updatedtodos = [...prevTodos];
            updatedtodos.splice(id, 1);
            return updatedtodos;
          });
          break;

        default:
          break;
      }
    } catch (error) {
      toast("error in removing the todo try again");
    }
  };

  return (
    <div className="w-auto p-4">
      {/* Header */}
      <div className="w-full flex gap-4 items-center">
        <button onClick={onBack} className="text-blue-500 py-auto">
          <FaRegArrowAltCircleLeft size={20} />
        </button>
        <h2 className="text-3xl font-bold">{board.name}</h2>
      </div>

      {/* Create Todo Modal */}
      {createTodo && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10"
            onClick={() => setCreateTodo(false)}
          ></div>

          {/* Popup */}
          <div className="fixed inset-0 flex items-center justify-center z-20">
            <div className=" w-[40rem] max-h-[80%] h-[70%]  items-center rounded-none md:rounded-2xl  pl-5 pr-5 pb-4  shadow-input bg-white dark:bg-black">
              <form className="my-8" onSubmit={handleCreateTodo}>
                {isDatePickerOpen && (
                 <div className="absolute z-10 mt-2 bottom-[11.5rem]">
                 <DatePicker
                   selected={selectedDate}
                   onChange={handleDateChange} // Handle date change without modifying the date
                   inline // Show the calendar inline
                 />
               </div>
                )}
                <LabelInputContainer className="mb-4">
                  <Label htmlFor="title" className="text-[20px]">
                    Todo Title
                  </Label>
                  <Input
                    id="title"
                    onChange={(e) => setTitle(e.target.value)}
                    name="title"
                    placeholder="Todo 1"
                  />
                </LabelInputContainer>
                <LabelInputContainer className="flex flex-row items-center gap-2">
                  <Label
                    htmlFor="description"
                    className="text-center pt-1 pr-2 flex items-center gap-1"
                  >
                    Select priority{" "}
                    <label className="text-red-800 text-[20px] pt-1">*</label>
                  </Label>

                  <div
                    onClick={() => setPriority("High Priority")}
                    className={`w-[8rem] flex border gap-2 justify-center items-center rounded-lg p-1 cursor-pointer ${
                      priority === "High Priority"
                        ? "border-white"
                        : "border-gray-800"
                    }`}
                  >
                    <div className="bg-red-800 w-[10px] h-[10px] rounded-full"></div>
                    <p className="text-[12px] cursor-pointer">HIGH PRIORITY</p>
                  </div>

                  <div
                    onClick={() => setPriority("Medium Priority")}
                    className={`w-[9rem] flex border gap-2 justify-center items-center rounded-lg p-1 cursor-pointer ${
                      priority === "Medium Priority"
                        ? "border-white"
                        : "border-gray-800"
                    }`}
                  >
                    <div className="bg-cyan-500 w-[10px] h-[10px] rounded-full"></div>
                    <p className="text-[12px] cursor-pointer">
                      MEDIUM PRIORITY
                    </p>
                  </div>

                  <div
                    onClick={() => setPriority("Low Priority")}
                    className={`w-[8rem] flex border gap-2 justify-center items-center rounded-lg p-1 cursor-pointer ${
                      priority === "Low Priority"
                        ? "border-white"
                        : "border-gray-800"
                    }`}
                  >
                    <div className="bg-green-800 w-[10px] h-[10px] rounded-full"></div>
                    <p className="text-[12px] cursor-pointer">LOW PRIORITY</p>
                  </div>
                </LabelInputContainer>

                {/* checklist  */}
                <div className=" mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold">
                      Checklist {checklist.filter((item) => item.isDone).length}
                      /{checklist.length}
                    </h4>
                    <div className="flex  items-center pt-2">
                      <IoMdAdd />
                      <button
                        className="pl-2  text-white rounded"
                        onClick={handleAddItem}
                      >
                        Add New
                      </button>
                    </div>
                  </div>

                  <div className="w-full h-[33vh] overflow-y-auto">
                    {checklist.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center mb-2 border border-gray-300 rounded-lg p-3 pt-1 pb-1"
                      >
                        <input
                          type="checkbox"
                          checked={item.isDone}
                          onChange={() => handleCheckboxChange(item.id)}
                          className="mr-2 w-5 h-5 rounded-xl"
                        />
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) =>
                            handleInputChange(item.id, e.target.value)
                          }
                          className="w-full h-[35px] p-2 border border-gray-300 rounded-xl text-white focus:outline-none focus:ring-0 border-none bg-transparent"
                          placeholder="Task name"
                        />
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="ml-2 text-red-500"
                        >
                          <IoTrashBinSharp size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-full flex justify-between items-center ">
                  <button
                    className="w-[30%] border border-gray-500 bg-gradient-to-br p-2 mt-5 relative group/btn from-black dark:from-zinc-900 to-neutral-600 block text-white rounded-md h-10 font-medium"
                    type="button"
                    onClick={toggleDatePicker}
                  >
                    {selectedDate
                      ? `${formatDate(selectedDate)}`
                      : "Select Due Date"}
                  </button>

                  <div className="w-[50%] flex justify-betweem items-center gap-3 ">
                    <button
                      className=" w-[45%] border border-red-500 bg-gradient-to-br mt-5 relative group/btn from-black dark:from-zinc-900 to-neutral-600 block  text-white rounded-md h-10 font-medium"
                      onClick={() => setCreateTodo(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className=" w-[45%] border border-cyan-500 bg-gradient-to-br mt-5 relative group/btn from-black dark:from-zinc-900 to-neutral-600 block  text-white rounded-md h-10 font-medium"
                      type="submit"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Board Columns */}
      <div className="w-full flex overflow-x-auto p-4 no-scrollbar">
        <div className="w-max h-full flex gap-6">
          {/* Backlog */}
          <div
            className={`${
              collbacklog ? "h-[6vh]" : "h-[81vh]"
            } w-[25rem]  bg-slate-200 p-3 rounded-lg flex-shrink-0 overflow-y-auto`}
          >
            <div className="flex justify-between items-center mb-3">
              <h1 className="text-black font-bold text-[17px]">Backlog</h1>
              <VscCollapseAll
                className="cursor-pointer"
                color="gray"
                size={20}
                onClick={() => setCollBacklog(!collbacklog)}
              />
            </div>

            {/* Scrollable container with fixed height */}
            <div className="flex flex-col gap-3 overflow-y-scroll h-full">
              {backlogs.map((backlog, index) => (
                <BacklogsCard
                  key={index}
                  todo={backlog}
                  handleChange={handleChange}
                  handleRemove={handleRemove}
                  itemKey={index}
                  loading={loading}
                />
              ))}
            </div>
          </div>

          {/* Todo */}
          <div
            className={`${
              colltodo ? "h-[6vh]" : "h-[81vh]"
            } w-[25rem]  bg-slate-200 p-3 rounded-lg flex-shrink-0 overflow-y-auto`}
          >
            <div className="flex justify-between items-center mb-3">
              <h1 className="text-black font-bold text-[17px]">To do</h1>
              <div className="flex gap-2">
                <IoMdAdd
                  className="cursor-pointer"
                  onClick={() => setCreateTodo(true)}
                  color="gray"
                  size={20}
                />
                <VscCollapseAll
                  className="cursor-pointer"
                  color="gray"
                  size={20}
                  onClick={() => setCollTodo(!colltodo)}
                />
              </div>
            </div>
            {/* Scrollable container with fixed height */}
            <div className="flex flex-col gap-3 overflow-y-scroll h-full">
              {todos.map((todo, index) => (
                <TodoCard
                  key={index}
                  todo={todo}
                  handleChange={handleChange}
                  handleRemove={handleRemove}
                  itemKey={index} // Pass index explicitly as a prop
                  loading={loading}
                />
              ))}
            </div>
          </div>

          {/* In Process */}
          <div
            className={`${
              collinprogress ? "h-[6vh]" : "h-[81vh]"
            } w-[25rem]  bg-slate-200 p-3 rounded-lg flex-shrink-0 overflow-y-auto`}
          >
            <div className="flex justify-between items-center mb-3">
              <h1 className="text-black font-bold text-[17px]">In Process</h1>
              <VscCollapseAll
                className="cursor-pointer"
                color="gray"
                size={20}
                onClick={() => setCollInProgress(!collinprogress)}
              />
            </div>
            {/* Scrollable container with fixed height */}
            <div className="flex flex-col gap-3 overflow-y-scroll h-full">
              {inProgress.map((inprog, index) => (
                <InProgressCard
                  key={index}
                  todo={inprog}
                  handleChange={handleChange}
                  handleRemove={handleRemove}
                  itemKey={index}
                  loading={loading}
                />
              ))}
            </div>
          </div>

          {/* Done */}
          <div
            className={`${
              colldone ? "h-[6vh]" : "h-[81vh]"
            } w-[25rem]  bg-slate-200 p-3 rounded-lg flex-shrink-0 overflow-y-auto`}
          >
            <div className="flex justify-between items-center mb-3">
              <h1 className="text-black font-bold text-[17px]">Done</h1>
              <VscCollapseAll
                className="cursor-pointer"
                color="gray"
                size={20}
                onClick={() => setCollDone(!colldone)}
              />
            </div>
            {/* Scrollable container with fixed height */}
            <div className="flex flex-col gap-3 overflow-y-scroll h-full">
              {done.map((done, index) => (
                <DoneCard
                  key={index}
                  todo={done}
                  handleChange={handleChange}
                  handleRemove={handleRemove}
                  itemKey={index}
                  loading={loading}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardDetails;

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
