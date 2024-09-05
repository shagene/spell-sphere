'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Shuffle, X } from "lucide-react";
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
  const [shuffledLetters, setShuffledLetters] = useState<Letter[]>([]);
  const [usedLetters, setUsedLetters] = useState<Letter[]>([]);
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

  const handleInputChange = (index: number, value: string) => {
    const newUserInputs = [...userInputs];
    const newUsedLetters = [...usedLetters];
    const lastChar = newUserInputs[index].slice(-1);

    if (value.length < newUserInputs[index].length) {
      // Letter was deleted
      const removedLetter = newUsedLetters.pop();
      if (removedLetter) {
        setShuffledLetters([...shuffledLetters, removedLetter]);
      }
    }

    newUserInputs[index] = value;
    setUserInputs(newUserInputs);
    setUsedLetters(newUsedLetters);
  };

  const handleSubmit = (index: number) => {
    if (words.length > 0 && index < words.length && words[index] && userInputs[index]) {
      const word = words[index];
      if (word && userInputs[index].toLowerCase().trim() === word.text.toLowerCase().trim()) {
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
  };

  const handleVoiceSelect = (voiceId: string) => {
    setSelectedVoice(voiceId);
    setOpen(false);
  };

  const shuffleWord = (word: string) => {
    return word.split('').map(char => ({ id: uuidv4(), char })).sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    if (words.length > 0 && currentWordIndex < words.length && words[currentWordIndex] && words[currentWordIndex].helpEnabled) {
      const wordLetters = words[currentWordIndex].text.split('').map(char => ({ id: uuidv4(), char }));
      setShuffledLetters(wordLetters.sort(() => Math.random() - 0.5));
      setUsedLetters([]);
    } else {
      setShuffledLetters([]);
      setUsedLetters([]);
    }
  }, [currentWordIndex, words]);

  const handleLetterClick = (letter: Letter) => {
    const newUserInputs = [...userInputs];
    newUserInputs[currentWordIndex] += letter.char;
    setUserInputs(newUserInputs);
    setShuffledLetters(shuffledLetters.filter(l => l.id !== letter.id));
    setUsedLetters([...usedLetters, letter]);
  };

  const handleRemoveLetter = (index: number) => {
    const newUserInputs = [...userInputs];
    const newUsedLetters = [...usedLetters];
    const letter = newUsedLetters[index];
    newUserInputs[currentWordIndex] = newUserInputs[currentWordIndex].slice(0, index) + newUserInputs[currentWordIndex].slice(index + 1);
    setUserInputs(newUserInputs);
    setUsedLetters(newUsedLetters.filter((_, i) => i !== index));
    setShuffledLetters([...shuffledLetters, letter]);
  };

  const handleShuffleLetters = () => {
    setShuffledLetters(prevShuffledLetters => {
      const allLetters = [...prevShuffledLetters, ...usedLetters];
      return allLetters
        .sort(() => Math.random() - 0.5)
        .filter(letter => !usedLetters.some(usedLetter => usedLetter.id === letter.id));
    });
  };

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
      {usedLetters.map((letter, index) => (
        <Button
          key={letter.id}
          variant="outline"
          size="lg" // Changed from "sm" to "lg"
          className="relative p-3" // Added padding
        >
          <span className="text-xl">{letter.char}</span>
          <X
            className="absolute top-0 right-0 h-4 w-4 text-destructive cursor-pointer"
            onClick={() => handleRemoveLetter(index)}
          />
        </Button>
      ))}
    </div>
    <div className="flex flex-wrap gap-2 mb-2">
      {shuffledLetters.map((letter) => (
        <Button
          key={letter.id}
          onClick={() => handleLetterClick(letter)}
          variant="outline"
          size="lg" // Changed from "sm" to "lg"
          className="p-3" // Added padding
        >
          <span className="text-xl">{letter.char}</span> 
        </Button>
      ))}
    </div>
    <Button onClick={handleShuffleLetters} variant="secondary" size="lg" className="p-3">
      <Shuffle className="mr-2 h-6 w-6" /> 
      <span className="text-xl">Shuffle Letters</span> 
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
      >
        Submit Answer
      </Button>
      <p className="mt-4">Progress: {submitted.filter(Boolean).length}/{words.length}</p>
    </>
  );

  const handleFinishQuiz = () => {
    onQuizComplete(score, words.length);
  };

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