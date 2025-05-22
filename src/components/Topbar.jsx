import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import {
  backendUrl,
  logoutToastNotificationSettings,
  toastNoficationSettings,
} from "../utils/utils";
import Profile from "./Profile";
import { Tooltip as ReactTooltip } from "react-tooltip";

const Topbar = () => {
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [lastUploadedFileName, setLastUploadedFileName] = useState(null);

  const getProfileData = async () => {
    try {
      const apiUrl = `${backendUrl}/api/user/view-profile`;
      const options = {
        method: "GET",
        credentials: "include",
      };
      const response = await fetch(apiUrl, options);
      if (response.ok) {
        const data = await response.json();
        const { profileInfo } = data;
        setProfileData(profileInfo);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    getProfileData();
  }, []);

  // const handleProfilePicChange = (e) => {
  //   const file = e.target.files[0];

  //   if (!file) return;

  //   // Prevent re-uploading same file
  //   if (file.name === lastUploadedFileName) {
  //     toast.info("This image is already uploaded.", toastNoficationSettings);
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append("avatar", file);

  //   updateUserImage(formData);
  //   setLastUploadedFileName(file.name); // Save current file name
  // };

  // const updateUserImage = async (formData) => {
  //   try {
  //     // Show a loading toast and store its id
  //     const loadingToastId = toast.loading("Updating profile picture...");

  //     const response = await fetch(`${backendUrl}/api/user/edit-profile`, {
  //       method: "PATCH",
  //       credentials: "include",
  //       body: formData,
  //     });

  //     // Clear loading toast
  //     toast.dismiss(loadingToastId);

  //     if (response.ok) {
  //       getProfileData(); // Refresh user info on UI
  //     } else {
  //       const error = await response.json();
  //       toast.error(error.message || "Upload failed", toastNoficationSettings);
  //     }
  //   } catch (err) {
  //     console.error("Profile Upload Error:", err);
  //     toast.error("Something went wrong", toastNoficationSettings);
  //   }
  // };

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
    try {
      const loadingToastId = toast.loading("Updating profile picture...");
      const response = await fetch(`${backendUrl}/api/user/edit-profile`, {
        method: "PATCH",
        credentials: "include",
        body: formData,
      });

      toast.dismiss(loadingToastId);

      if (response.ok) {
        getProfileData(); // Refresh UI
      } else {
        const error = await response.json();
        toast.error(error.message || "Upload failed", toastNoficationSettings);
      }
    } catch (err) {
      console.error("Profile Upload Error:", err);
      toast.error("Something went wrong", toastNoficationSettings);
    }
  };

  const handleLogout = () => {
    Cookies.remove("jwtToken");
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
          setProfileData={setProfileData}
          handleProfilePicChange={handleProfilePicChange}
        />
      )}
    </div>
  );
};

export default Topbar;
