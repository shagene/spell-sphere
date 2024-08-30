declare module 'elevenlabs-node' {
  export interface Voice {
    voice_id: string;
    name: string;
  }

  export interface GenerateStreamOptions {
    text: string;
    voice_id: string;
    api_key: string;
    model_id: string;
  }

  export function generateStream(options: GenerateStreamOptions): Promise<any>;
  export function getVoices(apiKey: string): Promise<Voice[]>;
}