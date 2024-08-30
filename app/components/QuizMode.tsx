'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Card, CardBody } from "@nextui-org/react";

interface QuizModeProps {
  words: string[];
  onQuizComplete: (score: number) => void;
  onBackToDashboard: () => void;  // New prop for navigation
}

export function QuizMode({ words, onQuizComplete, onBackToDashboard }: QuizModeProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInputs, setUserInputs] = useState<string[]>(new Array(words.length).fill(''));
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState<boolean[]>(new Array(words.length).fill(false));
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const recognitionRef = useRef<any>(null);

  const speakWord = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 0.8; // Slightly slower
    utterance.pitch = 1.0; // Normal pitch
    
    // Try to select a more natural-sounding voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      voice => voice.name.includes('Natural') || 
               voice.name.includes('Neural') || 
               voice.name.includes('Wavenet') ||
               (voice.name === "Google US English" || voice.lang === 'en-US')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
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

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleInputChange(currentWordIndex, transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
    setIsListening(!isListening);
  };

  const renderQuizMode = () => (
    <>
      <h2 className="text-2xl font-bold mb-4">Spelling Quiz</h2>
      <div className="mb-4">
        <p>Word {currentWordIndex + 1} of {words.length}</p>
        <Button onClick={() => speakWord(words[currentWordIndex])} className="mt-2">
          Hear Word
        </Button>
      </div>
      <div className="flex items-center mb-4">
        <Input
          value={userInputs[currentWordIndex]}
          onChange={(e) => handleInputChange(currentWordIndex, e.target.value)}
          placeholder="Type or speak the word you hear"
          className="mr-2"
        />
        <Button
          onClick={toggleListening}
          color={isListening ? "danger" : "success"}
        >
          {isListening ? "Stop" : "Speak"}
        </Button>
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