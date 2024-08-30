'use client';

import React, { useState } from 'react';
import { WordList } from './components/WordList';
import { QuizMode } from './components/QuizMode';
import { Button, Card, CardBody } from "@nextui-org/react";
import { Layout } from './components/Layout';
import TextToSpeech from '../components/TextToSpeech';

export default function Home() {
  const [words, setWords] = useState<string[]>([]);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const handleWordsUpdated = (newWords: string[]) => {
    setWords(newWords);
  };

  const handleQuizComplete = (score: number) => {
    setQuizScore(score);
    setIsQuizMode(false);
  };

  const handleBackToDashboard = () => {
    setIsQuizMode(false);
    setQuizScore(null);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to SpellSphere</h1>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Spelling Practice App</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="col-span-1 md:col-span-2">
            <CardBody>
              {isQuizMode ? (
                <QuizMode 
                  words={words} 
                  onQuizComplete={handleQuizComplete} 
                  onBackToDashboard={handleBackToDashboard}
                />
              ) : (
                <>
                  <WordList onWordsUpdated={handleWordsUpdated} />
                  <Button 
                    onClick={() => setIsQuizMode(true)} 
                    className="mt-4 w-full"
                    color="primary"
                    disabled={words.length === 0}
                  >
                    Start Quiz
                  </Button>
                </>
              )}
            </CardBody>
          </Card>
          {quizScore !== null && (
            <Card className="col-span-1 md:col-span-2">
              <CardBody>
                <h2 className="text-2xl font-bold mb-2">Quiz Results</h2>
                <p>Your score: {quizScore}/{words.length}</p>
                <p>
                  {quizScore === words.length
                    ? "Great job! Perfect score!"
                    : `Keep practicing! Try focusing on the words you missed.`}
                </p>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
      <TextToSpeech />
    </main>
  );
}
