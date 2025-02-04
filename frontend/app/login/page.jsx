"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [successMesaage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const { email, password } = formData;

  const handleChange = (e) => {
    setError("");
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      await login({
        email: formData.email,
        password: formData.password,
      });

      setSuccessMessage("Login Successfull!!. Redirecting to dashboard..");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 p-6">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-xl border border-indigo-100 p-8">
          {/* Header section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-indigo-500">Sign in to your account</p>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {successMesaage && (
            <p className="text-green-500 text-sm mb-4">{successMesaage}</p>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="relative">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-indigo-900 mb-1 block"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-indigo-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                    className="pl-10 w-full rounded-lg border border-indigo-200 bg-white py-3 px-4 text-indigo-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="relative">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-indigo-900 mb-1 block"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-indigo-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                    id="password"
                    className="pl-10 w-full rounded-lg border border-indigo-200 bg-white py-3 px-4 text-indigo-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-indigo-300 rounded"
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 block text-sm text-gray-950"
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm text-indigo-800 hover:text-indigo-700"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform transition-all duration-150 hover:scale-[1.02]"
            >
              {isLoading ? "Loading..." : "Sign In"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8">
            <p className="text-center text-indigo-600">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-indigo-800 hover:text-indigo-900 font-medium"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
