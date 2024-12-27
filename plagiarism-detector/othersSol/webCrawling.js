const express = require("express");
const puppeteer = require("puppeteer");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Function to fetch OpenAI API response for similarity check
const getOpenAIResponse = async (inputText, sourceText) => {
  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4o-mini", // Specify the model to use
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that checks text similarity.",
        },
        {
          role: "user",
          content: `Check if the following text is similar to the provided source:\n\nInput Text:\n${inputText}\n\nSource Text:\n${sourceText}`,
        },
      ],
      max_tokens: 3000,
      temperature: 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.choices[0].message.content.trim();
};

// Function to crawl the web for similar content
const crawlWebForContent = async (inputText) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Search the input text on Google
  await page.goto(
    "https://www.google.com/search?q=" + encodeURIComponent(inputText)
  );

  const links = await page.evaluate(() => {
    const linkElements = Array.from(document.querySelectorAll("a"));
    return linkElements
      .map((link) => link.href)
      .filter(
        (href) =>
          href.startsWith("http") &&
          !href.includes("google") &&
          !href.includes("accounts.google")
      ); // Filter valid and non-Google links
  });

  await browser.close();
  return links;
};

// Function to fetch webpage content
const fetchWebpageContent = async (url) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });

    const content = await page.evaluate(() => {
      return document.body.innerText;
    });

    await browser.close();
    return content;
  } catch (error) {
    console.error(`Error fetching content from ${url}:`, error.message);
    return null;
  }
};

// Endpoint to check plagiarism
app.post("/check-plagiarism", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    // Step 1: Crawl the web for similar content
    const webLinks = await crawlWebForContent(text);

    // Step 2: Fetch content from the crawled links
    const fetchedContents = await Promise.all(
      webLinks.map(async (link) => {
        const content = await fetchWebpageContent(link);
        return { link, content };
      })
    );

    // Step 3: Use OpenAI to compare the input text with each fetched content
    const similarityResults = [];

    for (const { link, content } of fetchedContents) {
      if (content) {
        const similarity = await getOpenAIResponse(text, content);
        similarityResults.push({ link, similarity });
      }
    }

    // Step 4: Return the results
    res.json({
      inputText: text,
      similarityResults,
    });
  } catch (error) {
    console.error("Error checking plagiarism:", error.message, error.stack);
    res
      .status(500)
      .json({ error: "An error occurred while checking plagiarism." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
