import React from "react";

const ConfirmModal = ({ confirmType, confirmDelete, setShowConfirmModal }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white p-6 rounded-md shadow-md text-center w-96 overflow-hidden transform transition-all sm:align-middle">
          <h2 className="text-lg font-bold mb-4">Are you sure?</h2>
          <p className="mb-6">
            {confirmType === "hostel"
              ? "This will remove the hostel and all rooms."
              : "This will delete the selected room."}
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={confirmDelete}
              className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
            >
              Confirm
            </button>
            <button
              onClick={() => setShowConfirmModal(false)}
              className="bg-gray-300 px-4 py-2 rounded cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
