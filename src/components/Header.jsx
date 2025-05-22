import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [modal, setModal] = useState(false);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <div className="flex justify-between items-center px-4 sm:px-8 md:px-16 lg:px-28 py-3">
        {/* Logo */}
        <Link to="/">
          <div className="text-4xl">🏨</div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex gap-x-10 items-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm tracking-wide text-gray-800 hover:text-blue-500 transition ${
                isActive ? "font-semibold text-blue-600" : ""
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `text-sm tracking-wide text-gray-800 hover:text-blue-500 transition ${
                isActive ? "font-semibold text-blue-600" : ""
              }`
            }
          >
            About
          </NavLink>
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex gap-x-4">
          <Link
            to="contactSection"
            className="text-sm tracking-wide px-4 py-2 rounded border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition"
          >
            Let's Talk
          </Link>
        </div>

        {/* Hamburger Menu - Mobile Only */}
        <button
          className="lg:hidden focus:outline-none"
          onClick={toggleMobileMenu}
        >
          <svg
            className="w-7 h-7 text-gray-700 hover:text-blue-600 transition"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white shadow-md px-6 py-4 space-y-4 text-center animate-slideDown">
          <Link
            to="/"
            className="block text-sm text-gray-800 tracking-wide hover:text-blue-500 transition"
            onClick={() => setMobileOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="block text-sm text-gray-800 tracking-wide hover:text-blue-500 transition"
            onClick={() => setMobileOpen(false)}
          >
            About
          </Link>
          <button
            onClick={() => {
              setModal(true);
              navigate("/auth/login");
              setMobileOpen(false);
            }}
            className="w-full text-sm bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </div>
      )}
    </header>
  );
}
