import React from "react";
import { RxCrossCircled } from "react-icons/rx";
import { format } from "date-fns";

const MaintenanceDetailsModal = ({ issue, setShowDetailsModal }) => {
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      return dateString || "N/A";
    }
  };

  // Get appropriate status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get appropriate priority color
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "urgent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
          <div className="bg-white px-6 py-6 sm:p-8">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-700">
                Maintenance Issue Details
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="absolute top-5 right-5"
              >
                <RxCrossCircled className="text-2xl text-red-600 cursor-pointer hover:text-red-900" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Header Section */}
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">Room Number</p>
                  <p className="text-lg font-semibold">{issue.roomNo || "N/A"}</p>
                </div>
                <div className="flex gap-3">
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span 
                      className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(issue.status)}`}
                    >
                      {issue.status || "Pending"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Priority</p>
                    <span 
                      className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(issue.priority)}`}
                    >
                      {issue.priority || "Medium"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Issue Description */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Issue Description</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-800">{issue.issue || "No description provided"}</p>
                </div>
              </div>

              {/* Remarks Section (only show if exists) */}
              {issue.remarks && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Remarks / Notes</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-800">{issue.remarks}</p>
                  </div>
                </div>
              )}

              {/* People Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-sm text-gray-500">Requested By</p>
                  <p className="font-medium">{issue.requestedBy || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Assigned To</p>
                  <p className="font-medium">{issue.assignedTo || "Not assigned yet"}</p>
                </div>
              </div>

              {/* Dates Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-sm text-gray-500">Request Date</p>
                  <p className="font-medium">{formatDate(issue.createdDate)}</p>
                </div>
                {issue.updatedDate && (
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-medium">{formatDate(issue.updatedDate)}</p>
                  </div>
                )}
              </div>

              {/* Additional metadata could go here if needed */}
            </div>

            <div className="mt-8 pt-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="rounded-lg px-4 py-2 bg-blue-500 text-white hover:bg-blue-700 cursor-pointer"
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

export default MaintenanceDetailsModal;