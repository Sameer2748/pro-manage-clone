"use client";

import { cn } from "@/lib/utils";

const BoardCard = ({
  title,
  description,
  id,
  onClick,
}: {
  title: string;
  description: string;
  id: string;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "col-span-12 md:col-span-6 lg:col-span-4 w-full h-[15rem] p-4 flex flex-col justify-center items-center bg-white gap-4 cursor-pointer rounded-lg hover:w-[102%] ",
        "bg-[url(https://images.unsplash.com/photo-1476842634003-7dcca8f832de?auto=format&fit=crop&w=1650&q=80)] bg-cover"
      )}
    >
      <h1 className="text-white font-bold text-[28px]">{title}</h1>
      <p className="text-white text-[13px]">{description}</p>
    </div>
  );
};

export default BoardCard;
