'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface Word {
  id: string;
  text: string;
}

interface WordListProps {
  onWordsUpdated: (words: string[]) => void;
}

export const WordList: React.FC<WordListProps> = ({ onWordsUpdated }) => {
  const [words, setWords] = useState<Word[]>([]);
  const [newWord, setNewWord] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  const updateWords = useCallback(() => {
    onWordsUpdated(words.map(word => word.text));
  }, [words, onWordsUpdated]);

  useEffect(() => {
    updateWords();
  }, [updateWords]);

  const addWord = () => {
    if (newWord.trim()) {
      setWords(prevWords => [...prevWords, { id: Date.now().toString(), text: newWord.trim() }]);
      setNewWord('');
    }
  };

  const deleteWord = (id: string) => {
    setWords(prevWords => prevWords.filter(word => word.id !== id));
  };

  const startEditing = (word: Word) => {
    setEditingId(word.id);
    setEditingText(word.text);
  };

  const saveEdit = () => {
    if (editingId && editingText.trim()) {
      setWords(prevWords => prevWords.map(word => 
        word.id === editingId ? { ...word, text: editingText.trim() } : word
      ));
      setEditingId(null);
      setEditingText('');
    }
  };

  const clearAllWords = () => {
    setWords([]);
  };

  return (
    <div className="bg-bg-primary text-text-primary p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Word List</h2>
      <div className="flex mb-4">
        <input
          value={newWord}
          onChange={(e) => setNewWord(e.target.value)}
          placeholder="Enter a new word"
          className="flex-grow mr-2 p-2 border rounded"
        />
        <button onClick={addWord} className="bg-accent-color text-bg-primary px-4 py-2 rounded">Add Word</button>
      </div>
      <ul className="list-disc pl-6">
        {words.map(word => (
          <li key={word.id} className="mb-2 flex justify-between items-center">
            {editingId === word.id ? (
              <>
                <input
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="mr-2 p-1 border rounded"
                />
                <button onClick={saveEdit} className="bg-green-500 text-white px-2 py-1 rounded text-sm">Save</button>
              </>
            ) : (
              <>
                <span>{word.text}</span>
                <div>
                  <button onClick={() => startEditing(word)} className="bg-blue-500 text-white px-2 py-1 rounded text-sm mr-2">Edit</button>
                  <button onClick={() => deleteWord(word.id)} className="bg-red-500 text-white px-2 py-1 rounded text-sm">Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
      {words.length > 0 && (
        <button onClick={clearAllWords} className="bg-yellow-500 text-white px-4 py-2 rounded mt-4">Clear All Words</button>
      )}
    </div>
  );
};