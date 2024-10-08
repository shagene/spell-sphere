'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Tesseract from 'tesseract.js';

interface ImageUploadProps {
  onWordsExtracted: (words: string[]) => void;
}

export function ImageUpload({ onWordsExtracted }: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    
    try {
      const result = await Tesseract.recognize(file);
      const extractedText = result.data.text;
      const words = extractedText.split(/\s+/).filter(word => word.length > 0);
      onWordsExtracted(words);
    } catch (error) {
      console.error('Error parsing image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Input type="file" onChange={handleImageUpload} accept="image/*" />
      {isLoading && <p>Processing image...</p>}
    </div>
  );
}