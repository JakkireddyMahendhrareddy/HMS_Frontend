import React from "react";
import { RxCrossCircled } from "react-icons/rx";
import { Tooltip as ReactTooltip } from "react-tooltip";

const MessFormModal = ({
  setShowMessFormModal,
  newMenu,
  handleMenuChange,
  handleMenuSubmit,
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
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-[95%] sm:my-8 sm:align-middle sm:max-w-2xl">
          <div className="bg-white px-4 py-5 sm:px-6 sm:py-6 relative">
            <div className="flex justify-between items-center border-b pb-3 mb-5">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center w-full">
                  {isEditing ? "Edit Mess Menu" : "Create New Mess Menu"}
                </h2>
                <button
                  onClick={() => setShowMessFormModal(false)}
                  className="absolute top-6 right-6"
                  data-tooltip-id="close-tooltip"
                  data-tooltip-content="Close"
                  disabled={isSubmitting}
                >
                  <RxCrossCircled className="text-2xl text-red-600 hover:text-red-800 cursor-pointer" />
                </button>
                <ReactTooltip
                  id="close-tooltip"
                  place="left"
                  effect="solid"
                  className="!bg-red-700 !text-white !text-sm !rounded-md !px-3 !py-1 shadow-md"
                />
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleMenuSubmit();
                }}
                className="space-y-6"
              >
                {/* Day Selector */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Day of Week
                  </label>
                  <select
                    name="day"
                    value={newMenu.day}
                    onChange={handleMenuChange}
                    className={`w-full p-3 border rounded-lg ${
                      formErrors.day ? "border-red-500" : "border-gray-300"
                    }`}
                    disabled={isSubmitting}
                    required
                  >
                    <option value="">Select Day</option>
                    {[
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ].map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                  {formErrors.day && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.day}
                    </p>
                  )}
                </div>

                {/* Meal Sections */}
                {["breakfast", "lunch", "dinner"].map((meal) => (
                  <div key={meal} className="border-t border-gray-200 pt-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 capitalize">
                      {meal}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Menu Items
                        </label>
                        <textarea
                          name={`${meal}.item`}
                          value={newMenu.meals[meal].item}
                          onChange={handleMenuChange}
                          className={`w-full p-3 border rounded-lg ${
                            formErrors[`${meal}Item`]
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          rows="2"
                          placeholder={
                            meal === "breakfast"
                              ? "Milk, Bread, Eggs, etc."
                              : meal === "lunch"
                              ? "Rice, Dal, Vegetables, etc."
                              : "Roti, Sabzi, Curry, etc."
                          }
                          disabled={isSubmitting}
                          required
                        />
                        {formErrors[`${meal}Item`] && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors[`${meal}Item`]}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Timing
                        </label>
                        <input
                          type="text"
                          name={`${meal}.time`}
                          value={newMenu.meals[meal].time}
                          onChange={handleMenuChange}
                          className={`w-full p-3 border rounded-lg ${
                            formErrors[`${meal}Time`]
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder={
                            meal === "breakfast"
                              ? "7:00 AM - 9:00 AM"
                              : meal === "lunch"
                              ? "12:30 PM - 2:30 PM"
                              : "7:30 PM - 9:30 PM"
                          }
                          disabled={isSubmitting}
                          required
                        />
                        {formErrors[`${meal}Time`] && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors[`${meal}Time`]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {formErrors.general && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600">{formErrors.general}</p>
                  </div>
                )}

                {/* Buttons */}
                <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end items-center gap-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full sm:w-auto rounded-lg border border-gray-300 px-4 py-2 bg-white text-gray-700 hover:bg-gray-50"
                    disabled={isSubmitting}
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto rounded-lg px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Saving..."
                      : isEditing
                      ? "Update Menu"
                      : "Save Menu"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
  );
};

export default MessFormModal;
