const About = () => {
  return (
    <main className="px-4 sm:px-8 md:px-16 lg:px-32 pt-24 pb-12 bg-white min-h-screen">
      <section className="max-w-5xl mx-auto space-y-10">
        {/* What is PGO */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-blue-500  tracking-normal	  mb-3">
            What is PGO?
          </h1>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            We understand how difficult it is to manage records, track
            vacancies, and maintain up-to-date hostel details using
            spreadsheets or paperwork. That’s why we built PGO — a modern
            solution to help hostel owners stay in control and make
            data-driven decisions with ease.
          </p>
        </div>

        {/* What We Offer */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-blue-500 tracking-normal	 mb-6">
            What we offer
          </h2>

          <div className="space-y-8">
            {[
              {
                icon: "🏢",
                title: "Easy Hostel Registration",
                text: "Add details like the number of rooms, floors, pricing, and availability — all from a single dashboard.",
              },
              {
                icon: "🔐",
                title: "Secure Verification Process",
                text: "Your submission is reviewed by our admin team to ensure genuine listings and a trusted platform for everyone.",
              },
              {
                icon: "📊",
                title: "Smart Dashboard Access",
                text: "Get real-time control over room vacancies, update hostel details anytime, and keep everything organized effortlessly.",
              },
              {
                icon: "⚡",
                title: "Smooth User Experience",
                text: "No more clutter. Just clean visuals, smooth navigation, and powerful tools that make management feel easy.",
              },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="text-2xl">{item.icon}</div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-blue-500 tracking-wide mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission & Vision Section */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-blue-500 tracking-normal	 mb-6">
            Our Mission & Vision
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mission */}
            <div className="p-6 rounded-xl shadow-lg border border-gray-200 bg-white">
              <div className="flex items-start gap-4">
                <div className="text-2xl">🎯</div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-blue-500 tracking-wide mb-2">
                    Our Mission
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    To empower hostel owners with smart tools that eliminate
                    stress and boost efficiency, creating a new standard in
                    hostel management.
                  </p>
                </div>
              </div>
            </div>

            {/* Vision */}
            <div className="p-6 rounded-xl shadow-lg border border-gray-200 bg-white">
              <div className="flex items-start gap-4">
                <div className="text-2xl">👁️</div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-blue-500 tracking-wide mb-2">
                    Our Vision
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    To become the most trusted digital platform for hostel
                    operations by combining innovation, simplicity, and
                    reliability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;


// <div className="px-4 sm:px-8 md:px-16 lg:px-32  min-h-screen py-8 md:py-20">
//   {/* Hero Section */}
//   <div className="flex flex-col md:flex-row items-center gap-x-6 gap-y-6">
//     <div className="w-full md:w-1/2">
//       <img
//         src="https://bookmypg.co.in/assets/front/images/about.png"
//         className="w-[90%] md:w-full  mx-auto md:mx-0"
//         alt="About Us"
//       />
//     </div>
//     <div className="md:w-1/2 w-full text-center md:text-left p-4 sm:p-6">
//       <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold">
//         <span className="font-semibold">Trust</span>
//         <br /> Your Booking Partner
//       </h1>
//       <p className="text-sm sm:text-base lg:text-lg font-light text-gray-800 mt-4">
//         At{" "}
//         <span className="font-semibold text-black">
//           Paying-Guest Online,
//         </span>{" "}
//         we prioritize trust and convenience, making your hostel and PG
//         booking experience seamless and secure.
//       </p>
//       <p className="font-bold text-sm sm:text-lg text-center md:text-left italic mt-5">
//         Book with confidence at PGO!
//       </p>
//     </div>
//   </div>

//   {/* Why Choose Us Section */}
//   <div className="mt-16 flex flex-col md:flex-row-reverse items-center justify-center gap-6">
//     <div className="w-full md:w-1/2 flex justify-center">
//       <img
//         src="https://img.freepik.com/free-vector/curiosity-people-concept-illustration_114360-11034.jpg?t=st=1741863974~exp=1741867574~hmac=5a64b55f9011490a2a0d722ecc363231b7f48e406b2b720ed8d3815b9823a992&w=900"
//         className="w-full max-w-sm mx-auto object-cover"
//         alt="Why Choose Us"
//       />
//     </div>
//     <div className="w-full md:w-1/2 pt-4 lg:pt-0 text-center md:text-left">
//       <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold">
//         <span className="text-lg sm:text-xl font-medium">Benefits</span>
//         <br />
//         Why Choose Us for Your Booking Needs?
//       </h1>
//       <p className="text-sm sm:text-base lg:text-lg font-light pt-4">
//         At <span className="font-bold italic">PGO</span>, we make hostel and
//         PG bookings easy, secure, and hassle-free.
//       </p>
//     </div>
//   </div>

//   {/* Benefits Cards - Responsive Grid */}
//   <div className="mt-12 ">
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//       {[
//         {
//           title: "Key Benefits for Tenants",
//           text: "Enjoy verified accommodations, secure payments, and flexible stay options.",
//           img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRn6P3lonz51VlLdC6HK9_LuGiYU-FI8nT6fw&s",
//         },
//         {
//           title: "Key Benefits for Hostel Owners",
//           text: "Boost your visibility and streamline property management effortlessly.",
//           img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRn6P3lonz51VlLdC6HK9_LuGiYU-FI8nT6fw&s",
//         },
//         {
//           title: "Our Commitment to Quality & Trust",
//           text: "We ensure transparency and reliability in every booking.",
//           img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRn6P3lonz51VlLdC6HK9_LuGiYU-FI8nT6fw&s",
//         },
//       ].map((card, index) => (
//         <div
//           key={index}
//           className="bg-white shadow-lg flex flex-col items-center p-6 rounded-lg transition-all duration-500
//                         hover:shadow-2xl hover:scale-105 hover:bg-gray-100 text-center"
//         >
//           <img
//             src={card.img}
//             className="w-16 h-16 rounded-full transition-all duration-500 hover:scale-110"
//             alt={card.title}
//           />
//           <h1 className="text-lg sm:text-xl font-bold pt-4">
//             {card.title}
//           </h1>
//           <p className="text-sm sm:text-base lg:text-lg font-light pt-4">
//             {card.text}
//           </p>
//         </div>
//       ))}
//     </div>
//   </div>

//   {/* Mission, Vision, Values */}
//   <p className="mt-14 text-sm sm:text-lg max-w-3xl mx-auto text-center">
//     At PGO, we simplify your search for the perfect stay with seamless
//     bookings, secure payments, and verified listings.
//   </p>

//   <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
//     {[
//       {
//         title: "Our Mission",
//         text: "To make hostel and PG bookings effortless and secure.",
//       },
//       {
//         title: "Our Vision",
//         text: "To be the most trusted platform for hostel accommodations.",
//       },
//       {
//         title: "Our Values",
//         text: "Transparency, security, and customer satisfaction.",
//       },
//     ].map((item, index) => (
//       <div
//         key={index}
//         className="bg-white p-6 shadow-md rounded-lg transition-all duration-500
//                       hover:shadow-xl hover:scale-105 hover:bg-gray-50 text-center"
//       >
//         <h3 className="text-lg sm:text-xl font-bold pb-4">{item.title}</h3>
//         <p className="text-sm sm:text-base">{item.text}</p>
//       </div>
//     ))}
//   </div>
// </div>
