const axios = require("axios");

exports.fetchArticles = async (req, res) => {
  const { query, sources } = req.body;

  if (!query || !sources) {
    return res.status(400).json({ error: "Query and sources are required." });
  }

  try {
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
      query
    )}&sources=${encodeURIComponent(sources)}&pageSize=10&apiKey=${
      process.env.NEWSAPI_KEY
    }`;

    console.log("NewsAPI URL:", url);

    const response = await axios.get(url);
    console.log("NewsAPI Response:", response.data);

    const articles = response.data.articles || [];
    res.json({ articles });
  } catch (error) {
    console.error("Error fetching articles:", error.message);

    if (error.response) {
      console.error("Error Response Data:", error.response.data);
      console.error("Error Response Status:", error.response.status);
    }

    res.status(500).json({ error: "Failed to fetch articles." });
  }
};
