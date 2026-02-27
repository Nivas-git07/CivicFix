import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function askGemini(message, language, issueType) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const prompt = `
You are a civic assistant AI.

Detected Issue: ${issueType}

User Question: ${message}

Instructions:
- Explain clearly
- Ask follow-up question
- Provide safety advice
- Respond in ${language}
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}