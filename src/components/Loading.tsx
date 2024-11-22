const Loading = () => {
    return (
      <div className="bg-gray-300 w-[95%] auto p-4 rounded-lg shadow-md flex flex-col justify-between relative animate-pulse">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-gray-400 w-[10px] h-[10px] rounded-full"></div>
            <div className="bg-gray-400 w-[50px] h-[10px] rounded"></div>
          </div>
          <div className="bg-gray-400 w-[20px] h-[20px] rounded"></div>
        </div>
        <div className="bg-gray-400 w-[70%] h-[20px] rounded my-4"></div>
        
        {/* Body Section */}
        <div className="h-auto flex-grow flex flex-col justify-center items-center">
          <div className="w-full h-[50px] flex justify-between items-center rounded mb-2">
            <div className="bg-gray-400 w-[150px] h-[10px] rounded"></div>
          </div>
          <div className="w-full h-auto rounded flex flex-col m-3 mt-0 gap-3">
            <div className="bg-gray-400 w-full h-[40px] rounded"></div>
            <div className="bg-gray-400 w-full h-[40px] rounded"></div>
          </div>
        </div>
  
        {/* Footer Section */}
        <div className="flex justify-between items-center">
          <div className="bg-gray-300 w-[50px] h-[20px] rounded"></div>
          <div className="flex gap-2">
            <div className="bg-gray-300 w-[70px] h-[30px] rounded"></div>
            <div className="bg-gray-300 w-[70px] h-[30px] rounded"></div>
            <div className="bg-gray-300 w-[70px] h-[30px] rounded"></div>
          </div>
        </div>
      </div>
    );
  };
  

  export default Loading