require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

// Environment variables
const COPYLEAKS_API_KEY = process.env.COPYLEAKS_API_KEY;
const COPYLEAKS_EMAIL = process.env.COPYLEAKS_EMAIL;
const copyleaksEndpoint = "https://api.copyleaks.com/v3";
const copyleaksLoginEndpoint = "https://id.copyleaks.com/v3/account/login/api";

// Authenticate with Copyleaks API to get access token
async function authenticateWithCopyleaks() {
  const response = await axios.post(copyleaksLoginEndpoint, {
    email: COPYLEAKS_EMAIL,
    key: COPYLEAKS_API_KEY,
  });
  return response.data.access_token;
}

// Submit text for plagiarism detection
async function submitTextForPlagiarism(access_token, content) {
  const encodedContent = Buffer.from(content).toString("base64");

  try {
    // Submit the base64 encoded text to Copyleaks for plagiarism check
    console.log("text");

    const response = await axios.post(
      `${copyleaksEndpoint}/education/submit/file`, // Correct endpoint for text submission
      {
        base64: encodedContent, // Content encoded as base64
        properties: {
          webhooks: {
            status: "https://yoursite.com/webhook/{STATUS}", // Replace with your actual webhook URL
          },
        },
      },
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );
    console.log("text1");

    return response.data; // Return the scanId from the response
  } catch (error) {
    console.error(
      "Error submitting text for plagiarism check:"
      //   error.response || error.message
    );
    throw error;
  }
}

// Poll for plagiarism results
async function pollForResults(access_token, scanId) {
  let resultData;
  while (!resultData) {
    // Polling for results every 5 seconds
    const response = await axios.get(
      `${copyleaksEndpoint}/education/${scanId}/result`, // Endpoint to retrieve scan results
      { headers: { Authorization: `Bearer ${access_token}` } }
    );
    if (response.data && response.data.length > 0) {
      resultData = response.data; // Once results are available, return them
    } else {
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds before retrying
    }
  }
  return resultData;
}

// Route to handle plagiarism detection for text
app.post("/detect-plagiarism-text", async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }

  try {
    console.log("log1");

    // Step 1: Authenticate to get the access token
    const access_token = await authenticateWithCopyleaks();

    console.log("log2");

    // Step 2: Submit the text content for plagiarism detection
    const submissionResponse = await submitTextForPlagiarism(
      access_token,
      content
    );
    const { scanId } = submissionResponse; // Get scanId from the response

    console.log("log3");

    // Step 3: Poll for plagiarism results
    const resultData = await pollForResults(access_token, scanId);

    console.log("log4");

    // Step 4: Return the results
    res.json({
      success: true,
      resultData: resultData, // Return the plagiarism results
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong", details: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
