import React from "react";
import { FaEdit, FaEye } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  "In Progress": "bg-blue-100 text-blue-800",
  Resolved: "bg-green-100 text-green-800",
  Cancelled: "bg-gray-100 text-gray-800",
};

const priorityColors = {
  Low: "bg-blue-100 text-blue-800",
  Medium: "bg-yellow-100 text-yellow-800",
  High: "bg-orange-100 text-orange-800",
  Critical: "bg-red-100 text-red-800",
};

const MaintenanceTable = ({
  issues,
  handleDeleteClick,
  loading,
  handleEditClick,
  handleViewClick,
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const truncateText = (text, maxLength = 30) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <div className="w-full mt-2 overflow-x-auto rounded-xl border border-gray-200 shadow-md mx-auto">
      <table className="min-w-[700px] w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-100 shadow-md">
          <tr>
            <th className="px-3 sm:px-4 md:px-6 py-3 text-left font-semibold text-gray-700 tracking-wide whitespace-nowrap">
              Room
            </th>
            <th className="px-3 sm:px-4 md:px-6 py-3 text-left font-semibold text-gray-700 tracking-wide whitespace-nowrap">
              Issue
            </th>
            <th className="px-3 sm:px-4 md:px-6 py-3 text-left font-semibold text-gray-700 tracking-wide whitespace-nowrap">
              Status
            </th>
            <th className="px-3 sm:px-4 md:px-6 py-3 text-left font-semibold text-gray-700 tracking-wide whitespace-nowrap">
              Priority
            </th>
            <th className="px-3 sm:px-4 md:px-6 py-3 text-left font-semibold text-gray-700 tracking-wide whitespace-nowrap">
              Requested
            </th>
            <th className="px-3 sm:px-4 md:px-6 py-3 text-left font-semibold text-gray-700 tracking-wide whitespace-nowrap">
              Date
            </th>
            <th className="px-3 sm:px-4 md:px-6 py-3 text-left font-semibold text-gray-700 tracking-wide whitespace-nowrap">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan="7" className="py-4 px-4 text-center">
                <div className="flex justify-center items-center">
                  <div className="w-6 h-6 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
                  <span className="ml-2">Loading...</span>
                </div>
              </td>
            </tr>
          ) : issues.length === 0 ? (
            <tr>
              <td colSpan="7" className="py-4 px-4 text-center text-gray-500">
                No maintenance issues found
              </td>
            </tr>
          ) : (
            issues.map((issue) => (
              <tr key={issue._id} className="hover:bg-gray-50">
                <td className="py-3 px-4 whitespace-nowrap">
                  {issue.roomNo || "N/A"}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  {truncateText(issue.issue)}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      statusColors[issue.status] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {issue.status || "Pending"}
                  </span>
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      priorityColors[issue.priority] ||
                      "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {issue.priority || "Medium"}
                  </span>
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  {issue.requestedBy || "N/A"}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  {formatDate(issue.createdDate)}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="flex justify-start space-x-4">
                    <button
                      onClick={() => handleViewClick(issue)}
                      className="text-gray-700 hover:text-gray-900"
                      title="View"
                    >
                      <FaEye size={18} />
                    </button>
                    <button
                      onClick={() => handleEditClick(issue)}
                      className="text-gray-700 hover:text-gray-900"
                      title="Edit"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(issue._id)}
                      className="text-gray-700 hover:text-gray-900"
                      title="Delete"
                    >
                      <AiFillDelete size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MaintenanceTable;
