const express = require("express");
const axios = require("axios");
const { OpenAI } = require("openai");
const app = express();

const cors = require("cors");
app.use(cors({ origin: "http://localhost:3001" })); // Replace with the actual frontend URL

app.use(express.json()); // Parse JSON requests

// Use environment variables for sensitive keys
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const NEWSAPI_KEY = process.env.NEWSAPI_KEY;

// Set up OpenAI client
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// Function to fetch multiple articles using NewsAPI with filters
app.post("/fetch-articles", async (req, res) => {
  const { query, sources } = req.body;

  if (!query || !sources) {
    return res.status(400).json({ error: "Query and sources are required." });
  }

  try {
    // Construct URL with only available parameters
    let url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
      query
    )}&sources=${encodeURIComponent(
      sources
    )}&pageSize=10&apiKey=${NEWSAPI_KEY}`;

    console.log("Fetching articles with URL:", url);

    const response = await axios.get(url);
    const articles = response.data.articles || [];
    console.log(articles);

    res.json({ articles });
  } catch (error) {
    console.error("Error fetching articles:", error.message);
    res.status(500).json({ error: "Failed to fetch articles." });
  }
});

// Function to compare content similarity using GPT-4o-mini
const compareContentSimilarity = async (inputContent, allArticlesContent) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant for text matching. Compare the two provided texts and calculate the overall similarity percentage by identifying the matching words and phrases. Return only the similarity percentage and the matched sections from Text 1 (do not include other information).",
        },
        {
          role: "user",
          content: `
            Text 1:
            ${inputContent}

            Text 2:
            ${allArticlesContent}

            Please provide the similarity percentage and highlight the matched sections in Text 1 only.
          `,
        },
      ],
    });

    const similarityResponse = response.choices[0].message.content;
    console.log("Raw Similarity Response:", similarityResponse); // Log to inspect the format

    const similarityPercentageMatch = similarityResponse.match(
      /similarity percentage\s*[:=]?\s*(\d+(\.\d+)?)/i
    );

    const matchedText1 = similarityResponse.match(
      /matched sections from Text 1:\s*[:=]?\s*([\s\S]+?)(?=\n|$)/i
    );

    const similarityPercentage = similarityPercentageMatch
      ? parseFloat(similarityPercentageMatch[1])
      : 0;

    const highlightedText1 = matchedText1 ? matchedText1[1].trim() : "";

    let finalContent = inputContent;
    if (highlightedText1) {
      const escapeRegExp = (string) =>
        string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      const escapedHighlightedText = escapeRegExp(highlightedText1);

      const regex = new RegExp(`(${escapedHighlightedText})`, "gi");

      finalContent = inputContent.replace(regex, (match) => `${match}`);
    }

    return {
      similarityPercentage,
      matched_text: highlightedText1,
      highlightedTextFromIp: finalContent,
    };
  } catch (error) {
    console.error("Error comparing contents:", error);
    throw new Error("Failed to compare contents.");
  }
};

// Endpoint to check plagiarism for a single article
app.post("/check-plagiarism", async (req, res) => {
  const { targetContent, articleContent } = req.body;

  try {
    if (!targetContent || !articleContent) {
      return res
        .status(400)
        .json({ error: "Target content and article content are required." });
    }

    const { similarityPercentage, matched_text, highlightedTextFromIp } =
      await compareContentSimilarity(targetContent, articleContent);

    return res.json({
      similarityPercentage,
      matched_text,
      highlightedTextFromIp,
    });
  } catch (error) {
    console.error("Error during plagiarism check:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred during the plagiarism check." });
  }
});

// Endpoint to check plagiarism for all articles (grouped content)
app.post("/check-plagiarism-all", async (req, res) => {
  const { targetContent, articles } = req.body;

  if (!targetContent || !Array.isArray(articles)) {
    return res.status(400).json({
      error: "Target content and articles array are required.",
    });
  }

  try {
    // Grouping all articles' content into one string
    const allArticlesContent = articles
      .map((article) => article.content)
      .join("\n"); // Joining articles with a newline

    const { similarityPercentage, matched_text, highlightedTextFromIp } =
      await compareContentSimilarity(targetContent, allArticlesContent);

    return res.json({
      similarityPercentage,
      matched_text,
      highlightedTextFromIp,
    });
  } catch (error) {
    console.error("Error during batch plagiarism check:", error.message);
    res.status(500).json({
      error: "An error occurred during the batch plagiarism check.",
    });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
