import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useState, useEffect, useCallback } from "react";
import {
  backendUrl,
  logoutToastNotificationSettings,
  toastNoficationSettings,
} from "../utils/utils";
import Profile from "./Profile";
import { Tooltip as ReactTooltip } from "react-tooltip";
import axios from "axios";

// Create axios instance with default config
const api = axios.create({
  baseURL: backendUrl,
  timeout: 5000, // 5 second timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add token
api.interceptors.request.use((config) => {
  const token = Cookies.get('jwtToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('jwtToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const Topbar = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [lastUploadedFileName, setLastUploadedFileName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Cache profile data in memory
  const profileCache = {
    data: null,
    timestamp: null,
    maxAge: 5 * 60 * 1000 // 5 minutes
  };

  const getProfileData = useCallback(async (forceRefresh = false) => {
    try {
      setIsLoading(true);

      // Check cache if not forcing refresh
      if (!forceRefresh && 
          profileCache.data && 
          profileCache.timestamp && 
          (Date.now() - profileCache.timestamp < profileCache.maxAge)) {
        setProfileData(profileCache.data);
        return;
      }

      const response = await api.get('/api/user/view-profile', {
        withCredentials: true
      });

      const { profileInfo } = response.data;
      
      // Update cache
      profileCache.data = profileInfo;
      profileCache.timestamp = Date.now();
      
      setProfileData(profileInfo);
    } catch (error) {
      console.error('Profile fetch error:', error);
      if (error.response) {
        toast.error(error.response.data.message || "Failed to load profile", toastNoficationSettings);
      } else if (error.request) {
        toast.error("Network error. Please check your connection.", toastNoficationSettings);
      } else {
        toast.error("An unexpected error occurred", toastNoficationSettings);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getProfileData();
  }, [getProfileData]);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.name === lastUploadedFileName) {
      toast.info("This image is already uploaded.", toastNoficationSettings);
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    updateUserImage(formData);
    setLastUploadedFileName(file.name);
  };

  const updateUserImage = async (formData) => {
    const loadingToastId = toast.loading("Updating profile picture...");
    try {
      const response = await api.patch('/api/user/edit-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true,
        timeout: 10000 // 10 second timeout for file upload
      });

      if (response.data) {
        await getProfileData(true); // Force refresh profile data
        toast.success("Profile picture updated successfully", toastNoficationSettings);
      }
    } catch (error) {
      console.error("Profile Upload Error:", error);
      if (error.response) {
        toast.error(error.response.data.message || "Upload failed", toastNoficationSettings);
      } else if (error.request) {
        toast.error("Network error. Please check your connection.", toastNoficationSettings);
      } else {
        toast.error("An unexpected error occurred", toastNoficationSettings);
      }
    } finally {
      toast.dismiss(loadingToastId);
    }
  };

  const handleLogout = () => {
    Cookies.remove("jwtToken");
    // Clear profile cache on logout
    profileCache.data = null;
    profileCache.timestamp = null;
    navigate("/");
    toast.success("Logout Successful", logoutToastNotificationSettings);
  };

  return (
    <div className="h-16 z-10 w-full">
      <div className="h-16 z-10 flex w-full justify-between items-center bg-white p-2 sm:p-4 shadow-md">
        {/* Welcome Message - Responsive */}
        {profileData !== null ? (
          <div className="flex flex-col max-w-full overflow-hidden">
            <h1 className="text-sm sm:text-lg md:text-xl font-medium text-gray-600 flex items-center flex-wrap gap-1">
              <span className="whitespace-nowrap">Welcome back,</span>
              <span className="text-blue-500 font-semibold truncate">
                {profileData?.name}
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-blue-600 mt-0 sm:mt-1  hidden sm:block tracking-wide">
              Hope your rooms are filling fast today 🙂!
            </p>
          </div>
        ) : (
          <div className="flex flex-col max-w-full overflow-hidden">
            <h1 className="text-sm sm:text-lg md:text-xl font-medium text-gray-600">
              Welcome back, Guest
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-0 sm:mt-1 italic hidden sm:block">
              Hope your rooms are filling fast today!
            </p>
          </div>
        )}

        {/* Icons Section - Responsive */}
        <div className="flex items-center gap-x-3 sm:gap-x-4 md:gap-x-8 px-2 sm:px-4 md:px-8">
          {/* Profile Icon */}
          <button
            className="text-blue-500 text-xl sm:text-2xl rounded-lg hover:scale-110 transition-transform duration-150 cursor-pointer"
            onClick={() => setShowProfileModal(true)}
            data-tooltip-id="profile-tooltip"
            data-tooltip-content="View Profile"
            disabled={isLoading}
          >
            <FaUserCircle />
          </button>
          <ReactTooltip
            id="profile-tooltip"
            place="bottom"
            effect="solid"
            positionStrategy="fixed"
          />
          {/* Logout Button */}
          <button
            className="text-blue-500 text-lg sm:text-xl rounded-lg hover:scale-110 transition-transform duration-150 cursor-pointer"
            onClick={handleLogout}
            data-tooltip-id="logout-tooltip"
            data-tooltip-content="Logout"
          >
            <FaSignOutAlt />
          </button>

          <ReactTooltip
            id="logout-tooltip"
            place="top"
            effect="solid"
            positionStrategy="fixed"
          />
        </div>
      </div>
      {showProfileModal && (
        <Profile
          setShowProfileModal={setShowProfileModal}
          profileData={profileData}
          handleProfilePicChange={handleProfilePicChange}
        />
      )}
    </div>
  );
};

export default Topbar;
