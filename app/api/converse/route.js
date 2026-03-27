import { chat } from "@/lib/openaiClient";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const body = await req.json();
    const userMessage = body.message;
    const mode = body.mode || "normal";

    const filePath = path.join(process.cwd(), "data", "patientMemory.json");

    let memories = [];
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf-8");
      memories = JSON.parse(fileData);
    }

    const memoryContext = memories.length
      ? `Here are important memories about the user:\n- ${memories.join("\n- ")}`
      : "No memories yet.";

    let toneInstruction = "";
    if (mode === "gentle") {
      toneInstruction = "Speak very gently, simply, and reassuringly.";
    } else if (mode === "hard") {
      toneInstruction = "Keep responses very simple, grounding, and calm.";
    } else {
      toneInstruction = "Speak naturally and warmly.";
    }

    const systemPrompt = `
You are a compassionate AI companion for someone experiencing memory loss.

${toneInstruction}

Actively reference specific memories when appropriate. Mention details (like people, places, or activities) naturally in conversation when relevant.

${memoryContext}

Do NOT correct the user.
Do NOT mention memory loss.
Keep things emotionally safe and warm.
`;

    const aiResponse = await chat(systemPrompt, [
      { role: "user", content: userMessage },
    ]);

    return Response.json({
      response: aiResponse,
    });

  } catch (error) {
    console.error("Converse API Error:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
