import express from "express";
import { askGemini } from "../Services/gemini.service.js";

const router = express.Router();

router.post("/chat", async (req, res) => {
  try {
    const { message, language, issueType } = req.body;

    const reply = await askGemini(message, language, issueType);

    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "AI Error" });
  }
});

export default router;