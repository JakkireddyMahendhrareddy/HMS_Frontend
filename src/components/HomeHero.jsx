import { Link, useNavigate } from "react-router-dom";

const HomeHero = () => {
  const navigate = useNavigate();

  return (
    <section className="px-4 sm:px-10 lg:px-28 w-full py-16 md:py-24 lg:py-32 min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="flex flex-col gap-6 text-center items-center max-w-3xl w-full">
        {/* Heading */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-normal leading-snug text-blue-600 dark:text-blue-400">
          Tired of Hostel Hassles?{" "}
          <span className="block text-2xl sm:text-3xl md:text-4xl font-semibold mt-1">
            Let Tech Take Over 🧠⚡
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 font-medium italic">
          No more hostel headaches. Just smooth control.
        </p>

        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
          Say goodbye to boring{" "}
          <span className="font-semibold line-through">
            spreadsheets and messy records
          </span>
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <button
            onClick={() => navigate("/auth/login")}
            className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white px-6 py-2 rounded text-sm sm:text-base hover:from-blue-500 hover:to-blue-700 transition duration-200 cursor-pointer"
          >
            Get Started
          </button>

          <Link
            to="/about"
            className="border border-blue-500 text-blue-500 px-6 py-2 rounded text-sm sm:text-base hover:border-blue-600 hover:text-blue-600 transition duration-200"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
