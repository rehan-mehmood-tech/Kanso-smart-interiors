"use client";

import React, { useState, useEffect } from 'react';
import { WallCaptureState, WallUploadSlot } from './WallUploadSlot';

interface CaptureGridProps {
  onCompletionChange: (completed: boolean) => void;
}

const INITIAL_STATE: WallCaptureState[] = [
  { id: 'wall1', label: 'Wall 1 of 4', file: null, previewUrl: null, rotation: 0 },
  { id: 'wall2', label: 'Wall 2 of 4', file: null, previewUrl: null, rotation: 90 },
  { id: 'wall3', label: 'Wall 3 of 4', file: null, previewUrl: null, rotation: 180 },
  { id: 'wall4', label: 'Wall 4 of 4', file: null, previewUrl: null, rotation: 270 },
];

export function CaptureGrid({ onCompletionChange }: CaptureGridProps) {
  const [walls, setWalls] = useState<WallCaptureState[]>(INITIAL_STATE);

  const allCompleted = walls.every(wall => wall.file !== null);

  // Reporting completion from inside the setWalls updater called the parent's
  // setState while CaptureGrid was rendering. Derive it from state instead and
  // notify after commit.
  useEffect(() => {
    onCompletionChange(allCompleted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCompleted]);

  useEffect(() => {
    // Cleanup object URLs to avoid memory leaks
    return () => {
      walls.forEach(wall => {
        if (wall.previewUrl) {
          URL.revokeObjectURL(wall.previewUrl);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpload = (id: string, file: File) => {
    setWalls(prev => {
      const next = prev.map(wall => {
        if (wall.id === id) {
          if (wall.previewUrl) {
            URL.revokeObjectURL(wall.previewUrl);
          }
          return { ...wall, file, previewUrl: URL.createObjectURL(file) };
        }
        return wall;
      });

      return next;
    });
  };

  const handleRemove = (id: string) => {
    setWalls(prev => {
      const next = prev.map(wall => {
        if (wall.id === id) {
          if (wall.previewUrl) {
            URL.revokeObjectURL(wall.previewUrl);
          }
          return { ...wall, file: null, previewUrl: null };
        }
        return wall;
      });

      return next;
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl mx-auto mb-12">
      {walls.map(wall => (
        <WallUploadSlot 
          key={wall.id}
          state={wall}
          onUpload={handleUpload}
          onRemove={handleRemove}
        />
      ))}
    </div>
  );
}
