import React from "react";
import { RxCrossCircled } from "react-icons/rx";
import { Tooltip as ReactTooltip } from "react-tooltip";
const HostelForm = ({
  setHostelName,
  setHostelCategory,
  setTotalRooms,
  setMaxCapacity,
  addNewHostel,
  updateHostelDetails,
  hostelName,
  hostelCategory,
  totalRooms,
  maxCapacity,
  setShowAddHostelFormModal,
  setIsEditingHostel,
  isEditingHostel,
}) => {
  return (
    // <div className="fixed inset-0 z-10 overflow-y-auto">
    //   <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
    //     {/* Background overlay */}
    //     <div className="fixed inset-0 transition-opacity" aria-hidden="true">
    //       <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
    //     </div>

    //     {/* This span is used to trick the browser into centering the modal contents */}
    //     <span
    //       className="hidden sm:inline-block sm:align-middle sm:h-screen"
    //       aria-hidden="true"
    //     >
    //       &#8203;
    //     </span>

    //     {/* Modal Panel */}
    //     <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-6 sm:align-middle sm:max-w-md sm:w-full">
    //       <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
    //         <div className="flex justify-between items-start">
    //           <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
    //             {isEditingHostel ? " Edit Hostel" : "Add Hostel"}
    //           </h2>
    //           <button
    //             onClick={() => {
    //               setShowAddHostelFormModal(false), setIsEditingHostel(false);
    //             }}
    //             className="absolute top-5 right-5"
    //             data-tooltip-id="add-form-close-tooltip"
    //             data-tooltip-content="Close"
    //           >
    //             <RxCrossCircled className="text-2xl text-red-600 cursor-pointer hover:text-red-900" />
    //           </button>
    //           <ReactTooltip
    //             id="add-form-close-tooltip"
    //             place="left"
    //             effect="solid"
    //             className="!bg-red-700 !text-white !text-sm !rounded-sm !px-3 !py-1 shadow-lg"
    //           />
    //         </div>

    //         <label>Hostel Name</label>
    //         <input
    //           type="text"
    //           placeholder="Hostel Name"
    //           value={hostelName ?? ""}
    //           className="w-full mt-1 p-3 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
    //           onChange={(e) => setHostelName(e.target.value)}
    //         />
    //         <label>Hostel Category</label>
    //         <select
    //           name="category"
    //           value={hostelCategory}
    //           onChange={(e) => setHostelCategory(e.target.value)}
    //           className="w-full mt-1 p-3 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
    //         >
    //           <option value="Men">Men</option>
    //           <option value="Women">Women</option>
    //         </select>
    //         <label>Total Rooms</label>
    //         <input
    //           type="number"
    //           min="0"
    //           name="totalRooms"
    //           placeholder="Total Rooms"
    //           value={totalRooms ?? ""}
    //           onChange={(e) => setTotalRooms(e.target.value)}
    //           className="w-full mt-1 p-3 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
    //         />
    //         <label>Total Capacity</label>
    //         <input
    //           type="number"
    //           min="0"
    //           name="maxCapacity"
    //           placeholder="Total Capacity"
    //           value={maxCapacity ?? ""}
    //           onChange={(e) => setMaxCapacity(e.target.value)}
    //           className="w-full mt-1 p-3 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
    //         />

    //         {/* <div className="flex justify-end items-center gap-6 mb-4 mt-6"> */}
    //         <div className="px-4 py-3 mt-4 sm:px-6 flex justify-end items-center">
    //           <button
    //             onClick={() => {
    //               setHostelName(""),
    //                 setHostelCategory(""),
    //                 setTotalRooms(""),
    //                 setMaxCapacity("");
    //             }}
    //             className="mt-3 w-full cursor-pointer inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
    //           >
    //             {" "}
    //             Reset
    //           </button>
    //           <button
    //             onClick={() => {
    //               isEditingHostel ? updateHostelDetails() : addNewHostel();
    //               setShowAddHostelFormModal(false);
    //               setIsEditingHostel(false);
    //             }}
    //             className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 cursor-pointer bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
    //           >
    //             {" "}
    //             Save
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
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
        <div className=" align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-md sm:w-full">
          <div className="bg-white px-6 py-5 sm:px-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {isEditingHostel ? "Edit Hostel" : "Add Hostel"}
              </h2>
              <button
                onClick={() => {
                  setShowAddHostelFormModal(false);
                  setIsEditingHostel(false);
                }}
                className="text-red-500 hover:text-red-700 text-2xl"
                aria-label="Close Modal"
              >
                <RxCrossCircled />
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Hostel Name
                </label>
                <input
                  type="text"
                  placeholder="Hostel Name"
                  value={hostelName ?? ""}
                  onChange={(e) => setHostelName(e.target.value)}
                  className="mt-1 w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Hostel Category
                </label>
                <select
                  value={hostelCategory}
                  onChange={(e) => setHostelCategory(e.target.value)}
                  className="mt-1 w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500 bg-gray-50"
                >
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Total Rooms
                </label>
                <input
                  type="number"
                  min="0"
                  value={totalRooms ?? ""}
                  onChange={(e) => setTotalRooms(e.target.value)}
                  className="mt-1 w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500"
                  placeholder="Total Rooms"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Total Capacity
                </label>
                <input
                  type="number"
                  min="0"
                  value={maxCapacity ?? ""}
                  onChange={(e) => setMaxCapacity(e.target.value)}
                  className="mt-1 w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500"
                  placeholder="Total Capacity"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => {
                  setHostelName("");
                  setHostelCategory("");
                  setTotalRooms("");
                  setMaxCapacity("");
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400"
              >
                Reset
              </button>

              <button
                onClick={() => {
                  isEditingHostel ? updateHostelDetails() : addNewHostel();
                  setShowAddHostelFormModal(false);
                  setIsEditingHostel(false);
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostelForm;
