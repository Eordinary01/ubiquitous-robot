"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [gymId, setGymId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();

  // Check if the token has expired
  const checkTokenExpiration = (token) => {
    if (!token) return false;

    try {
      const decodeToken = jwt.decode(token);
      const currentTime = Date.now() / 1000;

      return decodeToken && decodeToken.exp > currentTime;
    } catch (error) {
      console.error("Error decoding token: ", error);
      return false;
    }
  };

  // Handle token validation and set user state
  const handleTokenValidation = () => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && checkTokenExpiration(storedToken) && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);

        setToken(storedToken);
        setUser(parsedUser);

        // Assign gymId based on role:
        // - member & gymOwner should have gymId
        // - admin may not have gymId, depending on your requirements
        if (parsedUser.role === "member" || parsedUser.role === "gymOwner") {
          setGymId(parsedUser.gymId);
        } else {
          setGymId(null); // No gymId for admins
        }

        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        logout();
      }
    } else {
      logout();
    }

    setLoading(false);
  };

  useEffect(() => {
    handleTokenValidation();
  }, []);

  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch("http://localhost:8010/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration Failed!!");
      }

      router.push("/login");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch("http://localhost:8010/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login Failed!!");
      }

      const decodedToken = jwt.decode(data.token);
      const userToStore = {
        id: decodedToken.userId,
        name: decodedToken.name,
        email: decodedToken.email,
        token: data.token,
        role: decodedToken.role,
        gymId: decodedToken.role === "member" || decodedToken.role === "gymOwner" ? decodedToken.gymId : null, // Set gymId for member & gymOwner
      };

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(userToStore));

      setToken(data.token);
      setUser(userToStore);

      // Assign gymId based on role:
      if (decodedToken.role === "member" || decodedToken.role === "gymOwner") {
        setGymId(decodedToken.gymId); // Set gymId for member & gymOwner
      } else {
        setGymId(null); // No gymId for admin
      }

      setIsLoggedIn(true);

      router.push("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setToken(null);
    setGymId(null); // Reset gymId on logout
    setIsLoggedIn(false);

    router.push("/login");
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    token,
    gymId,
    loading,
    error,
    isLoggedIn,
    register,
    login,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
