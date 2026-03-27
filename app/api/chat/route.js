import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_KEY,
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}openai/deployments/memory-bridge-gpt`,
  defaultQuery: { "api-version": "2024-02-15-preview" },
});

export async function POST(req) {
  const messages = [{ role: "user", content: "Hello" }];

  const response = await client.chat.completions.create({
    model: "memory-bridge-gpt",
    messages,
  });

  return Response.json(response.choices[0].message);
}
