import React, { useState, useEffect } from "react";
import { RxCrossCircled } from "react-icons/rx";
import { Tooltip as ReactTooltip } from "react-tooltip";

const TenantPaymentForm = ({
  setShowDetailsModal,
  tenant,
  paymentDetails: initialPaymentDetails,
  onSuccess,
}) => {
  // Form state
  const [tenantName, setTenantName] = useState("");
  const [contact, setContact] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [joinDate, setJoinDate] = useState("");
  const [rent, setRent] = useState("");
  const [rentStatus, setRentStatus] = useState("Due");
  const [dueDate, setDueDate] = useState("");
  const [payingDate, setPayingDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [payingAmount, setPayingAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [transactionId, setTransactionId] = useState("");
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Initialize form with tenant data and payment details if available
  useEffect(() => {
    if (tenant) {
      setTenantName(tenant.tenantName || "");
      setContact(tenant.contact || "");
      setRoomNumber(tenant.roomNumber || "");
      setJoinDate(tenant.joinDate || "");
      setRent(tenant.rentAmount || "");
    }

    // If payment details are provided, initialize form with them
    if (initialPaymentDetails) {
      setRentStatus(initialPaymentDetails.rentStatus || "Due");
      setDueDate(initialPaymentDetails.dueDate || "");
      setPayingDate(
        initialPaymentDetails.payingDate ||
          new Date().toISOString().split("T")[0]
      );
      setPayingAmount(initialPaymentDetails.payingAmount || "");
      setPaymentMode(initialPaymentDetails.paymentMode || "Cash");
      setTransactionId(initialPaymentDetails.transactionId || "");
      setRemarks(initialPaymentDetails.remarks || "");
    }
  }, [tenant, initialPaymentDetails]);

  const resetForm = () => {
    // Reset to tenant data
    if (tenant) {
      setTenantName(tenant.tenantName || "");
      setContact(tenant.contact || "");
      setRoomNumber(tenant.roomNumber || "");
      setJoinDate(tenant.joinDate || "");
      setRent(tenant.rentAmount || "");
    } else {
      setTenantName("");
      setContact("");
      setRoomNumber("");
      setJoinDate("");
      setRent("");
    }

    // Reset payment details
    setRentStatus("Due");
    setDueDate("");
    setPayingDate(new Date().toISOString().split("T")[0]);
    setPayingAmount("");
    setPaymentMode("Cash");
    setTransactionId("");
    setRemarks("");
  };

  const handleFormSubmit = async () => {
    try {
      setSubmitting(true);

      // Validate required fields
      if (!payingAmount || parseFloat(payingAmount) <= 0) {
        alert("Please enter a valid payment amount");
        return;
      }

      // Create payment details object
      const paymentDetails = {
        tenantName: tenantName || tenant?.tenantName || "",
        contact: contact || tenant?.contact || "",
        roomNumber: roomNumber || tenant?.roomNumber || "",
        joinDate: joinDate || tenant?.joinDate || "",
        rent: rent || tenant?.rentAmount || "",
        dueAmount:
          parseFloat(rent || tenant?.rentAmount || 0) -
          parseFloat(payingAmount || 0),
        payingDate,
        payingAmount,
        paymentMode,
        transactionId: transactionId || `TXN-${Date.now()}`, // Generate transaction ID if not provided
        remarks,
        rentStatus,
        dueDate,
      };

      console.log("Payment Details Submitted:", paymentDetails);

      // Call onSuccess if provided
      if (onSuccess) {
        await onSuccess(paymentDetails);
      } else {
        // Just close the modal if no success handler
        setShowDetailsModal(false);
      }
    } catch (error) {
      console.error("Error submitting payment form:", error);
      alert("Failed to process payment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* Modal positioning */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-6 py-6 sm:p-12">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
                Tenant Payment Form
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="absolute top-5 right-5"
                data-tooltip-id="close-tooltip"
                data-tooltip-content="Close"
                disabled={submitting}
              >
                <RxCrossCircled className="text-2xl text-red-600 cursor-pointer hover:text-red-900" />
              </button>
              <ReactTooltip
                id="close-tooltip"
                place="left"
                effect="solid"
                className="!bg-red-700 !text-white !text-sm !rounded-sm !px-3 !py-1 shadow-lg"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label>Tenant Name</label>
                <input
                  type="text"
                  value={tenantName || tenant?.tenantName || ""}
                  onChange={(e) => setTenantName(e.target.value)}
                  className="w-full mt-1 p-3 border rounded-lg"
                  placeholder="Ravi Kumar"
                  readOnly={!!tenant}
                  disabled={submitting}
                />
              </div>

              <div>
                <label>Contact</label>
                <input
                  type="text"
                  value={contact || tenant?.contact || ""}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full mt-1 p-3 border rounded-lg"
                  placeholder="9876543210"
                  readOnly={!!tenant}
                  disabled={submitting}
                />
              </div>

              <div>
                <label>Room Number</label>
                <input
                  type="text"
                  value={roomNumber || tenant?.roomNumber || ""}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="w-full mt-1 p-3 border rounded-lg"
                  placeholder="101"
                  readOnly={!!tenant}
                  disabled={submitting}
                />
              </div>

              <div>
                <label>Join Date</label>
                <input
                  type="date"
                  value={joinDate || tenant?.joinDate || ""}
                  onChange={(e) => setJoinDate(e.target.value)}
                  className="w-full mt-1 p-3 border rounded-lg"
                  readOnly={!!tenant}
                  disabled={submitting}
                />
              </div>
              <div>
                <label>Paying Date</label>
                <input
                  type="date"
                  value={payingDate}
                  onChange={(e) => setPayingDate(e.target.value)}
                  className="w-full mt-1 p-3 border rounded-lg"
                  disabled={submitting}
                />
              </div>

              <div>
                <label>Rent Amount</label>
                <input
                  type="number"
                  value={rent || tenant?.rentAmount || ""}
                  onChange={(e) => setRent(e.target.value)}
                  className="w-full mt-1 p-3 border rounded-lg"
                  placeholder="5000"
                  readOnly={!!tenant}
                  disabled={submitting}
                />
              </div>

              <div>
                <label>Paying Amount</label>
                <input
                  type="number"
                  value={payingAmount}
                  onChange={(e) => setPayingAmount(e.target.value)}
                  className="w-full mt-1 p-3 border rounded-lg"
                  disabled={submitting}
                  required
                />
              </div>
              <div>
                <label>Due Amount</label>
                <input
                  type="number"
                  value={
                    parseFloat(rent || tenant?.rentAmount || 0) -
                    parseFloat(payingAmount || 0)
                  }
                  readOnly
                  className="w-full mt-1 p-3 border rounded-lg bg-gray-100 text-gray-600"
                  placeholder="Auto-calculated"
                  disabled={submitting}
                />
              </div>

              <div>
                <label>Rent Status</label>
                <select
                  value={rentStatus}
                  onChange={(e) => setRentStatus(e.target.value)}
                  className="w-full mt-1 p-3 border rounded-lg bg-gray-50"
                  disabled={submitting}
                >
                  <option value="Paid">Paid</option>
                  <option value="Due">Due</option>
                  <option value="Partial">Partial</option>
                </select>
              </div>

              <div>
                <label>Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full mt-1 p-3 border rounded-lg"
                  disabled={submitting}
                />
              </div>

              <div>
                <label>Payment Mode</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full mt-1 p-3 border rounded-lg bg-gray-50"
                  disabled={submitting}
                >
                  <option>Cash</option>
                  <option>UPI</option>
                  <option>Bank Transfer</option>
                  <option>Card</option>
                  <option>Online Gateway</option>
                </select>
              </div>

              <div>
                <label>Transaction ID</label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full mt-1 p-3 border rounded-lg"
                  placeholder="Optional - auto-generated if empty"
                  disabled={submitting}
                />
              </div>

              <div className="sm:col-span-2">
                <label>Remarks</label>
                <textarea
                  rows="2"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full mt-1 p-3 border rounded-lg"
                  placeholder="Optional"
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="px-4 py-3 mt-4 sm:px-6 flex justify-end items-center gap-4">
              <button
                onClick={resetForm}
                className="w-full sm:w-auto rounded-lg border border-gray-300 px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 cursor-pointer"
                disabled={submitting}
              >
                Reset
              </button>
              <button
                onClick={handleFormSubmit}
                className="w-full sm:w-auto rounded-lg px-4 py-2 bg-blue-500 text-white hover:bg-blue-700 cursor-pointer disabled:bg-blue-300"
                disabled={submitting}
              >
                {submitting ? "Processing..." : "Save Payment"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantPaymentForm;
