import { streamText, UIMessage, convertToModelMessages } from "ai";
import { GoogleGenAI } from "@google/genai";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of four open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be? || What's a simple thing that makes you happy? || What's an underrated place, food, or activity that you think more people should try?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    

    const ai = new GoogleGenAI({});

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    console.log(response.text);

    console.log("APi response ",response.text);
    return Response.json({
      success: true,
      message: response.text,
    }, {status: 200}
    )

  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Error generating suggested messages",
      },
      { status: 500 }
    );
  }
}
