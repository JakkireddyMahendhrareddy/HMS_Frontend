import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaUpload,
  FaIdCard,
  FaSignature,
  FaUser,
  FaHome,
  FaPhone,
} from "react-icons/fa";
import { toast } from "react-toastify"; // Make sure to import toast

const TenantFormModal = ({
  setShowTenantFormModal,
  newTenant,
  handleTenantChange,
  handleTenantSubmit,
  isEditing,
  rooms,
  resetForm,
}) => {
  const [addressesSame, setAddressesSame] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageCompressing, setImageCompressing] = useState(false);

  // Effect to copy permanent address to current address when checkbox changes
  useEffect(() => {
    if (addressesSame && newTenant.permanentAddress) {
      handleTenantChange({
        target: {
          name: "currentAddress",
          value: { ...newTenant.permanentAddress },
        },
      });
    }
  }, [addressesSame, newTenant.permanentAddress]);

  const handleAddressSameChange = (e) => {
    setAddressesSame(e.target.checked);
  };

  console.log(newTenant, ".............");

  // Compress image before uploading
  const compressImage = (
    file,
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.7
  ) => {
    return new Promise((resolve) => {
      setImageCompressing(true);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to Blob
          canvas.toBlob(
            (blob) => {
              setImageCompressing(false);
              resolve(blob);
            },
            "image/jpeg",
            quality
          );
        };
      };
    });
  };

  const handleFileChange = async (e) => {
    try {
      const { name, files } = e.target;
      if (files && files[0]) {
        // Show compressing indicator
        // toast.info("image comprased successfully...");

        // Compress the image
        const compressedBlob = await compressImage(files[0]);

        // Convert to base64 string but with much smaller size
        const reader = new FileReader();
        reader.onload = (event) => {
          handleTenantChange({
            target: {
              name,
              value: event.target.result,
              type: "file",
            },
          });
          // toast.success("Image added successfully");
          toast.success("Image added successfully", {
            className: "custom-toast",
            autoClose: 800, // <- speed in milliseconds
          });
        };
        reader.readAsDataURL(compressedBlob);
      }
    } catch (error) {
      toast.error("Error processing image");
      console.error("Error handling file:", error);
    }
  };

  const validateForm = () => {
    const errors = {};

    // Only validate essential fields to keep validation simpler
    if (!newTenant.tenantName?.trim()) errors.tenantName = "Name is required";
    if (!newTenant.dateOfBirth)
      errors.dateOfBirth = "Date of birth is required";
    if (!newTenant.contact || !/^[0-9]{10}$/.test(newTenant.contact))
      errors.contact = "Valid 10-digit mobile number is required";
    if (!newTenant.roomNumber)
      errors.roomNumber = "Room number must be selected";

    // Changed joinDate to moveInDate
    if (!newTenant.moveInDate) errors.moveInDate = "Move-in date is required";

    if (!newTenant.rentAmount || newTenant.rentAmount <= 0)
      errors.rentAmount = "Valid rent amount is required";

    // Agreement Start Date validation
    if (!newTenant.agreementStartDate)
      errors.agreementStartDate = "Agreement start date is required";

    // Validate addresses
    if (!newTenant.permanentAddress?.street?.trim())
      errors.permanentAddressStreet = "Permanent address is required";
    if (!addressesSame && !newTenant.currentAddress?.street?.trim())
      errors.currentAddressStreet = "Current address is required";

    // Emergency contact validation
    if (!newTenant.emergencyContact?.name?.trim())
      errors.emergencyName = "Emergency contact name is required";
    if (
      !newTenant.emergencyContact?.mobile ||
      !/^[0-9]{10}$/.test(newTenant.emergencyContact.mobile)
    ) {
      errors.emergencyMobile =
        "Valid 10-digit emergency contact number is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitForm = async (e) => {
    e.preventDefault();

    // Validate form first
    const isValid = validateForm();

    if (isValid) {
      setIsSubmitting(true);

      try {
        // Notify user of submission
        toast.info("Submitting tenant information...");

        await handleTenantSubmit();

        // Success notification
        toast.success("Tenant information saved successfully!");

        // Reset form and close modal
        resetForm();
        setShowTenantFormModal(false);
      } catch (error) {
        console.error("Error submitting tenant form:", error);
        toast.error("Error saving tenant information. Please try again.");

        setFormErrors({
          general: "There was an error saving the tenant. Please try again.",
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.warning("Please correct the errors in the form");

      // Scroll to first error
      const firstErrorField = document.querySelector(".error-field");
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const renderError = (fieldName) => {
    return formErrors[fieldName] ? (
      <p className="mt-1 text-sm text-red-600">{formErrors[fieldName]}</p>
    ) : null;
  };

  // Image upload preview component
  const ImageUpload = ({ label, name, icon, current }) => (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label} {!isEditing && <span className="text-red-500">*</span>}
      </label>
      <div className="flex items-center justify-center w-full">
        <label
          className="flex flex-col items-center justify-center w-full h-24 border-2 border-blue-200 border-dashed 
                         rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-all"
        >
          {current ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={current}
                alt={label}
                className="max-h-20 max-w-full object-contain rounded"
              />
              <div
                className="absolute inset-0 bg-black bg-opacity-30 opacity-0 hover:opacity-100 
                            flex items-center justify-center transition-opacity rounded"
              >
                <FaUpload className="text-white text-xl" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pt-3 pb-3">
              {React.createElement(icon, { className: "text-blue-400 mb-1" })}
              <p className="text-xs text-gray-500">Click to upload</p>
            </div>
          )}
          <input
            id={name}
            name={name}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            required={!current && !isEditing}
          />
        </label>
      </div>
    </div>
  );

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

        {/* Modal container */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="flex flex-col md:flex-row w-full">
            {/* Sidebar with gradient background */}
            <div className="hidden md:flex md:flex-col md:w-1/5 bg-gradient-to-br from-blue-500 to-teal-400 rounded-l-lg p-8 justify-start items-start text-white">
              <h3 className="text-xl font-semibold mb-2">
                {isEditing ? "Edit Tenant" : "Add New Tenant"}
              </h3>
              <p className="text-white text-opacity-80 text-sm">
                Fill in the tenant details in the form.
              </p>
            </div>

            {/* Form content */}
            <div className="w-full md:w-4/5 p-6 relative">
              {/* Mobile header - only visible on small screens */}
              <div className="flex md:hidden justify-between items-center mb-4 pb-3 border-b">
                <h3 className="text-lg font-semibold text-gray-800">
                  {isEditing ? "Edit Tenant" : "Add New Tenant"}
                </h3>
                <button
                  onClick={() => {
                    resetForm();
                    setShowTenantFormModal(false);
                  }}
                  className="text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              {/* Close button for desktop */}
              <button
                onClick={() => {
                  resetForm();
                  setShowTenantFormModal(false);
                }}
                className="hidden md:block absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <FaTimes size={20} />
              </button>

              {/* Form */}
              <form
                onSubmit={submitForm}
                className="max-h-[75vh] overflow-y-auto px-4 py-3 space-y-4"
              >
                {/* Personal Information */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="text-lg font-medium text-blue-800 mb-3 flex items-center">
                    <FaUser className="mr-2" /> Personal Information
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name & DOB */}
                    <div className={formErrors.tenantName ? "error-field" : ""}>
                      <label
                        htmlFor="tenantName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="tenantName"
                        name="tenantName"
                        value={newTenant.tenantName || ""}
                        onChange={handleTenantChange}
                        className={`w-full p-2 border rounded-md ${
                          formErrors.tenantName
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                      />
                      {renderError("tenantName")}
                    </div>

                    <div
                      className={formErrors.dateOfBirth ? "error-field" : ""}
                    >
                      <label
                        htmlFor="dateOfBirth"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={newTenant.dateOfBirth || ""}
                        onChange={handleTenantChange}
                        className={`w-full p-2 border rounded-md ${
                          formErrors.dateOfBirth
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                      />
                      {renderError("dateOfBirth")}
                    </div>

                    {/* Contact & Email */}
                    <div className={formErrors.contact ? "error-field" : ""}>
                      <label
                        htmlFor="contact"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="contact"
                        name="contact"
                        value={newTenant.contact || ""}
                        onChange={handleTenantChange}
                        pattern="[0-9]{10}"
                        className={`w-full p-2 border rounded-md ${
                          formErrors.contact
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                      />
                      {renderError("contact")}
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email (Optional)
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={newTenant.email || ""}
                        onChange={handleTenantChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    {/* Aadhaar */}
                    <div
                      className={formErrors.aadhaarNumber ? "error-field" : ""}
                    >
                      <label
                        htmlFor="aadhaarNumber"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Aadhaar Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="aadhaarNumber"
                        name="aadhaarNumber"
                        value={newTenant.aadhaarNumber || ""}
                        onChange={handleTenantChange}
                        pattern="[0-9]{12}"
                        className={`w-full p-2 border rounded-md ${
                          formErrors.aadhaarNumber
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                      />
                      {renderError("aadhaarNumber")}
                    </div>
                  </div>

                  {/* Document Uploads - Streamlined */}
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                    <ImageUpload
                      label="Photo"
                      name="passportPhoto"
                      icon={FaUser}
                      current={newTenant.passportPhoto}
                    />
                    <ImageUpload
                      label="Aadhaar Front"
                      name="aadhaarFront"
                      icon={FaIdCard}
                      current={newTenant.aadhaarFront}
                    />
                    <ImageUpload
                      label="Aadhaar Back"
                      name="aadhaarBack"
                      icon={FaIdCard}
                      current={newTenant.aadhaarBack}
                    />
                    <ImageUpload
                      label="Signature"
                      name="digitalSignature"
                      icon={FaSignature}
                      current={newTenant.digitalSignature}
                    />
                  </div>
                </div>

                {/* Address Information */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h4 className="text-lg font-medium text-green-800 mb-3 flex items-center">
                    <FaHome className="mr-2" /> Address Information
                  </h4>

                  {/* Permanent Address */}
                  <div className="mb-3">
                    <h5 className="text-md font-medium text-gray-700 mb-2 border-b border-green-200 pb-1">
                      Permanent Address
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div
                        className={`md:col-span-2 ${
                          formErrors.permanentAddressStreet ? "error-field" : ""
                        }`}
                      >
                        <label
                          htmlFor="permanentAddress.street"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Street Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="permanentAddress.street"
                          name="permanentAddress.street"
                          value={newTenant.permanentAddress?.street || ""}
                          onChange={handleTenantChange}
                          className={`w-full p-2 border rounded-md ${
                            formErrors.permanentAddressStreet
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {renderError("permanentAddressStreet")}
                      </div>

                      <div>
                        <label
                          htmlFor="permanentAddress.city"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="permanentAddress.city"
                          name="permanentAddress.city"
                          value={newTenant.permanentAddress?.city || ""}
                          onChange={handleTenantChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="permanentAddress.state"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          State <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="permanentAddress.state"
                          name="permanentAddress.state"
                          value={newTenant.permanentAddress?.state || ""}
                          onChange={handleTenantChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="permanentAddress.pincode"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Pincode <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="permanentAddress.pincode"
                          name="permanentAddress.pincode"
                          value={newTenant.permanentAddress?.pincode || ""}
                          onChange={handleTenantChange}
                          pattern="[0-9]{6}"
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address Same Checkbox */}
                  <div className="flex items-center mb-3 px-2 py-2 bg-green-100 rounded-md cursor-pointer">
                    <input
                      id="addressesSame"
                      type="checkbox"
                      checked={addressesSame}
                      onChange={handleAddressSameChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded cursor-pointer"
                    />
                    <label
                      htmlFor="addressesSame"
                      className="ml-2 block text-sm text-gray-700 cursor-pointer"
                    >
                      Current address same as permanent address
                    </label>
                  </div>

                  {/* Current Address */}
                  {!addressesSame && (
                    <div>
                      <h5 className="text-md font-medium text-gray-700 mb-2 border-b border-green-200 pb-1">
                        Current Address
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div
                          className={`md:col-span-2 ${
                            formErrors.currentAddressStreet ? "error-field" : ""
                          }`}
                        >
                          <label
                            htmlFor="currentAddress.street"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Street Address{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="currentAddress.street"
                            name="currentAddress.street"
                            value={newTenant.currentAddress?.street || ""}
                            onChange={handleTenantChange}
                            className={`w-full p-2 border rounded-md ${
                              formErrors.currentAddressStreet
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                          {renderError("currentAddressStreet")}
                        </div>

                        <div>
                          <label
                            htmlFor="currentAddress.city"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            City <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="currentAddress.city"
                            name="currentAddress.city"
                            value={newTenant.currentAddress?.city || ""}
                            onChange={handleTenantChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="currentAddress.state"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            State <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="currentAddress.state"
                            name="currentAddress.state"
                            value={newTenant.currentAddress?.state || ""}
                            onChange={handleTenantChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="currentAddress.pincode"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Pincode <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="currentAddress.pincode"
                            name="currentAddress.pincode"
                            value={newTenant.currentAddress?.pincode || ""}
                            onChange={handleTenantChange}
                            pattern="[0-9]{6}"
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Emergency Contact - Simplified */}
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <h4 className="text-lg font-medium text-purple-800 mb-3 flex items-center">
                    <FaPhone className="mr-2" /> Emergency Contact
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div
                      className={formErrors.emergencyName ? "error-field" : ""}
                    >
                      <label
                        htmlFor="emergencyContact.name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Contact Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="emergencyContact.name"
                        name="emergencyContact.name"
                        value={newTenant.emergencyContact?.name || ""}
                        onChange={handleTenantChange}
                        className={`w-full p-2 border rounded-md ${
                          formErrors.emergencyName
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {renderError("emergencyName")}
                    </div>

                    <div>
                      <label
                        htmlFor="emergencyContact.relationship"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Relationship <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="emergencyContact.relationship"
                        name="emergencyContact.relationship"
                        value={newTenant.emergencyContact?.relationship || ""}
                        onChange={handleTenantChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div
                      className={
                        formErrors.emergencyMobile ? "error-field" : ""
                      }
                    >
                      <label
                        htmlFor="emergencyContact.mobile"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="emergencyContact.mobile"
                        name="emergencyContact.mobile"
                        value={newTenant.emergencyContact?.mobile || ""}
                        onChange={handleTenantChange}
                        pattern="[0-9]{10}"
                        className={`w-full p-2 border rounded-md ${
                          formErrors.emergencyMobile
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {renderError("emergencyMobile")}
                    </div>
                  </div>
                </div>

                {/* Accommodation Details - Simplified */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="text-lg font-medium text-gray-700 mb-3 border-b pb-1">
                    Accommodation Details
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className={formErrors.roomNumber ? "error-field" : ""}>
                      <label
                        htmlFor="roomNumber"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Room Number <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="roomNumber"
                        name="roomNumber"
                        value={newTenant.roomNumber ?? ""}
                        onChange={handleTenantChange}
                        className={`w-full p-2 border rounded-md cursor-pointer ${
                          formErrors.roomNumber
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      >
                        <option value="">Select a room</option>
                        {rooms.map((room) => (
                          <option
                            key={room._id}
                            value={room.roomNumber}
                            disabled={
                              room.availableBeds <= 0 &&
                              newTenant.roomNumber !== room.roomNumber
                            }
                          >
                            Room {room.roomNumber} ({room.availableBeds} beds
                            available)
                          </option>
                        ))}
                      </select>
                      {renderError("roomNumber")}
                    </div>
                    <div className="form-group">
                      <label
                        htmlFor="moveInDate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Move-in Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="moveInDate"
                        name="moveInDate"
                        value={newTenant.moveInDate || ""}
                        onChange={handleTenantChange}
                        className={`w-full p-2 border rounded-md cursor-pointer ${
                          formErrors.moveInDate
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {formErrors.moveInDate && (
                        <div className="text-red-500 text-sm mt-1">
                          {formErrors.moveInDate}
                        </div>
                      )}
                    </div>

                    <div
                      className={
                        formErrors.agreementStartDate ? "error-field" : ""
                      }
                    >
                      <label
                        htmlFor="agreementStartDate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Agreement Start Date{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="agreementStartDate"
                        name="agreementStartDate"
                        value={newTenant.agreementStartDate || ""}
                        onChange={handleTenantChange}
                        className={`w-full p-2 border rounded-md cursor-pointer ${
                          formErrors.agreementStartDate
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {renderError("agreementStartDate")}
                    </div>

                    <div className={formErrors.rentAmount ? "error-field" : ""}>
                      <label
                        htmlFor="rentAmount"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Rent Amount (₹) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="rentAmount"
                        name="rentAmount"
                        value={newTenant.rentAmount || ""}
                        onChange={handleTenantChange}
                        className={`w-full p-2 border rounded-md ${
                          formErrors.rentAmount
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {renderError("rentAmount")}
                    </div>
                  </div>
                </div>

                {/* Legal Compliance - Simplified */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="text-lg font-medium text-gray-700 mb-2 border-b pb-1">
                    Legal Compliance
                  </h4>

                  <div className="flex items-center mb-2 cursor-pointer">
                    <input
                      id="policeVerificationConsent"
                      name="policeVerificationConsent"
                      type="checkbox"
                      checked={newTenant.policeVerificationConsent || false}
                      onChange={(e) =>
                        handleTenantChange({
                          target: {
                            name: "policeVerificationConsent",
                            value: e.target.checked,
                          },
                        })
                      }
                      className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded cursor-pointer"
                    />
                    <label
                      htmlFor="policeVerificationConsent"
                      className="ml-2 block text-sm text-gray-700 cursor-pointer"
                    >
                      I consent to police verification{" "}
                      <span className="text-red-500">*</span>
                    </label>
                  </div>

                  <div className="flex items-center cursor-pointer">
                    <input
                      id="termsAgreement"
                      name="termsAgreement"
                      type="checkbox"
                      checked={newTenant.termsAgreement  || false}
                      onChange={(e) =>
                        handleTenantChange({
                          target: {
                            name: "termsAgreement",
                            value: e.target.checked,
                          },
                        })
                      }
                      className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded cursor-pointer"
                    />
                    <label
                      htmlFor="termsAccepted"
                      className="ml-2 block text-sm text-gray-700 cursor-pointer"
                    >
                      I agree to the terms and conditions{" "}
                      <span className="text-red-500">*</span>
                    </label>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setShowTenantFormModal(false);
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting || imageCompressing}
                    className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer`}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TenantFormModal;
