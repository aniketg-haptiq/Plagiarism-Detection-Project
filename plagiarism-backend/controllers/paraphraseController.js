const openai = require("../config/openai");

exports.paraphraseController = async (req, res) => {
  const { inputText } = req.body;

  if (!inputText) {
    console.log("no input text");

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
};
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
