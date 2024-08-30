import React, { useState, useEffect } from 'react';

interface Voice {
  voice_id: string;
  name: string;
}

const TextToSpeech: React.FC = () => {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const response = await fetch('/api/tts');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || 'Failed to fetch voices');
        }
        const data = await response.json();
        console.log('Fetched voices:', data);
        setVoices(data);
        if (data.length > 0) {
          setSelectedVoice(data[0].voice_id);
        }
      } catch (error) {
        console.error('Error fetching voices:', error);
        setError(error.message);
      }
    };
    fetchVoices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log('Generating speech for:', text, 'with voice:', selectedVoice);
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, voiceId: selectedVoice }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to generate speech');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to convert to speech"
          rows={4}
          cols={50}
        />
        <select
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value)}
        >
          {voices.map((voice) => (
            <option key={voice.voice_id} value={voice.voice_id}>
              {voice.name}
            </option>
          ))}
        </select>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Speech'}
        </button>
      </form>
    </div>
  );
};

export default TextToSpeech;