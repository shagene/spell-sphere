import React, { useState, useEffect } from 'react';

interface Voice {
  voice_id: string;
  name: string;
  // Add other properties as needed
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
        console.log('Fetching voices...');
        const response = await fetch('/api/tts');
        if (!response.ok) {
          throw new Error('Failed to fetch voices');
        }
        const data = await response.json();
        console.log('Fetched voices:', data);
        
        // Check if data is an array, if not, it might be nested
        const voicesArray = Array.isArray(data) ? data : data.voices;
        
        if (Array.isArray(voicesArray)) {
          setVoices(voicesArray);
          if (voicesArray.length > 0) {
            setSelectedVoice(voicesArray[0].voice_id);
          }
        } else {
          throw new Error('Unexpected voice data structure');
        }
      } catch (error) {
        console.error('Error fetching voices:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      }
    };
    fetchVoices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    console.log('handleSubmit called with text:', text, 'and voiceId:', selectedVoice);

    try {
      console.log('Preparing to send POST request to /api/tts');
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, voiceId: selectedVoice }),
      });

      console.log('Received response from /api/tts:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response data:', errorData);
        throw new Error(errorData.details || 'Failed to generate speech');
      }

      console.log('Response is OK, converting to blob');
      const audioBlob = await response.blob();
      console.log('Audio blob created, size:', audioBlob.size, 'bytes');

      const audioUrl = URL.createObjectURL(audioBlob);
      console.log('Created audio URL:', audioUrl);

      const audio = new Audio(audioUrl);
      console.log('Audio object created, attempting to play');
      
      audio.oncanplaythrough = () => {
        console.log('Audio can play through, starting playback');
        audio.play().then(() => {
          console.log('Audio playback started successfully');
        }).catch((playError) => {
          console.error('Error during audio playback:', playError);
        });
      };

      audio.onerror = (e) => {
        console.error('Error loading audio:', e);
      };

    } catch (error) {
      console.error('Caught error in handleSubmit:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
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
        {voices.length > 0 && (
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
        )}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Speech'}
        </button>
      </form>
    </div>
  );
};

export default TextToSpeech;