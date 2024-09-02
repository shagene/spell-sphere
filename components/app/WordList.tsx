'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { v4 as uuidv4 } from 'uuid';

interface Word {
  id: string;
  text: string;
  helpEnabled: boolean;
}

interface WordListProps {
  onWordsUpdated: (words: Word[]) => void;
}

export const WordList: React.FC<WordListProps> = ({ onWordsUpdated }) => {
  const [words, setWords] = useState<Word[]>([]);
  const [newWord, setNewWord] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    const storedWords = localStorage.getItem('words');
    if (storedWords) {
      setWords(JSON.parse(storedWords));
    }
  }, []);

  const updateWords = useCallback((updatedWords: Word[]) => {
    setWords(updatedWords);
    onWordsUpdated(updatedWords);
    localStorage.setItem('words', JSON.stringify(updatedWords));
  }, [onWordsUpdated]);

  const addWord = () => {
    if (newWord.trim()) {
      const updatedWords = [...words, { id: uuidv4(), text: newWord.trim(), helpEnabled: false }];
      updateWords(updatedWords);
      setNewWord('');
    }
  };

  const toggleHelp = (id: string) => {
    const updatedWords = words.map(word => 
      word.id === id ? { ...word, helpEnabled: !word.helpEnabled } : word
    );
    updateWords(updatedWords);
  };

  const deleteWord = (id: string) => {
    const updatedWords = words.filter(word => word.id !== id);
    updateWords(updatedWords);
  };

  const startEditing = (word: Word) => {
    setEditingId(word.id);
    setEditingText(word.text);
  };

  const saveEdit = () => {
    if (editingId && editingText.trim()) {
      const updatedWords = words.map(word => 
        word.id === editingId ? { ...word, text: editingText.trim() } : word
      );
      updateWords(updatedWords);
      setEditingId(null);
      setEditingText('');
    }
  };

  const clearAllWords = () => {
    updateWords([]);
    localStorage.removeItem('words');
  };

  return (
    <div className="bg-bg-primary text-text-primary p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Word List</h2>
      <div className="flex mb-4">
        <Input
          value={newWord}
          onChange={(e) => setNewWord(e.target.value)}
          placeholder="Enter a new word"
          className="flex-grow mr-2"
        />
        <Button onClick={addWord}>Add Word</Button>
      </div>
      <ul className="list-disc pl-6">
        {words.map(word => (
          <li key={word.id} className="mb-2 flex justify-between items-center">
            {editingId === word.id ? (
              <>
                <Input
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="mr-2"
                />
                <Button onClick={saveEdit} variant="outline">Save</Button>
              </>
            ) : (
              <>
                <span>{word.text}</span>
                <div className="flex items-center">
                  <label className="mr-2">
                    <input
                      type="checkbox"
                      checked={word.helpEnabled}
                      onChange={() => toggleHelp(word.id)}
                      className="mr-1"
                    />
                    Help
                  </label>
                  <Button onClick={() => startEditing(word)} variant="outline" className="mr-2">Edit</Button>
                  <Button onClick={() => deleteWord(word.id)} variant="destructive">Delete</Button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
      {words.length > 0 && (
        <Button onClick={clearAllWords} variant="destructive" className="mt-4">Clear All Words</Button>
      )}
    </div>
  );
};