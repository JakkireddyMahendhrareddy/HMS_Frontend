import { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { backendUrl, toastNoficationSettings } from "../utils/utils.js";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const Registration = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const checkFormValidations = () => {
    const errors = [];
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$!]).{8,}$/;
    const mobileRegex = /^\d{10}$/;

    if (!passwordRegex.test(password)) {
      errors.push(
        "Password must include at least one uppercase, one lowercase, one number, and one special character (@, #, $, !)."
      );
    }
    if (!mobileRegex.test(mobileNumber)) {
      errors.push("Mobile number must be exactly 10 digits.");
    }

    return errors;
  };

  const onHandleLoginBtn = () => {
    navigate("/auth/login");
  };

  const onHandleFormSubmit = (e) => {
    e.preventDefault();
    const errors = checkFormValidations();

    if (errors.length > 0) {
      setErrorMessage(errors.join("\n"));
      return;
    }

    const newUserCredentials = {
      name: fullName,
      email,
      password,
      mobileNumber,
    };

    registerUser(newUserCredentials);
    setErrorMessage("");
    setFullName("");
    setEmail("");
    setPassword("");
    setMobileNumber("");
  };

  const registerUser = async (userCredentials) => {
    try {
      const apiUrl = `${backendUrl}/api/auth/register`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userCredentials),
      });

      const data = await response.json();
      if (response.ok) {
        const { message, jwtToken } = data;
        toast.success(message, toastNoficationSettings);
        Cookies.set("jwtToken", jwtToken, { expires: 0.25 });
        navigate("/dashboard");
      } else {
        toast.error(data.message, toastNoficationSettings);
      }
    } catch (error) {
      toast.warning("Something went wrong", toastNoficationSettings);
    }
  };

  const token = Cookies.get("jwtToken");
  if (token !== undefined) return <Navigate to="/dashboard" replace />;

  return (
    <div className="flex flex-col items-center min-h-screen pt-8 pb-4 bg-gray-100 px-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        Create Account
      </h1>
      <div className="w-full sm:max-w-md lg:max-w-lg bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md">
        <form onSubmit={onHandleFormSubmit}>
          <div className="mb-5">
            <label htmlFor="full-name" className="block font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="full-name"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setErrorMessage("");
              }}
              placeholder="Enter your name"
              required
              className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2 px-1"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="email" className="block font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMessage("");
              }}
              placeholder="Enter your email"
              required
              className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2 px-1"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="mobile" className="block font-medium mb-1">
              Mobile Number
            </label>
            <input
              type="tel"
              id="mobile"
              value={mobileNumber}
              onChange={(e) => {
                setMobileNumber(e.target.value);
                setErrorMessage("");
              }}
              maxLength="10"
              placeholder="Enter 10-digit mobile number"
              required
              className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2 px-1"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="password" className="block font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage("");
                }}
                placeholder="Enter your password"
                required
                className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2 px-1 pr-10"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <IoEyeOutline size={20} />
                ) : (
                  <IoEyeOffOutline size={20} />
                )}
              </button>
            </div>
          </div>

          {errorMessage && (
            <p className="text-sm text-red-600 font-medium mb-4 whitespace-pre-line">
              *{errorMessage}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition-all cursor-pointer"
          >
            Register
          </button>

          <div className="flex items-center my-6">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="mx-3 text-xs text-gray-500">or continue with</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>

          <button
            type="button"
            onClick={onHandleLoginBtn}
            className="w-full border border-blue-500 text-blue-500 hover:bg-blue-50 py-2 rounded-md transition-all cursor-pointer"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
