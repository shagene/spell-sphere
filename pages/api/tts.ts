import { NextApiRequest, NextApiResponse } from 'next';
import { ElevenLabsClient } from 'elevenlabs';
import { Readable } from 'stream';

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { text } = req.body;

      const audioStream = await elevenlabs.generate({
        voice: 'Rachel', // You can change this to any available voice
        text: text,
        model_id: 'eleven_multilingual_v2',
      });

      // Set appropriate headers
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Transfer-Encoding', 'chunked');

      // Pipe the audio stream to the response
      Readable.from(audioStream).pipe(res);
    } catch (error) {
      console.error('Error generating speech:', error);
      res.status(500).json({ error: 'Error generating speech' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}