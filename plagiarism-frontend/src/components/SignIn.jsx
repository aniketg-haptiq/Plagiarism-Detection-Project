import React, { useState, useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const { signIn } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3000/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      const { token } = data;

      // Save token in localStorage and context
      localStorage.setItem("token", token);
      signIn({ email, token });

      // Display success message
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-white p-8 shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Sign In Successful!</h2>
          <p className="mb-6">You have successfully signed in.</p>
          {/* <button
            onClick={() => navigate(-1)} // Go back to the previous page
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Go Back
          </button> */}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form className="bg-white p-8 shadow-lg" onSubmit={handleSignIn}>
        <h2 className="text-2xl font-bold mb-6">Sign In</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Sign In
        </button>
      </form>
      <p className="mt-4 text-sm">
        Don't have an account?{" "}
        <button
          onClick={() => navigate("/signup")}
          className="text-blue-500 hover:underline"
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default SignIn;
