// import { useState, useEffect } from "react";
// import { Eye, Edit, Trash2, Plus } from "lucide-react";
// import { toast } from "react-toastify";
// import axios from "axios";
// import NoHostelMessage from "../NoHostelMessage";
// import ConfirmModal from "../ConfirmModal";
// import { backendUrl, toastNoficationSettings } from "../../utils/utils";
// import MessTable from "./MaintenanceTable";
// import MessFormModal from "./MaintenanceFormModal";
// import MessDetailsModal from "./MaintenanceDetailsModal";

// const MaintenanceInfo = () => {
//   // API URLs
//   const getHostelUrl = `${backendUrl}/api/maintenance/view`;
//   const getAllDetailsUrl = `${backendUrl}/api/maintenance/`;
//   const createDetailsUrl = `${backendUrl}/api/maintenance/`;
//   const updateDetailsUrl = `${backendUrl}/api/maintenance/edit`;
//   const deleteDetailsUrl = `${backendUrl}/api/maintenance/delete`;

//   // State variables
//   const [messDetails, setMessDetails] = useState({});
//   const [menuData, setMenuData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [hostel, setHostel] = useState(null);
//   const [showMessFormModal, setShowMessFormModal] = useState(false);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [selectedMenu, setSelectedMenu] = useState(null);
//   const [messDayDelete, setMessDayDelete] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [formErrors, setFormErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // New menu form state
//   const [newMenu, setNewMenu] = useState({
//     day: "",
//     meals: {
//       breakfast: {
//         item: "",
//         time: "",
//       },
//       lunch: {
//         item: "",
//         time: "",
//       },
//       dinner: {
//         item: "",
//         time: "",
//       },
//     },
//   });

//   // Fetch hostel details
//   const fetchHostel = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(getHostelUrl, {
//         method: "GET",
//         credentials: "include",
//       });
//       if (response.ok) {
//         const data = await response.json();
//         if (data) {
//           setHostel(data);
//           fetchMessMenu();
//         } else {
//           setHostel(null);
//         }
//       }
//     } catch (error) {
//       toast.warning("Something Went Wrong", toastNoficationSettings);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch mess menu data from API
//   const fetchMessMenu = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(getAllMessDetailsUrl, {
//         withCredentials: true,
//       });

//       if (response.status === 200) {
//         const data = response.data;
//         console.log("Mess menu data:", data);

//         if (!data || data.length === 0) {
//           toast.info(
//             "No mess timetable found. Please add it first.",
//             toastNoficationSettings
//           );
//           setMessDetails({});
//           setMenuData([]);
//           return;
//         }

//         const formattedData = {};
//         data.forEach((item) => {
//           const day = item.day;
//           const meals = item.meals;

//           if (!day || !meals) return;

//           formattedData[day] = {
//             breakfast: meals.breakfast?.item || "",
//             breakfastTime: meals.breakfast?.time || "",
//             lunch: meals.lunch?.item || "",
//             lunchTime: meals.lunch?.time || "",
//             dinner: meals.dinner?.item || "",
//             dinnerTime: meals.dinner?.time || "",
//             id: item._id || Math.random().toString(),
//           };
//         });

//         setMessDetails(formattedData);

//         // Convert for table format
//         const tableData = Object.keys(formattedData).map((day) => {
//           const meal = formattedData[day];
//           return {
//             id: meal.id,
//             day,
//             breakfast: meal.breakfast,
//             breakfastTime: meal.breakfastTime,
//             lunch: meal.lunch,
//             lunchTime: meal.lunchTime,
//             dinner: meal.dinner,
//             dinnerTime: meal.dinnerTime,
//           };
//         });

