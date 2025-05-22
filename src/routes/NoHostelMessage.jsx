import React from "react";

import{FaBed,FaCheckCircle,FaDollarSign,FaEdit} from "react-icons/fa";
import { useNavigate } from 'react-router-dom';


const NoHostelMessage = ({setShowAddHostelFormModal}) => {
    const navigate = useNavigate();

  
  const handleListHostelClick = () => {
    // If using a modal approach
    setShowAddHostelFormModal(true);
    
    // If using React Router navigation to Hostel Management page
    // Uncomment this when using React Router:
    // navigate('/hostel-management');
  };

  return(  
  <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center px-4 text-center">
    <h2 className="text-red-700 font-bold text-2xl mb-10 max-w-xl">
      You haven't listed any hostel yet!
    </h2>
    <p className="text-gray-600 text-lg mb-8 max-w-xl">
      Start managing your hostel digitally – add your property and control every
      detail with ease.
    </p>

    <button
      onClick={handleListHostelClick}
      className="bg-radial from-blue-400 via-blue-500 to-blue-600 text-white px-6 py-3 rounded-full cursor-pointer hover:scale-105 transition duration-300"
    >
      List Your Hostel
    </button>

    <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-gray-700">
      <div className="flex flex-col items-center">
        <FaBed size={40} className="w-12 mb-4 text-blue-500" />
        <p>Room & Bed Management</p>
      </div>
      <div className="flex flex-col items-center">
        <FaDollarSign size={40} className="w-12 mb-4 text-blue-500" />
        <p>Update Rent Anytime</p>
      </div>
      <div className="flex flex-col items-center">
        <FaCheckCircle size={40} className="w-12 mb-4 text-blue-500" />
        <p>Track Availability</p>
      </div>
      <div className="flex flex-col items-center">
        <FaEdit size={40} className="w-12 mb-4 text-blue-500" />
        <p>Edit Hostel Info</p>
      </div>
    </div>
  </div>
  )
};
export default NoHostelMessage;


// import React from "react";
// import { FaBed, FaCheckCircle, FaDollarSign, FaEdit } from "react-icons/fa";
// // Uncomment this when using React Router:
// // import { useNavigate } from 'react-router-dom';

// const NoHostelMessage = ({ setShowAddHostelFormModal }) => {
//   // For React Router navigation - uncomment when using Router
//   // const navigate = useNavigate();
  
//   // Function to handle hostel button click
//   const handleListHostelClick = () => {
//     // If using a modal approach
//     setShowAddHostelFormModal(true);
    
//     // If using React Router navigation to Hostel Management page
//     // Uncomment this when using React Router:
//     // navigate('/hostel-management');
//   };

//   return (
//     <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg shadow-md text-center">
//       <h2 className="text-2xl font-bold text-gray-800 mb-4">
//         You haven't listed any hostel yet!
//       </h2>
      
//       <p className="text-gray-600 mb-6">
//         Start managing your hostel digitally – add your property and control every 
//         detail with ease.
//       </p>
      
//       <button
//         onClick={handleListHostelClick}
//         className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white px-6 py-3 rounded-full cursor-pointer hover:scale-105 transition duration-300 mb-8"
//       >
//         List Your Hostel
//       </button>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
//         <FeatureCard icon={<FaBed className="text-blue-500" size={24} />} text="Room & Bed Management" />
//         <FeatureCard icon={<FaDollarSign className="text-blue-500" size={24} />} text="Update Rent Anytime" />
//         <FeatureCard icon={<FaCheckCircle className="text-blue-500" size={24} />} text="Track Availability" />
//         <FeatureCard icon={<FaEdit className="text-blue-500" size={24} />} text="Edit Hostel Info" />
//       </div>
//     </div>
//   );
// };

// // Helper component for feature cards
// const FeatureCard = ({ icon, text }) => {
//   return (
//     <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
//       <div className="mr-4">
//         {icon}
//       </div>
//       <span className="font-medium text-gray-700">{text}</span>
//     </div>
//   );
// };

// export default NoHostelMessage;