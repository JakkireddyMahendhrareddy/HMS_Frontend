import React from "react";
import { FaEdit, FaEye } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import {
  FaAngleDoubleLeft,
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleRight,
} from "react-icons/fa";
import { useState } from "react";

const PaginatedTenantTable = ({
  tenants,
  handleViewClick,
  handleEditClick,
  handleDeleteClick,
  loading,
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  handleSort,
  sortConfig,
}) => {
  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  return (
    <div className="w-full">
      {/* Tenants Table */}
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
        </div>
      ) : tenants.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-800">
            No tenants found. Did they ghost us? 👻
          </p>
        </div>
      ) : (
        <>
          <div className="w-full mt-4 overflow-x-auto rounded-xl border border-gray-200 shadow-md">
            <table className="min-w-[700px] w-full divide-y divide-gray-200 text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-2 sm:px-4 md:px-6 py-3 font-semibold text-gray-700 whitespace-nowrap">
                    S.No
                  </th>
                  <th className="px-2 sm:px-4 md:px-6 py-3 font-semibold text-gray-700 whitespace-nowrap">
                    Tenant
                  </th>
                  <th className="px-2 sm:px-4 md:px-6 py-3 font-semibold text-gray-700 whitespace-nowrap">
                    Contact
                  </th>
                  <th className="px-2 sm:px-4 md:px-6 py-3 font-semibold text-gray-700 whitespace-nowrap">
                    Room
                  </th>
                  <th className="px-2 sm:px-4 md:px-6 py-3 font-semibold text-gray-700 whitespace-nowrap">
                    Join Date
                  </th>
                  <th className="px-2 sm:px-4 md:px-6 py-3 font-semibold text-gray-700 whitespace-nowrap">
                    Rent
                  </th>
                  <th className="px-2 sm:px-4 md:px-6 py-3 font-semibold text-gray-700 whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {tenants.map((tenant, index) => (
                  <tr
                    key={tenant._id || index}
                    className="hover:bg-gray-100 group"
                  >
                    <td className="px-2 sm:px-4 md:px-6 py-3 whitespace-nowrap">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-2 sm:px-4 md:px-6 py-3 whitespace-nowrap">
                      {tenant.tenantName}
                    </td>
                    <td className="px-2 sm:px-4 md:px-6 py-3 whitespace-nowrap">
                      {tenant.contact}
                    </td>
                    <td className="px-2 sm:px-4 md:px-6 py-3 whitespace-nowrap">
                      {tenant.roomNumber}
                    </td>
                    <td className="px-2 sm:px-4 md:px-6 py-3 whitespace-nowrap">
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
                    <td className="px-2 sm:px-4 md:px-6 py-3 whitespace-nowrap">
                      {tenant.rentAmount}
                    </td>
                    <td className="px-2 sm:px-4 md:px-6 py-3 whitespace-nowrap">
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleViewClick(tenant)}
                          className="text-gray-700 cursor-pointer hover:text-gray-900"
                          title="View"
                        >
                          <FaEye size={18} />
                        </button>
                        <button
                          onClick={() => handleEditClick(tenant)}
                          className="text-gray-700 cursor-pointer hover:text-gray-900"
                          title="Edit"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(tenant._id)}
                          className="text-gray-700 cursor-pointer hover:text-gray-900"
                          title="Delete"
                        >
                          <AiFillDelete size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-between items-center mt-6 gap-4 text-sm">
            {/* Items Per Page Selector */}
            <div className="flex items-center gap-2">
              <span className="text-gray-700">Items per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                className="border border-gray-300 rounded-md p-1 px-2 text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <button
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                className={`p-2 border cursor-pointer rounded-md transition ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed bg-gray-100"
                    : "hover:bg-gray-200 text-gray-700"
                }`}
              >
                <FaAngleDoubleLeft />
              </button>
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 border cursor-pointer rounded-md transition ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed bg-gray-100"
                    : "hover:bg-gray-200 text-gray-700"
                }`}
              >
                <FaChevronLeft />
              </button>
              <span className="text-gray-700 px-2">
                Page <strong>{currentPage}</strong> of{" "}
                <strong>{totalPages}</strong>
              </span>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 border cursor-pointer rounded-md transition ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed bg-gray-100"
                    : "hover:bg-gray-200 text-gray-700"
                }`}
              >
                <FaChevronRight />
              </button>
              <button
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
                className={`p-2 border cursor-pointer rounded-md transition ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed bg-gray-100"
                    : "hover:bg-gray-200 text-gray-700"
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

export default PaginatedTenantTable;
