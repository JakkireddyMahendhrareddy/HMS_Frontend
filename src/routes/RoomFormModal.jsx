import React from "react";

const RoomFormModal = ({
  setShowRoomFormModal,
  setError,
  editRoomId,
  newRoom,
  handleRoomChange,
  handleAvailableBedsChange,
  error,
  addRoom,
}) => {
  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* This span is used to trick the browser into centering the modal contents */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        {/* Modal Panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {editRoomId !== null ? "Edit Room" : "Add Room"}
              </h2>
            </div>

            {/* Form Inputs */}
            <div className="gap-4 flex-wrap flex flex-col justify-center">
              <div className="flex flex-col gap-2">
                <label className="font-semibold">Room Number</label>
                <input
                  type="text"
                  name="number"
                  placeholder="Room Number"
                  value={newRoom.number}
                  onChange={handleRoomChange}
                  className="shadow border rounded w-full md:w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-semibold">Room Type</label>
                <select
                  name="type"
                  value={newRoom.type}
                  onChange={handleRoomChange}
                  className="flex-1 shadow border rounded w-full md:w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Room Type
                  </option>
                  <option value="Single Sharing">Single Sharing</option>
                  <option value="Two Sharing">Two Sharing</option>
                  <option value="Three Sharing">Three Sharing</option>
                  <option value="Four Sharing">Four Sharing</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-semibold">Available Beds</label>
                <input
                  type="number"
                  min="0"
                  max={newRoom.beds}
                  name="availableBeds"
                  placeholder="Available Beds"
                  value={newRoom.availableBeds}
                  onChange={handleAvailableBedsChange}
                  className="shadow border rounded w-full md:w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-semibold">Room Rent</label>
                <input
                  type="number"
                  min="0"
                  name="rent"
                  placeholder="Room Rent"
                  value={newRoom.rent}
                  step={newRoom.rent >= 4000 ? 100 : 500}
                  onChange={handleRoomChange}
                  className="shadow border rounded w-full md:w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <p className="text-red-600 mt-4 font-semibold text-lg text-center">
                {error}
              </p>
            )}

            {/* Buttons */}
            <div className="px-4 py-3 mt-6 sm:px-6 sm:flex sm:flex-row-reverse flex justify-start">
              <button
                onClick={addRoom}
                className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 cursor-pointer bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {editRoomId !== null ? "Update Room" : "Add Room"}
              </button>
              <button
                onClick={() => {
                  setShowRoomFormModal(false), setError(false);
                }}
                className="mt-3 w-full cursor-pointer inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomFormModal;
