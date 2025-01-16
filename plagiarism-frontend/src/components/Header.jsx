import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../components/AuthContext"; 
import "../css/style.css"

const Header = () => {
  const { user, signOut } = useContext(AuthContext); 
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = () => {
    signOut(); 
    navigate("/"); 
  };

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#ededed] px-10 py-3">
      <div className="flex items-center gap-4 text-[#141414]">
        
        <div className="headingImg"><img src="/images/PG.jpg" alt="" /></div>
        <h2 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em]">PlagGuard</h2>
      </div>
      <div className="flex flex-1 justify-end gap-8">
        <div className="flex items-center gap-9">
          <Link className="text-[#141414] text-sm font-medium leading-normal" to="/">Home</Link>
          <Link className="text-[#141414] text-sm font-medium leading-normal" to="/contact">Contact</Link>

       
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
