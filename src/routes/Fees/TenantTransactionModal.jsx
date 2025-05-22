import React, { useState, useEffect } from "react";
import { RxCrossCircled } from "react-icons/rx";
import { FaEdit, FaTrash } from "react-icons/fa";

const TenantTransactionModal = ({
  showModal,
  setShowModal,
  tenantName,
  transactions,
  onEditTransaction,
  onDeleteTransaction,
  onUpdateTenant,
}) => {
  if (!showModal) return null;

  // Sort transactions by date, most recent first
  const sortedTransactions = transactions?.sort(
    (a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)
  );
  
  return (
    <div className="fixed inset-10 z-50 overflow-y-auto">
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

        {/* Modal content */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-6 py-6 sm:p-10">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Transaction History for {tenantName}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
              >
                <RxCrossCircled className="text-3xl" />
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {sortedTransactions?.length > 0 ? (
                sortedTransactions.map((txn, index) => {
                  // Format dates for display
                  const paymentDate = new Date(
                    txn.paymentDate
                  ).toLocaleDateString();
                  const dueDate = new Date(txn.dueDate).toLocaleDateString();

                  // Check if payment is late
                  const isPastDue =
                    new Date(txn.paymentDate) > new Date(txn.dueDate);

                  return (
                    <div
                      key={txn._id}
                      className={`p-4 rounded-lg shadow-md space-y-1 relative ${
                        index === 0
                          ? "bg-green-50 border-l-4 border-green-500"
                          : "bg-gray-100"
                      }`}
                    >
                      <div className="flex justify-between">
                        <div className="flex-1">
                          <p>
                            <strong>Transaction ID:</strong> {txn.transactionId}
                          </p>
                          <p>
                            <strong>Rent Amount:</strong> ₹{txn.rentAmount}
                          </p>
                          <p>
                            <strong>Due Amount:</strong> ₹{txn.dueAmount}
                          </p>
                          <p>
                            <strong>Payment Amount:</strong> ₹
                            {txn.paymentAmount}
                          </p>
                          <p>
                            <strong>Payment Mode:</strong> {txn.paymentMode}
                          </p>
                          <p>
                            <strong>Rent Status:</strong>{" "}
                            <span
                              className={
                                txn.rentStatus === "Paid"
                                  ? "text-green-600 font-medium"
                                  : "text-red-600 font-medium"
                              }
                            >
                              {txn.rentStatus}
                            </span>
                          </p>
                          <p>
                            <strong>Payment Date:</strong>{" "}
                            <span
                              className={
                                isPastDue ? "text-red-600 font-medium" : ""
                              }
                            >
                              {paymentDate}
                            </span>
                            {isPastDue && (
                              <span className="ml-2 text-xs text-red-600">
                                (Late payment)
                              </span>
                            )}
                          </p>
                          <p>
                            <strong>Due Date:</strong> {dueDate}
                          </p>
                          <p>
                            <strong>Room Number:</strong> {txn.roomNumber}
                          </p>
                          <p>
                            <strong>Remarks:</strong> {txn.remarks || "N/A"}
                          </p>
                        </div>

                        {index === 0 && (
                          <div className="ml-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Latest
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Buttons */}
                      <div className="mt-3 flex gap-3">
                        <button
                          onClick={() => onEditTransaction(txn)}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded flex items-center gap-1 cursor-pointer"
                        >
                          <FaEdit size={12} /> Edit
                        </button>
                        <button
                          onClick={() => {
                            onDeleteTransaction(txn._id);
                            // If this is the latest transaction, update UI based on next transaction
                            if (index === 0 && sortedTransactions.length > 1) {
                              const nextLatestTxn = sortedTransactions[1];
                              onUpdateTenant(nextLatestTxn);
                            }
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded flex items-center gap-1 cursor-pointer"
                        >
                          <FaTrash size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-gray-500">
                  No transactions found.
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-red-500 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantTransactionModal;
