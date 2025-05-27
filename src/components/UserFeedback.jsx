import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import UserFeedbackCard from "./UserFeedbackCard";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { backendUrl, toastNoficationSettings } from "../utils/utils";
import { toast } from "react-toastify";

// Create axios instance with default config
const api = axios.create({
  baseURL: backendUrl,
  timeout: 5000, // 5 second timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Initialize feedback cache
const feedbackCache = {
  data: null,
  timestamp: null,
  maxAge: 15 * 60 * 1000 // 15 minutes cache
};

const UserFeedback = () => {
  const [customerFeedback, setCustomerFeedback] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const customerFeedbackSliderSettings = {
    dots: false,
    infinite: true,
    speed: 900,
    slidesToShow: 3,
    slidesToScroll: 1,
    swipeToSlide: true,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    pauseOnHover: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          speed: 1000,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          speed: 800,
        },
      },
    ],
  };

  const fetchCustomerFeedback = useCallback(async (forceRefresh = false) => {
    try {
      // Check cache if not forcing refresh
      if (!forceRefresh && 
          feedbackCache.data && 
          feedbackCache.timestamp && 
          (Date.now() - feedbackCache.timestamp < feedbackCache.maxAge)) {
        setCustomerFeedback(feedbackCache.data);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      const response = await api.get('/api/review/view', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      const popularFeedback = response.data
        .filter(feedback => feedback.rating >= 4)
        .sort((a, b) => b.rating - a.rating); // Sort by rating descending

      // Update cache
      feedbackCache.data = popularFeedback;
      feedbackCache.timestamp = Date.now();

      setCustomerFeedback(popularFeedback);
    } catch (error) {
      console.error('Feedback fetch error:', error);
      setError('Failed to load testimonials');
      
      if (error.response) {
        toast.error(error.response.data.message || "Failed to load testimonials", toastNoficationSettings);
      } else if (error.request) {
        toast.error("Network error. Please check your connection.", toastNoficationSettings);
      } else {
        toast.error("An unexpected error occurred", toastNoficationSettings);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomerFeedback();

    // Cleanup function
    return () => {
      // Clear loading and error states on unmount
      setIsLoading(false);
      setError(null);
    };
  }, [fetchCustomerFeedback]);

  if (isLoading) {
    return (
      <section className="px-6 md:px-20 xl:px-32 w-full mb-16 min-h-[60vh] max-w-screen-xl mx-auto flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-6 md:px-20 xl:px-32 w-full mb-16 min-h-[60vh] max-w-screen-xl mx-auto flex items-center justify-center">
        <h1 className="text-center font-semibold text-gray-600">{error}</h1>
      </section>
    );
  }

  if (!customerFeedback.length) {
    return (
      <section className="px-6 md:px-20 xl:px-32 w-full mb-16 min-h-[60vh] max-w-screen-xl mx-auto flex items-center justify-center">
        <h1 className="text-center font-semibold text-gray-600">No reviews to show</h1>
      </section>
    );
  }

  return (
    <section className="px-6 md:px-20 xl:px-32 w-full mb-16 min-h-[60vh] max-w-screen-xl mx-auto">
      <h2 className="text-2xl font-semibold text-blue-500 text-center mb-12 tracking-widest">
        Testimonials
      </h2>

      <div className="w-full overflow-x-hidden mt-2 md:mt-4 bg-white">
        <Slider {...customerFeedbackSliderSettings}>
          {customerFeedback.map((feedback) => (
            <div key={feedback._id} className="!flex justify-center px-3">
              <UserFeedbackCard feedbackInfo={feedback} />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default UserFeedback;
