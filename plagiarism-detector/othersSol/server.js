require("dotenv").config(); // Load environment variables from .env file

const express = require("express");
const axios = require("axios");

const app = express();
const port = 3000;

app.use(express.json());

// Use the API key from environment variables
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error("OpenAI API Key not found in environment variables.");
  process.exit(1);
}

app.post("/compare-text", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "No text provided to compare." });
  }

  try {
    const plagiarismReport = await compareTextWithOpenAI(text, apiKey);
    res.json(plagiarismReport);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error comparing text with OpenAI API." });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
async function compareTextWithOpenAI(inputText, apiKey) {
  const messages = [
    {
      role: "system",
      content:
        "You are a plagiarism detection assistant. Analyze the provided text for any similarities to known writing patterns or sources. Highlight phrases or portions that may be commonly used or closely resemble widely known phrases. Even partial matches or similarities should be highlighted.",
    },
    {
      role: "user",
      content: `Please analyze the following text for potential plagiarism and highlight the matched portions with their similarity percentage:

      ${inputText}`,
    },
  ];

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions", // Correct endpoint for chat completions
      {
        model: "gpt-4o-mini", // Your chat model
        messages: messages, // Pass messages for chat-based models
        max_tokens: 1000,
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const report = response.data.choices[0].message.content.trim();

    // Extract similarity percentage
    const similarityMatch = report.match(/(\d+)%/); // Regex to extract percentage
    let similarityPercentage = "Unable to calculate similarity";

    if (similarityMatch && similarityMatch[1]) {
      similarityPercentage = similarityMatch[1] + "%"; // Extract percentage
    }

    // Extract matched text
    const matchedTextPattern = /Matched Text:\s*(.*?)\s*Similarity:/i; // Regex to extract matched text
    const matchedTextMatch = report.match(matchedTextPattern);
    const matchedText = matchedTextMatch ? matchedTextMatch[1] : null;

    // Highlight matched text in HTML
    let highlightedHtml = inputText;
    if (matchedText) {
      const escapedMatchedText = matchedText.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      ); // Escape special characters in matchedText for regex
      const highlightRegex = new RegExp(`(${escapedMatchedText})`, "gi"); // Case-insensitive match
      highlightedHtml = inputText.replace(
        highlightRegex,
        '<span style="background-color: yellow;">$1</span>'
      );
    }

    return {
      plagiarismReport: report,
      similarityPercentage,
      matchedText: matchedText || "No matched text found.",
      highlightedHtml,
    };
  } catch (error) {
    console.error(
      "Error making request to OpenAI API:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Error querying OpenAI API for plagiarism comparison");
  }
}
