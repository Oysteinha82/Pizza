"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (user: User, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (
    userData: Partial<User & { currentPassword?: string; newPassword?: string }>
  ) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);

  useEffect(() => {
    // Load registered users from localStorage
    const storedUsers = localStorage.getItem("registeredUsers");
    if (storedUsers) {
      setRegisteredUsers(JSON.parse(storedUsers));
    }

    // Load current user if exists
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const register = async (userData: User, password: string) => {
    // Add user to registered users
    const newUser = { ...userData };
    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);
    localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));

    // Log in the new user
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem("currentUser", JSON.stringify(newUser));
  };

  const login = async (email: string, password: string) => {
    // Check if user exists in registered users
    const storedUsers = localStorage.getItem("registeredUsers");
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const foundUser = users.find((u: User) => u.email === email);

      if (foundUser) {
        setUser(foundUser);
        setIsAuthenticated(true);
        localStorage.setItem("currentUser", JSON.stringify(foundUser));
        return;
      }
    }

    throw new Error("Invalid email or password");
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("currentUser");
  };

  const updateUser = async (
    userData: Partial<User & { currentPassword?: string; newPassword?: string }>
  ) => {
    if (!user) return;

    const { currentPassword, newPassword, ...userDataWithoutPassword } =
      userData;
    const updatedUser = {
      ...user,
      ...userDataWithoutPassword,
    };

    // Update user in current session
    setUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    // Update user in registered users list
    const updatedUsers = registeredUsers.map((u) =>
      u.email === updatedUser.email ? updatedUser : u
    );
    setRegisteredUsers(updatedUsers);
    localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));
  };

  const deleteAccount = async () => {
    if (!user) return;

    // Remove user from registered users
    const updatedUsers = registeredUsers.filter((u) => u.email !== user.email);
    setRegisteredUsers(updatedUsers);
    localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));

    // Clear current user
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("orders");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        register,
        logout,
        updateUser,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
