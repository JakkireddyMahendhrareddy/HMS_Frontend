import { v4 as uuidv4 } from "uuid";

// export const backendUrl = "http://localhost:5001";
export const backendUrl = "https://hms-backend-9.onrender.com";


export const toastNoficationSettings = {
  autoClose: 3000,
  pauseOnHover: false,
  closeOnClick: false,
};
export const loginSuccessToastNotificationSettings = {
  autoClose: 3000,
  pauseOnHover: false,
  closeOnClick: false,
  closeButton: false,
  position: "bottom-center",
  icon: false,
  className: "custom-toast",
  bodyClassName: "custom-toast-body",
  hideProgressBar: true,
};
export const logoutToastNotificationSettings = {
  autoClose: 3000,
  pauseOnHover: false,
  closeOnClick: false,
  closeButton: false,
  position: "bottom-center",
  icon: false,
  className: "custom-toast-logout",
  bodyClassName: "custom-toast-body",
  hideProgressBar: true,
};
export const errorViewToastNotificationSettings = {
  autoClose: 3000,
  pauseOnHover: false,
  closeOnClick: false,
  icon: false,
  className: "custom-toast-error",
  bodyClassName: "custom-toast-error-body",
  progress: false,
  closeButton: false,
};
export const faqList = [
  {
    id: uuidv4(),
    question: "How does verification work?",
    answer:
      "After signing up, our team will verify your hostel's details and your identity. This ensures that only verified hosts can list on our platform, providing a secure and trustworthy environment.",
  },
  {
    id: uuidv4(),
    question: "Can I add multiple hostels?",
    answer:
      "Sorry right now, we are only giving access to add one hostel. Definitely, you can add multiple in future versions.",
  },
  {
    id: uuidv4(),
    question: "How do I manage room availability?",
    answer:
      "Managing room availability is simple! In your dashboard, you can update the number of available rooms, set vacancy status, and adjust prices in real-time.",
  },

  {
    id: uuidv4(),
    question: "How do I manage bookings?",
    answer:
      "While this platform doesn't handle bookings directly, you can use it to manage room availability and pricing. Once you have a booking, you can manually track it through your dashboard.",
  },
];
