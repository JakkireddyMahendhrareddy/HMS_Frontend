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
import axios from "axios";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Create axios instance with default config
  const api = axios.create({
    baseURL: backendUrl,
    timeout: 5000, // 5 second timeout
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const onHandleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validator.isEmail(email)) {
      setErrorMessage("Invalid Email");
      return;
    }
    const userCredentials = { email, password };
    await loginUser(userCredentials);
  };

  const loginUser = async (userCredentials) => {
    let retryCount = 0;
    const maxRetries = 2;

    const attemptLogin = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await api.post('/api/auth/login', userCredentials);
        const { message, jwtToken } = response.data;

        // Set cookie with proper expiration
        Cookies.set("jwtToken", jwtToken, { 
          expires: 0.25, // 6 hours
          secure: true,
          sameSite: 'strict'
        });

        toast.success(message, loginSuccessToastNotificationSettings);
        setEmail("");
        setPassword("");
        navigate("/dashboard");

      } catch (error) {
        if (error.response) {
          // Server responded with error
          const { message } = error.response.data;
          toast.error(message, toastNoficationSettings);
          setErrorMessage(message);
        } else if (error.request) {
          // Request made but no response
          if (retryCount < maxRetries) {
            retryCount++;
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
            return attemptLogin();
          }
          toast.error("Server not responding. Please try again.", toastNoficationSettings);
          setErrorMessage("Connection failed. Please check your internet.");
        } else {
          toast.error("Something went wrong", toastNoficationSettings);
          setErrorMessage("An unexpected error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    await attemptLogin();
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
              disabled={isLoading}
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
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
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
            className={`w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-all duration-200 ${
              isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Logging in...
              </div>
            ) : (
              'Login'
            )}
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
