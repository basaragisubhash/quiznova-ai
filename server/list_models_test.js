require('dotenv').config();

async function listModels() {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.models) {
        console.log("Available models:");
        data.models.forEach(m => console.log(m.name));
    } else {
        console.error("No models returned. API Response:", data);
    }
  } catch (error) {
    console.error("Error listing models:", error);
  }
}
listModels();
