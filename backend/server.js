import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/explain", async (req, res) => {
  try {
    const { question, correctAnswer } = req.body;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful physics teacher." },
        {
          role: "user",
          content: `Question: ${question}\nCorrect Answer: ${correctAnswer}\nExplain why this answer is correct in simple terms.`
        }
      ]
    });

    const explanation =
      response.choices[0].message.content || "No explanation generated.";
    res.json({ explanation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI explanation failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
