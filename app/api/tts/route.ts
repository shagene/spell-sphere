import { NextResponse } from 'next/server';
import { Voice, generateStream, getVoices, GenerateStreamOptions } from 'elevenlabs-node';

export async function POST(request: Request) {
  try {
    const { text, voiceId } = await request.json();

    const options: GenerateStreamOptions = {
      text,
      voice_id: voiceId,
      api_key: process.env.ELEVENLABS_API_KEY!,
      model_id: 'eleven_multilingual_v2',
    };

    const audioStream = await generateStream(options);

    // Create a ReadableStream from the audioStream
    const readableStream = new ReadableStream({
      start(controller) {
        audioStream.on('data', (chunk: any) => controller.enqueue(chunk));
        audioStream.on('end', () => controller.close());
        audioStream.on('error', (err: any) => controller.error(err));
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
    return NextResponse.json({ error: 'Error generating speech', details: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    if (!process.env.ELEVENLABS_API_KEY) {
      throw new Error('ELEVENLABS_API_KEY is not set');
    }
    const voices = await getVoices(process.env.ELEVENLABS_API_KEY);
    return NextResponse.json(voices);
  } catch (error) {
    console.error('Error fetching voices:', error);
    return NextResponse.json({ error: 'Error fetching voices', details: error.message }, { status: 500 });
  }
}