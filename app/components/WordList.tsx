'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Input, CardBody } from "@nextui-org/react";
import { ImageUpload } from './ImageUpload';
import { DocumentUpload } from './DocumentUpload';

interface Word {
  id: string;
  text: string;
}

interface WordListProps {
  onWordsUpdated: (words: string[]) => void;
}

export const WordList: React.FC<WordListProps> = ({ onWordsUpdated }) => {
  const [words, setWords] = useState<Word[]>([]); // Change this line
  const [newWord, setNewWord] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  const updateParentWords = useCallback(() => {
    onWordsUpdated(words.map(word => word.text));
  }, [words, onWordsUpdated]);

  useEffect(() => {
    updateParentWords();
  }, [updateParentWords]);

  const addWord = () => {
    if (newWord.trim()) {
      const newWordObject: Word = { id: Date.now().toString(), text: newWord.trim() };
      setWords([...words, newWordObject]);
      setNewWord('');
    }
  };

  const deleteWord = (id: string) => {
    setWords(words.filter(word => word.id !== id));
  };

  const startEditing = (word: Word) => {
    setEditingId(word.id);
    setEditingText(word.text);
  };

  const saveEdit = () => {
    if (editingId && editingText.trim()) {
      setWords(words.map(word => 
        word.id === editingId ? { ...word, text: editingText.trim() } : word
      ));
      setEditingId(null);
      setEditingText('');
    }
  };

  const clearAllWords = () => {
    setWords([]);
  };

  const handleWordsExtracted = (extractedWords: string[]) => {
    const newWords = extractedWords.map(word => ({ id: Date.now().toString() + Math.random(), text: word }));
    setWords([...words, ...newWords]);
  };

  return (
    <Card>
      <CardBody>
        <h2 className="text-2xl font-bold mb-4">Word List</h2>
        <div className="flex mb-4">
          <Input
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            placeholder="Enter a new word"
            className="mr-2"
          />
          <Button onClick={addWord}>Add Word</Button>
        </div>
        <ImageUpload onWordsExtracted={handleWordsExtracted} />
        <DocumentUpload onWordsExtracted={handleWordsExtracted} />
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
                  <Button size="sm" color="primary" onClick={saveEdit}>Save</Button>
                </>
              ) : (
                <>
                  <span>{word.text}</span>
                  <div>
                    <Button size="sm" color="secondary" onClick={() => startEditing(word)} className="mr-2">Edit</Button>
                    <Button size="sm" color="danger" onClick={() => deleteWord(word.id)}>Delete</Button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
        {words.length > 0 && (
          <Button color="warning" onClick={clearAllWords} className="mt-4">Clear All Words</Button>
        )}
      </CardBody>
    </Card>
  );
};