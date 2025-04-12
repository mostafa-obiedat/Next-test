"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "patient",
  });

  const [error, setError] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post("/api/auth/register", formData);
      if (response.status === 201) {
        router.push("/login");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1D1D1D] text-[#FFFFFF]">
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <div className="bg-[#303241] rounded-xl shadow-2xl overflow-hidden">
          {/* Error message */}
          {error && (
            <div className="bg-red-500 bg-opacity-10 border-l-4 border-red-500 p-4">
              <div className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="ml-2 text-sm text-red-400">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="p-8">
            <form className="space-y-8" onSubmit={handleSubmit}>
              <h2 className="text-xl font-semibold text-white mb-6">
                Create an Account
              </h2>

              {/* Name */}
              <div className="space-y-1">
                <label htmlFor="name" className="block text-sm font-medium">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="block w-full px-4 py-3 bg-[#1D1D1D] border border-[#1D1D1D] rounded-lg text-white placeholder-[#C8C8C8] focus:ring-2 focus:ring-[#FCAA29] focus:outline-none"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="block w-full px-4 py-3 bg-[#1D1D1D] border border-[#1D1D1D] rounded-lg text-white placeholder-[#C8C8C8] focus:ring-2 focus:ring-[#FCAA29] focus:outline-none"
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="block w-full px-4 py-3 bg-[#1D1D1D] border border-[#1D1D1D] rounded-lg text-white placeholder-[#C8C8C8] focus:ring-2 focus:ring-[#FCAA29] focus:outline-none"
                />
                <p className="text-xs text-[#C8C8C8] mt-1">
                  Must be at least 8 characters
                </p>
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label htmlFor="phone" className="block text-sm font-medium">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className="block w-full px-4 py-3 bg-[#1D1D1D] border border-[#1D1D1D] rounded-lg text-white placeholder-[#C8C8C8] focus:ring-2 focus:ring-[#FCAA29] focus:outline-none"
                />
              </div>

              {/* Address */}
              <div className="space-y-1">
                <label htmlFor="address" className="block text-sm font-medium">
                  Address
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main St, City"
                  className="block w-full px-4 py-3 bg-[#1D1D1D] border border-[#1D1D1D] rounded-lg text-white placeholder-[#C8C8C8] focus:ring-2 focus:ring-[#FCAA29] focus:outline-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 rounded-lg font-medium text-white bg-gradient-to-r from-[#FC7729] to-[#FCAA29] hover:from-[#FCAA29] hover:to-[#FC7729] focus:ring-2 focus:ring-offset-2 focus:ring-[#FCAA29] transition-all"
              >
                Create Account
              </button>

              <p className="text-sm text-center text-[#C8C8C8] pt-4">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-[#FCAA29] font-medium hover:text-[#FC7729]"
                >
                  Sign in
                </a>
              </p>
            </form>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[#C8C8C8]">
          © 2025 Your Company. All rights reserved.
        </p>
      </div>
    </div>
  );
}
