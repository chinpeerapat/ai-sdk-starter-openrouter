import { openrouter, DEFAULT_MODEL_ID } from "@/ai/providers";
import { weatherTool } from "@/ai/tools";
import { convertToModelMessages, stepCountIs, streamText, UIMessage } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const {
    messages,
    selectedModel,
  }: { messages: UIMessage[]; selectedModel?: string } = await req.json();

  const modelId = (selectedModel && selectedModel.length > 0)
    ? selectedModel
    : DEFAULT_MODEL_ID;

  const result = streamText({
    model: openrouter(modelId),
    system: "You are a helpful assistant.",
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(5), // enable multi-step agentic flow
    tools: {
      getWeather: weatherTool,
    },
    experimental_telemetry: {
      isEnabled: false,
    },
  });

  return result.toUIMessageStreamResponse({
    sendReasoning: true,
    onError: (error) => {
      if (error instanceof Error) {
        if (error.message.includes("Rate limit")) {
          return "Rate limit exceeded. Please try again later.";
        }
      }
      console.error(error);
      return "An error occurred.";
    },
  });
}
