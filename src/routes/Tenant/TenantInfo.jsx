import axios from "axios";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { FaUserPlus, FaSearch } from "react-icons/fa";
import { RiFilterLine } from "react-icons/ri";
import { toast } from "react-toastify";
import debounce from "lodash/debounce";
import ConfirmModal from "../ConfirmModal";
import TenantFormModal from "./TenantFormModal";
import TenantDetailsModal from "./TenantDetailsModal";
import PaginatedTenantTable from "./PaginatedTenantTable";
// import FilterComponent from "./FilterComponent";
import NoHostelMessage from "../NoHostelMessage";
import { backendUrl, toastNoficationSettings } from "../../utils/utils";
import Cookies from "js-cookie";

// Create axios instance with default config
const api = axios.create({
  baseURL: backendUrl,
  timeout: 8000, // 8 second timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = Cookies.get('jwtToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Initialize cache
const cache = {
  hostel: { data: null, timestamp: null },
  rooms: { data: null, timestamp: null },
  tenants: { data: null, timestamp: null },
  maxAge: 5 * 60 * 1000 // 5 minutes cache
};

const TenantInfo = () => {
  // API URLs
  const getHostelUrl = `${backendUrl}/api/hostel/view`;
  const addTenantUrl = `${backendUrl}/api/tenants/add`;
  const editTenantUrl = `${backendUrl}/api/tenants/update/`;
  const deleteTenantUrl = `${backendUrl}/api/tenants/delete/`;
  const getRoomsUrl = `${backendUrl}/api/hostel/room/get`;
  const getTenantUrl = `${backendUrl}/api/tenants/all`;
  const searchTenantUrl = `${backendUrl}/api/tenants/search`;

  // State variables
  const [filters, setFilters] = useState({
    roomNumber: "",
    joinDateFrom: "",
    joinDateTo: "",
    rentAmountMin: "",
    rentAmountMax: "",
  });

  const [rooms, setRooms] = useState([]);
  const [hostel, setHostel] = useState({});
  const [loading, setLoading] = useState(true);
  const [showTenantFormModal, setShowTenantFormModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [tenantIdToDelete, setTenantIdToDelete] = useState(null);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [tableRefreshTrigger, setTableRefreshTrigger] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressesSame, setAddressesSame] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    field: "joinDate",
    direction: "desc",
  });

  // Pagination states
  const [pageNumber, setPageNumber] = useState(1);
  const [tenantPerPage, setTenantPerPage] = useState(5);
  const [totalTenants, setTotalTenants] = useState(0);

  const [tenants, setTenants] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isError, setIsError] = useState(false);

  // New tenant form state
  const [newTenant, setNewTenant] = useState({
    tenantName: "",
    roomNumber: "",
    moveInDate: "",
    agreementStartDate: "",
    rentAmount: "",
    contact: "",
    email: "",
    aadhaarNumber: "",
    isCurrentAddressSame: false,
    policeVerificationConsent: false,
    termsAgreement: false,
    permanentAddress: {
      street: "",
      city: "",
      state: "",
      pincode: "",
    },
    currentAddress: {
      street: "",
      city: "",
      state: "",
      pincode: "",
    },
    emergencyContact: {
      name: "",
      relationship: "",
      mobile: "",
    },
    passportPhoto: "",
    aadhaarFront: "",
    aadhaarBack: "",
    digitalSignature: "",
    dateOfBirth: "",
    ownerId: "",
  });

  // Add new state for request cancellation
  const cancelTokenRef = useRef(null);

  // Optimized fetch function with caching and request cancellation
  const fetchWithCache = async (key, url, options = {}) => {
    try {
      // Check cache first
      if (cache[key]?.data && 
          cache[key]?.timestamp && 
          (Date.now() - cache[key].timestamp < cache.maxAge) &&
          !options.forceRefresh) {
        return cache[key].data;
      }

      // Cancel previous request if exists
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel('Operation canceled due to new request.');
      }

      // Create new cancel token
      cancelTokenRef.current = axios.CancelToken.source();

      const response = await api.get(url, {
        ...options,
        cancelToken: cancelTokenRef.current.token,
        withCredentials: true
      });

      // Update cache
      cache[key] = {
        data: response.data,
        timestamp: Date.now()
      };

      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message);
      } else {
        throw error;
      }
    }
  };

  // Optimized fetch tenants function
  const fetchTenants = useCallback(async () => {
    try {
      setLoading(true);
      setIsError(false);
      setIsSearching(true);

      const params = {
        page: pageNumber,
        limit: tenantPerPage,
        sortBy: sortConfig.field,
        sortOrder: sortConfig.direction,
        ...(searchTerm && { search: searchTerm.trim() }),
        ...(filters.roomNumber && { roomNumber: filters.roomNumber }),
        ...(filters.joinDateFrom && { joinDateFrom: filters.joinDateFrom }),
        ...(filters.joinDateTo && { joinDateTo: filters.joinDateTo }),
        ...(filters.rentAmountMin && { rentAmountMin: filters.rentAmountMin }),
        ...(filters.rentAmountMax && { rentAmountMax: filters.rentAmountMax })
      };

      const data = await fetchWithCache('tenants', getTenantUrl, { 
        params,
        forceRefresh: true // Always get fresh data for tenant list
      });

      if (data?.tenants && data?.total !== undefined) {
        setTenants(data.tenants);
        setTotalTenants(data.total);
      } else {
        setTenants(data || []);
        setTotalTenants((data || []).length);
      }
    } catch (error) {
      console.error("Error fetching tenants:", error);
      setIsError(true);
      toast.error("Failed to fetch tenants", toastNoficationSettings);
      setTenants([]);
      setTotalTenants(0);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  }, [pageNumber, tenantPerPage, searchTerm, filters, sortConfig]);

  // Optimized fetch hostel function
  const fetchHostel = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchWithCache('hostel', getHostelUrl);
      
      if (data) {
        setHostel(data);
        await fetchRooms();
        await fetchTenants();
      } else {
        setHostel(null);
      }
    } catch (error) {
      toast.warning("Something Went Wrong", toastNoficationSettings);
    } finally {
      setLoading(false);
    }
  }, []);

  // Optimized fetch rooms function
  const fetchRooms = useCallback(async () => {
    try {
      const data = await fetchWithCache('rooms', getRoomsUrl);
      
      if (data) {
        if (isEditing && selectedTenant) {
          const availableRooms = data.filter(
            room => room.availableBeds > 0 || room.roomNumber === selectedTenant.roomNumber
          );
          setRooms(availableRooms);
        } else {
          const availableRooms = data.filter(room => room.availableBeds > 0);
          setRooms(availableRooms);
        }
      } else {
        setRooms([]);
      }
    } catch (error) {
      toast.error("Failed to fetch rooms", toastNoficationSettings);
    }
  }, [isEditing, selectedTenant]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(() => {
      setPageNumber(1);
      fetchTenants();
    }, 300),
    []
  );

  // Update search handler to use debounce
  const handleSearch = useCallback(() => {
    debouncedSearch();
  }, [debouncedSearch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cancel any pending requests
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel('Component unmounted');
      }
      // Clear cache on unmount
      Object.keys(cache).forEach(key => {
        if (typeof cache[key] === 'object') {
          cache[key].data = null;
          cache[key].timestamp = null;
        }
      });
    };
  }, []);

  // Handle form input changes
  const handleTenantChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle nested objects (addresses, emergency contact)
    if (name.includes(".")) {
      const [objectName, field] = name.split(".");
      setNewTenant((prev) => ({
        ...prev,
        [objectName]: {
          ...prev[objectName],
          [field]: value,
        },
      }));
    } else {
      // Handle checkbox inputs
      if (type === "checkbox") {
        setNewTenant((prev) => ({ ...prev, [name]: checked }));

        // If isCurrentAddressSame checkbox changes, update state
        if (name === "isCurrentAddressSame") {
          setAddressesSame(checked);

          // If checked, copy permanent address to current address
          if (checked) {
            setNewTenant((prev) => ({
              ...prev,
              currentAddress: { ...prev.permanentAddress },
            }));
          }
        }
      } else {
        setNewTenant((prev) => ({ ...prev, [name]: value }));
      }
    }
  };

  // Validate form data
  const validateForm = () => {
    // Log the tenant data to debug validation issues
    console.log("Validating tenant data:", newTenant);

    const errors = {};

    // Essential fields validation
    if (!newTenant.tenantName?.trim()) {
      errors.tenantName = "Name is required";
    }

    if (!newTenant.dateOfBirth) {
      errors.dateOfBirth = "Date of birth is required";
    }

    if (!newTenant.contact || !/^[0-9]{10}$/.test(newTenant.contact)) {
      errors.contact = "Valid 10-digit mobile number is required";
    }

    if (!newTenant.roomNumber) {
      errors.roomNumber = "Room number must be selected";
    }

    // The key fix: validate moveInDate, not joinDate
    if (!newTenant.moveInDate) {
      errors.moveInDate = "Move-in date is required";
    }

    if (!newTenant.rentAmount || newTenant.rentAmount <= 0) {
      errors.rentAmount = "Valid rent amount is required";
    }

    // Validate addresses
    if (!newTenant.permanentAddress?.street?.trim()) {
      errors.permanentAddressStreet = "Permanent address is required";
    }

    if (!addressesSame && !newTenant.currentAddress?.street?.trim()) {
      errors.currentAddressStreet = "Current address is required";
    }

    // Emergency contact validation
    if (!newTenant.emergencyContact?.name?.trim()) {
      errors.emergencyName = "Emergency contact name is required";
    }

    if (
      !newTenant.emergencyContact?.mobile ||
      !/^[0-9]{10}$/.test(newTenant.emergencyContact.mobile)
    ) {
      errors.emergencyMobile =
        "Valid 10-digit emergency contact number is required";
    }

    setFormErrors(errors);

    // If there are errors, display them in the console for debugging
    if (Object.keys(errors).length > 0) {
      console.error("Form validation errors:", errors);
    }

    return Object.keys(errors).length === 0;
  };

  const handleTenantSubmit = async () => {
    try {
      if (!validateForm()) {
        toast.error("Please fill all required fields", toastNoficationSettings);
        return;
      }

      const url = isEditing
        ? `${editTenantUrl}${selectedTenant._id}`
        : addTenantUrl;

      const method = isEditing ? "PUT" : "POST";

      // console.log("Sending request to:", url, "with method:", method);
      // console.log("Submitting tenant data:", newTenant);

      const response = await axios({
        method,
        url,
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
        data: newTenant,
      });

      const data = response.data;

      if (response.status === 200 || response.status === 201) {
        toast.success(data.message, toastNoficationSettings);

        // Close modal after successful submission
        setShowTenantFormModal(false);
        resetForm();

        // Fetch updated data
        await fetchRooms();
        // Trigger a refresh by updating the refresh trigger
        setTableRefreshTrigger((prev) => prev + 1);
      } else {
        toast.error(data.message, toastNoficationSettings);
      }
    } catch (error) {
      console.error("Error submitting tenant data:", error);

      // Extract the specific error message if available
      let errorMessage = "Something went wrong";
      if (error.response && error.response.data) {
        if (
          typeof error.response.data === "string" &&
          error.response.data.includes("<!DOCTYPE html>")
        ) {
          // Handle HTML error responses
          errorMessage =
            "Server doesn't support this request method. Try another approach.";
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }

      toast.error(errorMessage, toastNoficationSettings);
    }
  };

  const deleteTenant = async () => {
    try {
      const idToDelete = tenantIdToDelete;

      const response = await axios.delete(`${deleteTenantUrl}${idToDelete}`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.success(response.data.message, toastNoficationSettings);

        // Refresh the table with current filters
        setTableRefreshTrigger((prev) => prev + 1);
      } else {
        toast.error(response.data.message, toastNoficationSettings);
      }
    } catch (error) {
      console.error("Error deleting tenant:", error);
      toast.error("Something went wrong", toastNoficationSettings);
    } finally {
      setShowConfirmModal(false);
      setTenantIdToDelete(null);
    }
  };

  // Handle edit button click
  const handleEditClick = (tenant) => {
    setSelectedTenant(tenant);

    // Helper function to format date properly
    const formatDate = (dateValue) => {
      if (!dateValue) return "";

      try {
        // Handle different date formats and ensure it's converted to YYYY-MM-DD
        const date = new Date(dateValue);

        // Check if date is valid
        if (isNaN(date.getTime())) {
          console.error("Invalid date:", dateValue);
          return "";
        }

        // Format as YYYY-MM-DD
        return date.toISOString().split("T")[0];
      } catch (error) {
        console.error("Error formatting date:", dateValue, error);
        return "";
      }
    };

    // Log the moveInDate specifically to debug
    const formattedMoveInDate = formatDate(tenant.moveInDate);

    // Initialize newTenant with proper fallbacks
    setNewTenant({
      tenantName: tenant.tenantName || "",
      roomNumber: tenant.roomNumber ? tenant.roomNumber.toString() : "",
      moveInDate: formattedMoveInDate, // Set moveInDate correctly
      agreementStartDate: formatDate(tenant.agreementStartDate),
      rentAmount: tenant.rentAmount?.toString() || "",
      contact: tenant.contact || "",
      email: tenant.email || "",
      aadhaarNumber: tenant.aadhaarNumber || "",
      isCurrentAddressSame: Boolean(tenant.isCurrentAddressSame),
      policeVerificationConsent: Boolean(tenant.policeVerificationConsent),
      termsAgreement: Boolean(tenant.termsAgreement),

      // Address handling with nested object fallbacks
      permanentAddress: {
        street: tenant.permanentAddress?.street || "",
        city: tenant.permanentAddress?.city || "",
        state: tenant.permanentAddress?.state || "",
        pincode: tenant.permanentAddress?.pincode || "",
      },

      currentAddress: {
        street: tenant.currentAddress?.street || "",
        city: tenant.currentAddress?.city || "",
        state: tenant.currentAddress?.state || "",
        pincode: tenant.currentAddress?.pincode || "",
      },

      emergencyContact: {
        name: tenant.emergencyContact?.name || "",
        relationship: tenant.emergencyContact?.relationship || "",
        mobile: tenant.emergencyContact?.mobile || "",
      },

      // Document URLs
      passportPhoto: tenant.passportPhoto || "",
      aadhaarFront: tenant.aadhaarFront || "",
      aadhaarBack: tenant.aadhaarBack || "",
      digitalSignature: tenant.digitalSignature || "",

      // Additional fields
      dateOfBirth: formatDate(tenant.dateOfBirth),

      // Make sure to include the owner ID which might be required for updates
      ownerId: tenant.ownerId || "",
    });

    // Update the addressesSame state based on the tenant data
    setAddressesSame(Boolean(tenant.isCurrentAddressSame));

    setIsEditing(true);
    setShowTenantFormModal(true);

    // Refresh rooms data with error handling
    fetchRooms().catch((error) =>
      console.error("Error fetching rooms:", error)
    );
  };

  // Handle delete button click
  const handleDeleteClick = (tenantId) => {
    setTenantIdToDelete(tenantId);
    setShowConfirmModal(true);
  };

  // Handle view details button click
  const handleViewClick = (tenant) => {
    setSelectedTenant(tenant);
    setShowDetailsModal(true);
  };

  // Effect for table refresh and pagination changes
  useEffect(() => {
    if (hostel && Object.keys(hostel).length > 0) {
      fetchTenants();
    }
  }, [tableRefreshTrigger, pageNumber, tenantPerPage]);

  // Reset form after submission or cancel
  const resetForm = () => {
    setNewTenant({
      tenantName: "",
      roomNumber: "",
      moveInDate: "", // Ensure this is moveInDate, not joinDate
      agreementStartDate: "",
      rentAmount: "",
      contact: "",
      email: "",
      aadhaarNumber: "",
      isCurrentAddressSame: false,
      policeVerificationConsent: false,
      termsAgreement: false,
      permanentAddress: {
        street: "",
        city: "",
        state: "",
        pincode: "",
      },
      currentAddress: {
        street: "",
        city: "",
        state: "",
        pincode: "",
      },
      emergencyContact: {
        name: "",
        relationship: "",
        mobile: "",
      },
      passportPhoto: "",
      aadhaarFront: "",
      aadhaarBack: "",
      digitalSignature: "",
      dateOfBirth: "",
      ownerId: "",
    });
    setFormErrors({});
    setIsEditing(false);
    setSelectedTenant(null);
  };

  // Handle page change for pagination
  const handlePageChange = (newPage) => {
    setPageNumber(newPage);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setTenantPerPage(newItemsPerPage);
    setPageNumber(1); // Reset to first page when changing items per page
  };

  // Submit form with validation
  const submitForm = async (e) => {
    if (e) e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        // Notify user of submission
        // toast.info("Submitting tenant information...");

        await handleTenantSubmit();

        // Success notification
        toast.success("Tenant information saved successfully!");

        // Reset form and close modal
        resetForm();
        setShowTenantFormModal(false);
      } catch (error) {
        console.error("Error submitting tenant form:", error);
        toast.error("Error saving tenant information. Please try again.");

        setFormErrors({
          general: "There was an error saving the tenant. Please try again.",
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.warning("Please correct the errors in the form");

      // Scroll to first error
      const firstErrorField = document.querySelector(".error-field");
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  // Handle sorting
  const handleSort = (field) => {
    // If clicking the same field, toggle direction
    const direction =
      sortConfig.field === field && sortConfig.direction === "asc"
        ? "desc"
        : "asc";
    setSortConfig({ field, direction });
    // fetchTenants will be called by the useEffect
  };

  return (
    <div className="w-full pt-0 min-h-screen flex justify-center items-start relative">
      <div className="w-full pt-4 max-w-7xl px-4">
        {loading && tenants.length === 0 ? (
          <div className="flex justify-center items-center h-60">
            <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
          </div>
        ) : !hostel || Object.keys(hostel).length === 0 ? (
          <NoHostelMessage />
        ) : (
          <div>
            <h1 className="text-2xl font-bold mb-6">Tenant Management</h1>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-4 mt-4 space-y-4">
              {/* Search and Filter Bar */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Search input */}
                <div className="flex w-full md:w-1/2 lg:w-1/3">
                  <input
                    type="text"
                    placeholder="Search tenant details..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearch();
                    }}
                    className="flex-grow text-black border border-gray-300 p-3 rounded-l-lg shadow-sm focus:outline-none "
                  />
                  <button
                    onClick={handleSearch}
                    className="bg-blue-500 text-white px-4 rounded-r-lg hover:bg-blue-600 transition duration-200"
                  >
                    <FaSearch />
                  </button>
                </div>

                {/* Filter and Create New Button */}
                <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
                  <button
                    onClick={() => {
                      resetForm();
                      setShowTenantFormModal(true);
                    }}
                    className="flex items-center cursor-pointer justify-center gap-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 hover:scale-105 transition duration-200 shadow-md"
                  >
                    <FaUserPlus />
                    <span className="whitespace-nowrap">Create New</span>
                  </button>
                </div>
              </div>

              {/* Paginated Table Component */}
              <PaginatedTenantTable
                tenants={tenants}
                handleViewClick={handleViewClick}
                handleEditClick={handleEditClick}
                handleDeleteClick={handleDeleteClick}
                loading={loading && tenants.length > 0}
                currentPage={pageNumber}
                totalItems={totalTenants}
                itemsPerPage={tenantPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
                sortConfig={sortConfig}
                handleSort={handleSort}
              />
            </div>
          </div>
        )}

        {/* Tenant Form Modal */}
        {showTenantFormModal && (
          <TenantFormModal
            setShowTenantFormModal={setShowTenantFormModal}
            newTenant={newTenant}
            handleTenantChange={handleTenantChange}
            handleTenantSubmit={submitForm} // Use the new submitForm function instead
            isEditing={isEditing}
            rooms={rooms}
            resetForm={resetForm}
            formErrors={formErrors} // Pass form errors to the modal
            isSubmitting={isSubmitting} // Pass submission state
            addressesSame={addressesSame} // Pass addressesSame state
          />
        )}

        {/* Tenant Details Modal */}
        {showDetailsModal && (
          <TenantDetailsModal
            tenant={selectedTenant}
            setShowDetailsModal={setShowDetailsModal}
          />
        )}

        {/* Confirm Delete Modal */}
        {showConfirmModal && (
          <ConfirmModal
            confirmType="tenant"
            confirmDelete={deleteTenant}
            setShowConfirmModal={setShowConfirmModal}
          />
        )}
      </div>
    </div>
  );
};

export default TenantInfo;
