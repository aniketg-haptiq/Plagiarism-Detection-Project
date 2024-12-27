require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

// Environment variables
const COPYLEAKS_API_KEY = process.env.COPYLEAKS_API_KEY;
const COPYLEAKS_EMAIL = process.env.COPYLEAKS_EMAIL;
// const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Copyleaks API Endpoint
const copyleaksEndpoint = "https://api.copyleaks.com/v3";

// Route to handle plagiarism detection
app.post("/detect-plagiarism", async (req, res) => {
  const { content } = req.body;
  console.log(content);

  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }

  try {
    // Step 1: Authenticate with Copyleaks API
    const authResponse = await axios.post(
      `${copyleaksEndpoint}/account/login/api`,
      {
        email: COPYLEAKS_EMAIL,
        key: COPYLEAKS_API_KEY,
      }
    );
    const { access_token } = authResponse.data;

    // Step 2: Submit content for plagiarism detection
    console.log("step111");

    const scanResponse = await axios.post(
      `${copyleaksEndpoint}/education/submit/text`,
      {
        base64: Buffer.from(content).toString("base64"),
        // filename: "submission.txt",
        // properties: { webhooks: { status: "YOUR_WEBHOOK_URL" } },
      },
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );
    console.log("step2");

    // Get scan ID
    const { scanId } = scanResponse.data;

    // Step 3: Poll for results
    let resultData;
    while (!resultData) {
      const resultResponse = await axios.get(
        `${copyleaksEndpoint}/education/${scanId}/result`,
        { headers: { Authorization: `Bearer ${access_token}` } }
      );
      if (resultResponse.data && resultResponse.data.length > 0) {
        resultData = resultResponse.data;
      }
    }

    // Step 4: Process results to calculate overall similarity and highlight text
    let totalMatchedWords = 0;
    const contentWords = content.split(/\s+/).length;

    // Highlight matches in input text
    let highlightedText = content;

    for (const match of resultData) {
      const { matchedText, matchedWords } = match;
      totalMatchedWords += matchedWords;

      // Highlight matched text in input content
      const escapedMatchedText = matchedText.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      ); // Escape regex special characters
      const regex = new RegExp(`\\b${escapedMatchedText}\\b`, "gi");
      highlightedText = highlightedText.replace(
        regex,
        (match) => `<mark>${match}</mark>`
      );
    }

    // Calculate overall similarity
    const overallSimilarity = (
      (totalMatchedWords / contentWords) *
      100
    ).toFixed(2);

    // Step 5: Return results
    res.json({
      success: true,
      overallSimilarity: overallSimilarity,
      highlightedInputText: highlightedText,
    });
  } catch (error) {
    // console.error(error);
    res
      .status(500)
      .json({ error: "Something went wrong", details: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
