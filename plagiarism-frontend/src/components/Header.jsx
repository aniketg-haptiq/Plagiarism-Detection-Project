import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../components/AuthContext"; // Assuming AuthContext is created to manage user state
import "../css/style.css"

const Header = () => {
  const { user, signOut } = useContext(AuthContext); // Use signOut function from context
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = () => {
    signOut(); // Call signOut to clear user data
    navigate("/"); // Redirect to home or a specific page after sign out
  };

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#ededed] px-10 py-3">
      <div className="flex items-center gap-4 text-[#141414]">
        {/* <div className="size-4">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_6_319)">
              <path
                d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"
                fill="currentColor"
              ></path>
            </g>
            <defs>
              <clipPath id="clip0_6_319"><rect width="48" height="48" fill="white"></rect></clipPath>
            </defs>
          </svg>
        </div> */}
        <div className="headingImg"><img src="/images/PG.jpg" alt="" /></div>
        <h2 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em]">PlagGuard</h2>
      </div>
      <div className="flex flex-1 justify-end gap-8">
        <div className="flex items-center gap-9">
          <Link className="text-[#141414] text-sm font-medium leading-normal" to="/">Home</Link>
          <Link className="text-[#141414] text-sm font-medium leading-normal" to="/contact">Contact</Link>

          {/* Conditionally render Log In / Sign Out */}
          {user ? (
            <>
              <span className="text-sm text-[#141414] font-medium leading-normal">Welcome, {user.name}</span>
              <button 
                className="text-[#141414] text-sm font-medium leading-normal"
                onClick={handleSignOut}>
                Sign Out
              </button>
            </>
          ) : (
            <Link className="text-[#141414] text-sm font-medium leading-normal" to="/signin" state={{ from: location.pathname }}>Log In</Link>
          )}
        </div>
        <div className="flex gap-2">
          <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-black text-neutral-50 text-sm font-bold leading-normal tracking-[0.015em]">
            <span className="truncate">Explore More</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
