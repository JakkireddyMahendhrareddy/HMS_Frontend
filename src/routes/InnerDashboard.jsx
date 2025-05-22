import React from "react";
import { useState, useEffect } from "react";
import NoHostelMessage from "./NoHostelMessage";
import { toast } from "react-toastify";
import { backendUrl, toastNoficationSettings } from "../utils/utils";

const InnerDashboard = () => {
  const headingColor = "text-blue-600";

  const getHostelUrl = `${backendUrl}/api/hostel/view`;

  const [loading, setLoading] = useState(true);
  const [hostel, setHostel] = useState(null);

   const fetchHostel = async () => {
      try {
        setLoading(true);
        const response = await fetch(getHostelUrl, {
          method: "GET",
          credentials: "include",
        });
        console.log(response,"response")
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setHostel(data);
            fetchMessMenu();
          } else {
            setHostel(null);
          }
        }
      } catch (error) {
        // toast.warning("Something Went Wrong", toastNoficationSettings);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchHostel();
  }, []);

  return (
    <div>
      <div className="w-full pt-0 min-h-screen flex justify-center items-start relative">
        <div className="w-full pt-4 max-w-7xl">
          {loading ? (
            <div className="flex justify-center items-center h-60">
              <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
            </div>
          ) : !hostel || Object.keys(hostel).length === 0 ? (
            <NoHostelMessage />
          ) : (
            <div>
              <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 py-6">
                <div className="max-w-7xl mx-auto space-y-6">
                  {/* Rooms, Payment, Amenities */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Rooms */}
                    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition duration-300 transform hover:scale-[1.02]">
                      <h3 className={`${headingColor} font-bold text-lg mb-4`}>
                        Rooms
                      </h3>
                      <div className="flex justify-between flex-wrap gap-4">
                        <Stat label="Total" value="200" />
                        <Stat label="Occupied" value="150" />
                        <Stat label="Vacant" value="50" />
                      </div>
                    </div>

                    {/* Payment */}
                    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition duration-300 transform hover:scale-[1.02]">
                      <h3 className={`${headingColor} font-bold text-lg mb-4`}>
                        Payment
                      </h3>
                      <div className="flex justify-between flex-wrap gap-4">
                        <Stat label="Paid" value="₹ 1,20,345" />
                        <Stat label="Unpaid" value="₹ 20,345" />
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition duration-300 transform hover:scale-[1.02]">
                      <h3 className={`${headingColor} font-bold text-lg mb-4`}>
                        Amenities
                      </h3>
                      <div className="grid grid-cols-3 gap-3 md:flex md:justify-between text-center">
                        {[
                          { icon: "💡", label: "Light" },
                          { icon: "💧", label: "Water" },
                          { icon: "📶", label: "Wifi" },
                          { icon: "👕", label: "Laundry" },
                          { icon: "🔥", label: "Hot Water" },
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="flex flex-col items-center hover:scale-110 transition"
                          >
                            <span className="text-2xl mb-1">{item.icon}</span>
                            <p className="text-gray-600 text-sm">
                              {item.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Tenants, Mess, Tickets */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Tenants */}
                    <div className="bg-white p-8 rounded-xl border border-gray-300 shadow-lg hover:shadow-xl transition transform hover:scale-[1.05] flex flex-col items-center">
                      <h3 className={`${headingColor} font-bold text-xl mb-6`}>
                        Tenants
                      </h3>
                      <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mb-6">
                        <svg viewBox="0 0 200 200" className="w-full h-full">
                          <circle
                            cx="100"
                            cy="100"
                            r="90"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="16"
                          />
                          <circle
                            cx="100"
                            cy="100"
                            r="90"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="16"
                            strokeDasharray={`${Math.PI * 2 * 90}`}
                            strokeDashoffset={`${
                              Math.PI * 2 * 90 * (1 - 0.75)
                            }`} // 75% progress
                            transform="rotate(-90 100 100)"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                          75%
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-gray-600">
                          Capacity: <span className="font-semibold">500</span>
                        </p>
                        <p className="text-gray-600">
                          Occupied:{" "}
                          <span className="font-semibold text-green-600">
                            375
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Mess Menu */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition transform hover:scale-[1.02]">
                      <h3 className={`${headingColor} font-bold text-lg mb-4`}>
                        Mess - Today's Meal
                      </h3>
                      <Meal title="Breakfast" items={["3 Idli Sambar"]} />
                      <Meal
                        title="Lunch"
                        items={[
                          "Veg: Sprouts | 3 Chapatis | Rice | Dal",
                          "Non-Veg: Egg Biryani",
                        ]}
                      />
                      <Meal
                        title="Dinner"
                        items={[
                          "Veg: Sprouts | 3 Chapatis | Rice | Dal",
                          "Non-Veg: Egg Curry | 3 Chapatis | Rice",
                        ]}
                      />
                    </div>

                    {/* Tickets */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition transform hover:scale-[1.02]">
                      <h3 className={`${headingColor} font-bold text-lg mb-4`}>
                        Tickets{" "}
                        <span className="text-sm font-normal text-gray-500">
                          (Unresolved - 5)
                        </span>
                      </h3>
                      <ul className="space-y-3 text-gray-700">
                        {[
                          { name: "Mike Ross", issue: "Water not coming" },
                          {
                            name: "Jennifer Grint",
                            issue: "Light is not available since last night",
                          },
                          {
                            name: "Casey Allen",
                            issue:
                              "WiFi is not working since past week, please fix it.",
                          },
                          {
                            name: "Tina Harris",
                            issue: "Laundry not working properly",
                          },
                          {
                            name: "Rick Butcher",
                            issue: "Hot water is broken",
                          },
                        ].map((ticket, index) => (
                          <li
                            key={index}
                            className="pb-2 border-b border-gray-100 last:border-b-0 hover:pl-2 transition"
                          >
                            <span className="font-semibold text-gray-800">
                              {ticket.name}:
                            </span>{" "}
                            {ticket.issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Visitors, Reports */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card
                      title="Visitors (Total 2)"
                      items={[
                        "Building A | Floor 2nd | Room 201",
                        "Building A | Floor 1st | Room 103",
                      ]}
                    />
                    <Card
                      title="Reports"
                      items={[
                        "Total Number of Vacant Rooms",
                        "Total Fees Collected",
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Small reusable components
const Stat = ({ label, value }) => (
  <div className="text-center">
    <p className="text-gray-800 font-bold text-2xl">{value}</p>
    <p className="text-gray-600 text-sm mt-1">{label}</p>
  </div>
);

const Meal = ({ title, items }) => (
  <div className="mb-3">
    <p className="font-medium">{title}:</p>
    <ul className="list-disc pl-6">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
);

const Card = ({ title, items }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition transform hover:scale-[1.02]">
    <h3 className="text-blue-600 font-bold text-lg mb-4">{title}</h3>
    <ul className="list-disc pl-6 text-gray-700 space-y-2">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
);

export default InnerDashboard;
