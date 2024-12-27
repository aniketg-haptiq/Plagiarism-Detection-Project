const express = require("express");
const bodyParser = require("body-parser");
const { default: OpenAI } = require("openai"); // Import default export

// Load environment variables (replace with your preferred method)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

app.post("/compare-text", async (req, res) => {
  const { inputText, newsArticles, blogPosts } = req.body;

  if (!inputText || !newsArticles || !blogPosts) {
    return res.status(400).json({
      error: "Missing required fields: inputText, newsArticles, or blogPosts",
    });
  }

  try {
    const result = await compareTextWithOpenAI(
      inputText,
      newsArticles,
      blogPosts
    );
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error comparing text with OpenAI API." });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

async function compareTextWithOpenAI(inputText, newsArticles, blogPosts) {
  const prompt = `
        You are a plagiarism detection assistant. Analyze the provided text 
        for any similarities to the following news articles and blog posts:

        ${JSON.stringify({
          news_articles: newsArticles,
          blog_posts: blogPosts,
        })}

        Highlight phrases or portions that may closely resemble the provided 
        data, indicating the source and similarity percentage. 
        **Present your findings in the following format:**
        * **Similarity Percentage:** <percentage>
        * **Matched Text:** <matched_text> 

        Please analyze the following text for potential plagiarism: ${inputText}
      `;

  try {
    const response = await openai.complete({
      engine: "text-davinci-003", // Replace with your preferred model
      prompt,
      max_tokens: 1000,
      temperature: 0.3,
    });

    const report = response.data.choices[0].text.trim();

    // Extract similarity percentage and matched text using regex
    const similarityMatch = report.match(/Similarity Percentage:\s*(\d+)\%/);
    let similarityPercentage = "Unable to calculate similarity";
    if (similarityMatch && similarityMatch[1]) {
      similarityPercentage = similarityMatch[1] + "%";
    }

    const matchedTextMatch = report.match(/Matched Text:\s*(.*)/);
    let matchedText = "No matched text found.";
    if (matchedTextMatch && matchedTextMatch[1]) {
      matchedText = matchedTextMatch[1].trim();
    }

    // Highlight matched text (adapt regex as needed)
    let highlightedHtml = inputText;
    if (matchedText) {
      const escapedMatchedText = matchedText.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      ); // Escape special characters
      const highlightRegex = new RegExp(`(${escapedMatchedText})`, "gi"); // Case-insensitive match
      highlightedHtml = inputText.replace(
        highlightRegex,
        '<span style="background-color: yellow;">$1</span>'
      );
    }

    return {
      plagiarismReport: report,
      similarityPercentage,
      matchedText,
      highlightedHtml,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Error querying OpenAI API for plagiarism comparison");
  }
}
