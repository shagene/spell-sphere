'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Shuffle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Voice } from 'elevenlabs-node';
import { v4 as uuidv4 } from 'uuid';

interface Word {
  id: string;
  text: string;
  helpEnabled: boolean;
}

interface QuizModeProps {
  words: Word[];
  onQuizComplete: (score: number, totalWords: number) => void;
  onBackToDashboard: () => void;
}

interface Letter {
  id: string;
  char: string;
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
  const [open, setOpen] = useState(false);
  const [letters, setLetters] = useState<Letter[]>([]);
  const [draggedLetter, setDraggedLetter] = useState<Letter | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
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

  useEffect(() => {
    if (words.length > 0 && currentWordIndex < words.length && words[currentWordIndex] && words[currentWordIndex].helpEnabled) {
      const wordLetters = words[currentWordIndex].text.split('').map(char => ({ id: uuidv4(), char }));
      setLetters(wordLetters.sort(() => Math.random() - 0.5));
    } else {
      setLetters([]);
    }
  }, [currentWordIndex, words]);

  const speakWord = async (word: string) => {
    if (!selectedVoice) {
      console.error('No voice selected');
      return;
    }

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
  const handleInputChange = useCallback((index: number, value: string) => {
    const newUserInputs = [...userInputs];
    newUserInputs[index] = value;
    setUserInputs(newUserInputs);
  }, [userInputs]);

  const handleSubmit = useCallback((index: number) => {
    if (words.length > 0 && index < words.length && words[index]) {
      const word = words[index];
      const userAnswer = words[index].helpEnabled 
        ? letters.map(letter => letter.char).join('')
        : userInputs[index];
      if (word && userAnswer.toLowerCase().trim() === word.text.toLowerCase().trim()) {
        setScore(prevScore => prevScore + 1);
      }
      const newSubmitted = [...submitted];
      newSubmitted[index] = true;
      setSubmitted(newSubmitted);

      if (newSubmitted.every(Boolean)) {
        setIsReviewMode(true);
      } else {
        setCurrentWordIndex(prevIndex => {
          let nextIndex = prevIndex + 1;
          while (nextIndex < words.length && newSubmitted[nextIndex]) {
            nextIndex++;
          }
          return nextIndex < words.length ? nextIndex : prevIndex;
        });
      }
    }
  }, [words, letters, userInputs, submitted]);

  const handleVoiceSelect = useCallback((voiceId: string) => {
    setSelectedVoice(voiceId);
    setOpen(false);
  }, []);

  const handleDragStart = useCallback((e: React.DragEvent<HTMLButtonElement>, letter: Letter, index: number) => {
    e.dataTransfer.setData('text', JSON.stringify({ id: letter.id, char: letter.char }));
    setDraggedLetter(letter);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLButtonElement>, index: number) => {
    e.preventDefault();
    setDropTargetIndex(index);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedLetter(null);
    setDropTargetIndex(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLButtonElement>, targetIndex: number) => {
    e.preventDefault();
    if (draggedLetter && dropTargetIndex !== null) {
      const newLetters = [...letters];
      const draggedIndex = newLetters.findIndex(letter => letter.id === draggedLetter.id);
      
      if (draggedIndex !== -1 && draggedIndex !== targetIndex) {
        const [removed] = newLetters.splice(draggedIndex, 1);
        newLetters.splice(targetIndex, 0, removed);
        
        setLetters(newLetters);
      }
    }
    setDraggedLetter(null);
    setDropTargetIndex(null);
  }, [draggedLetter, dropTargetIndex, letters]);

  const handleShuffleLetters = useCallback(() => {
    setLetters(prevLetters => [...prevLetters].sort(() => Math.random() - 0.5));
  }, []);

  const renderQuizMode = () => (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-bold mb-2 sm:mb-0">Spelling Quiz</h2>
        {voices.length > 0 && (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between mt-2 sm:mt-0"
              >
                {selectedVoice
                  ? voices.find((voice) => voice.voice_id === selectedVoice)?.name
                  : "Select voice..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <div className="max-h-[300px] overflow-auto">
                {voices.map((voice) => (
                  <Button
                    key={voice.voice_id}
                    onClick={() => handleVoiceSelect(voice.voice_id)}
                    variant={selectedVoice === voice.voice_id ? "secondary" : "ghost"}
                    className="w-full justify-start font-normal"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedVoice === voice.voice_id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {voice.name}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
      <div className="mb-4">
        <p>Word {currentWordIndex + 1} of {words.length}</p>
        <Button 
          onClick={() => words.length > 0 && speakWord(words[currentWordIndex].text)} 
          className="mt-2"
          disabled={isLoading || words.length === 0}
          variant="secondary"
        >
          {isLoading ? 'Loading...' : 'Hear Word'}
        </Button>
      </div>
      {words.length > 0 && words[currentWordIndex].helpEnabled ? (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-2">
            {letters.map((letter, index) => (
              <Button
                key={letter.id}
                variant="outline"
                size="lg"
                className={`relative p-3 text-lg ${dropTargetIndex === index ? 'bg-gray-200' : ''}`}
                draggable={true}
                onDragStart={(e) => handleDragStart(e, letter, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                onDrop={(e) => handleDrop(e, index)}
              >
                {letter.char}
              </Button>
            ))}
          </div>
          <Button onClick={handleShuffleLetters} variant="secondary" size="lg">
            <Shuffle className="mr-2 h-5 w-5" />
            Shuffle Letters
          </Button>
        </div>
      ) : (
        <div className="mb-4">
          <Input
            value={userInputs[currentWordIndex]}
            onChange={(e) => handleInputChange(currentWordIndex, e.target.value)}
            placeholder="Type the word you hear"
            className="mr-2"
          />
        </div>
      )}
      <Button
        onClick={() => handleSubmit(currentWordIndex)}
        disabled={submitted[currentWordIndex] || words.length === 0}
        variant="default"
        size="lg"
      >
        Submit Answer
      </Button>
      <p className="mt-4">Progress: {submitted.filter(Boolean).length}/{words.length}</p>
    </>
  );

  const handleFinishQuiz = useCallback(() => {
    onQuizComplete(score, words.length);
  }, [score, words.length, onQuizComplete]);

  const renderReviewMode = () => (
    <>
      <h2 className="text-2xl font-bold mb-4">Quiz Review</h2>
      <p className="mb-4">Your score: {score}/{words.length}</p>
      {words.map((word, index) => (
        <div key={word.id} className="mb-4 p-2 border rounded">
          <div className="flex justify-between items-center">
            <span className="font-bold">{word.text}</span>
            <Button size="sm" variant="secondary" onClick={() => speakWord(word.text)}>Hear Word</Button>
          </div>
          <p className={userInputs[index].toLowerCase().trim() === word.text.toLowerCase().trim() ? "text-green-500" : "text-red-500"}>
            Your answer: {userInputs[index]}
          </p>
        </div>
      ))}
      <div className="flex justify-end mt-4">
        <Button onClick={handleFinishQuiz} variant="default">
          Finish Review
        </Button>
      </div>
    </>
  );

  return (
    <Card className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      <CardContent>
        {words.length === 0 ? (
          <p>No words available for the quiz. Please add some words first.</p>
        ) : (
          isReviewMode ? renderReviewMode() : renderQuizMode()
        )}
        <audio ref={audioRef} />
      </CardContent>
    </Card>
  );
}