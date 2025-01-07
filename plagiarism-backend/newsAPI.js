const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const { OpenAI } = require("openai");

const app = express();
app.use(cors({ origin: "http://localhost:3001" }));
app.use(express.json());

// Use environment variables for sensitive keys
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const NEWSAPI_KEY = process.env.NEWSAPI_KEY;
const JWT_SECRET = process.env.JWT_SECRET; // For simplicity
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/authDB";

// Set up OpenAI client
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// MongoDB connection with retry logic
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    // setTimeout(connectToMongoDB, 5000); // Retry after 5 seconds if connection fails
  }
};

connectToMongoDB(); // Initiate the connection

// User schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// SignUp API
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User created successfully." });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already exists." });
    }
    res.status(500).json({ error: "Internal server error." });
  }
});

// SignIn API
app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token, message: "Login successful." });
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
});

// Middleware to authenticate requests
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token." });
  }
};

// Fetch multiple articles using NewsAPI
app.post("/fetch-articles", async (req, res) => {
  const { query, sources } = req.body;

  if (!query || !sources) {
    return res.status(400).json({ error: "Query and sources are required." });
  }

  try {
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
      query
    )}&sources=${encodeURIComponent(
      sources
    )}&pageSize=10&apiKey=${NEWSAPI_KEY}`;

    console.log("Fetching articles with URL:", url);

    const response = await axios.get(url);

    // Log the API response
    console.log("NewsAPI Response:", response.data);

    const articles = response.data.articles || [];
    res.json({ articles });
  } catch (error) {
    console.error("Error fetching articles:", error.message);

    // Log more detailed error information
    if (error.response) {
      console.error("Error Response Data:", error.response.data);
      console.error("Error Response Status:", error.response.status);
    }

    res.status(500).json({ error: "Failed to fetch articles." });
  }
});

// Compare content similarity using GPT-4o-mini
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

    res.json({
      similarityPercentage,
      matched_text,
      highlightedTextFromIp,
    });
  } catch (error) {
    res.status(500).json({
      error: "An error occurred during the batch plagiarism check.",
    });
  }
});

// Paraphrase content using GPT-4o-mini
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

app.post("/paraphrase", authenticate, async (req, res) => {
  const { inputText } = req.body;

  if (!inputText) {
    return res.status(400).json({
      error: "Input text is required for paraphrasing.",
    });
  }

  try {
    const paraphrasedText = await paraphraseContent(inputText);
    res.json({
      paraphrasedText,
    });
  } catch (error) {
    res.status(500).json({
      error: "An error occurred during the paraphrasing process.",
    });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
