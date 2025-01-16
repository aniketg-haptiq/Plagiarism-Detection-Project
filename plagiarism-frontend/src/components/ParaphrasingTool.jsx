import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ParaphrasingTool = ({ inputText, isLoggedIn }) => {
  const [paraphrasedText, setParaphrasedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const navigate = useNavigate();

  const handleParaphrase = async () => {
    if (!isLoggedIn) {
      setShowSignInPrompt(true);
      return;
    }

    if (!inputText) {
      setError("No text available to paraphrase.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage

      const response = await fetch("http://localhost:3000/paraphrase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token in the request
        },
        body: JSON.stringify({ inputText }),
      });

      if (!response.ok) {
        throw new Error("Failed to paraphrase content.");
      }

      const data = await response.json();
      setParaphrasedText(data.paraphrasedText);
    } catch (error) {
      console.error("Error paraphrasing text:", error.message, error.stack);
      setError("An error occurred while paraphrasing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (paraphrasedText) {
      navigator.clipboard
        .writeText(paraphrasedText)
        .then(() => setCopySuccess(true))
        .catch((err) => {
          console.error("Failed to copy text:", err);
          setCopySuccess(false);
        });
    }
  };

  return (
    <div className="px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1 gap-4">
        <h2 className="text-[#141414] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          AI Paraphrasing Tool
        </h2>

        <div className="rounded bg-[#f5f5f5] p-4 border border-[#dbdbdb]">
          <h3 className="text-[#141414] text-base font-bold pb-2">
            Your Input Text
          </h3>
          <p className="text-neutral-500 text-sm font-normal leading-normal">
            {inputText}
          </p>
        </div>

        {error && (
          <p className="text-red-600 text-sm font-medium px-4">{error}</p>
        )}

        {!paraphrasedText && !showSignInPrompt && (
          <button
            onClick={handleParaphrase}
            className="w-40 h-10 bg-black text-white rounded-full font-bold text-sm hover:bg-gray-800 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Rewriting..." : "Rewrite"}
          </button>
        )}

        {showSignInPrompt && (
          <div className="text-center p-4 bg-yellow-100 border border-yellow-400 rounded-lg mt-4">
            <p className="text-red-500">You must be signed in to use the tool.</p>
            <button
              onClick={() => navigate("/signin")}
              className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600"
            >
              Sign In
            </button>
          </div>
        )}

        {paraphrasedText && (
          <div className="rounded bg-[#dbdbdb] p-4 border border-[#c4c4c4]">
            <h3 className="text-[#141414] text-base font-bold pb-2">
              Paraphrased Text
            </h3>
            <p className="text-neutral-500 text-sm font-normal leading-normal">
              {paraphrasedText}
            </p>

            <button
              onClick={handleCopy}
              className="w-36 h-10 mt-3 bg-blue-500 text-white rounded-full font-bold text-sm hover:bg-blue-600"
            >
              {copySuccess ? "Copied!" : "Copy Text"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParaphrasingTool;
