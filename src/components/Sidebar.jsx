import { useState, useEffect } from "react";
import {
  FaUser,
  FaBed,
  FaUsers,
  FaMoneyBill,
  FaUtensils,
  FaTools,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import InnerDashboard from "../routes/InnerDashboard";
import HostelInfo from "../routes/Hostel/HostelInfo";
import TenantManagement from "../routes/Tenant/TenantInfo";
import Fees from "../routes/Fees/FeesInfo";
import MessDetails from "../routes/Mess/MessInfo";
import Maintenance from "../routes/Maintenance/MaintenanceInfo";
import Topbar from "./Topbar";
import { Link } from "react-router-dom";

const sections = [
  { id: "admin", title: "Dashboard", icon: <FaUser /> },
  { id: "hostel", title: "Hostel Management", icon: <FaBed /> },
  { id: "students", title: "Tenant Management", icon: <FaUsers /> },
  { id: "fees", title: "Payments", icon: <FaMoneyBill /> },
  { id: "mess", title: "Mess", icon: <FaUtensils /> },
  { id: "maintenance", title: "Maintenance", icon: <FaTools /> },
];

export default function Sidebar() {
  const [activeSection, setActiveSection] = useState("admin");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "admin":
        return <InnerDashboard />;
      case "hostel":
        return <HostelInfo />;
      case "students":
        return <TenantManagement />;
      case "fees":
        return <Fees />;
      case "mess":
        return <MessDetails />;
      case "maintenance":
        return <Maintenance />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-center text-lg font-medium">
              Click on a section to view details
            </p>
          </div>
        );
    }
  };

  const handleSectionClick = (sectionId) => {
    setActiveSection(sectionId);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-100">
      {/* Mobile Toggle Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="bg-blue-500 text-white p-2 rounded-md shadow-lg"
          aria-label="Toggle Sidebar"
        >
          {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } fixed md:relative z-40 w-64 md:w-72 bg-white text-gray-900 shadow-xl h-screen flex flex-col border-r border-gray-300 transition-transform duration-300 ease-in-out`}
      >
        <Link to="/" className="flex-shrink-0">
          <div className="bg-blue-500 text-white font-bold text-xl md:text-2xl h-16 flex items-center justify-start px-4 md:px-6 text-start shadow-lg">
            <div className="text-4xl">🏨</div>
            <p className="text-xl font-semibold mt-2">My Hostel</p>
          </div>
        </Link>

        <ul className="flex-1 overflow-y-auto p-3 md:p-5 space-y-2 md:space-y-3">
          {sections.map((section) => (
            <li
              key={section.id}
              onClick={() => handleSectionClick(section.id)}
              className={`flex items-center gap-2 md:gap-3 py-2 md:py-3 px-3 md:px-5 rounded-md cursor-pointer transition-all duration-300 text-xs md:text-sm font-medium tracking-wide shadow-sm ${
                activeSection === section.id
                  ? "bg-blue-500 text-white shadow-md"
                  : "hover:bg-blue-700 hover:text-white hover:shadow-md text-gray-900"
              }`}
            >
              <span className="text-base md:text-lg">{section.icon}</span>
              <span className="truncate">{section.title}</span>
            </li>
          ))}
        </ul>
      </aside>

      {/* Backdrop for mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-gray-50 overflow-hidden relative w-full md:ml-0">
        {/* Fixed Topbar */}
        <div className="sticky top-0 left-0 right-0 h-16 z-10 shadow-md bg-white">
          <div className="pl-16 md:pl-0">
            <Topbar />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1  overflow-auto">
          <div className="bg-white rounded-lg shadow-md  border border-gray-200">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}
