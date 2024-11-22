"use client";

import React, { createContext, useContext, ReactNode } from "react";

// Define the User type
export interface User {
  id: string;
  username: string;
  email: string;
}

// Define the shape of the "all" state
interface AllState {
  backlogs: number;
  todos: number;
  inprogress: number;
  done: number;
}

// Extend UserContextType to include "all" and "setAll"
interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  all: AllState;
  setAll: React.Dispatch<React.SetStateAction<AllState>>;
}

// Create the UserContext
export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

// Custom hook to use UserContext
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserContext.Provider");
  }
  return context;
};