//         setMenuData(tableData);
//       } else {
//         toast.warning("Failed to fetch mess menu", toastNoficationSettings);
//         setMenuData([]);
//       }
//     } catch (error) {
//       console.error("Error fetching mess menu:", error);
//       toast.error(
//         "Something went wrong while fetching mess menu",
//         toastNoficationSettings
//       );
//       setMenuData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Create new mess menu
//   const createMessMenu = async (menuItem) => {
//     setLoading(true);
//     try {
//       const response = await axios.post(createMessDetailsUrl, menuItem, {
//         withCredentials: true,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (response.status === 200 || response.status === 201) {
//         toast.success("Mess menu added successfully", toastNoficationSettings);
//         await fetchMessMenu(); // refresh list after create
//         return true;
//       } else {
//         const errorData = response.data;
//         toast.error(
//           errorData.message || "Failed to add mess menu",
//           toastNoficationSettings
//         );
//         return false;
//       }
//     } catch (error) {
//       console.error("Error creating mess menu:", error);
//       toast.error(
//         "Something went wrong while adding mess menu",
//         toastNoficationSettings
//       );
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update mess menu
//   const editMessMenu = async (id, updatedMenuItem) => {
//     setLoading(true);
//     try {
//       const response = await axios.put(
//         `${updateMessDetailsUrl}/${id}`,
//         updatedMenuItem,
//         {
//           withCredentials: true,
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.status === 200) {
//         toast.success(
//           "Mess menu updated successfully",
//           toastNoficationSettings
//         );
//         await fetchMessMenu(); // refresh after update
//         return true;
//       } else {
//         const errorData = response.data;
//         toast.error(
//           errorData.message || "Failed to update mess menu",
//           toastNoficationSettings
//         );
//         return false;
//       }
//     } catch (error) {
//       console.error("Error updating mess menu:", error);
//       toast.error(
//         "Something went wrong while updating mess menu",
//         toastNoficationSettings
//       );
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Simple handleDeleteClick function
//   const handleDeleteClick = (menuId) => {
//     console.log("Deleting menu with ID:", menuId);
//     setMessDayDelete(menuId);
//     setShowConfirmModal(true);
//   };

//   const deleteMessMenu = async () => {
//     // Step 1: Check if we have an ID to delete
//     if (!messDayDelete) {
//       console.error("No menu ID to delete");
//       toast.error(
//         "Error: No menu selected for deletion",
//         toastNoficationSettings
//       );
//       setShowConfirmModal(false);
//       return;
//     }

//     const idToDelete = messDayDelete;
//     console.log("Attempting to delete menu with ID:", idToDelete);

//     try {
//       // Step 2: Construct the delete URL with proper format
//       const deleteUrl = `${deleteMessDetailsUrl}/${idToDelete}`;
//       console.log("Delete URL:", deleteUrl);

//       // Step 3: Send the delete request to the server
//       const response = await axios.delete(deleteUrl, {
//         withCredentials: true,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       // Step 4: Handle successful response
//       console.log("Delete successful, response:", response);
//       toast.success("Mess menu deleted successfully", toastNoficationSettings);
//       // Refresh the list to show updated data
//       await fetchMessMenu();
//     } catch (error) {
//       console.error("Error deleting mess menu:", error);

//       // Step 5: Handle specific error cases
//       if (error.response) {
//         // Server responded with an error status code
//         console.error("Error response:", error.response);
//         console.error("Error response status:", error.response.status);
//         console.error("Error response data:", error.response.data);

//         // Handle different error status codes
//         if (error.response.status === 404) {
//           toast.error(
//             "Menu item not found. It may have been deleted already.",
//             toastNoficationSettings
//           );
//           // Refresh to show current state - might need to be outside this condition
//           await fetchMessMenu();
//         } else {
//           // Extract error message from response if available
//           const errorMessage =
//             error.response.data &&
//             (error.response.data.message ||
//               error.response.data.error ||
//               JSON.stringify(error.response.data))
//               ? error.response.data.message ||
//                 error.response.data.error ||
//                 JSON.stringify(error.response.data)
//               : "Server error";

//           toast.error(
//             `Failed to delete: ${errorMessage}`,
//             toastNoficationSettings
//           );
//         }
//       } else if (error.request) {
//         // No response received from server
//         console.error("Error request:", error.request);
//         toast.error(
//           "Network error: No response from server",
//           toastNoficationSettings
//         );
//       } else {
//         // Other errors
//         toast.error(`Error: ${error.message}`, toastNoficationSettings);
//       }
//     } finally {
//       // Step 6: Always clean up the state regardless of success or failure
//       setShowConfirmModal(false);
//       setMessDayDelete(null);
//     }
//   };

//   // Initial data loading
//   useEffect(() => {
//     fetchHostel();
//   }, []);

//   // Handle form input changes
//   const handleMenuChange = (e) => {
//     const { name, value } = e.target;

//     // Handle nested objects for meals
//     if (name.includes(".")) {
//       const [mealType, field] = name.split(".");
//       setNewMenu((prev) => ({
//         ...prev,
//         meals: {
//           ...prev.meals,
//           [mealType]: {
//             ...prev.meals[mealType],
//             [field]: value,
//           },
//         },
//       }));
//     } else {
//       // Handle regular fields
//       setNewMenu((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   // Validate form data
//   const validateForm = () => {
//     const errors = {};

//     // Basic validation
//     if (!newMenu.day?.trim()) {
//       errors.day = "Day is required";
//     }

//     if (!newMenu.meals.breakfast.item?.trim()) {
//       errors.breakfastItem = "Breakfast item is required";
//     }

//     if (!newMenu.meals.breakfast.time?.trim()) {
//       errors.breakfastTime = "Breakfast time is required";
//     }

//     if (!newMenu.meals.lunch.item?.trim()) {
//       errors.lunchItem = "Lunch item is required";
//     }

//     if (!newMenu.meals.lunch.time?.trim()) {
//       errors.lunchTime = "Lunch time is required";
//     }

//     if (!newMenu.meals.dinner.item?.trim()) {
//       errors.dinnerItem = "Dinner item is required";
//     }

//     if (!newMenu.meals.dinner.time?.trim()) {
//       errors.dinnerTime = "Dinner time is required";
//     }

//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   // Submit form with validation
//   const submitForm = async (e) => {
//     if (e) e.preventDefault();

//     if (validateForm()) {
//       setIsSubmitting(true);

//       try {
//         let success;
//         if (isEditing) {
//           success = await editMessMenu(selectedMenu.id, newMenu);
//         } else {
//           success = await createMessMenu(newMenu);
//         }

//         if (success) {
//           // Reset form and close modal
//           resetForm();
//           setShowMessFormModal(false);
//         }
//       } catch (error) {
//         console.error("Error submitting menu form:", error);
//         toast.error("Error saving menu information. Please try again.");

//         setFormErrors({
//           general: "There was an error saving the menu. Please try again.",
//         });
//       } finally {
//         setIsSubmitting(false);
//       }
//     } else {
//       toast.warning("Please correct the errors in the form");
//     }
//   };

//   // Reset form after submission or cancel
//   const resetForm = () => {
//     setNewMenu({
//       day: "",
//       meals: {
//         breakfast: {
//           item: "",
//           time: "",
//         },
//         lunch: {
//           item: "",
//           time: "",
//         },
//         dinner: {
//           item: "",
//           time: "",
//         },
//       },
//     });
//     setFormErrors({});
//     setIsEditing(false);
//     setSelectedMenu(null);
//   };

//   // Handle view details button click
//   const handleViewClick = (menu) => {
//     setSelectedMenu(menu);
//     setShowDetailsModal(true);
//   };

//   // Handle edit button click
//   const handleEditClick = (menu) => {
//     setSelectedMenu(menu);

//     // Format the menu data for the form
//     setNewMenu({
//       day: menu.day,
//       meals: {
//         breakfast: {
//           item: menu.breakfast,
//           time: menu.breakfastTime,
//         },
//         lunch: {
//           item: menu.lunch,
//           time: menu.lunchTime,
//         },
//         dinner: {
//           item: menu.dinner,
//           time: menu.dinnerTime,
//         },
//       },
//     });

//     setIsEditing(true);
//     setShowMessFormModal(true);
//   };

//   // Handle delete button click
//   // const handleDeleteClick = (menuId) => {
//   //   setMessDayDelete(menuId);
//   //   setShowConfirmModal(true);
//   // };

//   return (
//     <div className="w-full bg-white pt-0 min-h-screen flex justify-center items-start relative">
//       <div className="w-full pt-4 max-w-7xl px-4">
//         {loading && menuData.length === 0 ? (
//           <div className="flex justify-center items-center h-60">
//             <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
//           </div>
//         ) : !hostel || Object.keys(hostel).length === 0 ? (
//           <NoHostelMessage />
//         ) : (
//           <div className="min-h-screen bg-white shadow-lg p-4 md:p-8">
//             <div className="flex justify-between items-center mb-6">
//               <h1 className="text-3xl md:text-4xl font-bold text-blue-800 drop-shadow-md">
//                  Hostel Maintenance Records
//               </h1>
//               <button
//                 onClick={() => {
//                   resetForm();
//                   setShowMessFormModal(true);
//                 }}
//                 className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-md shadow-md transition-colors"
//               >
//                 <Plus size={20} />
//                  Enter Issue
//               </button>
//             </div>

//             {menuData.length === 0 ? (
//               <div className="text-center text-gray-500 mt-4 text-lg font-medium">
//                 No mess timetable found. Please add one.
//               </div>
//             ) : (
//               <MessTable
//                 menuData={menuData}
//                 handleDeleteClick={handleDeleteClick}
//                 loading={loading}
//                 handleEditClick={handleEditClick}
//                 handleViewClick={handleViewClick}
//               />
//             )}

//             {/* Mess Form Modal */}
//             {showMessFormModal && (
//               <MessFormModal
//                 setShowMessFormModal={setShowMessFormModal}
//                 newMenu={newMenu}
//                 handleMenuChange={handleMenuChange}
//                 handleMenuSubmit={submitForm}
//                 isEditing={isEditing}
//                 resetForm={resetForm}
//                 formErrors={formErrors}
//                 isSubmitting={isSubmitting}
//               />
//             )}

//             {/* Mess Details Modal */}
//             {showDetailsModal && (
//               <MessDetailsModal
//                 menu={selectedMenu}
//                 setShowDetailsModal={setShowDetailsModal}
//               />
//             )}

//             {/* Confirm Delete Modal */}
//             {showConfirmModal && (
//               <ConfirmModal
//                 confirmType="mess"
//                 confirmDelete={deleteMessMenu}
//                 setShowConfirmModal={setShowConfirmModal}
//               />
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MaintenanceInfo;

import { useState, useEffect } from "react";
import { Eye, Edit, Trash2, Plus, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import NoHostelMessage from "../NoHostelMessage";
import ConfirmModal from "../ConfirmModal";
import { backendUrl, toastNoficationSettings } from "../../utils/utils";
import MaintenanceTable from "./MaintenanceTable";
import MaintenanceFormModal from "./MaintenanceFormModal";
import MaintenanceDetailsModal from "./MaintenanceDetailsModal";

const MaintenanceInfo = () => {
  // API URLs
  const getHostelUrl = `${backendUrl}/api/hostel/view`;
  const getAllIssuesUrl = `${backendUrl}/api/maintenance/`;
  const createIssueUrl = `${backendUrl}/api/maintenance`;
  const updateIssueUrl = `${backendUrl}/api/maintenance/edit`;
  const deleteIssueUrl = `${backendUrl}/api/maintenance/delete`;

  // State variables
  const [maintenanceIssues, setMaintenanceIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hostel, setHostel] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [issueToDelete, setIssueToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New maintenance issue form state
  const [newIssue, setNewIssue] = useState({
    roomNo: "",
    issue: "",
    status: "Pending",
    remarks: "",
    priority: "Medium",
    requestedBy: "",
    assignedTo: "",
    createdDate: new Date().toISOString().split("T")[0],
  });

  // Fetch hostel details
  const fetchHostel = async () => {
    try {
      setLoading(true);
      const response = await fetch(getHostelUrl, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setHostel(data);
          fetchMaintenanceIssues();
        } else {
          setHostel(null);
        }
      }
    } catch (error) {
      toast.warning("Something Went Wrong", toastNoficationSettings);
    } finally {
      setLoading(false);
    }
  };

  // Fetch maintenance issues data from API
  const fetchMaintenanceIssues = async () => {
    setLoading(true);
    try {
      const response = await axios.get(getAllIssuesUrl, {
        withCredentials: true,
      });

      if (response.status === 200) {
        const data = response.data;
        console.log("Maintenance issues data:", data);

        if (!data || data.length === 0) {
          toast.info("No maintenance issues found.", toastNoficationSettings);
          setMaintenanceIssues([]);
          return;
        }

        setMaintenanceIssues(data);
      } else {
        toast.warning(
          "Failed to fetch maintenance issues",
          toastNoficationSettings
        );
        setMaintenanceIssues([]);
      }
    } catch (error) {
      console.error("Error fetching maintenance issues:", error);
      toast.error(
        "Something went wrong while fetching maintenance issues",
        toastNoficationSettings
      );
      setMaintenanceIssues([]);
    } finally {
      setLoading(false);
    }
  };

  const createMaintenanceIssue = async (issueData) => {
    console.log(issueData, "00000000000000099999999999999999");
    setLoading(true);
    try {
      // Make sure we're sending the correct data format
      const cleanedIssueData = {
        roomNo: issueData.roomNo?.trim(),
        issue: issueData.issue?.trim(),
        status: issueData.status || "Pending",
        remarks: issueData.remarks?.trim() || "",
        priority: issueData.priority || "Medium",
        requestedBy: issueData.requestedBy?.trim(),
        assignedTo: issueData.assignedTo?.trim() || "",
        createdDate:
          issueData.createdDate || new Date().toISOString().split("T")[0],
      };

      console.log("Sending data to server:", cleanedIssueData);

      const response = await axios.post(createIssueUrl, cleanedIssueData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Server response:", response);

      if (response.status >= 200 && response.status < 300) {
        toast.success(
          "Maintenance issue added successfully",
          toastNoficationSettings
        );
        await fetchMaintenanceIssues(); // refresh list after create
        return true;
      } else {
        const errorData = response.data;
        toast.error(
          errorData.message || "Failed to add maintenance issue",
          toastNoficationSettings
        );
        return false;
      }
    } catch (error) {
      console.error("Error creating maintenance issue:", error);

      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);

        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          "Failed to add maintenance issue";
        toast.error(errorMessage, toastNoficationSettings);
      } else if (error.request) {
        console.error("Error request:", error.request);
        toast.error(
          "No response from server. Please try again later.",
          toastNoficationSettings
        );
      } else {
        toast.error(
          `Error: ${
            error.message ||
            "Something went wrong while adding maintenance issue"
          }`,
          toastNoficationSettings
        );
      }

      return false;
    } finally {
      setLoading(false);
    }
  };
  // Update maintenance issue
  const updateMaintenanceIssue = async (id, updatedIssueData) => {
    setLoading(true);
    try {
      // Make sure we're sending the correct data format
      const cleanedIssueData = {
        roomNo: updatedIssueData.roomNo?.trim(),
        issue: updatedIssueData.issue?.trim(),
        status: updatedIssueData.status || "Pending",
        remarks: updatedIssueData.remarks?.trim() || "",
        priority: updatedIssueData.priority || "Medium",
        requestedBy: updatedIssueData.requestedBy?.trim(),
        assignedTo: updatedIssueData.assignedTo?.trim() || "",
        createdDate:
          updatedIssueData.createdDate ||
          new Date().toISOString().split("T")[0],
      };

      console.log(`Updating issue with ID: ${id}`);
      console.log("Sending update data to server:", cleanedIssueData);

      const response = await axios.put(
        `${updateIssueUrl}/${id}`,
        cleanedIssueData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Update response:", response);

      if (response.status >= 200 && response.status < 300) {
        toast.success(
          "Maintenance issue updated successfully",
          toastNoficationSettings
        );
        await fetchMaintenanceIssues(); // refresh after update
        return true;
      } else {
        const errorData = response.data;
        toast.error(
          errorData.message || "Failed to update maintenance issue",
          toastNoficationSettings
        );
        return false;
      }
    } catch (error) {
      console.error("Error updating maintenance issue:", error);

      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);

        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          "Failed to update maintenance issue";
        toast.error(errorMessage, toastNoficationSettings);
      } else if (error.request) {
        console.error("Error request:", error.request);
        toast.error(
          "No response from server. Please try again later.",
          toastNoficationSettings
        );
      } else {
        toast.error(
          `Error: ${
            error.message ||
            "Something went wrong while updating maintenance issue"
          }`,
          toastNoficationSettings
        );
      }

      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateMaintenanceStatus = async (id, status) => {
    setLoading(true);
    try {
      console.log(`Updating status for issue ID: ${id} to ${status}`);

      const response = await axios.patch(
        `${backendUrl}/api/maintenance/${id}/status`,
        { status },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Status update response:", response);

      if (response.status >= 200 && response.status < 300) {
        toast.success(
          `Status updated to ${status} successfully`,
          toastNoficationSettings
        );
        await fetchMaintenanceIssues(); // refresh after update
        return true;
      } else {
        const errorData = response.data;
        toast.error(
          errorData.message || "Failed to update status",
          toastNoficationSettings
        );
        return false;
      }
    } catch (error) {
      console.error("Error updating maintenance status:", error);

      if (error.response) {
        console.error("Error response data:", error.response.data);
        const errorMessage =
          error.response.data?.message || "Failed to update status";
        toast.error(errorMessage, toastNoficationSettings);
      } else {
        toast.error(
          "Something went wrong while updating status",
          toastNoficationSettings
        );
      }

      return false;
    } finally {
      setLoading(false);
    }
  };

  // Function to assign maintenance to staff
  const assignMaintenanceToStaff = async (id, assignedTo) => {
    setLoading(true);
    try {
      console.log(`Assigning issue ID: ${id} to ${assignedTo}`);

      const response = await axios.patch(
        `${backendUrl}/api/maintenance/${id}/assign`,
        { assignedTo },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Assignment response:", response);

      if (response.status >= 200 && response.status < 300) {
        toast.success(
          `Issue assigned to ${assignedTo} successfully`,
          toastNoficationSettings
        );
        await fetchMaintenanceIssues(); // refresh after update
        return true;
      } else {
        const errorData = response.data;
        toast.error(
          errorData.message || "Failed to assign maintenance issue",
          toastNoficationSettings
        );
        return false;
      }
    } catch (error) {
      console.error("Error assigning maintenance:", error);

      if (error.response) {
        console.error("Error response data:", error.response.data);
        const errorMessage =
          error.response.data?.message || "Failed to assign maintenance issue";
        toast.error(errorMessage, toastNoficationSettings);
      } else {
        toast.error(
          "Something went wrong while assigning maintenance issue",
          toastNoficationSettings
        );
      }

      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete maintenance issue
  const deleteMaintenanceIssue = async () => {
    if (!issueToDelete) {
      console.error("No issue ID to delete");
      toast.error(
        "Error: No issue selected for deletion",
        toastNoficationSettings
      );
      setShowConfirmModal(false);
      return;
    }

    const idToDelete = issueToDelete;
    console.log("Attempting to delete issue with ID:", idToDelete);

    try {
      const deleteUrl = `${deleteIssueUrl}/${idToDelete}`;
      console.log("Delete URL:", deleteUrl);

      const response = await axios.delete(deleteUrl, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Delete successful, response:", response);
      toast.success(
        "Maintenance issue deleted successfully",
        toastNoficationSettings
      );
      await fetchMaintenanceIssues();
    } catch (error) {
      console.error("Error deleting maintenance issue:", error);

      if (error.response) {
        console.error("Error response:", error.response);
        console.error("Error response status:", error.response.status);
        console.error("Error response data:", error.response.data);

        if (error.response.status === 404) {
          toast.error(
            "Issue not found. It may have been deleted already.",
            toastNoficationSettings
          );
          await fetchMaintenanceIssues();
        } else {
          const errorMessage =
            error.response.data &&
            (error.response.data.message ||
              error.response.data.error ||
              JSON.stringify(error.response.data))
              ? error.response.data.message ||
                error.response.data.error ||
                JSON.stringify(error.response.data)
              : "Server error";

          toast.error(
            `Failed to delete: ${errorMessage}`,
            toastNoficationSettings
          );
        }
      } else if (error.request) {
        console.error("Error request:", error.request);
        toast.error(
          "Network error: No response from server",
          toastNoficationSettings
        );
      } else {
        toast.error(`Error: ${error.message}`, toastNoficationSettings);
      }
    } finally {
      setShowConfirmModal(false);
      setIssueToDelete(null);
    }
  };

  // Initial data loading
  useEffect(() => {
    fetchHostel();
  }, []);

  // Handle form input changes
  const handleIssueChange = (e) => {
    const { name, value } = e.target;
    setNewIssue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate form data
  const validateForm = () => {
    const errors = {};

    // Basic validation
    if (!newIssue.roomNo?.trim()) {
      errors.roomNo = "Room number is required";
    }

    if (!newIssue.issue?.trim()) {
      errors.issue = "Issue description is required";
    }

    if (!newIssue.status?.trim()) {
      errors.status = "Status is required";
    }

    if (!newIssue.priority?.trim()) {
      errors.priority = "Priority is required";
    }

    if (!newIssue.requestedBy?.trim()) {
      errors.requestedBy = "Requester name is required";
    }

    if (!newIssue.createdDate) {
      errors.createdDate = "Request date is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit form with validation
  const submitForm = async (e) => {
    if (e) e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        let success;
        if (isEditing && selectedIssue) {
          success = await updateMaintenanceIssue(selectedIssue._id, newIssue);
        } else {
          success = await createMaintenanceIssue(newIssue);
        }

        if (success) {
          // Reset form and close modal
          resetForm();
          setShowFormModal(false);
        }
      } catch (error) {
        console.error("Error submitting maintenance form:", error);
        toast.error("Error saving maintenance information. Please try again.");

        setFormErrors({
          general:
            "There was an error saving the maintenance issue. Please try again.",
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.warning("Please correct the errors in the form");
    }
  };

  // Reset form after submission or cancel
  const resetForm = () => {
    setNewIssue({
      roomNo: "",
      issue: "",
      status: "Pending",
      remarks: "",
      priority: "Medium",
      requestedBy: "",
      assignedTo: "",
      createdDate: new Date().toISOString().split("T")[0],
    });
    setFormErrors({});
    setIsEditing(false);
    setSelectedIssue(null);
  };

  // Handle view details button click
  const handleViewClick = (issue) => {
    setSelectedIssue(issue);
    setShowDetailsModal(true);
  };

  // Handle edit button click
  const handleEditClick = (issue) => {
    setSelectedIssue(issue);

    // Format date properly
    const formattedDate = issue.createdDate
      ? new Date(issue.createdDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];

    // Format the issue data for the form
    setNewIssue({
      roomNo: issue.roomNo || "",
      issue: issue.issue || "",
      status: issue.status || "Pending",
      remarks: issue.remarks || "",
      priority: issue.priority || "Medium",
      requestedBy: issue.requestedBy || "",
      assignedTo: issue.assignedTo || "",
      createdDate: formattedDate,
    });

    setIsEditing(true);
    setShowFormModal(true);
  };

  // Handle delete button click
  const handleDeleteClick = (issueId) => {
    setIssueToDelete(issueId);
    setShowConfirmModal(true);
  };

  return (
    <div className="w-full min-h-screen bg-white flex justify-center items-start pt-0">
      <div className="w-full max-w-7xl px-4 pt-4">
        {loading && maintenanceIssues.length === 0 ? (
          <div className="flex justify-center items-center h-60">
            <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
          </div>
        ) : !hostel || Object.keys(hostel).length === 0 ? (
          <NoHostelMessage />
        ) : (
          <div className="min-h-screen bg-white shadow-lg p-4 sm:p-6 md:p-8 rounded-lg">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-800 drop-shadow-md">
                Hostel Maintenance Records
              </h1>
              <button
                onClick={() => {
                  resetForm();
                  setShowFormModal(true);
                }}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 sm:py-3 sm:px-5 rounded-md shadow-md transition-colors cursor-pointer text-sm sm:text-base"
              >
                <Plus size={20} />
                Report Issue
              </button>
            </div>

            {/* Empty State or Maintenance Table */}
            {maintenanceIssues.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 text-base sm:text-lg font-medium">
                  No maintenance issues found. Report a new issue to get
                  started.
                </p>
              </div>
            ) : (
              <MaintenanceTable
                issues={maintenanceIssues}
                handleDeleteClick={handleDeleteClick}
                loading={loading}
                handleEditClick={handleEditClick}
                handleViewClick={handleViewClick}
              />
            )}

            {/* Modals */}
            {showFormModal && (
              <MaintenanceFormModal
                setShowFormModal={setShowFormModal}
                newIssue={newIssue}
                handleIssueChange={handleIssueChange}
                handleSubmit={submitForm}
                isEditing={isEditing}
                resetForm={resetForm}
                formErrors={formErrors}
                isSubmitting={isSubmitting}
              />
            )}

            {showDetailsModal && (
              <MaintenanceDetailsModal
                issue={selectedIssue}
                setShowDetailsModal={setShowDetailsModal}
              />
            )}

            {showConfirmModal && (
              <ConfirmModal
                confirmType="maintenance"
                confirmDelete={deleteMaintenanceIssue}
                setShowConfirmModal={setShowConfirmModal}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenanceInfo;
