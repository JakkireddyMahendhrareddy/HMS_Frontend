import React, { useState, useEffect, useCallback } from "react";
// import { FaBed, FaDollarSign, FaCheckCircle, FaEdit } from "react-icons/fa";
import HostelAndRoomDetails from "../Hostel/HostelAndRoomdetails";
import ConfirmModal from "../ConfirmModal";
import { backendUrl, toastNoficationSettings } from "../../utils/utils";
import { toast } from "react-toastify";
import RoomFormModal from "../RoomFormModal";
import HostelForm from "./HostelForm";
import NoHostelMessage from "../NoHostelMessage";
import axios from "axios";
import Cookies from "js-cookie";

// Create axios instance with default config
const api = axios.create({
  baseURL: backendUrl,
  timeout: 8000, // 8 second timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = Cookies.get('jwtToken');
  if (!token) {
    // Redirect to login if no token
    window.location.href = '/login';
    return Promise.reject('No auth token');
  }
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('jwtToken');
      window.location.href = '/login';
      return Promise.reject('Session expired');
    }
    return Promise.reject(error);
  }
);

// Initialize cache
const cache = {
  hostel: { data: null, timestamp: null },
  rooms: { data: null, timestamp: null },
  maxAge: 5 * 60 * 1000 // 5 minutes cache
};

const HostelInfo = () => {
  // API endpoints
  const createHostelUrl = '/api/hostel/add';
  const getHostelUrl = '/api/hostel/view';
  const confirmEditUrl = '/api/hostel/edit';
  const confirmDeleteUrl = '/api/hostel/remove';
  const getRoomsUrl = '/api/hostel/room/get';
  const addRoomUrl = '/api/hostel/room/add';
  const editRoomUrl = '/api/hostel/room/edit/';
  const deleteRoomUrl = '/api/hostel/room/remove/';

  // State management
  const [hostel, setHostel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [showAddHostelFormModal, setShowAddHostelFormModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditingHostel, setIsEditingHostel] = useState(false);
  const [error, setError] = useState("");
  const [showRoomFormModal, setShowRoomFormModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmType, setConfirmType] = useState(null);
  const [roomNumberToDelete, setRoomNumberToDelete] = useState(null);
  const [hostelName, setHostelName] = useState("");
  const [hostelCategory, setHostelCategory] = useState("Men");
  const [totalRooms, setTotalRooms] = useState("");
  const [maxCapacity, setMaxCapacity] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const roomsPerPage = 10;

  const [newRoom, setNewRoom] = useState({
    number: "",
    type: "",
    beds: "",
    availableBeds: "",
    rent: "",
    status: "available",
  });
  const [editRoomId, setEditRoomId] = useState(null);

  // Fetch with cache utility
  const fetchWithCache = async (key, url, options = {}) => {
    try {
      // Check cache if not forcing refresh
      if (!options.forceRefresh && 
          cache[key]?.data && 
          cache[key]?.timestamp && 
          (Date.now() - cache[key].timestamp < cache.maxAge)) {
        return cache[key].data;
      }

      const response = await api.get(url, {
        ...options,
        withCredentials: true
      });

      // Update cache
      cache[key] = {
        data: response.data,
        timestamp: Date.now()
      };

      return response.data;
    } catch (error) {
      console.error(`Error fetching ${key}:`, error);
      throw error;
    }
  };

  // Optimized fetch rooms function
  const fetchRooms = useCallback(async () => {
    try {
      const data = await fetchWithCache('rooms', getRoomsUrl);
      if (data) {
        const convertedRooms = data.map(mapBackendRoomToFrontend);
        setRooms(convertedRooms);
      } else {
        setRooms([]);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error("Failed to fetch rooms", toastNoficationSettings);
    }
  }, []);

  // Optimized fetch hostel function
  const fetchHostel = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchWithCache('hostel', getHostelUrl, { forceRefresh: true });
      if (data) {
        setHostel(data);
        await fetchRooms();
      } else {
        setHostel(null);
      }
    } catch (error) {
      console.error('Error fetching hostel:', error);
      if (error.response?.status === 401) {
        toast.error("Please login again", toastNoficationSettings);
      } else {
        toast.error("Failed to load hostel data", toastNoficationSettings);
      }
      setError("Failed to load hostel data");
    } finally {
      setLoading(false);
    }
  }, [fetchRooms]);

  // Initial data loading
  useEffect(() => {
    fetchHostel();
  }, [fetchHostel]);

  useEffect(() => {
    if (isEditingHostel && hostel) {
      setHostelName(hostel.name || "");
      setHostelCategory(hostel.category || "men");
      setTotalRooms(hostel.totalRooms || "");
      setMaxCapacity(hostel.maxCapacity || "");
    }
  }, [hostel, isEditingHostel]);

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
      const response = await api({
        method,
        url,
        data: roomInfo,
        withCredentials: true
      });

      if (response.data) {
        toast.success(response.data.message);
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
      }
    } catch (error) {
      console.error('Error submitting room:', error);
      toast.error(error.response?.data?.message || "Failed to update room", toastNoficationSettings);
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
      const response = await api({
        method: "DELETE",
        url: confirmDeleteUrl,
        withCredentials: true
      });

      if (response.data) {
        toast.success(response.data.message);
        setHostel(null);
        setRooms([]);
        setHostelName(null);
        setHostelCategory("Men");
        setTotalRooms(null);
        setMaxCapacity(null);
      }
    } catch (error) {
      console.error('Error deleting hostel:', error);
      toast.error(error.response?.data?.message || "Failed to delete hostel", toastNoficationSettings);
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
      const response = await api({
        method: "DELETE",
        url: `${deleteRoomUrl}${roomNumber}`,
        withCredentials: true
      });

      if (response.data) {
        fetchRooms();
        toast.success(response.data.message);
        setRooms(rooms.filter((_, i) => i !== roomNumber));
        setRoomNumberToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting room:', error);
      toast.error(error.response?.data?.message || "Failed to delete room", toastNoficationSettings);
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

  // Room mapping utilities
  const mapBackendRoomToFrontend = (room) => ({
    number: room.roomNumber,
    type: room.sharingType,
    beds: room.totalBeds,
    availableBeds: room.availableBeds,
    rent: room.rent,
  });

  const mapFrontendRoomToBackend = (room) => ({
    roomNumber: room.number,
    sharingType: room.type,
    totalBeds: parseInt(room.beds, 10),
    availableBeds: parseInt(room.availableBeds, 10),
    rent: parseInt(room.rent, 10),
  });

  // Optimized hostel submit function
  const handleHostelSubmit = async (method, url, hostelData) => {
    try {
      setLoading(true);
      const response = await api({
        method,
        url,
        data: hostelData,
        withCredentials: true
      });

      if (response.data) {
        setHostel(hostelData);
        toast.success(response.data.message);
        // Force refresh hostel data
        await fetchHostel();
      }
    } catch (error) {
      console.error('Error submitting hostel:', error);
      toast.error(error.response?.data?.message || "Failed to update hostel", toastNoficationSettings);
    } finally {
      setLoading(false);
    }
  };

  return (
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


