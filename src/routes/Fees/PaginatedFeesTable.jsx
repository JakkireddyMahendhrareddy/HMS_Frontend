import React, { useState, useEffect } from "react";
import { FaMoneyBillWave, FaHistory } from "react-icons/fa";
import {
  FaAngleDoubleLeft,
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleRight,
} from "react-icons/fa";

const PaginatedFeesTable = ({
  tenants,
  handlePaymentClick,
  handleHistoryClick,
  loading,
  handlePageChange,
  handleItemsPerPageChange,
  itemsPerPage,
  totalItems,
  pageNumber,
  tenantPerPage,
  totalTenants,
  transactions,
  paymentTransactions,
}) => {
  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  // Local state to track tenant data with transaction information
  const [processedTenants, setProcessedTenants] = useState([]);

  // Process initial transactions and update tenant data
  useEffect(() => {
    if (!tenants || !transactions) return;

    // Map tenant data with their transaction information
    const processedData = tenants.map((tenant) => {
      // Get all transactions for this tenant
      const tenantTransactions = transactions
        .filter((tx) => tx.tenantId === tenant._id)
        .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate));

      let dueDate = null;
      let rentStatus = "Due";
      let remarks = "";

      // Calculate next due date and status from most recent transaction
      if (tenantTransactions.length > 0) {
        const latestTransaction = tenantTransactions[0];

        // Get the due date from the latest transaction
        dueDate = latestTransaction.dueDate;

        // Get the rent status from the latest transaction
        rentStatus = latestTransaction.rentStatus;

        // Capture any remarks
        remarks = latestTransaction.remarks || "";
      }

      // Return processed tenant with transaction data
      return {
        ...tenant,
        processedDueDate: dueDate,
        processedRentStatus: rentStatus,
        remarks: remarks,
        transactions: tenantTransactions,
      };
    });

    setProcessedTenants(processedData);
  }, [tenants, transactions]);

  // Update only the specific tenant when payment transactions change
  useEffect(() => {
    // Verify we have valid payment transaction data with a tenant ID
    if (!paymentTransactions?.data || !paymentTransactions.data.tenantId)
      return;

    const paymentTenantId = paymentTransactions.data.tenantId;

    // Update only the specific tenant that matches the payment transaction ID
    setProcessedTenants((prevTenants) =>
      prevTenants.map((tenant) => {
        if (tenant._id === paymentTenantId) {
          console.log(
            `Updating tenant ${tenant.tenantName} with new payment data`
          );
          return {
            ...tenant,
            processedDueDate:
              paymentTransactions.data.dueDate || tenant.processedDueDate,
            processedRentStatus:
              paymentTransactions.data.rentStatus || tenant.processedRentStatus,
          };
        }
        return tenant;
      })
    );
  }, [paymentTransactions]);

  // Custom payment handler to handle payment action
  const handlePayment = (tenant) => {
    // Call the original handler for backend processing
    handlePaymentClick(tenant);
  };

  return (
    <div className="w-full">
      {/* Tenants Table */}
      {loading ? (
        <div className="flex justify-start items-start h-60">
          <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
        </div>
      ) : processedTenants.length === 0 ? (
        <div className="text-start py-10">
          <p className="text-gray-800 text-center">
            No tenants found. Did they ghost us? 👻
          </p>
        </div>
      ) : (
        <>
          <div className="w-full mt-2 overflow-x-auto rounded-xl border border-gray-200 shadow-md">
            <div className="min-w-[700px] w-full overflow-x-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <table className="w-full divide-y divide-gray-200 text-sm text-left">
                <thead className="bg-gray-100 shadow sticky top-0 z-10">
                  <tr>
                    {[
                      "S.NO",
                      "TENANT",
                      "CONTACT",
                      "ROOM",
                      "JOIN DATE",
                      "DUE DATE",
                      "RENT",
                      "STATUS",
                      "ACTIONS",
                    ].map((col, i) => (
                      <th
                        key={i}
                        className={`px-2 sm:px-4 py-3 font-semibold text-gray-700 tracking-wide whitespace-nowrap text-xs sm:text-sm ${
                          col === "ACTIONS" ? "text-center" : "text-left"
                        }`}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {processedTenants.map((tenant, index) => {
                    const dueDate = tenant.processedDueDate
                      ? new Date(tenant.processedDueDate).toLocaleDateString()
                      : "-";
                    const rentStatus = tenant.processedRentStatus || "Due";
                    const isOverdue =
                      tenant.processedDueDate &&
                      new Date(tenant.processedDueDate) < new Date() &&
                      rentStatus === "Due";

                    return (
                      <tr
                        key={tenant._id}
                        className={`hover:bg-gray-100 ${
                          isOverdue ? "bg-red-50" : ""
                        } transition-all`}
                      >
                        <td className="px-2 sm:px-4 py-3 text-gray-900 text-xs sm:text-sm">
                          {(pageNumber - 1) * tenantPerPage + index + 1}
                        </td>
                        <td className="px-2 sm:px-4 py-3 text-gray-900 text-xs sm:text-sm">
                          {tenant.tenantName}
                        </td>
                        <td className="px-2 sm:px-4 py-3 text-gray-900 text-xs sm:text-sm">
                          {tenant.contact}
                        </td>
                        <td className="px-2 sm:px-4 py-3 text-gray-900 text-xs sm:text-sm">
                          {tenant.roomNumber}
                        </td>
                        <td className="px-2 sm:px-4 py-3 text-gray-900 text-xs sm:text-sm">
                          {tenant.moveInDate
                            ? new Date(tenant.moveInDate)
                                .toLocaleDateString("en-GB")
                                .replace(/\//g, "-")
                            : tenant.joinDate
                            ? new Date(tenant.joinDate)
                                .toLocaleDateString("en-GB")
                                .replace(/\//g, "-")
                            : "-"}
                        </td>
                        <td
                          className={`px-2 sm:px-4 py-3 text-xs sm:text-sm ${
                            isOverdue
                              ? "text-red-600 font-bold"
                              : "text-gray-900"
                          }`}
                        >
                          {dueDate}
                        </td>
                        <td className="px-2 sm:px-4 py-3 text-gray-900 text-xs sm:text-sm">
                          ₹{tenant.rentAmount}
                        </td>
                        <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm">
                          {rentStatus === "Paid" ? (
                            <span className="text-green-600 font-medium">
                              Paid
                            </span>
                          ) : (
                            <span
                              className={`font-medium ${
                                isOverdue ? "text-red-600" : "text-orange-500"
                              }`}
                            >
                              {rentStatus}
                            </span>
                          )}
                        </td>
                        <td className="px-2 sm:px-4 py-3 text-center text-xs sm:text-sm">
                          <div className="flex justify-center sm:justify-start gap-2 flex-nowrap">
                            <button
                              onClick={() => handlePayment(tenant)}
                              className="bg-green-600 text-white px-2 cursor-pointer py-1 rounded hover:bg-green-700 shadow-sm text-xs flex items-center gap-1"
                            >
                              <FaMoneyBillWave size={12} />
                              Pay
                            </button>
                            <button
                              onClick={() => handleHistoryClick(tenant)}
                              className="bg-yellow-500 text-white px-2 py-1 cursor-pointer rounded hover:bg-yellow-600 shadow-sm text-xs flex items-center gap-1"
                            >
                              <FaHistory size={12} />
                              Previous
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Items per page:</span>
              <select
                value={tenantPerPage}
                onChange={(e) =>
                  handleItemsPerPageChange(Number(e.target.value))
                }
                className="border rounded p-1 text-sm cursor-pointer"
              >
                {[5, 10, 20].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(1)}
                disabled={pageNumber === 1}
                className={`p-2 border cursor-pointer rounded ${
                  pageNumber === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                <FaAngleDoubleLeft />
              </button>
              <button
                onClick={() => handlePageChange(pageNumber - 1)}
                disabled={pageNumber === 1}
                className={`p-2 border cursor-pointer rounded ${
                  pageNumber === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                <FaChevronLeft />
              </button>
              <span className="text-gray-700">
                Page <strong>{pageNumber}</strong> of{" "}
                <strong>{Math.ceil(totalTenants / tenantPerPage)}</strong>
              </span>
              <button
                onClick={() => handlePageChange(pageNumber + 1)}
                disabled={
                  pageNumber === Math.ceil(totalTenants / tenantPerPage)
                }
                className={`p-2 border cursor-pointer rounded ${
                  pageNumber === Math.ceil(totalTenants / tenantPerPage)
                    ? "text-gray-400 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                <FaChevronRight />
              </button>
              <button
                onClick={() =>
                  handlePageChange(Math.ceil(totalTenants / tenantPerPage))
                }
                disabled={
                  pageNumber === Math.ceil(totalTenants / tenantPerPage)
                }
                className={`p-2 border cursor-pointer rounded ${
                  pageNumber === Math.ceil(totalTenants / tenantPerPage)
                    ? "text-gray-400 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                <FaAngleDoubleRight />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PaginatedFeesTable;
