const { OpenAI } = require("openai");
const axios = require("axios");
const cheerio = require("cheerio");

// Instantiate OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Replace with your OpenAI API key
});

// Function to fetch article content from a URL
async function fetchArticleContent(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const articleText = $("article").text(); // Adjust this selector based on the article's HTML structure
    return articleText;
  } catch (error) {
    console.error("Error fetching article content:", error);
    return null;
  }
}

// Function to get embeddings from OpenAI API
async function getEmbeddings(text) {
  try {
    const response = await openai.embeddings({
      model: "text-embedding-ada-002",
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error("Error generating embeddings:", error);
    return null;
  }
}

// Function to calculate cosine similarity between two vectors
function cosineSimilarity(a, b) {
  let dotProduct = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }

  return dotProduct / (Math.sqrt(magA) * Math.sqrt(magB));
}

// Main function to check plagiarism by comparing target text with article content
async function checkPlagiarism(targetText, articleUrl) {
  const articleContent = await fetchArticleContent(articleUrl);
  if (!articleContent) {
    console.log("Failed to fetch article content.");
    return;
  }

  const targetEmbedding = await getEmbeddings(targetText);
  const articleEmbedding = await getEmbeddings(articleContent);

  if (!targetEmbedding || !articleEmbedding) {
    console.log("Error generating embeddings.");
    return;
  }

  const similarity = cosineSimilarity(targetEmbedding, articleEmbedding);
  console.log(`Similarity score: ${similarity}`);

  // You can set a threshold to determine plagiarism
  if (similarity > 0.85) {
    console.log("Potential plagiarism detected!");
  } else {
    console.log("No significant plagiarism detected.");
  }
}

// Example usage
const targetText =
  "Artificial intelligence is transforming industries worldwide. From healthcare to finance, AI is being used to streamline processes, improve accuracy, and drive innovation.";
const articleUrl = "https://www.bbc.com/news/world-us-canada-57026342"; // Example article URL

checkPlagiarism(targetText, articleUrl);
