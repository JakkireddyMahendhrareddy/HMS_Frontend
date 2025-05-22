import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import UserFeedbackCard from "./UserFeedbackCard";
import { useEffect } from "react";
import { useState } from "react";

const UserFeedback = () => {
  const [customerFeedback, setCustomerFeedback] = useState([]);
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

  const fetchCustomerFeedback = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/review/view");
      if (response.ok) {
        const data = await response.json();
        const popularFeedback = data.filter((feedback) => feedback.rating >= 4);
        setCustomerFeedback(popularFeedback);
      } else {
        return <h1 className="text-center font-semibold tetx-gray-600">No Reviews to show</h1>;
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCustomerFeedback();
  }, []);

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
