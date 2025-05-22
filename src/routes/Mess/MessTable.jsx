import React from "react";

import { FaEdit, FaEye } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
const MessTable = ({
  menuData,
  handleViewClick,
  handleEditClick,
  handleDeleteClick,
  loading,
}) => {
  // Sort days of week in order
  const daysOrder = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 7,
  };

  const sortedMenuData = [...menuData].sort(
    (a, b) => daysOrder[a.day] - daysOrder[b.day]
  );

  return (
    <div className="w-full mt-1 overflow-x-auto rounded-xl border border-gray-200 shadow-md">
      <table className="min-w-[700px] w-full divide-y divide-gray-200 text-sm md:text-base">
        <thead className="bg-blue-100 text-gray-700">
          <tr>
            <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
              Day
            </th>
            <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
              Breakfast
            </th>
            <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
              Lunch
            </th>
            <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
              Dinner
            </th>
            <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-100">
          {loading ? (
            <tr>
              <td colSpan="5" className="py-10 text-center text-gray-500">
                <div className="flex justify-center items-center">
                  <div className="w-6 h-6 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
                  <span className="ml-3">Loading menu data...</span>
                </div>
              </td>
            </tr>
          ) : sortedMenuData.length === 0 ? (
            <tr>
              <td colSpan="5" className="py-10 text-center text-gray-500">
                No mess menu data available
              </td>
            </tr>
          ) : (
            sortedMenuData.map((menu) => (
              <tr key={menu.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 font-medium text-gray-800">
                  {menu.day}
                </td>
                <td className="py-3 px-4 text-gray-700">
                  <div className="text-sm">
                    {menu.breakfast ? (
                      <div className="line-clamp-1">{menu.breakfast}</div>
                    ) : (
                      <span className="text-gray-400 italic">
                        Not specified
                      </span>
                    )}
                    <div className="text-xs text-gray-400 mt-1">
                      {menu.breakfastTime || "No time specified"}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-700">
                  <div className="text-sm">
                    {menu.lunch ? (
                      <div className="line-clamp-1">{menu.lunch}</div>
                    ) : (
                      <span className="text-gray-400 italic">
                        Not specified
                      </span>
                    )}
                    <div className="text-xs text-gray-400 mt-1">
                      {menu.lunchTime || "No time specified"}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-700">
                  <div className="text-sm">
                    {menu.dinner ? (
                      <div className="line-clamp-1">{menu.dinner}</div>
                    ) : (
                      <span className="text-gray-400 italic">
                        Not specified
                      </span>
                    )}
                    <div className="text-xs text-gray-400 mt-1">
                      {menu.dinnerTime || "No time specified"}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 w-32">
                  <div className="flex items-center space-x-4 text-gray-600">
                    <button
                      onClick={() => handleViewClick(menu)}
                      title="View"
                      className="hover:text-blue-600 cursor-pointer"
                    >
                      <FaEye size={18} />
                    </button>
                    <button
                      onClick={() => handleEditClick(menu)}
                      title="Edit"
                      className="hover:text-green-600 cursor-pointer"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(menu.id)}
                      title="Delete"
                      className="hover:text-red-600 cursor-pointer"
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

export default MessTable;
