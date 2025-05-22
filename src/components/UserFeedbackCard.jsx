const UserFeedbackCard = ({feedbackInfo}) => {
  return (
    <li className=" list-none w-full md:w-[360px] h-[220px] flex flex-col items-center p-6  mx-auto rounded-xl border-2 border-gray-100 shadow-lg my-4">
      {/* Quote Icon */}
      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-200 text-white text-lg font-bold mb-4">
        ❝
      </div>

      {/* Testimonial Text */}
      <p className="text-[18px] md:text-[18px] font-semibold text-gray-600 text-center leading-relaxed mb-4">
        “ {feedbackInfo?.review} ”
      </p>

      {/* Name */}
      <h3 className="self-end text-sm  text-gray-700">
        -{feedbackInfo?.name}
      </h3>
    </li>
  );
};

export default UserFeedbackCard;
