'use client';

import React, { useState } from 'react';
import { Button, Input } from "@nextui-org/react";

interface DocumentUploadProps {
  onWordsExtracted: (words: string[]) => void;
}

export function DocumentUpload({ onWordsExtracted }: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('document', file);

    try {
      const response = await fetch('/api/extract-words-from-document', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const { words } = await response.json();
        onWordsExtracted(words);
      } else {
        console.error('Failed to extract words from document');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
    }
  };

  return (
    <div className="mb-4">
      <Input type="file" onChange={handleFileChange} accept=".txt,.doc,.docx,.pdf" />
      <Button onClick={handleUpload} disabled={!file} className="mt-2">
        Upload Document
      </Button>
    </div>
  );
}