import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PlagiarismForm = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sources, setSources] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // State to manage loading

  const handleSearch = async () => {
    if (!searchQuery || !sources) {
      setError("Both Search Query and Sources are required.");
      return;
    }

    setLoading(true); // Set loading to true when search is initiated

    try {
      // Call backend to fetch articles
      const response = await axios.post("http://localhost:3000/fetch-articles", {
        query: searchQuery,
        sources: sources,
      });

      const articles = response.data.articles;
      if (articles.length > 0) {
        // Navigate to MainPage with fetched articles
        navigate("/main", { state: { articles, searchQuery } });
      } else {
        setError("No articles found for the given query and sources.");
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
      setError("An error occurred while fetching articles. Please try again.");
    } finally {
      setLoading(false); // Set loading to false once the request is complete
    }
  };

  return (
    <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 max-w-[960px] flex-1">
      <h1 className="text-[#141414] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 text-left pb-3 pt-5">
        Find similar content
      </h1>
      <p className="text-[#141414] text-base font-normal leading-normal pb-3 pt-1 px-4">
      Uncover Content Similarities with our AI-Powered Plagiarism detection: Perfect for Writers, Educators, and Media Professionals.
      </p>

      {error && (
        <p className="text-red-600 px-4 pb-3 text-sm font-medium">{error}</p>
      )}

      {/* Search Query Input */}
      <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
        <label className="flex flex-col min-w-40 flex-1">
          <p className="text-[#141414] text-base font-medium leading-normal pb-2">
          Article Topic
          </p>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter the topic or keywords for the article"
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#141414] focus:outline-0 focus:ring-0 border border-[#dbdbdb] bg-neutral-50 focus:border-[#dbdbdb] h-14 placeholder:text-neutral-500 p-[15px] text-base font-normal leading-normal"
          />
        </label>
      </div>

      {/* Sources Input */}
      <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
        <label className="flex flex-col min-w-40 flex-1">
          <p className="text-[#141414] text-base font-medium leading-normal pb-2">
          News Source
          </p>
          <input
            value={sources}
            onChange={(e) => setSources(e.target.value)}
            placeholder="Enter the name of a news source"
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#141414] focus:outline-0 focus:ring-0 border border-[#dbdbdb] bg-neutral-50 focus:border-[#dbdbdb] h-14 placeholder:text-neutral-500 p-[15px] text-base font-normal leading-normal"
          />
        </label>
      </div>

      {/* Buttons */}
      <div className="flex justify-stretch">
        <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-end">
          <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#ededed] text-[#141414] text-sm font-bold leading-normal tracking-[0.015em]">
            <span className="truncate">Cancel</span>
          </button>
          <button
            onClick={handleSearch}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-black text-neutral-50 text-sm font-bold leading-normal tracking-[0.015em]"
            disabled={loading} // Disable the button while loading
          >
            {loading ? (
              <span className="truncate">Searching...</span> // Display Searching... text
            ) : (
              <span className="truncate">Search</span> // Display original text when not loading
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlagiarismForm;
