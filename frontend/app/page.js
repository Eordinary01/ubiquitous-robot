"use client";
import React from "react";
import { 
  Users, Dumbbell, MapPin, ChefHat, ClipboardList, 
  BarChart2, BookOpen, HeartPulse, Instagram, Twitter, Facebook 
} from "lucide-react";

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-24 px-4 text-center">
        <div className="container mx-auto">
          <h1 className="text-6xl font-bold mb-6 drop-shadow-lg">FitConnect</h1>
          <p className="text-2xl text-gray-200 max-w-3xl mx-auto mb-10">
            Revolutionizing Fitness Management: Connecting Enthusiasts, Empowering Gym Owners
          </p>
          <div className="space-x-6">
            <button className="bg-white text-indigo-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg">
              Find Gyms
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full text-lg hover:bg-white/20 transition-all duration-300 shadow-lg">
              List Your Gym
            </button>
          </div>
        </div>
      </div>

      {/* Platform Features Detailed */}
      <div className="container mx-auto py-24 px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-indigo-600">How FitConnect Works</h2>
        <div className="grid md:grid-cols-3 gap-12">
          {/* Fitness Enthusiast Features */}
          <div className="bg-white border-2 border-indigo-100 rounded-2xl p-8 shadow-2xl">
            <HeartPulse className="mx-auto mb-6 text-indigo-600" size={64} />
            <h3 className="text-2xl font-bold mb-6 text-black text-center">For Fitness Enthusiasts</h3>
            <ul className="space-y-4 text-gray-700">
              <li>• Personalized fitness profile tracking</li>
              <li>• Comprehensive gym and class directory</li>
              <li>• Diet and nutrition management</li>
              <li>• Progress tracking and analytics</li>
              <li>• Workout and exercise recommendations</li>
            </ul>
          </div>

          {/* Gym Owner Features */}
          <div className="bg-white border-2 border-indigo-100 rounded-2xl p-8 shadow-2xl">
            <BarChart2 className="mx-auto mb-6 text-indigo-600" size={64} />
            <h3 className="text-2xl font-bold mb-6 text-black text-center">For Gym Owners</h3>
            <ul className="space-y-4 text-gray-700">
              <li>• Digital gym management platform</li>
              <li>• Member database and tracking</li>
              <li>• Performance and revenue analytics</li>
              <li>• Automated scheduling and booking</li>
              <li>• Marketing and member acquisition tools</li>
            </ul>
          </div>

          {/* Platform Capabilities */}
          <div className="bg-white border-2 border-indigo-100 rounded-2xl p-8 shadow-2xl">
            <ClipboardList className="mx-auto mb-6 text-indigo-600" size={64} />
            <h3 className="text-2xl font-bold mb-6 text-black text-center">Platform Capabilities</h3>
            <ul className="space-y-4 text-gray-700">
              <li>• Geolocation-based gym discovery</li>
              <li>• Verified and transparent profiles</li>
              <li>• Integrated communication tools</li>
              <li>• Secure payment and membership management</li>
              <li>• Real-time performance insights</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Detailed Service Description */}
      <div className="container mx-auto py-24 px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-indigo-600">Our Ecosystem Connection</h2>
        <div className="grid md:grid-cols-2 gap-12">
          {/* Fitness Enthusiast Card */}
          <div className="bg-white border-2 border-indigo-100 rounded-2xl p-8 shadow-2xl transform transition-all duration-300 hover:-translate-y-4 hover:shadow-4xl">
            <HeartPulse className="mx-auto mb-6 text-indigo-600" size={64} />
            <h3 className="text-2xl font-bold mb-6 text-black text-center">For Fitness Enthusiasts</h3>
            <div className="space-y-4 text-gray-700">
              <p className="text-center">
                Unlock a comprehensive fitness journey with personalized tracking, 
                workout recommendations, and seamless gym connections.
              </p>
              <ul className="list-disc list-inside">
                <li>Personalized fitness profiling</li>
                <li>Workout and diet tracking</li>
                <li>Progress analytics</li>
                <li>Community connections</li>
              </ul>
            </div>
          </div>

          {/* Gym Owner Card */}
          <div className="bg-white border-2 border-indigo-100 rounded-2xl p-8 shadow-2xl transform transition-all duration-300 hover:-translate-y-4 hover:shadow-4xl">
            <BarChart2 className="mx-auto mb-6 text-indigo-600" size={64} />
            <h3 className="text-2xl font-bold mb-6 text-black text-center">For Gym Owners</h3>
            <div className="space-y-4 text-gray-700">
              <p className="text-center">
                Streamline gym management with powerful tools for member tracking, 
                performance insights, and business growth.
              </p>
              <ul className="list-disc list-inside">
                <li>Member management system</li>
                <li>Performance analytics</li>
                <li>Scheduling tools</li>
                <li>Marketing support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 mt-auto">
        {/* Footer content remains the same as previous version */}
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-12">
          <div>
            <h4 className="text-2xl font-bold mb-6">FitConnect</h4>
            <p className="text-gray-400">Connecting fitness enthusiasts with quality gym experiences</p>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><a href="#" className="hover:text-indigo-400">Find Gyms</a></li>
              <li><a href="#" className="hover:text-indigo-400">List Your Gym</a></li>
              <li><a href="#" className="hover:text-indigo-400">About Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-6">Support</h4>
            <ul className="space-y-4">
              <li><a href="#" className="hover:text-indigo-400">Help Center</a></li>
              <li><a href="#" className="hover:text-indigo-400">Contact Support</a></li>
              <li><a href="#" className="hover:text-indigo-400">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-6">Connect With Us</h4>
            <div className="flex space-x-6">
              <Instagram className="text-white hover:text-indigo-400 cursor-pointer" size={32} />
              <Twitter className="text-white hover:text-indigo-400 cursor-pointer" size={32} />
              <Facebook className="text-white hover:text-indigo-400 cursor-pointer" size={32} />
            </div>
          </div>
        </div>
        <div className="text-center text-gray-500 mt-12 border-t border-gray-800 pt-6">
          © 2024 FitConnect. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}