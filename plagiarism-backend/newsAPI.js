const express = require("express");
const axios = require("axios");
const { OpenAI } = require("openai");
const app = express();

const cors = require("cors");
app.use(cors({ origin: "http://localhost:3001" }));

app.use(express.json());

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
    const similarityPercentageMatch = similarityResponse.match(
      /Similarity Percentage: \s*[:=]?\s*(\d+(\.\d+)?)/i
    );
    const matchedText1 = similarityResponse.match(
      /Matched sections from Text 1:\s*[:=]?\s*([\s\S]+?)(?=\n|$)/i
    );

    const similarityPercentage = similarityPercentageMatch
      ? parseFloat(similarityPercentageMatch[1])
      : 0;

    const highlightedText1 = matchedText1 ? matchedText1[1].trim() : "";

    let finalContent = inputContent;
    if (highlightedText1) {
      const regex = new RegExp(`(${highlightedText1})`, "gi");
      finalContent = inputContent.replace(regex, (match) => `${match}`);
    }

    return {
      similarityPercentage,
      matched_text: highlightedText1,
      highlightedTextFromIp: finalContent,
    };
  } catch (error) {
    if (error.status === 429) {
      console.log(error);

      throw new Error("RateLimitError");
    }
    console.error("Error comparing contents:", error);
    throw new Error("Failed to compare contents.");
  }
};

app.post("/check-plagiarism-all", async (req, res) => {
  const { targetContent, articles } = req.body;

  if (!targetContent || !Array.isArray(articles)) {
    return res.status(400).json({
      error: "Target content and articles array are required.",
    });
  }

  try {
    const allArticlesContent = articles
      .map((article) => article.content)
      .join("\n");

    const { similarityPercentage, matched_text, highlightedTextFromIp } =
      await compareContentSimilarity(targetContent, allArticlesContent);

    return res.json({
      similarityPercentage,
      matched_text,
      highlightedTextFromIp,
    });
  } catch (error) {
    if (error.message === "RateLimitError") {
      console.log(error);
      return res.status(429).json({
        error: "Rate limit exceeded. Please try again later.",
      });
    }
    res.status(500).json({
      error: "An error occurred during the batch plagiarism check.",
    });
  }
});

// Function to paraphrase content using GPT-4
const paraphraseContent = async (inputText) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a paraphrasing assistant. Rewrite the given text in different words while preserving the meaning.",
        },
        {
          role: "user",
          content: `Please paraphrase the following text:
          ${inputText}`,
        },
      ],
    });

    const paraphrasedText = response.choices[0].message.content;
    return paraphrasedText.trim();
  } catch (error) {
    console.error("Error paraphrasing content:", error);
    throw new Error("Failed to paraphrase content.");
  }
};

// Paraphrasing API Endpoint
app.post("/paraphrase", async (req, res) => {
  const { inputText } = req.body;

  if (!inputText) {
    return res.status(400).json({
      error: "Input text is required for paraphrasing.",
    });
  }

  try {
    const paraphrasedText = await paraphraseContent(inputText);
    return res.json({
      paraphrasedText,
    });
  } catch (error) {
    console.error("Error paraphrasing content:", error);
    res.status(500).json({
      error: "An error occurred during the paraphrasing process.",
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
