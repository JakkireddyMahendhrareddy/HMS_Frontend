import React, { useState, useEffect } from "react";
// import { FaBed, FaDollarSign, FaCheckCircle, FaEdit } from "react-icons/fa";
import HostelAndRoomDetails from "../Hostel/HostelAndRoomdetails";
import ConfirmModal from "../ConfirmModal";
import { backendUrl, toastNoficationSettings } from "../../utils/utils";
import { toast } from "react-toastify";
import RoomFormModal from "../RoomFormModal";
import HostelForm from "./HostelForm";
import NoHostelMessage from "../NoHostelMessage";
const HostelInfo = () => {
  const createHostelUrl = `${backendUrl}/api/hostel/add`;
  const getHostelUrl = `${backendUrl}/api/hostel/view`;
  const confirmEditUrl = `${backendUrl}/api/hostel/edit`;
  const confirmDeleteUrl = `${backendUrl}/api/hostel/remove`;
  const getRoomsUrl = `${backendUrl}/api/hostel/room/get`;

  const addRoomUrl = `${backendUrl}/api/hostel/room/add`;
  const editRoomUrl = `${backendUrl}/api/hostel/room/edit/`;
  const deleteRoomUrl = `${backendUrl}/api/hostel/room/remove/`;
  console.log(getHostelUrl,"hhhhhhhhhhhhhhhhhhhhhhhhhhcd")

  const [hostel, setHostel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [showAddHostelFormModal, setShowAddHostelFormModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditingHostel, setIsEditingHostel] = useState(false);
  const [newRoom, setNewRoom] = useState({
    number: "",
    type: "",
    beds: "",
    availableBeds: "",
    rent: "",
    status: "available",
  });
  const [editRoomId, setEditRoomId] = useState(null);
  const [error, setError] = useState("");
  const [showRoomFormModal, setShowRoomFormModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmType, setConfirmType] = useState(null);
  const [roomNumberToDelete, setRoomNumberToDelete] = useState(null);
  const [hostelName, setHostelName] = useState("");
  const [hostelCategory, setHostelCategory] = useState("Men");
  const [totalRooms, setTotalRooms] = useState("");
  const [maxCapacity, setMaxCapacity] = useState("");

  const mapBackendRoomToFrontend = (room) => ({
    number: room.roomNumber,
    type: room.sharingType,
    beds: room.totalBeds,
    availableBeds: room.availableBeds,
    rent: room.rent,
  });

  const mapFrontendRoomToBackend = (room) => {
    return {
      roomNumber: room.number,
      sharingType: room.type,
      totalBeds: parseInt(room.beds, 10),
      availableBeds: parseInt(room.availableBeds, 10),
      rent: parseInt(room.rent, 10),
    };
  };

  const fetchRooms = async () => {
    try {
      const response = await fetch(getRoomsUrl, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        if (data) {
          const convertedRooms = data.map(mapBackendRoomToFrontend);
          setRooms(convertedRooms);
        } else {
          setRooms([]);
        }
      }
    } catch (error) {
      toast.error("Something Went Wrong", toastNoficationSettings);
    }
  };

  const fetchHostel = async () => {
    try {
      setLoading(true);
      const response = await fetch(getHostelUrl, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        if (data) {
          setHostel(data);
          fetchRooms();
        } else {
          setHostel(null);
        }
      }
    } catch (error) {
      toast.warning("Something Went Wrong", toastNoficationSettings);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostel();
  }, []);

  useEffect(() => {
    if (isEditingHostel && hostel) {
      setHostelName(hostel.name || "");
      setHostelCategory(hostel.category || "men");
      setTotalRooms(hostel.totalRooms || "");
      setMaxCapacity(hostel.maxCapacity || "");
    }
  }, [hostel, isEditingHostel]);

  const [pageNumber, setPageNumber] = useState(1);
  const roomsPerPage = 10;

  const handleHostelSubmit = async (method, url, hostelData) => {
    try {
      setLoading(true);
      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hostelData),
      });
      const data = await response.json();
      if (response.ok) {
        setHostel(hostelData);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.warning("Something Went Wrong", toastNoficationSettings);
    } finally {
      setLoading(false);
    }
  };

  const getHostelData = () => {
    return {
      name: hostelName || hostel?.name,
      category: hostelCategory || hostel?.category,
      totalRooms: totalRooms || hostel?.totalRooms,
      maxCapacity: maxCapacity || hostel?.maxCapacity,
    };
  };

  const validateHostelData = (hostelInfo) => {
    if (!hostelInfo.name || !hostelInfo.totalRooms || !hostelInfo.maxCapacity) {
      toast.error("All fields are required");
      return false;
    }
    return true;
  };

  const addNewHostel = () => {
    const hostelInfo = getHostelData();
    if (!validateHostelData(hostelInfo)) return;
    handleHostelSubmit("POST", createHostelUrl, hostelInfo);
  };

  const updateHostelDetails = () => {
    const hostelInfo = getHostelData();
    if (!validateHostelData(hostelInfo)) return;
    handleHostelSubmit("PATCH", confirmEditUrl, hostelInfo);
  };

  const handleRoomChange = (e) => {
    const { name, value } = e.target;
    if (name === "type") {
      let beds = "";
      switch (value) {
        case "Single Sharing":
          beds = 1;
          break;
        case "Two Sharing":
          beds = 2;
          break;
        case "Three Sharing":
          beds = 3;
          break;
        case "Four Sharing":
          beds = 4;
          break;
        default:
          beds = "";
          break;
      }
      setNewRoom({ ...newRoom, type: value, beds, availableBeds: beds });
    } else {
      setNewRoom({ ...newRoom, [name]: value });
    }
  };

  const handleAvailableBedsChange = (e) => {
    const value = parseInt(e.target.value, 10) || 0;
    if (value >= 0 && value <= newRoom.beds) {
      setNewRoom({ ...newRoom, availableBeds: value });
    }
  };

  const handleRoomSubmit = async (roomInfo, isEdit = false, roomID = null) => {
    try {
      const url = isEdit ? `${editRoomUrl}${roomID}` : addRoomUrl;
      const method = isEdit ? "PATCH" : "POST";
      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roomInfo),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        fetchRooms();
        setNewRoom({
          number: "",
          type: "",
          beds: "",
          availableBeds: "",
          rent: "",
          status: "Available",
        });
        setShowRoomFormModal(false);
        setError("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.warning("Something Went Wrong", toastNoficationSettings);
    }
  };

  const addRoom = () => {
    const updatedRoom = {
      ...newRoom,
      status: parseInt(newRoom.availableBeds) === 0 ? "Occupied" : "Available",
    };

    if (
      !updatedRoom.number ||
      !updatedRoom.type ||
      updatedRoom.beds === "" ||
      updatedRoom.availableBeds === "" ||
      !updatedRoom.rent
    ) {
      return;
    }

    const backendRoom = mapFrontendRoomToBackend(updatedRoom);

    if (editRoomId !== null) {
      const editableFields = {
        sharingType: backendRoom.sharingType,
        rent: backendRoom.rent,
        totalBeds: backendRoom.totalBeds,
        availableBeds: backendRoom.availableBeds,
      };
      const editableFieldID = String(rooms[editRoomId].number);
      handleRoomSubmit(editableFields, true, editableFieldID);
      setEditRoomId(null);
    } else {
      console.log("Sending Room Data:", backendRoom);
      handleRoomSubmit(backendRoom);
    }

    setNewRoom({ number: "", type: "", beds: "", availableBeds: "", rent: "" });
    setError("");
    setShowRoomFormModal(false);
  };

  const handleDeleteHostelClick = () => {
    setConfirmType("hostel");
    setShowConfirmModal(true);
  };

  const deleteHostelInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch(confirmDeleteUrl, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        setHostel(null);
        setRooms([]);
        setHostelName(null);
        setHostelCategory("Men");
        setTotalRooms(null);
        setMaxCapacity(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.warning("Something went wrong", toastNoficationSettings);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoomClick = (roomNumber) => {
    setConfirmType("room");
    setRoomNumberToDelete(roomNumber);
    setShowConfirmModal(true);
  };

  const deleteRoomInfo = async (roomNumber) => {
    try {
      const response = await fetch(`${deleteRoomUrl}${roomNumber}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        fetchRooms();
        toast.success(data.message);
        setRooms(rooms.filter((_, i) => i !== roomNumber));
        setRoomNumberToDelete(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.warning("Something Went Wrong", toastNoficationSettings);
    }
  };

  const confirmDelete = () => {
    if (confirmType === "hostel") {
      deleteHostelInfo();
    } else if (confirmType === "room" && roomNumberToDelete !== null) {
      deleteRoomInfo(roomNumberToDelete);
    }
    setShowConfirmModal(false);
    setConfirmType(null);
  };
  const editRoom = (roomNumber) => {
    const roomIndex = rooms.findIndex((room) => room.number === roomNumber);
    if (roomIndex === -1) {
      toast.error("Room not found");
      return;
    }
    setNewRoom(rooms[roomIndex]);
    setEditRoomId(roomIndex);
    setShowRoomFormModal(true);
  };
  const totalPages = Math.ceil(rooms.length / roomsPerPage);
  const displayedRooms = rooms.slice(
    (pageNumber - 1) * roomsPerPage,
    pageNumber * roomsPerPage
  );
  return (
    // <div>
    //   <div className="w-full pt-0 min-h-screen flex justify-center items-start relative">
    //     <div className="w-full pt-4 max-w-7xl">
    //       {loading ? (
    //         <div className="flex justify-center items-center h-60">
    //           <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
    //         </div>
    //       ) : !hostel || Object.keys(hostel).length === 0 ? (
    //         <NoHostelMessage
    //           setShowAddHostelFormModal={setShowAddHostelFormModal}
    //         />
    //       ) : (
    //         <div>
    //           <HostelAndRoomDetails
    //             setIsEditingHostel={setIsEditingHostel}
    //             hostel={hostel}
    //             handleDeleteHostelClick={handleDeleteHostelClick}
    //             setShowRoomFormModal={setShowRoomFormModal}
    //             setEditRoomId={setEditRoomId}
    //             setNewRoom={setNewRoom}
    //             displayedRooms={displayedRooms}
    //             editRoom={editRoom}
    //             handleDeleteRoomClick={handleDeleteRoomClick}
    //             setPageNumber={setPageNumber}
    //             rooms={rooms}
    //             pageNumber={pageNumber}
    //             totalPages={totalPages}
    //           />
    //         </div>
    //       )}

    //       {showRoomFormModal && (
    //         <RoomFormModal
    //           setShowRoomFormModal={setShowRoomFormModal}
    //           setError={setError}
    //           editRoomId={editRoomId}
    //           newRoom={newRoom}
    //           handleRoomChange={handleRoomChange}
    //           handleAvailableBedsChange={handleAvailableBedsChange}
    //           error={error}
    //           addRoom={addRoom}
    //         />
    //       )}

    //       {(isEditingHostel || showAddHostelFormModal) && (
    //         <HostelForm
    //           setHostelName={setHostelName}
    //           setHostelCategory={setHostelCategory}
    //           setTotalRooms={setTotalRooms}
    //           setMaxCapacity={setMaxCapacity}
    //           addNewHostel={addNewHostel}
    //           updateHostelDetails={updateHostelDetails}
    //           hostelName={hostelName}
    //           hostelCategory={hostelCategory}
    //           totalRooms={totalRooms}
    //           maxCapacity={maxCapacity}
    //           setShowAddHostelFormModal={setShowAddHostelFormModal}
    //           setIsEditingHostel={setIsEditingHostel}
    //           isEditingHostel={isEditingHostel}
    //         />
    //       )}

    //       {showConfirmModal && (
    //         <ConfirmModal
    //           confirmType={confirmType}
    //           confirmDelete={confirmDelete}
    //           setShowConfirmModal={setShowConfirmModal}
    //         />
    //       )}
    //     </div>
    //   </div>
    // </div>
    <div className="min-h-screen w-full bg-gray-50 px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto py-6 sm:py-8 lg:py-10">
    {loading ? (
      <div className="flex justify-center items-center h-60">
        <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
      </div>
    ) : !hostel || Object.keys(hostel).length === 0 ? (
      <NoHostelMessage setShowAddHostelFormModal={setShowAddHostelFormModal} />
    ) : (
      <div className="space-y-6">
        <HostelAndRoomDetails
          setIsEditingHostel={setIsEditingHostel}
          hostel={hostel}
          handleDeleteHostelClick={handleDeleteHostelClick}
          setShowRoomFormModal={setShowRoomFormModal}
          setEditRoomId={setEditRoomId}
          setNewRoom={setNewRoom}
          displayedRooms={displayedRooms}
          editRoom={editRoom}
          handleDeleteRoomClick={handleDeleteRoomClick}
          setPageNumber={setPageNumber}
          rooms={rooms}
          pageNumber={pageNumber}
          totalPages={totalPages}
        />
      </div>
    )}

    {showRoomFormModal && (
      <RoomFormModal
        setShowRoomFormModal={setShowRoomFormModal}
        setError={setError}
        editRoomId={editRoomId}
        newRoom={newRoom}
        handleRoomChange={handleRoomChange}
        handleAvailableBedsChange={handleAvailableBedsChange}
        error={error}
        addRoom={addRoom}
      />
    )}

    {(isEditingHostel || showAddHostelFormModal) && (
      <HostelForm
        setHostelName={setHostelName}
        setHostelCategory={setHostelCategory}
        setTotalRooms={setTotalRooms}
        setMaxCapacity={setMaxCapacity}
        addNewHostel={addNewHostel}
        updateHostelDetails={updateHostelDetails}
        hostelName={hostelName}
        hostelCategory={hostelCategory}
        totalRooms={totalRooms}
        maxCapacity={maxCapacity}
        setShowAddHostelFormModal={setShowAddHostelFormModal}
        setIsEditingHostel={setIsEditingHostel}
        isEditingHostel={isEditingHostel}
      />
    )}

    {showConfirmModal && (
      <ConfirmModal
        confirmType={confirmType}
        confirmDelete={confirmDelete}
        setShowConfirmModal={setShowConfirmModal}
      />
    )}
  </div>
</div>

  );
};

export default HostelInfo;


