import React from 'react';

export function Card({ title, content }: { title: string; content: string }) {
  return (
    <div className="card" style={{ 
      backgroundColor: 'var(--bg-primary)', 
      color: 'var(--text-primary)',
      border: '1px solid var(--accent-color)'
    }}>
      <h2>{title}</h2>
      <p>{content}</p>
    </div>
  );
}