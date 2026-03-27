import { chat } from "@/lib/openaiClient";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const body = await req.json();
    const userMessage = body.message;

    const systemPrompt = `
You are helping capture important life memories.

Respond naturally and warmly.

If the user shares something meaningful, extract it as a memory in this format:
[MEMORY: short summary of the memory]

Example:
User: I loved gardening with my mom
Response: That sounds beautiful. What did you enjoy most?
[MEMORY: User loved gardening with their mom]

Only include MEMORY if it's meaningful.
`;

    const aiResponse = await chat(systemPrompt, [
      { role: "user", content: userMessage },
    ]);

    const memoryMatch = aiResponse.match(/\[MEMORY:(.*?)\]/);
    const extractedMemory = memoryMatch ? memoryMatch[1].trim() : null;

    const filePath = path.join(process.cwd(), "data", "patientMemory.json");

    let memories = [];
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf-8");
      memories = JSON.parse(fileData);
    }

    if (extractedMemory) {
      memories.push(extractedMemory);
      fs.writeFileSync(filePath, JSON.stringify(memories, null, 2));
    }

    const cleanResponse = aiResponse.replace(/\[MEMORY:.*?\]/, "").trim();

    return Response.json({
      response: cleanResponse,
      memory: extractedMemory,
    });

  } catch (error) {
    console.error("Harvest API Error:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
