import React, { useState } from "react";
import axios from "axios";

function App() {
  const [targetContent, setTargetContent] = useState(""); // Target content input
  const [filters, setFilters] = useState({
    query: "",
    sources: "",
    from: "",
    to: "",
    language: "en",
    sortBy: "publishedAt",
  });
  const [articles, setArticles] = useState([]); // Fetched articles state
  const [plagiarismResults, setPlagiarismResults] = useState({}); // Plagiarism results by article ID
  const [loading, setLoading] = useState(false); // Global loading state
  const [error, setError] = useState(null); // Error state

  // Handle filter input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Fetch articles based on filters
  const fetchArticles = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:3000/fetch-articles",
        filters
      );
      setArticles(response.data.articles);
    } catch (err) {
      setError("Error fetching articles.");
    } finally {
      setLoading(false);
    }
  };

  // Check plagiarism for a specific article
  const checkPlagiarism = async (articleContent, articleId) => {
    if (plagiarismResults[articleId]?.loading) return; // Prevent multiple submissions for the same article

    setPlagiarismResults((prev) => ({
      ...prev,
      [articleId]: { loading: true }, // Set loading state for this article
    }));

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:3000/check-plagiarism",
        {
          targetContent,
          articleContent,
        }
      );

      setPlagiarismResults((prev) => ({
        ...prev,
        [articleId]: response.data, // Store result for this article
      }));
    } catch (err) {
      setError("Error checking plagiarism.");
      setPlagiarismResults((prev) => ({
        ...prev,
        [articleId]: { error: "Error checking plagiarism." }, // Handle error for specific article
      }));
    } finally {
      setLoading(false);
      setPlagiarismResults((prev) => ({
        ...prev,
        [articleId]: { ...prev[articleId], loading: false }, // Reset loading state for this article
      }));
    }
  };

  return (
    <div className="App">
      <h1>Plagiarism Checker</h1>

      {/* Target Content Input */}
      <div>
        <label htmlFor="targetContent">Target Content:</label>
        <textarea
          id="targetContent"
          value={targetContent}
          onChange={(e) => setTargetContent(e.target.value)}
          required
        />
      </div>

      {/* Filters Form */}
      <form onSubmit={fetchArticles}>
        <h2>Search for Articles</h2>
        <div>
          <label htmlFor="query">Query:</label>
          <input
            id="query"
            name="query"
            type="text"
            value={filters.query}
            onChange={handleFilterChange}
            required
          />
        </div>
        <div>
          <label htmlFor="sources">Sources (optional):</label>
          <input
            id="sources"
            name="sources"
            type="text"
            value={filters.sources}
            onChange={handleFilterChange}
            placeholder="e.g., cnn, bbc-news"
          />
        </div>
        <div>
          <label htmlFor="from">From Date (optional):</label>
          <input
            id="from"
            name="from"
            type="date"
            value={filters.from}
            onChange={handleFilterChange}
          />
        </div>
        <div>
          <label htmlFor="to">To Date (optional):</label>
          <input
            id="to"
            name="to"
            type="date"
            value={filters.to}
            onChange={handleFilterChange}
          />
        </div>
        <div>
          <label htmlFor="sortBy">Sort By:</label>
          <select
            id="sortBy"
            name="sortBy"
            value={filters.sortBy}
            onChange={handleFilterChange}
          >
            <option value="publishedAt">Published At</option>
            <option value="popularity">Popularity</option>
            <option value="relevancy">Relevancy</option>
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Fetching..." : "Fetch Articles"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Display Articles */}
      {articles.length > 0 && (
        <div>
          <h2>Fetched Articles</h2>
          <ul>
            {articles.map((article, index) => (
              <li key={index}>
                <h3>{article.title}</h3>
                <p>{article.description}</p>
                <button
                  onClick={() => checkPlagiarism(article.content, index)}
                  disabled={loading || plagiarismResults[index]?.loading}
                >
                  {loading || plagiarismResults[index]?.loading
                    ? "Checking..."
                    : "Check Plagiarism"}
                </button>

                {/* Plagiarism Results for the Article */}
                {plagiarismResults[index] && plagiarismResults[index].error && (
                  <p style={{ color: "red" }}>
                    {plagiarismResults[index].error}
                  </p>
                )}

                {plagiarismResults[index] &&
                  !plagiarismResults[index].error && (
                    <div>
                      <p>
                        <strong>Similarity Percentage:</strong>{" "}
                        {plagiarismResults[index].similarityPercentage}%
                      </p>
                      <p>
                        <strong>Matched Text:</strong>{" "}
                        {plagiarismResults[index].matched_text}
                      </p>
                      <div>
                        <strong>Highlighted Text:</strong>
                        <div
                          dangerouslySetInnerHTML={{
                            __html:
                              plagiarismResults[index].highlightedTextFromIp,
                          }}
                        />
                      </div>
                      <p>
                        <a
                          href={articles[index].url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Read the original article
                        </a>
                      </p>
                    </div>
                  )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
