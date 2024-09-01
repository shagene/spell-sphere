'use client';

import React, { useState, useCallback } from 'react';
import { WordList } from './components/WordList';
import { QuizMode } from './components/QuizMode';
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import { ThemeSwitcher } from './components/ThemeSwitcher';

export default function Home() {
  const [words, setWords] = useState<string[]>([]);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const handleWordsUpdated = useCallback((newWords: string[]) => {
    setWords(newWords);
  }, []);

  const handleQuizComplete = useCallback((score: number) => {
    setQuizScore(score);
    setIsQuizMode(false);
  }, []);

  const handleBackToDashboard = useCallback(() => {
    setIsQuizMode(false);
    setQuizScore(null);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to SpellSphere</h1>
      <div className="max-w-4xl mx-auto w-full">
        <Card className="w-full">
          <CardHeader className="flex justify-end items-center px-4 py-2">
            <ThemeSwitcher />
          </CardHeader>
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
          <Card className="mt-8">
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
  );
}
