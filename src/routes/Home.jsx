import HomeHero from "../components/HomeHero";
// import { FaCheck } from "react-icons/fa6";
// import { Link } from "react-router-dom";
import UserFeedback from "../components/UserFeedback";
import Faq from "../components/Faq";
import { SiGoogleforms } from "react-icons/si";
import { MdVerifiedUser } from "react-icons/md";
import { RiBuildingLine } from "react-icons/ri";
const Home = () => {
  return (
    <main className="relative top-[100px]">
      {/*Hero Section*/}
      <HomeHero />
      {/*Section 2 */}
      <section className="px-6 md:px-32 w-full mb-16 min-h-[60vh]">
        <h2 className="text-2xl font-semibold text-blue-500 text-center mb-12 tracking-widest">
          How It Works?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="border border-gray-200 shadow-lg rounded-xl p-6 flex flex-col items-center text-center gap-y-4 bg-white hover:scale-105 transition-all duration-300 ease-in-out">
            <SiGoogleforms className="text-4xl text-blue-500" />
            <h3 className="text-lg font-semibold text-blue-500">
              Register as Owner
            </h3>
            <p className="text-sm text-gray-600 ">
              Sign up and add your hostel details like number of rooms, floors,
              vacancy count, and pricing — all in one place.
            </p>
          </div>

          {/* Step 2 */}
          <div className="border border-gray-200 shadow-lg rounded-xl p-6 flex flex-col items-center text-center gap-y-4 bg-white hover:scale-105 transition-all duration-300 ease-in-out">
            <MdVerifiedUser className="text-4xl text-blue-500" />
            <h3 className="text-lg font-semibold text-blue-500">
              Get Verified
            </h3>
            <p className="text-sm text-gray-600">
              Our admin team reviews your submission and verifies your identity
              for a secure and trusted listing experience.
            </p>
          </div>

          {/* Step 3 */}
          <div className="border border-gray-200 shadow-lg rounded-xl p-6 flex flex-col items-center text-center gap-y-4 bg-white hover:scale-105 transition-all duration-300 ease-in-out">
            <RiBuildingLine className="text-4xl text-blue-500" />
            <h3 className="text-lg font-semibold text-blue-500">
              Manage Your Hostel
            </h3>
            <p className="text-sm text-gray-600">
              Once verified, access your personal dashboard to update hostel
              info and manage room vacancies in real time.
            </p>
          </div>
        </div>
      </section>

      <UserFeedback />

      {/*Frequently Asked Questions */}
      <Faq />
      {/*Conatct Section */}
    </main>
  );
};

export default Home;
