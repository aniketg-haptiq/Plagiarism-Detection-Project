import React from "react";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PlagiarismForm from "./components/PlagiarismForm";
import MainPage from "./components/MainPage";
import Result from "./components/Result";
import AboutUs from "./components/AboutUs";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfService from "./components/TermsOfService";
import Contact from "./components/Contact";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
// import ParaphrasingTool from "./components/ParaphrasingTool";
import { AuthProvider, AuthContext } from "./components/AuthContext"; // Import AuthContext

const AppRoutes = () => {
  const { user } = React.useContext(AuthContext); // Get user from AuthContext

  const routes = useRoutes([
    { path: "/", element: <PlagiarismForm /> },
    { path: "/main", element: <MainPage /> },
    {
      path: "/result",
      element: <Result isLoggedIn={!!user} />, // Pass isLoggedIn to Result
    },
    { path: "/about", element: <AboutUs /> },
    { path: "/privacy", element: <PrivacyPolicy /> },
    { path: "/terms", element: <TermsOfService /> },
    { path: "/contact", element: <Contact /> },
    { path: "/signin", element: <SignIn /> },
    { path: "/signup", element: <SignUp /> },
    // {
    //   path: "/paraphrasing",
    //   element: <ParaphrasingTool isLoggedIn={!!user} />, // Pass isLoggedIn to ParaphrasingTool
    // },
  ]);

  return routes;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div
          className="relative flex size-full min-h-screen flex-col bg-neutral-50 group/design-root overflow-x-hidden"
          style={{ fontFamily: '"Be Vietnam Pro", "Noto Sans", sans-serif' }}
        >
          {/* Header */}
          <div className="layout-container flex h-full grow flex-col">
            <Header />

            {/* Main Content */}
            <div className="px-40 flex flex-1 justify-center py-5">
              <AppRoutes />
            </div>

            {/* Footer */}
            <Footer />
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
