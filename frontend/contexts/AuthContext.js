'use client'
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();

  const checkTokenExpiration = (token) => {
    if (!token) return false;

    try {
      const decodeToken = jwt.decode(token);
      const currentTime = Date.now() / 1000;
      console.log("Decoded Token:", decodeToken);
      console.log(
        "Current Time:",
        currentTime,
        "Token Expiry Time: ",
        decodeToken?.exp
      );

      return decodeToken && decodeToken.exp > currentTime;
    } catch (error) {
      console.error("Error decoding token: ", error);
      return false;
    }
  };

  // token validation

  const handleTokenValidation = () => {
    console.log("Starting token validation...");
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    console.log("Stored Token:", storedToken);
    console.log("Stored User:", storedUser);

    if (storedToken && checkTokenExpiration(storedToken) && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log("Parsed User:", parsedUser);

        setToken(storedToken);
        setUser(parsedUser);
        setIsLoggedIn(true);
        console.log("User is authenticated.");
      } catch (error) {
        console.error("Error parsing stored user:", error);
        logout();
      }
    } else {
      console.warn("Token validation failed or user not found. Logging out...");
      logout();
    }

    setLoading(false);
  };

  useEffect(() => {
    console.log("AuthProvider mounted. Validating token...");
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

      console.log("Registration Successfull. Redirecting to login..", data);

      router.push("/login");
    } catch (error) {
      console.error("Registration Error:", error);

      setError(error.message);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {

        setError(null);
        setLoading(true);


        const response = await fetch("http://localhost:8010/auth/login",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email:credentials.email,
                password:credentials.password
            }),
        });

        const data = await response.json();
        console.log("Login Data:",data);


        if(!response.ok){
            console.error("Login Failed:",data.message);
            throw new Error(data.message || "Login Failed!!");
        }

        localStorage.setItem("token",data.token);

        const decodedToken = jwt.decode(data.token);

        console.log("Decoded Token:",decodedToken);

        const userToStore = {
            id:decodedToken.userId,
            name:decodedToken.name,
            email:decodedToken.email,
            token:data.token,
            role:decodedToken.role
        };

        localStorage.setItem("user",JSON.stringify(userToStore));

        setToken(data.token);
        setUser(userToStore);
        setIsLoggedIn(true);

        console.log("Login Successfull. Redirecting to home..");

        router.push("/");

        
    } catch (error) {
      console.error("Login Catch Error:", error);

      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };


  const logout = ()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    
        setUser(null);
        setToken(null);
        setIsLoggedIn(false);
    
        console.log("Logout Successfull. Redirecting to login..");
    
        router.push("/login");
  };

  const clearError = () => {
    setError(null);
  };

  const value ={
        user,
        token,
        loading,
        error,
        isLoggedIn,
        register,
        login,
        logout,
        clearError
  };


  return (
    <AuthContext.Provider value={value}>
      { children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
