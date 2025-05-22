import { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  backendUrl,
  loginSuccessToastNotificationSettings,
  toastNoficationSettings,
} from "../utils/utils";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import validator from "validator";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const onHandleFormSubmit = (e) => {
    e.preventDefault();
    if (!validator.isEmail(email)) {
      setErrorMessage("Invalid Email");
      return;
    }
    const userCredentials = { email, password };
    loginUser(userCredentials);
    setErrorMessage("");
    setEmail("");
    setPassword("");
  };

  const loginUser = async (userCredentials) => {
    try {
      const apiUrl = `${backendUrl}/api/auth/login`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userCredentials),
      });
      if (response.ok) {
        const { message, jwtToken } = await response.json();
        console.log(jwtToken);
        Cookies.set("jwtToken", jwtToken, { expires: 0.25 }); // 6 hours
        toast.success(message, loginSuccessToastNotificationSettings);
        navigate("/dashboard");
      } else {
        const { message } = await response.json();
        toast.error(message, toastNoficationSettings);
      }
    } catch (error) {
      toast.warning("Something went wrong", toastNoficationSettings);
    }
  };

  const token = Cookies.get("jwtToken");
  if (token) return <Navigate to="/dashboard" replace />;

  return (
    <div className="flex flex-col justify-center items-center min-h-screen px-4 bg-gray-50">
      <h1 className="text-3xl font-semibold mb-6 text-center">Login</h1>
      <div className="w-full max-w-md">
        <form
          className="bg-white shadow-md rounded-lg px-6 py-8 space-y-6"
          onSubmit={onHandleFormSubmit}
        >
          <div>
            <label htmlFor="email" className="block mb-2 font-medium">
              Email
            </label>
            <input
              id="email"
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your Email"
              className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2 px-2 transition-all duration-200"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 font-medium">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your Password"
                className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2 px-2 pr-10 transition-all duration-200"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {!showPassword ? (
                  <IoEyeOffOutline size={20} />
                ) : (
                  <IoEyeOutline size={20} />
                )}
              </button>
            </div>
          </div>

          {errorMessage && (
            <p className="text-red-600 font-semibold text-sm">
              * {errorMessage}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-all duration-200 cursor-pointer"
          >
            Login
          </button>

          <div className="text-sm text-center text-gray-600 space-x-2">
            Don't have an account?{" "}
            <Link
              to="/auth/register"
              className="text-blue-500 underline cursor-pointer"
            >
              Register here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
