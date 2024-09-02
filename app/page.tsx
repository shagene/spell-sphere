'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { WordList } from '@/components/app/WordList';
import { QuizMode } from '@/components/app/QuizMode';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLogTheme } from './hooks/useLogTheme';

interface Word {
  id: string;
  text: string;
  helpEnabled: boolean;
}

export default function Home() {
  useLogTheme();
  const [words, setWords] = useState<Word[]>([]);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [totalQuizWords, setTotalQuizWords] = useState<number | null>(null);

  useEffect(() => {
    const storedWords = localStorage.getItem('words');
    if (storedWords) {
      setWords(JSON.parse(storedWords));
    }
  }, []);

  const handleWordsUpdated = useCallback((newWords: Word[]) => {
    setWords(newWords);
    localStorage.setItem('words', JSON.stringify(newWords));
  }, []);

  const handleQuizComplete = useCallback((score: number, totalWords: number) => {
    setQuizScore(score);
    setTotalQuizWords(totalWords);
    setIsQuizMode(false);
  }, []);

  const handleBackToDashboard = useCallback(() => {
    setIsQuizMode(false);
  }, []);

  const startQuiz = useCallback(() => {
    setIsQuizMode(true);
    setQuizScore(null);
    setTotalQuizWords(null);
  }, []);

  return (
    <div className="flex flex-col flex-grow">
      <div className="flex-grow p-4 sm:p-8">
        <div className="max-w-4xl mx-auto w-full">
          <Card className="mt-4">
            <CardContent className="pt-6">
              {isQuizMode ? (
                <QuizMode 
                  words={words} // Pass the words array directly, no need to map
                  onQuizComplete={handleQuizComplete} 
                  onBackToDashboard={handleBackToDashboard}
                />
              ) : (
                <>
                  <WordList onWordsUpdated={handleWordsUpdated} />
                  <Button 
                    onClick={startQuiz} 
                    className="mt-4 w-full"
                    variant="default"
                    disabled={words.length === 0}
                  >
                    Start Quiz
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
          {quizScore !== null && totalQuizWords !== null && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Quiz Results</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Your score: {quizScore}/{totalQuizWords}</p>
                <p>
                  {(() => {
                    const percentage = (quizScore / totalQuizWords) * 100;
                    if (percentage === 100) return "Great job! Perfect score!";
                    if (percentage >= 90) return "Excellent work! Almost perfect!";
                    if (percentage >= 80) return "Very good! Keep it up!";
                    if (percentage >= 70) return "Good effort! Room for improvement.";
                    return "Keep practicing! Focus on the words you missed.";
                  })()}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
