'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Card, CardBody } from "@nextui-org/react";

interface QuizModeProps {
  words: string[];
  onQuizComplete: (score: number) => void;
  onBackToDashboard: () => void;
}

interface Voice {
  voice_id: string;
  name: string;
}

export function QuizMode({ words, onQuizComplete, onBackToDashboard }: QuizModeProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInputs, setUserInputs] = useState<string[]>(new Array(words.length).fill(''));
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState<boolean[]>(new Array(words.length).fill(false));
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const response = await fetch('/api/tts');
        if (!response.ok) {
          throw new Error('Failed to fetch voices');
        }
        const data = await response.json();
        const voicesArray = Array.isArray(data) ? data : data.voices;
        if (Array.isArray(voicesArray)) {
          setVoices(voicesArray);
          if (voicesArray.length > 0) {
            setSelectedVoice(voicesArray[0].voice_id);
          }
        }
      } catch (error) {
        console.error('Error fetching voices:', error);
      }
    };
    fetchVoices();
  }, []);

  const speakWord = async (word: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: word, voiceId: selectedVoice }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
    } catch (error) {
      console.error('Error generating speech:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (index: number, value: string) => {
    const newUserInputs = [...userInputs];
    newUserInputs[index] = value;
    setUserInputs(newUserInputs);
  };

  const handleSubmit = (index: number) => {
    if (userInputs[index].toLowerCase() === words[index].toLowerCase()) {
      setScore(score + 1);
    }
    const newSubmitted = [...submitted];
    newSubmitted[index] = true;
    setSubmitted(newSubmitted);

    if (newSubmitted.every(Boolean)) {
      setIsReviewMode(true);
    } else {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }
  };

  const renderQuizMode = () => (
    <>
      <h2 className="text-2xl font-bold mb-4">Spelling Quiz</h2>
      <div className="mb-4">
        <p>Word {currentWordIndex + 1} of {words.length}</p>
        <Button 
          onClick={() => speakWord(words[currentWordIndex])} 
          className="mt-2"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Hear Word'}
        </Button>
      </div>
      {voices.length > 0 && (
        <select
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value)}
          className="mb-4"
        >
          {voices.map((voice) => (
            <option key={voice.voice_id} value={voice.voice_id}>
              {voice.name}
            </option>
          ))}
        </select>
      )}
      <div className="mb-4">
        <Input
          value={userInputs[currentWordIndex]}
          onChange={(e) => handleInputChange(currentWordIndex, e.target.value)}
          placeholder="Type the word you hear"
          className="mr-2"
        />
      </div>
      <Button
        onClick={() => handleSubmit(currentWordIndex)}
        color="primary"
        disabled={submitted[currentWordIndex]}
      >
        Submit Answer
      </Button>
      <p className="mt-4">Progress: {submitted.filter(Boolean).length}/{words.length}</p>
      <Button onClick={onBackToDashboard} color="secondary" className="mt-4">
        Back to Dashboard
      </Button>
    </>
  );

  const renderReviewMode = () => (
    <>
      <h2 className="text-2xl font-bold mb-4">Quiz Review</h2>
      <p className="mb-4">Your score: {score}/{words.length}</p>
      {words.map((word, index) => (
        <div key={index} className="mb-4 p-2 border rounded">
          <div className="flex justify-between items-center">
            <span className="font-bold">{word}</span>
            <Button size="sm" onClick={() => speakWord(word)}>Hear Word</Button>
          </div>
          <p className={userInputs[index].toLowerCase() === word.toLowerCase() ? "text-green-500" : "text-red-500"}>
            Your answer: {userInputs[index]}
          </p>
        </div>
      ))}
      <div className="flex justify-between mt-4">
        <Button onClick={() => onQuizComplete(score)} color="success">
          Finish Review
        </Button>
        <Button onClick={onBackToDashboard} color="secondary">
          Back to Dashboard
        </Button>
      </div>
    </>
  );

  return (
    <Card>
      <CardBody>
        {isReviewMode ? renderReviewMode() : renderQuizMode()}
        <audio ref={audioRef} />
      </CardBody>
    </Card>
  );
}