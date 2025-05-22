import React from "react";
import { RxCrossCircled } from "react-icons/rx";
import { Tooltip as ReactTooltip } from "react-tooltip";

const MessDetailsModal = ({ menu, setShowDetailsModal }) => {
  if (!menu) return null;

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
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-[95%] sm:my-8 sm:align-middle sm:max-w-2xl">
          <div className="bg-white px-4 py-5 sm:px-6 sm:py-6 relative">
            <div className="flex justify-between items-center border-b pb-3 mb-5">
              <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-700 w-full">
                Mess Menu Details - {menu.day}
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="absolute top-4 right-4"
                data-tooltip-id="close-tooltip"
                data-tooltip-content="Close"
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

            <div className="space-y-6">
              {/* 🍳 Breakfast */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-3 flex items-center">
                  <span className="mr-2">🍳</span> Breakfast
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Menu Items
                    </h4>
                    <p className="text-gray-800 whitespace-pre-line">
                      {menu.breakfast || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Timing
                    </h4>
                    <p className="text-gray-800">
                      {menu.breakfastTime || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              {/* 🍲 Lunch */}
              <div className="bg-amber-50 rounded-lg p-4">
                <h3 className="text-lg sm:text-xl font-semibold text-amber-800 mb-3 flex items-center">
                  <span className="mr-2">🍲</span> Lunch
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Menu Items
                    </h4>
                    <p className="text-gray-800 whitespace-pre-line">
                      {menu.lunch || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Timing
                    </h4>
                    <p className="text-gray-800">
                      {menu.lunchTime || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              {/* 🍽️ Dinner */}
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="text-lg sm:text-xl font-semibold text-purple-800 mb-3 flex items-center">
                  <span className="mr-2">🍽️</span> Dinner
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Menu Items
                    </h4>
                    <p className="text-gray-800 whitespace-pre-line">
                      {menu.dinner || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Timing
                    </h4>
                    <p className="text-gray-800">
                      {menu.dinnerTime || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-5 mt-6 flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-700 rounded-lg text-sm sm:text-base"
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

export default MessDetailsModal;
