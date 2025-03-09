import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// const prompt = "Explain how AI works";

// const result = await model.generateContent(prompt);
// console.log(result.response.text());
dotenv.config();

class GoogleChat {
  constructor(model) {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }
  async generateContent(prompt) {
    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }

  async generateStreamContent(prompt) {
    const result = await this.model.generateContentStream(prompt);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      process.stdout.write(chunkText);
    }
    // return result.response.text();
  }
}

export default GoogleChat;
