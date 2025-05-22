import React from "react";
import Table from "../../ui/Table/Table";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const HostelAndRoomDetails = ({
  setIsEditingHostel,
  hostel,
  handleDeleteHostelClick,
  setShowRoomFormModal,
  setEditRoomId,
  setNewRoom,
  displayedRooms,
  editRoom,
  handleDeleteRoomClick,
  setPageNumber,
  rooms,
  pageNumber,
  totalPages,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      {/* Header: Hostel Overview + Action Buttons */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-gray-700">
          Hostel Overview
        </h2>
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={() => setIsEditingHostel(true)}
            className="text-blue-500 border-2 border-blue-500 px-4 py-1.5 rounded-lg flex items-center gap-2 hover:scale-105 transition"
          >
            <FaEdit size={18} />
            Edit
          </button>
          <button
            onClick={handleDeleteHostelClick}
            className="bg-blue-500 text-white px-4 py-1.5 rounded-lg flex items-center gap-2 hover:bg-blue-600 hover:scale-105 transition"
          >
            <FaTrash size={18} />
            Delete
          </button>
        </div>
      </div>

      {/* Hostel Details Card */}
      <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 p-5 rounded-2xl border border-gray-300 bg-white shadow-md text-lg grid gap-4">
        <p className="text-gray-700">
          Hostel Name:{" "}
          <span className="font-semibold text-xl">{hostel.name}</span>
        </p>
        <p className="text-gray-700">
          Category:{" "}
          <span className="font-semibold text-xl">{hostel.category}</span>
        </p>
        <p className="text-gray-700">
          Rooms:{" "}
          <span className="font-semibold text-xl">{hostel.totalRooms}</span>
        </p>
        <p className="text-gray-700">
          Max Capacity:{" "}
          <span className="font-semibold text-xl">{hostel.maxCapacity}</span>
        </p>
      </div>

      {/* Rooms List Section */}
      <div className="bg-white border border-gray-300 rounded-2xl shadow-md p-4 mt-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
            Rooms List
          </h3>
          <button
            onClick={() => {
              setShowRoomFormModal(true);
              setEditRoomId(null);
              setNewRoom({
                number: "",
                type: "",
                beds: "",
                availableBeds: "",
                rent: "",
                status: "available",
              });
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 hover:scale-105 transition"
          >
            <FaPlus className="text-white" />
            Add New Room
          </button>
        </div>

        {/* Rooms Table */}
        <div className="overflow-x-auto">
          <Table
            headingList={[
              "Room No.",
              "Room Type",
              "Beds",
              "Available Beds",
              "Room Rent",
              "Room Status",
            ]}
            bodyData={displayedRooms}
            editRoom={editRoom}
            handleDeleteRoomClick={handleDeleteRoomClick}
          />
        </div>

        {/* Empty State */}
        {rooms.length === 0 && (
          <p className="text-center font-medium text-lg text-red-500 py-4">
            No rooms available. Add a new room to get started.
          </p>
        )}

        {/* Pagination */}
        {rooms.length !== 0 && (
          <div className="flex justify-center items-center gap-6 mt-4 text-sm font-medium text-gray-700 flex-wrap">
            <button
              disabled={pageNumber === 1}
              onClick={() => setPageNumber((prev) => prev - 1)}
              className={`px-4 py-2 rounded-md ${
                pageNumber === 1
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              Prev
            </button>
            <span>
              Page{" "}
              <span className="font-bold">
                {totalPages !== 0 ? pageNumber : 0}
              </span>{" "}
              of {totalPages}
            </span>
            <button
              disabled={pageNumber === totalPages}
              onClick={() => setPageNumber((prev) => prev + 1)}
              className={`px-4 py-2 rounded-md ${
                pageNumber === totalPages
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HostelAndRoomDetails;
