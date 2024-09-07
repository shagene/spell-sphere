'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { WordList } from '@/components/app/WordList';
import { QuizMode } from '@/components/app/QuizMode';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RotateDevicePrompt from '@/components/app/RotateDevicePrompt';
import PrototypeNotice from '@/components/app/PrototypeNotice';

interface Word {
  id: string;
  text: string;
  helpEnabled: boolean;
}

export default function Home() {
  const [words, setWords] = useState<Word[]>([]);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [totalQuizWords, setTotalQuizWords] = useState<number | null>(null);
  const [showRotateDevicePrompt, setShowRotateDevicePrompt] = useState(false);
  const [portraitModeOverride, setPortraitModeOverride] = useState(false);
  const [showPrototypeNotice, setShowPrototypeNotice] = useState(true);

  useEffect(() => {
    const storedWords = localStorage.getItem('words');
    if (storedWords) {
      setWords(JSON.parse(storedWords));
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      const sharedWords = urlParams.get('words');
      if (sharedWords) {
        try {
          const parsedWords = JSON.parse(decodeURIComponent(sharedWords));
          setWords(parsedWords);
        } catch (error) {
          console.error("Error parsing shared words:", error);
        }
      }
    }

    const prototypeAcknowledged = localStorage.getItem('prototypeAcknowledged') === 'true';
    setShowPrototypeNotice(!prototypeAcknowledged);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (!portraitModeOverride && window.innerWidth <= window.innerHeight) {
        setShowRotateDevicePrompt(true);
      } else {
        setShowRotateDevicePrompt(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [portraitModeOverride]);

  const handleCloseRotateDevicePrompt = useCallback(() => {
    setShowRotateDevicePrompt(false);
    setPortraitModeOverride(true);
  }, []);

  const acknowledgePrototype = () => {
    setShowPrototypeNotice(false);
    localStorage.setItem('prototypeAcknowledged', 'true');
  };

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

  const generateShareUrl = useCallback(() => {
    const encodedWords = encodeURIComponent(JSON.stringify(words));
    return `${window.location.href}?words=${encodedWords}`;
  }, [words]);

  return (
    <>
      {showRotateDevicePrompt && (
        <RotateDevicePrompt onClose={handleCloseRotateDevicePrompt} />
      )}
      {showPrototypeNotice && <PrototypeNotice onClose={acknowledgePrototype} />}
      <div className="flex flex-col flex-grow bg-background text-foreground">
        <div className="flex-grow p-4 sm:p-8">
          <div className="max-w-4xl mx-auto w-full">
            <Card className="mt-4 bg-white dark:bg-usmc-navy-blue text-black dark:text-white">
              <CardContent className="pt-6">
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
                      onClick={startQuiz} 
                      className="mt-4 w-full"
                      variant="default"
                      disabled={words.length === 0}
                    >
                      Start Quiz
                    </Button>
                    <Button 
                      onClick={() => {
                        const shareUrl = generateShareUrl();
                        navigator.clipboard.writeText(shareUrl).then(
                          () => alert("URL copied to clipboard"),
                          () => alert("Failed to copy URL")
                        );
                      }} 
                      className="mt-4 w-full"
                      variant="secondary"
                      disabled={words.length === 0}
                    >
                      Share Words
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
            {quizScore !== null && totalQuizWords !== null && (
              <Card className="mt-8 bg-white dark:bg-usmc-navy-blue text-black dark:text-white">
                <CardHeader>
                  <CardTitle className="text-usmc-scarlet dark:text-usmc-gold">Quiz Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Your score: {quizScore}/{totalQuizWords}</p>
                  <p className="text-muted-foreground">
                    {/* ... (existing feedback logic) */}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}