"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import { applyGymTheme } from "@/lib/themeEngine";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [gymId, setGymId] = useState(null);
  const [gymBranding, setGymBranding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();

  // Check if token has expired
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

  const handleTokenValidation = () => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const storedGym = localStorage.getItem("gym");

    if (storedToken && checkTokenExpiration(storedToken) && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        let parsedGym = null;
        if (storedGym) {
          try {
            parsedGym = JSON.parse(storedGym);
          } catch {}
        }

        setToken(storedToken);
        setUser(parsedUser);
        setGymBranding(parsedGym);

        if (parsedUser.role === "member" || parsedUser.role === "gymOwner") {
          setGymId(parsedUser.gymId);
        } else {
          setGymId(null);
        }

        applyGymTheme(parsedGym?.themeColor);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        logout();
      }
    } else {
      logout(false);
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Registration Failed");
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login Failed");
      }

      const decodedToken = jwt.decode(data.token);
      const userToStore = {
        id: decodedToken.userId,
        name: decodedToken.name,
        email: decodedToken.email,
        role: decodedToken.role,
        gymId: decodedToken.gymId || null,
      };

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(userToStore));
      if (data.gym) {
        localStorage.setItem("gym", JSON.stringify(data.gym));
        setGymBranding(data.gym);
        applyGymTheme(data.gym.themeColor);
      } else {
        localStorage.removeItem("gym");
        setGymBranding(null);
        applyGymTheme(null);
      }

      setToken(data.token);
      setUser(userToStore);
      setGymId(decodedToken.gymId || null);
      setIsLoggedIn(true);

      if (decodedToken.role === "gymOwner") {
        router.push("/dashboard");
      } else if (decodedToken.role === "member") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateGymBrandingState = (newBranding) => {
    setGymBranding(newBranding);
    if (newBranding) {
      localStorage.setItem("gym", JSON.stringify(newBranding));
      applyGymTheme(newBranding.themeColor);
    } else {
      localStorage.removeItem("gym");
      applyGymTheme(null);
    }
  };

  const logout = (redirect = true) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("gym");

    setUser(null);
    setToken(null);
    setGymId(null);
    setGymBranding(null);
    setIsLoggedIn(false);
    applyGymTheme(null);

    if (redirect) {
      router.push("/login");
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    token,
    gymId,
    gymBranding,
    updateGymBrandingState,
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
