import axios from "axios";
import History from "../models/history.js";

// --- LLM API URl setup ---
const API_KEY = process.env.GEMINI_API_KEY;
console.log(
  "Attempting to use Gemini API Key:",
  API_KEY ? `${API_KEY.substring(0, 4)}...` : "Key is UNDEFINED",
);
if (!API_KEY) {
  console.error(
    "FATAL ERROR: GEMINI_API_KEY is not defined in the .env file or is not being loaded correctly.",
  );
}
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${API_KEY}`;

//the core function that handles the logic for checking symptoms.
export const checkSymptoms = async (req, res) => {
  const { symptoms, sessionId } = req.body;
  console.log(sessionId, ": New request with symptoms => ", symptoms);

  if (!symptoms || !sessionId) {
    return res
      .status(400)
      .json({ message: "Symptoms and sessionId are required." });
  }

  /* --- PROMPT WITH GUARDRAILS ---*/
  const prompt = `
    **ROLE & TASK**: You are a specialized AI medical assistant. Your tone should be helpful and reassuring. Your ONLY function is to analyze user-described physical or mental health symptoms and provide potential conditions and next steps for educational purposes. You MUST adhere to the following rules strictly.

    **RULE 1: TOPIC VALIDATION**
    First, analyze the user's input to determine if it is a genuine query about health symptoms.
    - **VALID**: Queries about feelings, pain, sickness, physical changes, mental distress (e.g., "runny nose and headache", "feeling anxious and can't sleep").
    - **INVALID**: Any other topic (e.g., "what is the capital of France?", "tell me a joke").

    **RULE 2: RESPONSE PROTOCOL**
    - **IF THE INPUT IS INVALID**: You MUST ignore the user's query and respond ONLY with the following exact text:
    "I am an AI assistant designed only for symptom analysis. I cannot answer questions that are not related to health symptoms. Please describe your symptoms to continue."

    - **IF THE INPUT IS VALID**: Proceed with the analysis and provide the response in the following Markdown format, including the emojis. Your response MUST start with the disclaimer. **Do not use '---' separators.**

    **⚠️ Disclaimer**:
    This is for educational purposes only and not a substitute for professional medical advice. Please consult a healthcare provider for any health concerns.

    ## 🔍 Probable Conditions
    * **Condition 1**: [Brief explanation]
    * **Condition 2**: [Brief explanation]
    * **Condition 3**: [Brief explanation]

    ## 📋 Recommended Next Steps
    * [Actionable step 1]
    * [Actionable step 2]
    * [Actionable step 3]
    
    **USER'S INPUT TO ANALYZE**: "${symptoms}"
  `;

  try {
    const geminiResponse = await axios.post(API_URL, {
      contents: [{ parts: [{ text: prompt }] }],
    });

    const aiResponseText =
      geminiResponse.data.candidates[0].content.parts[0].text;
    console.log("Response: ", aiResponseText);

    // save the response to the database (optional)
    if (
      !aiResponseText.includes(
        "I am an AI assistant designed only for symptom analysis.",
      )
    ) {
      const newHistory = new History({
        sessionId,
        userInput: symptoms,
        aiResponse: aiResponseText,
      });
      await newHistory.save();
      console.log("Response saved to history.");
    }

    res.status(200).json({ response: aiResponseText });
  } catch (error) {
    console.error(
      "Error processing symptom check:",
      error.response ? error.response.data : error.message,
      "\n",
      API_URL,
    );
    res
      .status(500)
      .json({ message: "Failed to get a response from the AI model." });
  }
};

// This function retrieves the history for a given session
export const getHistory = async (req, res) => {
  const { sessionId } = req.params;
  if (!sessionId) {
    return res.status(400).json({ message: "Session ID is required." });
  }

  try {
    const history = await History.find({ sessionId }).sort({ createdAt: -1 }); // Sort by newest first
    res.status(200).json(history);
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ message: "Failed to fetch history." });
  }
};
