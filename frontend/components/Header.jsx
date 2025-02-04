"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FiHome, FiUser, FiLogIn, FiMenu, FiX, FiLogOut } from "react-icons/fi";
import { Transition } from "@headlessui/react";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, logout, user } = useAuth();

  return (
    <header className="bg-slate-100 text-gray-900 py-4 shadow-xl relative z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 hover:opacity-90 transition-opacity"
          >
            <span className="text-2xl font-extrabold">FitConnect</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="hover:text-indigo-400 transition-colors duration-200 flex items-center space-x-1"
            >
              <FiHome className="w-5 h-5" />
              <span>Home</span>
            </Link>

            {isLoggedIn && (
              <Link
                href="/dashboard"
                className="hover:text-indigo-400 transition-colors duration-200 flex items-center space-x-1"
              >
                <FiUser className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
            )}

            {!isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  className="text-indigo-900 hover:text-indigo-800 transition-colors duration-200 flex items-center space-x-1"
                >
                  <FiLogIn className="w-5 h-5" />
                  <span>Login</span>
                </Link>

                <Link
                  href="/register"
                  className="bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <span className="font-semibold text-indigo-600">
                  {user?.name}
                </span>

                <button
                  onClick={logout}
                  className="text-red-600 hover:text-red-800 transition-colors duration-200 flex items-center space-x-1"
                >
                  <FiLogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </nav>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="hover:text-indigo-400 transition-colors duration-200"
            >
              {isOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        <Transition
          show={isOpen}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <div className="md:hidden absolute left-0 right-0 top-full bg-white shadow-lg rounded-b-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
              >
                Home
              </Link>

              {isLoggedIn && (
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
                >
                  Dashboard
                </Link>
              )}

              {!isLoggedIn ? (
                <>
                  <Link
                    href="/login"
                    className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    className="block px-3 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition-colors duration-200"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <button
                  onClick={logout}
                  className="block w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-800 transition-colors duration-200"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </Transition>
      </div>
    </header>
  );
}
