import React, { useState, useEffect, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import { backendUrl, toastNoficationSettings } from "../../utils/utils";
import NoHostelMessage from "../NoHostelMessage";
import PaginatedFeesTable from "../Fees/PaginatedFeesTable";
import TenantTransactionModal from "./TenantTransactionModal";
import TenantPaymentForm from "./TenantPaymentForm";
import Cookies from "js-cookie";
import axios from "axios";

const FeesInfo = () => {
  // State variables
  const [hostel, setHostel] = useState({});
  const [loading, setLoading] = useState(true);
  const [tenants, setTenants] = useState([]);
  const [search, setSearch] = useState("");
  const [room, setRoom] = useState("Room 201");
  const [month, setMonth] = useState("May");
  const [year, setYear] = useState("2024");
  const [isSearching, setIsSearching] = useState(false);
  const [isError, setIsError] = useState(false);

  const [showTenantFormModal, setShowTenantFormModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);

  // State for storing tenant transactions
  const [tenantTransactions, setTenantTransactions] = useState([]);
  const [paymentTransactions, setPaymentTransactions] = useState([]);

  const [loadingTransactions, setLoadingTransactions] = useState(false);

  // Pagination states
  const [pageNumber, setPageNumber] = useState(1);
  const [tenantPerPage, setTenantPerPage] = useState(5);
  const [totalTenants, setTotalTenants] = useState(0);

  // API URLs
  const getHostelUrl = `${backendUrl}/api/hostel/view`;
  const getTenantUrl = `${backendUrl}/api/tenants/all`;
  const createPaymentUrl = `${backendUrl}/api/payments/create`;
  const getTransactionsUrl = `${backendUrl}/api/payments/tenant`; // Notice "tenant" is added
  const deleteTransactionsUrl = `${backendUrl}/api/payments/delete`; // Notice "tenant" is added
  const editTransactionsUrl = `${backendUrl}/api/payments/edit`; // Notice "tenant" is added

  // Debounce search function
  const debouncedSearch = useCallback(
    debounce((searchTerm) => {
      if (searchTerm !== search) {
        setSearch(searchTerm);
        setPageNumber(1); // Reset to first page on new search
        fetchTenants();
      }
    }, 500),
    []
  );

  // Memoize fetchTenants to prevent unnecessary re-renders
  const memoizedFetchTenants = useCallback(async () => {
    if (!hostel || Object.keys(hostel).length === 0) return;
    await fetchTenants();
  }, [pageNumber, tenantPerPage, search, room, month, year, hostel]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    debouncedSearch(searchTerm);
  };

  // Debounce function
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Handle search and filter submission
  const handleSubmit = () => {
    fetchTenants();
  };

  // Add a new utility function for retrying failed requests
  const retryRequest = async (requestFn, maxRetries = 3, initialDelay = 1000) => {
    let lastError;
    let delay = initialDelay;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;
        
        // Don't retry on authentication errors or invalid requests
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
    
    // If we've exhausted all retries, throw the last error
    console.error("All retry attempts failed");
    throw lastError;
  };

  const fetchHostelData = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    try {
      // Get the token from cookies
      const token = Cookies.get('jwtToken');
      
      if (!token) {
        // Redirect to login if no token found
        window.location.href = '/login';
        throw new Error("No authentication token found. Please login again.");
      }

      console.log("Fetching hostel data with token present");

      const response = await fetch(getHostelUrl, {
        method: "GET",
        credentials: "include", // This will send cookies
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Also send token in header
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Server response:", errorData);
        
        if (response.status === 401) {
          // Clear invalid token
          Cookies.remove('jwtToken', { path: '/' }); // Ensure cookie is removed from correct path
          // Redirect to login
          window.location.href = '/login';
          throw new Error(errorData.message || "Session expired. Please login again.");
        }
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }
      
      const data = await response.json();
      if (!data) {
        throw new Error("No data received from server");
      }
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
      if (error.name === 'AbortError') {
        throw new Error("Request timed out. Server is responding slowly.");
      }
      throw error;
    }
  };

  const fetchTenantsData = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    try {
      // Get the token from cookies
      const token = Cookies.get('jwtToken');
      
      if (!token) {
        window.location.href = '/login';
        throw new Error("No authentication token found. Please login again.");
      }

      const queryParams = new URLSearchParams({
        page: pageNumber.toString(),
        limit: tenantPerPage.toString(),
      });
      
      if (search.trim()) {
        queryParams.append("search", search.trim());
      }
      
      if (room !== "Room 201") {
        queryParams.append("room", room.replace("Room ", ""));
      }
      
      if (month && year) {
        queryParams.append("month", month);
        queryParams.append("year", year);
      }
      
      const url = `${getTenantUrl}?${queryParams.toString()}`;
      console.log("Fetching tenants from:", url);

      try {
        const response = await Promise.race([
          fetch(url, {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
              "Cache-Control": "no-cache",
              "Pragma": "no-cache"
            },
            signal: controller.signal
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Request timeout")), 30000)
          )
        ]);
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("Server response:", errorData);
          
          if (response.status === 401) {
            Cookies.remove('jwtToken', { path: '/' });
            window.location.href = '/login';
            throw new Error(errorData.message || "Session expired. Please login again.");
          }
          throw new Error(errorData.message || `Server error: ${response.status}`);
        }
        
        const data = await response.json();
        if (!data) {
          throw new Error("No data received from server");
        }
        return data;
      } catch (fetchError) {
        if (fetchError.name === 'AbortError') {
          throw new Error("Request timed out. Server is responding slowly.");
        }
        throw fetchError;
      }
    } catch (error) {
      console.error("Fetch error:", error);
      // Check if it's a network error
      if (!navigator.onLine) {
        throw new Error("No internet connection. Please check your network.");
      }
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        throw new Error("Unable to connect to server. Please try again later.");
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const fetchHostel = async () => {
    try {
      setLoading(true);
      
      const data = await retryRequest(fetchHostelData);
      
      if (data) {
        setHostel(data);
        await fetchTenants();
      } else {
        setHostel(null);
        toast.error("No hostel data found", toastNoficationSettings);
      }
    } catch (error) {
      console.error("Error fetching hostel:", error);
      toast.error(error.message || "Failed to fetch hostel data", toastNoficationSettings);
      setHostel(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchTenants = async () => {
    try {
      setLoading(true);
      setIsError(false);
      
      const data = await retryRequest(fetchTenantsData);
      
      if (data && Array.isArray(data.tenants)) {
        setTenants(data.tenants);
        setTotalTenants(data.total || data.count || data.tenants.length || 0);
      } else {
        setTenants([]);
        setTotalTenants(0);
        toast.warning("No tenants found", toastNoficationSettings);
      }
    } catch (error) {
      console.error("Error fetching tenants:", error);
      
      // Handle specific error cases
      if (error.message.includes("No internet connection")) {
        toast.error("Please check your internet connection and try again", toastNoficationSettings);
      } else if (error.message.includes("Session expired") || error.message.includes("No authentication token")) {
        toast.error("Your session has expired. Please login again", toastNoficationSettings);
        // Redirect will happen automatically due to error handling in fetchTenantsData
      } else if (error.message.includes("timeout")) {
        toast.error("The server is taking too long to respond. Please try again later", toastNoficationSettings);
      } else if (error.message.includes("Unable to connect")) {
        toast.error("Cannot connect to the server. Please try again later", toastNoficationSettings);
      } else {
        toast.error(error.message || "Failed to fetch tenants", toastNoficationSettings);
      }
      
      setTenants([]);
      setTotalTenants(0);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostel();
    return () => {
      // Cleanup function
      setTenants([]);
      setHostel({});
    };
  }, []);

  useEffect(() => {
    memoizedFetchTenants();
  }, [memoizedFetchTenants]);

  // Handle payment button click
  const handlePaymentClick = (tenant) => {
    const formattedTenant = {
      id: tenant.id || tenant._id || Date.now().toString(),
      tenantName: tenant.tenantName || "",
      contact: tenant.contact || "",
      roomNumber: tenant.roomNumber || "",
      rentAmount: tenant.rentAmount || "",
      joinDate: tenant.moveInDate ? tenant.moveInDate.split("T")[0] : "",
      rentStatus: "Due",
      dueDate: "", // optionally calculate based on business logic
      payingDate: new Date().toISOString().split("T")[0],
      paymentMode: "Cash",
      transactionId: "",
      remarks: "",
    };

    setSelectedTenant(formattedTenant);
    setShowTenantFormModal(true);
  };

  // Save payment to MongoDB and create linked transaction
  const savePaymentToDatabase = async (paymentDetails) => {
    try {
      setLoading(true);
      const paymentData = {
        tenantId: selectedTenant.id,
        tenantName: paymentDetails.tenantName,
        roomNumber: paymentDetails.roomNumber,
        paymentAmount: parseFloat(paymentDetails.payingAmount), // ✅ correct name
        dueAmount: parseFloat(paymentDetails.dueAmount),
        rentAmount: parseFloat(paymentDetails.rent), // ✅ correct name
        paymentDate: paymentDetails.payingDate,
        dueDate: paymentDetails.dueDate,
        paymentMode: paymentDetails.paymentMode,
        transactionId: paymentDetails.transactionId || `TXN-${Date.now()}`,
        rentStatus: paymentDetails.rentStatus,
        remarks: paymentDetails.remarks,
      };

      // Send data to API
      const response = await fetch(createPaymentUrl, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save payment");
      }

      const savedPayment = await response.json();
      setPaymentTransactions(savedPayment);

      // Show success message
      toast.success("Payment recorded successfully", toastNoficationSettings);

      // Refresh tenant list to show updated payment status
      fetchTenants();

      return savedPayment;
    } catch (error) {
      console.error("Error saving payment:", error);
      toast.error(
        error.message || "Failed to save payment",
        toastNoficationSettings
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchTenantTransactions = async (tenantId) => {
    try {
      setLoadingTransactions(true);

      if (!tenantId) {
        throw new Error("Invalid tenant ID");
      }

      // Add timeout to handle slow responses
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const apiUrl = `${getTransactionsUrl}/${tenantId}`;
      console.log("Fetching transactions from:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 408 || response.status === 504) {
          throw new Error("Transaction fetch timed out. Please try again.");
        }
        if (response.status === 401) {
          throw new Error("Session expired. Please login again.");
        }
        throw new Error(`Server error: ${response.status}`);
      }

      const responseData = await response.json();
      const transactions = responseData.data || [];

      if (!Array.isArray(transactions)) {
        throw new Error("Invalid transaction data format received");
      }

      console.log(`Retrieved ${transactions.length} transactions for tenant ${tenantId}`);
      return transactions;

    } catch (error) {
      if (error.name === 'AbortError') {
        toast.error("Transaction fetch timed out. Server is responding slowly.", toastNoficationSettings);
      } else {
        console.error("Error fetching transaction history:", error);
        toast.error(error.message || "Failed to load transaction history", toastNoficationSettings);
      }
      return [];
    } finally {
      setLoadingTransactions(false);
    }
  };

  // Helper function to verify API URL
  const verifyApiUrl = () => {
    // Check common issues with API URLs
    if (!getTransactionsUrl) {
      console.error("ERROR: getTransactionsUrl is undefined or empty!");
    } else if (getTransactionsUrl.includes("undefined")) {
      console.error(
        "ERROR: getTransactionsUrl contains 'undefined', suggesting a variable is not properly set!"
      );
    } else if (
      !getTransactionsUrl.startsWith("http://") &&
      !getTransactionsUrl.startsWith("https://") &&
      !getTransactionsUrl.startsWith("/")
    ) {
      console.warn(
        "WARNING: getTransactionsUrl doesn't start with http://, https://, or / - This might be incorrect!"
      );
    }

    // Verify the expected full URL pattern
    console.log(
      "Expected full URL pattern:",
      `${getTransactionsUrl}/{tenantId}`
    );
  };

  // Handle previous payment history button click
  const handleHistoryClick = async (tenantData) => {
    try {
      setLoading(true);

      // First verify the API URL configuration
      verifyApiUrl();

      // Set the current tenant data in state
      setSelectedTenant(tenantData);

      // Get the tenant ID (ensures compatibility with different data structures)
      const tenantId = tenantData?.id || tenantData?._id;

      if (!tenantId) {
        throw new Error("Invalid tenant ID");
      }

      console.log("Starting transaction fetch for tenant:", {
        tenantId,
        tenantName: tenantData?.name || "Unknown",
      });

      // Fetch transaction history from MongoDB
      const transactions = await fetchTenantTransactions(tenantId);

      if (!Array.isArray(transactions)) {
        console.error(
          "Expected array of transactions but got:",
          typeof transactions,
          transactions
        );
        throw new Error("Invalid transaction data format");
      }

      // Sort transactions by date (newest first)
      const sortedTransactions = transactions.sort((a, b) => {
        return (
          new Date(b.createdAt || Date.now()) -
          new Date(a.createdAt || Date.now())
        );
      });

      setTenantTransactions(sortedTransactions);
      setShowTransactionModal(true);
    } catch (error) {
      console.error("Error handling transaction history:", error);
      toast.error(
        `Failed to load transaction history: ${error.message}`,
        toastNoficationSettings
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle edit button click
  const onEditTransaction = (tenant) => {
    console.log("Edit tenant:", tenant);
    // This would normally open an edit form
  };

  // Handle page change for pagination
  const handlePageChange = (newPage) => {
    setPageNumber(newPage);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setTenantPerPage(newItemsPerPage);
    setPageNumber(1);
  };

  const deleteTransaction = async (transactionId) => {
    try {
      if (!transactionId) {
        throw new Error("Invalid transaction ID");
      }

      // Show confirmation dialog
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this transaction? This action cannot be undone."
      );

      if (!confirmDelete) {
        console.log("Delete operation cancelled by user");
        return false;
      }

      setLoading(true);

      console.log(`Deleting transaction with ID: ${transactionId}`);

      const response = await fetch(
        `${deleteTransactionsUrl}/${transactionId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Server error: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();

      toast.success(
        "Transaction deleted successfully",
        toastNoficationSettings
      );

      console.log("Delete transaction result:", result);

      // Return true to indicate successful deletion
      return true;
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error(
        `Failed to delete transaction: ${error.message}`,
        toastNoficationSettings
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const onDeleteTransaction = async (transaction) => {
    const deleted = await deleteTransaction(transaction);

    if (deleted) {
      // 1. Remove transaction from tenantTransactions
      const updatedTransactions = tenantTransactions.filter(
        (t) => t._id !== transaction._id
      );
      setTenantTransactions(updatedTransactions);

      // 2. Find updated latest transaction for this tenant
      const tenantId = transaction.tenantId;
      const tenantRemainingTransactions = updatedTransactions
        .filter((t) => t.tenantId === tenantId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const latestTransaction = tenantRemainingTransactions[0];

      // 3. Update tenant data in the tenants list
      setTenants((prevTenants) =>
        prevTenants.map((tenant) => {
          if (tenant._id === tenantId) {
            return {
              ...tenant,
              status: latestTransaction?.rentStatus || "Due", // fallback
              dueDate: latestTransaction?.dueDate || null,
            };
          }
          return tenant;
        })
      );

      // 4. Optional: Close modal if it was open
      if (selectedTenant && selectedTenant._id === tenantId) {
        setSelectedTenant(null); // or closeModal()
      }
    }
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
            <h1 className="text-2xl font-bold mb-6">Payments</h1>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-4 mt-4 space-y-4">
              {/* Search and Filter Bar */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-wrap">
                {/* Search Bar */}
                <div className="flex w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Search tenant details..."
                    onChange={handleSearchChange}
                    className="flex-1 min-w-0 text-black border border-gray-300 rounded-l-lg p-3 shadow-sm"
                  />
                  <button
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition"
                  >
                    <FaSearch />
                  </button>
                </div>

                {/* Filter Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex gap-2 w-full sm:w-auto">
                  {/* Room Dropdown */}
                  <select
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="w-full cursor-pointer bg-white border border-blue-500 text-sm rounded-md py-2 px-6 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <option value="">Select Room</option>
                    <option value="Room 101">Room 101</option>
                    <option value="Room 201">Room 201</option>
                    <option value="Room 104">Room 104</option>
                  </select>

                  {/* Month Dropdown */}
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full cursor-pointer bg-white border border-blue-500 text-sm rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    {[
                      "January",
                      "February",
                      "March",
                      "April",
                      "May",
                      "June",
                      "July",
                      "August",
                      "September",
                      "October",
                      "November",
                      "December",
                    ].map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>

                  {/* Year Dropdown */}
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full cursor-pointer bg-white border border-blue-500 text-sm rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    {["2024", "2025", "2026"].map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    className="bg-blue-600 cursor-pointer text-white font-medium px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition w-full sm:w-auto"
                  >
                    Submit
                  </button>
                </div>
              </div>

              {/* Tenants Table with Pagination */}
              <PaginatedFeesTable
                tenants={tenants}
                handlePaymentClick={handlePaymentClick}
                handleHistoryClick={handleHistoryClick}
                loading={loading}
                handlePageChange={handlePageChange}
                handleItemsPerPageChange={handleItemsPerPageChange}
                pageNumber={pageNumber}
                tenantPerPage={tenantPerPage}
                totalTenants={totalTenants}
                transactions={tenantTransactions}
                paymentTransactions={paymentTransactions}
              />
            </div>
          </div>
        )}
        {showTenantFormModal && (
          <TenantPaymentForm
            tenant={selectedTenant}
            setShowDetailsModal={setShowTenantFormModal}
            onSuccess={async (paymentDetails) => {
              try {
                // Save the payment to MongoDB (which auto-creates a transaction)
                await savePaymentToDatabase(paymentDetails); // ✅ Pass currentUser
                setShowTenantFormModal(false);
              } catch (error) {
                // Error is already handled in savePaymentToDatabase
                console.error("Payment process failed:", error);
              }
            }}
          />
        )}
        {/* Transaction History Modal */}
        {showTransactionModal && (
          <TenantTransactionModal
            showModal={showTransactionModal}
            setShowModal={setShowTransactionModal}
            tenantName={selectedTenant?.tenantName || ""}
            transactions={tenantTransactions}
            paymentTransactions={paymentTransactions}
            loading={loadingTransactions}
            onEditTransaction={onEditTransaction}
            onDeleteTransaction={onDeleteTransaction}
          />
        )}
      </div>
    </div>
  );
};

export default FeesInfo;
