import { createOllama } from 'ollama-ai-provider';
import { streamText, convertToCoreMessages, CoreMessage, UserContent } from 'ai';

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // Destructure request data
    const { messages, selectedModel, data } = await req.json();

    const ollamaUrl = process.env.NEXT_PUBLIC_OLLAMA_URL || "http://localhost:11434";

    const initialMessages = messages.slice(0, -1); 
    const currentMessage = messages[messages.length - 1]; 

    const ollama = createOllama({ baseURL: ollamaUrl + "/api" });

    // Build message content array directly
    const messageContent: UserContent = [{ type: 'text', text: currentMessage.content }];

    // Add images if they exist
    if (data?.images) {
      data.images.forEach((imageUrl: string) => {
        const image = new URL(imageUrl);
        messageContent.push({ type: 'image', image });
      });
    }

    // Stream text using the ollama model
    const result = await streamText({
      model: ollama(selectedModel),
      messages: [
        ...convertToCoreMessages(initialMessages),
        { role: 'user', content: messageContent },
      ],
    });

    return result.toDataStreamResponse();
  } catch (error) {
    return new Response(
      `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { status: 500 }
    );
  }
}
