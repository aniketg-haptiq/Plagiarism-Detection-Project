import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext"; 

const SignOut = () => {
  const { signOut } = useContext(AuthContext); 
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(); 
    navigate("/"); 
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <button
        onClick={handleSignOut}
        className="bg-red-500 text-white p-4 rounded hover:bg-red-600"
      >
        Sign Out
      </button>
    </div>
  );
};

export default SignOut;
