import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext"; // Import AuthContext

const SignOut = () => {
  const { signOut } = useContext(AuthContext); // Get signOut function from context
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(); // Call the signOut function to clear the login status
    navigate("/"); // Redirect to the home page after sign-out
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
