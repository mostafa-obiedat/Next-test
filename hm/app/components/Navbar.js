"use client";
import { useState } from "react";
import Link from "next/link";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-white text-xl font-bold">HMS</h1>
        <button
          className="text-white md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
        <div className={`md:flex md:items-center ${isOpen ? "block" : "hidden"}`}>
          <Link
            href="/"
            className="block md:inline-block text-white px-4 py-2 hover:bg-blue-700"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="block md:inline-block text-white px-4 py-2 hover:bg-blue-700"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="block md:inline-block text-white px-4 py-2 hover:bg-blue-700"
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
