import { NextResponse } from 'next/server';
import { ElevenLabsClient } from 'elevenlabs';

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    const audioStream = await elevenlabs.generate({
      voice: 'Rachel', // You can change this to any available voice
      text: text,
      model_id: 'eleven_multilingual_v2',
    });

    // Create a ReadableStream from the audioStream
    const readableStream = new ReadableStream({
      start(controller) {
        audioStream.on('data', (chunk) => controller.enqueue(chunk));
        audioStream.on('end', () => controller.close());
        audioStream.on('error', (err) => controller.error(err));
      },
    });

    // Return the stream as the response
    return new NextResponse(readableStream, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('Error generating speech:', error);
    return NextResponse.json({ error: 'Error generating speech' }, { status: 500 });
  }
}