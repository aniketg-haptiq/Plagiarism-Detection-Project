import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="container mx-auto flex flex-col items-center justify-between sm:flex-row">
        {/* Left Section */}
        <div className="flex flex-col items-center sm:items-start">
          <h2 className="text-xl font-bold mb-2">PlagGuard</h2>
          <p className="text-sm text-gray-400">
            Safeguard your content with the most reliable plagiarism detection system.
          </p>
        </div>

        {/* Links Section */}
        <div className="flex gap-6 mt-4 sm:mt-0">
          <Link
            to="/about"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            About Us
          </Link>
          <Link
            to="/privacy"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Terms of Service
          </Link>
          <Link
            to="/contact"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Contact
          </Link>
        </div>

        {/* Social Media Icons */}
        <div className="flex gap-4 mt-4 sm:mt-0">
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            <svg
              className="w-6 h-6"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.463.099 2.794.143v3.24l-1.917.001c-1.504 0-1.796.714-1.796 1.763v2.31h3.591l-.467 3.622h-3.124V24h6.116c.729 0 1.324-.593 1.324-1.324V1.325C24 .593 23.407 0 22.675 0z" />
            </svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            <svg
              className="w-6 h-6"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.608 1.794-1.57 2.163-2.723-.949.564-2.005.974-3.127 1.195-.897-.956-2.173-1.555-3.591-1.555-2.717 0-4.918 2.201-4.918 4.917 0 .386.045.762.128 1.124C7.728 8.087 4.1 6.128 1.671 3.149c-.423.722-.666 1.561-.666 2.475 0 1.71.87 3.217 2.188 4.099-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.697 4.374 3.946 4.827-.413.111-.848.171-1.296.171-.316 0-.624-.031-.927-.089.625 1.951 2.444 3.374 4.6 3.414-1.68 1.319-3.809 2.104-6.115 2.104-.398 0-.79-.023-1.175-.068C2.905 21.29 6.355 22 9.93 22c11.912 0 18.424-9.859 18.424-18.424 0-.28-.006-.559-.018-.836A13.144 13.144 0 0024 4.59z" />
            </svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            <svg
              className="w-6 h-6"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.372 0 0 5.372 0 12c0 5.302 3.438 9.8 8.207 11.387.6.111.82-.26.82-.577v-2.16c-3.338.725-4.042-1.423-4.042-1.423-.546-1.389-1.333-1.759-1.333-1.759-1.089-.744.083-.729.083-.729 1.204.083 1.836 1.237 1.836 1.237 1.071 1.835 2.809 1.305 3.495.998.107-.776.418-1.305.76-1.605-2.665-.305-5.466-1.333-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.525.117-3.176 0 0 1.008-.322 3.3 1.23a11.49 11.49 0 013.003-.404c1.018.005 2.043.137 3.003.404 2.292-1.552 3.299-1.23 3.299-1.23.653 1.651.242 2.873.118 3.176.769.84 1.236 1.911 1.236 3.221 0 4.609-2.804 5.624-5.475 5.922.431.372.815 1.1.815 2.217v3.293c0 .319.218.694.825.576C20.565 21.797 24 17.302 24 12c0-6.628-5.372-12-12-12z" />
            </svg>
          </a>
        </div>
      </div>
      <div className="text-center text-gray-500 text-sm mt-4">
        © {new Date().getFullYear()} PlagGuard. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
