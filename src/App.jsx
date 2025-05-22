import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./routes/ProtectedRoute";
import Dashboard from "./routes/Dashboard";
import Profile from "./components/Profile";
// Lazy loaded components
const Home = lazy(() => import("./routes/Home"));
const About = lazy(() => import("./routes/About"));
const Registration = lazy(() => import("./routes/Registration"));
const Login = lazy(() => import("./routes/Login"));
const PageNotFound = lazy(() => import("./routes/PageNotFound"));

const App = () => {
  return (
    <>
      <ScrollToTop />
      <ToastContainer />
      <Suspense>
        <Routes>
          {/* Auth routes */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Registration />} />

          {/* Public routes */}
          <Route
            path="/"
            element={
              <>
                <Header />
                <Home />
                <Footer />
              </>
            }
          />
          <Route
            path="/about"
            element={
              <>
                <Header />
                <About />
                <Footer />
              </>
            }
          />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/view"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />


          {/* 404 */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;

// import React, { lazy, Suspense } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";

// import Sidebar from "./components/pages/Sidebar";
// import Profile from "./components/pages/Profile";
// // import Login from "./components/pages/Login";
// // import Registration from "./components/pages/Registration";
// // import Dashboard from "./components/masters/Dashboard";

// import Header from "./components/Header";
// import Footer from "./components/Footer";
// import ScrollToTop from "./components/ScrollToTop";
// import { ToastContainer } from "react-toastify";
// import ProtectedRoute from "./routes/ProtectedRoute";

// // Lazy loaded components
// const Home = lazy(() => import("./routes/Home"));
// const About = lazy(() => import("./routes/About"));
// const OwnerRegistration = lazy(() => import("./routes/OwnerRegistration"));
// const Registration = lazy(() => import("./routes/Registration"));

// const Login = lazy(() => import("./routes/Login"));

// const OwnerLogin = lazy(() => import("./routes/OwnerLogin"));
// const LazyDashboard = lazy(() => import("./routes/Dashboard"));
// const PageNotFound = lazy(() => import("./routes/PageNotFound"));

// // Layout with Sidebar
// // const Layout = ({ children }) => (
// //   <div className="h-screen w-screen flex flex-col">
// //     <div className="flex flex-row flex-1 overflow-hidden">
// //       <Sidebar />
// //       <div className="flex-1 overflow-auto">{children}</div>
// //     </div>
// //   </div>
// // );

// // Route wrapper for login-protected routes using token
// // const PrivateRoute = ({ children }) => {
// //   const isAuthenticated = localStorage.getItem("token");
// //   return isAuthenticated ? children : <Navigate to="/login" replace />;
// // };

// const App = () => {
//   return (
//     <Router>
//       <ScrollToTop />
//       <ToastContainer />
//       <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
//         <Routes>
//           {/* Auth routes */}
//           <Route path="/login" element={<Login />} />
//           <Route path="/registration" element={<Registration />} />
//           <Route path="/auth/login" element={<Login />} />
//           <Route path="/auth/register" element={<Registration />} />

//           {/* Public routes */}
//           <Route
//             path="/"
//             element={
//               <>
//                 <Header />
//                 <Home />
//                 <Footer />
//               </>
//             }
//           />
//           <Route
//             path="/about"
//             element={
//               <>
//                 <Header />
//                 <About />
//                 <Footer />
//               </>
//             }
//           />

//           {/* Owner Routes */}
//           <Route
//             path="/ownerRegistration"
//             element={
//               <ProtectedRoute>
//                 <OwnerRegistration />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/ownerLogin"
//             element={
//               <ProtectedRoute>
//                 <OwnerLogin />
//               </ProtectedRoute>
//             }
//           />

//           {/* Dashboard and Profile */}
//           {/* <Route
//             path="/dashboard"
//             element={
//               <PrivateRoute>
//                 <Layout>
//                   <Dashboard />
//                 </Layout>
//               </PrivateRoute>
//             }
//           /> */}
//           <Route
//             path="/profile"
//             element={
//               <PrivateRoute>
//                 <div className="h-screen flex flex-col items-center justify-center">
//                   <Profile />
//                   <Sidebar />
//                 </div>
//               </PrivateRoute>
//             }
//           />

//           {/* Lazy loaded dashboard */}
//           <Route
//             path="/lazy-dashboard"
//             element={
//               <ProtectedRoute>
//                 <LazyDashboard />
//               </ProtectedRoute>
//             }
//           />

//           {/* 404 Page */}
//           <Route path="*" element={<PageNotFound />} />
//         </Routes>
//       </Suspense>
//     </Router>
//   );
// };

// export default App;

// import { Route, Routes } from "react-router-dom";
// import Header from "./components/Header";
// import Footer from "./components/Footer";
// import ScrollToTop from "./components/ScrollToTop";
// import { ToastContainer } from "react-toastify";
// import ProtectedRoute from "./routes/ProtectedRoute";
// import { lazy } from "react";

// const Home = lazy(() => import("./routes/Home"));
// const About = lazy(() => import("./routes/About"));
// const OwnerRegistartion = lazy(() => import("./routes/OwnerRegistration"));
// const OwnerLogin = lazy(() => import("./routes/OwnerLogin"));
// const Dashbaord = lazy(() => import("./routes/Dashboard"));

// const PageNotFound = lazy(() => import("./routes/PageNotFound"));
// const Login = lazy(() => import("./routes/Login"));
// const Registration = lazy(() => import("./routes/Registration"));

// const App = () => {
//   return (
//     <>
//       <ScrollToTop />
//       <ToastContainer />
//       <Routes>
//         <Route path="/auth/login" element={<Login />} />
//         <Route path="/auth/register" element={<Registration />} />
//         <Route
//           path="/"
//           element={
//             <>
//               <Header />
//               <Home />
//               <Footer />
//             </>
//           }
//         />
//         <Route
//           path="/about"
//           element={
//             <>
//               <Header />
//               <About />
//               <Footer />
//             </>
//           }
//         />

//         <Route
//           path="/ownerRegistration"
//           element={
//             <ProtectedRoute>
//               <OwnerRegistartion />
//             </ProtectedRoute>
//           }
//         />
//         <Route path="*" element={<PageNotFound />} />

//         <Route
//           path="/ownerLogin"
//           element={
//             <ProtectedRoute>
//               <OwnerLogin />
//             </ProtectedRoute>
//           }
//         />
//         <Route path="*" element={<PageNotFound />} />
//         <Route
//           path="/dashboard"
//           element={
//             <ProtectedRoute>
//               <Dashbaord />
//             </ProtectedRoute>
//           }
//         />
//         <Route path="*" element={<PageNotFound />} />
//       </Routes>
//     </>
//   );
// };

// export default App;
