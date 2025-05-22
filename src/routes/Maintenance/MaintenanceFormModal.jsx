import React from "react";
import { RxCrossCircled } from "react-icons/rx";
import { Tooltip as ReactTooltip } from "react-tooltip";

const MaintenanceFormModal = ({
  setShowFormModal,
  newIssue,
  handleIssueChange,
  handleSubmit,
  isEditing,
  resetForm,
  formErrors,
  isSubmitting,
}) => {
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
            <div className="relative border-b pb-4 mb-6">
              {/* Close Button */}
              <button
                onClick={() => setShowFormModal(false)}
                className="absolute top-0 right-0 mt-2 mr-2 sm:mt-3 sm:mr-3"
                data-tooltip-id="close-tooltip"
                data-tooltip-content="Close"
                disabled={isSubmitting}
              >
                <RxCrossCircled className="text-2xl text-red-600 cursor-pointer hover:text-red-900" />
              </button>

              {/* Title (Responsive Centered) */}
              <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-700 px-4">
                {isEditing
                  ? "Edit Maintenance Issue"
                  : "Report New Maintenance Issue"}
              </h2>

              {/* Tooltip */}
              <ReactTooltip
                id="close-tooltip"
                place="left"
                effect="solid"
                className="!bg-red-700 !text-white !text-sm !rounded-sm !px-3 !py-1 shadow-lg"
              />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(e);
              }}
            >
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Room Number *
                    </label>
                    <input
                      type="text"
                      name="roomNo"
                      value={newIssue.roomNo}
                      onChange={handleIssueChange}
                      className={`w-full p-3 border rounded-lg ${
                        formErrors.roomNo ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="e.g. B-101"
                      disabled={isSubmitting}
                      required
                    />
                    {formErrors.roomNo && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.roomNo}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Priority *
                    </label>
                    <select
                      name="priority"
                      value={newIssue.priority}
                      onChange={handleIssueChange}
                      className={`w-full p-3 border rounded-lg ${
                        formErrors.priority
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      disabled={isSubmitting}
                      required
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                    {formErrors.priority && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.priority}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Issue Description *
                  </label>
                  <textarea
                    name="issue"
                    value={newIssue.issue}
                    onChange={handleIssueChange}
                    className={`w-full p-3 border rounded-lg ${
                      formErrors.issue ? "border-red-500" : "border-gray-300"
                    }`}
                    rows="3"
                    placeholder="Describe the maintenance issue in detail"
                    disabled={isSubmitting}
                    required
                  />
                  {formErrors.issue && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.issue}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Status *
                    </label>
                    <select
                      name="status"
                      value={newIssue.status}
                      onChange={handleIssueChange}
                      className={`w-full p-3 border rounded-lg ${
                        formErrors.status ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={isSubmitting}
                      required
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                    {formErrors.status && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.status}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Request Date *
                    </label>
                    <input
                      type="date"
                      name="createdDate"
                      value={newIssue.createdDate}
                      onChange={handleIssueChange}
                      className={`w-full p-3 border rounded-lg ${
                        formErrors.createdDate
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      disabled={isSubmitting}
                      required
                    />
                    {formErrors.createdDate && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.createdDate}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Requested By *
                    </label>
                    <input
                      type="text"
                      name="requestedBy"
                      value={newIssue.requestedBy}
                      onChange={handleIssueChange}
                      className={`w-full p-3 border rounded-lg ${
                        formErrors.requestedBy
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Person who reported the issue"
                      disabled={isSubmitting}
                      required
                    />
                    {formErrors.requestedBy && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.requestedBy}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Assigned To
                    </label>
                    <input
                      type="text"
                      name="assignedTo"
                      value={newIssue.assignedTo}
                      onChange={handleIssueChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="Person responsible for fixing (optional)"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Remarks / Notes
                  </label>
                  <textarea
                    name="remarks"
                    value={newIssue.remarks}
                    onChange={handleIssueChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    rows="2"
                    placeholder="Additional notes or remarks (optional)"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {formErrors.general && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600">{formErrors.general}</p>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end items-center gap-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full sm:w-auto rounded-lg border border-gray-300 px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 cursor-pointer"
                  disabled={isSubmitting}
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto rounded-lg px-4 py-2 bg-blue-500 text-white hover:bg-blue-700 cursor-pointer disabled:bg-blue-300"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Saving..."
                    : isEditing
                    ? "Update Issue"
                    : "Submit Issue"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceFormModal;
