import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Updated import to useNavigate

const PlagiarismDetection = ({ articles }) => {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false); // State for loading
  const navigate = useNavigate(); // Replaced useHistory with useNavigate

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleCheckPlagiarism = async () => {
    setLoading(true); // Set loading to true when the request is initiated
    try {
      const response = await axios.post("http://localhost:3000/check-plagiarism-all", {
        targetContent: inputText,
        articles: articles, // You can add the list of articles here if needed
      });

      const { similarityPercentage, matched_text, highlightedTextFromIp } = response.data;

      // Use navigate to redirect to the Result page and pass data in the state
      navigate("/result", {
        state: {
          similarityPercentage,
          matchedText: matched_text,
          highlightedText: highlightedTextFromIp,
        },
      });
    } catch (error) {
      console.error("Error checking plagiarism:", error);
    } finally {
      setLoading(false); // Set loading to false once the request is complete
    }
  };

  return (
    <div className="px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <div className="flex min-w-72 flex-col gap-3">
            <p className="text-[#141414] tracking-light text-[32px] font-bold leading-tight">Plagiarism Detection</p>
            <p className="text-neutral-500 text-sm font-normal leading-normal">Check your content for plagiarism. Compare your text with the web to see if it's original</p>
          </div>
        </div>
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <textarea
              placeholder="Let’s check if your text has a twin! Paste it here.."
              value={inputText}
              onChange={handleInputChange}
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#141414] focus:outline-0 focus:ring-0 border border-[#dbdbdb] bg-neutral-50 focus:border-[#dbdbdb] min-h-36 placeholder:text-neutral-500 p-[15px] text-base font-normal leading-normal"
            ></textarea>
          </label>
        </div>
        <div className="flex px-4 py-3">
          <button
            onClick={handleCheckPlagiarism}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 flex-1 bg-black text-neutral-50 text-base font-bold leading-normal tracking-[0.015em]"
            disabled={loading} // Disable the button while loading
          >
            {loading ? (
              <span className="truncate">Checking...</span> // Display loading text
            ) : (
              <span className="truncate">Check Plagiarism</span> // Display original text when not loading
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlagiarismDetection;
