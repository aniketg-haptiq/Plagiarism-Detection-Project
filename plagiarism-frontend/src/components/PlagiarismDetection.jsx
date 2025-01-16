import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PlagiarismDetection = ({ articles }) => {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0); 
  const navigate = useNavigate();
  const maxWords = 1000; 

  const handleInputChange = (e) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/); 
    const wordCount = text.trim() === "" ? 0 : words.length;

    if (wordCount <= maxWords) {
      setInputText(text);
      setWordCount(wordCount);
    }
  };

  const handleCheckPlagiarism = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/check-plagiarism-all", {
        targetContent: inputText,
        articles: articles,
      });
  
      const { similarityPercentage, matched_text, highlightedTextFromIp } = response.data;
  
      navigate("/result", {
        state: {
          similarityPercentage,
          matchedText: matched_text,
          highlightedText: highlightedTextFromIp,
          inputText, // Pass inputText here
        },
      });
    } catch (error) {
      if (error.response && error.response.status === 429) {
        console.log(error);
        alert("Cannot proceed. Please try again later.");
      } else {
        console.error("Error checking plagiarism:", error);
        alert("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  
  return (
    <div className="px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <div className="flex min-w-72 flex-col gap-3">
            <p className="text-[#141414] tracking-light text-[32px] font-bold leading-tight">
              Plagiarism Detection
            </p>
            <p className="text-neutral-500 text-sm font-normal leading-normal">
              Check your content for plagiarism. Compare your text with the web to see if it's original
            </p>
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
            <p className="text-neutral-500 text-sm font-normal mt-2">
              {wordCount}/{maxWords} words
            </p>
          </label>
        </div>
        <div className="flex px-4 py-3">
          <button
            onClick={handleCheckPlagiarism}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 flex-1 bg-black text-neutral-50 text-base font-bold leading-normal tracking-[0.015em]"
            disabled={loading || wordCount === 0 || wordCount > maxWords} 
          >
            {loading ? (
              <span className="truncate">Checking...</span>
            ) : (
              <span className="truncate">Check Plagiarism</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlagiarismDetection;
