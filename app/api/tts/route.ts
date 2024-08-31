import { NextResponse } from 'next/server';
import { ElevenLabsClient } from 'elevenlabs';
import { Readable } from 'stream';

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

export async function POST(request: Request) {
  console.log('Received POST request to /api/tts');
  try {
    const { text, voiceId } = await request.json();
    console.log('Request body:', { text, voiceId });

    if (!process.env.ELEVENLABS_API_KEY) {
      console.error('ELEVENLABS_API_KEY is not set');
      throw new Error('ELEVENLABS_API_KEY is not set');
    }

    console.log('Generating audio stream');
    const audioStream = await elevenlabs.generate({
      voice: voiceId,
      text: text,
      model_id: 'eleven_multilingual_v2',
    });
    console.log('Audio generated successfully');

    // Convert the Readable stream to a Uint8Array
    const chunks: Uint8Array[] = [];
    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }
    const audioBuffer = Buffer.concat(chunks);

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    console.error('Error generating speech:', error);
    console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return NextResponse.json({ error: 'Error generating speech', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function GET() {
  console.log('Received GET request to /api/tts');
  try {
    if (!process.env.ELEVENLABS_API_KEY) {
      console.error('ELEVENLABS_API_KEY is not set');
      throw new Error('ELEVENLABS_API_KEY is not set');
    }
    console.log('Fetching voices from ElevenLabs API');
    const voices = await elevenlabs.voices.getAll();
    console.log('Fetched voices structure:', JSON.stringify(voices, null, 2));
    return NextResponse.json(voices);
  } catch (error) {
    console.error('Error fetching voices:', error);
    console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return NextResponse.json({ error: 'Error fetching voices', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}