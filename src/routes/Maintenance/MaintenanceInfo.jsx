import React, { useState, useEffect } from "react";
import { Eye, Edit, Trash2, Plus } from "lucide-react";
import { toast } from "react-toastify";
import NoHostelMessage from "../NoHostelMessage";
import ConfirmModal from "../ConfirmModal";
import { backendUrl, toastNoficationSettings } from "../../utils/utils";
import MaintenanceTable from "./MaintenanceTable";
import MaintenanceFormModal from "./MaintenanceFormModal";
import MaintenanceDetailsModal from "./MaintenanceDetailsModal";
import Cookies from "js-cookie";
import axios from "axios";

const MaintenanceInfo = () => {
  // API URLs - make sure these match your backend routes
  const getHostelUrl = `${backendUrl}/api/maintenance/view`;
  const getAllDetailsUrl = `${backendUrl}/api/maintenance/all`;  // Updated endpoint
  const createDetailsUrl = `${backendUrl}/api/maintenance/create`; // Updated endpoint
  const updateDetailsUrl = `${backendUrl}/api/maintenance/update`; // Updated endpoint
  const deleteDetailsUrl = `${backendUrl}/api/maintenance/delete`;

  // State variables
  const [maintenanceDetails, setMaintenanceDetails] = useState({});
  const [issuesData, setIssuesData] = useState([]);
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

  // Add retry mechanism at the top of the component
  const retryRequest = async (requestFn, maxRetries = 3, initialDelay = 1000) => {
    let lastError;
    let delay = initialDelay;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;
        
        // Don't retry on authentication errors
        if (error.message.includes("Session expired") || 
            error.message.includes("No authentication token found")) {
          throw error;
        }
        
        // Only retry on network errors or timeouts
        if (!error.message.includes("Unable to connect") && 
            !error.message.includes("timeout") &&
            !error.message.includes("Failed to fetch") &&
            !error.message.includes("No internet connection")) {
          throw error;
        }
        
        console.log(`Attempt ${i + 1} failed, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Exponential backoff with jitter
        delay = Math.min(delay * 2, 10000) * (0.75 + Math.random() * 0.5);
      }
    }
    
    console.error("All retry attempts failed");
    throw lastError;
  };

  const fetchHostelData = async () => {
    const token = Cookies.get('jwtToken');
    if (!token) {
      window.location.href = '/login';
      return null;
    }

    try {
      console.log('Fetching hostel data from:', getHostelUrl);
      const response = await axios.get(getHostelUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      
      console.log('Hostel data response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching hostel data:', error);
      if (error.response?.status === 401) {
        Cookies.remove('jwtToken');
        window.location.href = '/login';
      }
      throw error;
    }
  };

  const fetchMaintenanceIssuesData = async () => {
    const token = Cookies.get('jwtToken');
    if (!token) {
      window.location.href = '/login';
      return null;
    }

    try {
      console.log('Fetching maintenance issues from:', getAllDetailsUrl);
      const response = await axios.get(getAllDetailsUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      
      console.log('Maintenance issues response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching maintenance issues:', error);
      if (error.response?.status === 401) {
        Cookies.remove('jwtToken');
        window.location.href = '/login';
      }
      throw error;
    }
  };

  // Update the fetchHostel function to use retry mechanism
  const fetchHostel = async () => {
    try {
      setLoading(true);
      const hostelData = await fetchHostelData();
      
      if (hostelData) {
        console.log('Setting hostel data:', hostelData);
        setHostel(hostelData);
        await fetchMaintenanceIssues();
      } else {
        setHostel(null);
        toast.error("No hostel data found", toastNoficationSettings);
      }
    } catch (error) {
      console.error('Error in fetchHostel:', error);
      setHostel(null);
      toast.error("Failed to fetch hostel data", toastNoficationSettings);
    } finally {
      setLoading(false);
    }
  };

  // Update the fetchMaintenanceIssues function to use retry mechanism
  const fetchMaintenanceIssues = async () => {
    try {
      setLoading(true);
      const data = await fetchMaintenanceIssuesData();
      
      if (data && Array.isArray(data)) {
        console.log('Setting maintenance issues:', data);
        setIssuesData(data);
      } else {
        setIssuesData([]);
        toast.info("No maintenance issues found", toastNoficationSettings);
      }
    } catch (error) {
      console.error('Error in fetchMaintenanceIssues:', error);
      setIssuesData([]);
      toast.error("Failed to fetch maintenance issues", toastNoficationSettings);
    } finally {
      setLoading(false);
    }
  };

  // Create new maintenance issue with proper authentication
  const createMaintenanceIssue = async (issueData) => {
    try {
      setIsSubmitting(true);
      const token = Cookies.get('jwtToken');
      
      if (!token) {
        window.location.href = '/login';
        return false;
      }

      console.log('Creating maintenance issue:', issueData);
      const response = await axios.post(createDetailsUrl, issueData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      console.log('Create response:', response.data);
      toast.success("Maintenance issue created successfully", toastNoficationSettings);
      await fetchMaintenanceIssues();
      return true;
    } catch (error) {
      console.error('Error creating maintenance issue:', error);
      if (error.response?.status === 401) {
        Cookies.remove('jwtToken');
        window.location.href = '/login';
      }
      toast.error(error.response?.data?.message || "Failed to create maintenance issue", toastNoficationSettings);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update maintenance issue with proper authentication
  const updateMaintenanceIssue = async (id, updatedData) => {
    try {
      setIsSubmitting(true);
      const token = Cookies.get('jwtToken');
      
      if (!token) {
        window.location.href = '/login';
        return false;
      }

      console.log('Updating maintenance issue:', id, updatedData);
      const response = await axios.put(`${updateDetailsUrl}/${id}`, updatedData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      console.log('Update response:', response.data);
      toast.success("Maintenance issue updated successfully", toastNoficationSettings);
      await fetchMaintenanceIssues();
      return true;
    } catch (error) {
      console.error('Error updating maintenance issue:', error);
      if (error.response?.status === 401) {
        Cookies.remove('jwtToken');
        window.location.href = '/login';
      }
      toast.error(error.response?.data?.message || "Failed to update maintenance issue", toastNoficationSettings);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete maintenance issue with proper authentication
  const deleteMaintenanceIssue = async (id) => {
    try {
      setLoading(true);
      const token = Cookies.get('jwtToken');
      
      if (!token) {
        window.location.href = '/login';
        return false;
      }

      console.log('Deleting maintenance issue:', id);
      const response = await axios.delete(`${deleteDetailsUrl}/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      console.log('Delete response:', response.data);
      toast.success("Maintenance issue deleted successfully", toastNoficationSettings);
      await fetchMaintenanceIssues();
      return true;
    } catch (error) {
      console.error('Error deleting maintenance issue:', error);
      if (error.response?.status === 401) {
        Cookies.remove('jwtToken');
        window.location.href = '/login';
      }
      toast.error(error.response?.data?.message || "Failed to delete maintenance issue", toastNoficationSettings);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Initial data loading
  useEffect(() => {
    console.log('Component mounted, fetching initial data');
    fetchHostel();
    return () => {
      // Cleanup
      setHostel(null);
      setIssuesData([]);
    };
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
    <div className="container mx-auto px-4 py-8">
      {loading && !hostel ? (
        <div className="flex justify-center items-center h-60">
          <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
        </div>
      ) : !hostel ? (
        <NoHostelMessage />
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Maintenance Issues</h1>
            <button
              onClick={() => {
                setIsEditing(false);
                setSelectedIssue(null);
                setShowFormModal(true);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Add New Issue
            </button>
          </div>

          <MaintenanceTable
            issues={issuesData}
            onView={handleViewClick}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />

          {showFormModal && (
            <MaintenanceFormModal
              isOpen={showFormModal}
              onClose={() => setShowFormModal(false)}
              onSubmit={isEditing ? updateMaintenanceIssue : createMaintenanceIssue}
              initialData={selectedIssue}
              isEditing={isEditing}
            />
          )}

          {showDetailsModal && selectedIssue && (
            <MaintenanceDetailsModal
              isOpen={showDetailsModal}
              onClose={() => setShowDetailsModal(false)}
              issue={selectedIssue}
            />
          )}

          {showConfirmModal && (
            <ConfirmModal
              isOpen={showConfirmModal}
              onClose={() => setShowConfirmModal(false)}
              onConfirm={() => {
                if (issueToDelete) {
                  deleteMaintenanceIssue(issueToDelete);
                  setShowConfirmModal(false);
                  setIssueToDelete(null);
                }
              }}
              title="Delete Maintenance Issue"
              message="Are you sure you want to delete this maintenance issue? This action cannot be undone."
            />
          )}
        </div>
      )}
    </div>
  );
};

export default MaintenanceInfo;
