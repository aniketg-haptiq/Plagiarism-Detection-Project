const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectToMongoDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const articleRoutes = require("./routes/articleRoutes");
const plagiarismRoutes = require("./routes/plagiarismRoutes");
const paraphraseRoute = require("./routes/paraphraseRoute");



const app = express();
app.use(cors({ origin: "http://localhost:3001" }));
app.use(express.json());

// Connect to MongoDB
connectToMongoDB(process.env.MONGODB_URI || "mongodb://localhost:27017/authDB");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/plagiarism", plagiarismRoutes);
app.use("/api/paraphrase", paraphraseRoute);


// Start server
// const PORT = process.env.PORT || 5000;
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
