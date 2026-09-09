"use client";

import React, { useEffect } from 'react';
import type { WallAngle } from '@/lib/api/projects';
import { clearWall, hasAllWalls, setWallFile, useWizard } from '@/lib/project/session';
import { WallCaptureState, WallUploadSlot } from './WallUploadSlot';

interface CaptureGridProps {
  onCompletionChange: (completed: boolean) => void;
}

/**
 * How each wall is presented. The angle is what the backend stores, the label
 * and rotation are only for the slot's placeholder icon.
 */
const WALL_PRESENTATION: { angle: WallAngle; label: string; rotation: number }[] = [
  { angle: 'north', label: 'Wall 1 of 4', rotation: 0 },
  { angle: 'east', label: 'Wall 2 of 4', rotation: 90 },
  { angle: 'south', label: 'Wall 3 of 4', rotation: 180 },
  { angle: 'west', label: 'Wall 4 of 4', rotation: 270 },
];

export function CaptureGrid({ onCompletionChange }: CaptureGridProps) {
  // Photos live in the wizard store, not in local state: the review step needs
  // these exact files, and stepping back here must show what was already
  // captured rather than four empty slots.
  const wizard = useWizard();
  const allCompleted = hasAllWalls(wizard);

  // Reporting completion from inside the state updater called the parent's
  // setState while CaptureGrid was rendering. Derive it and notify after commit.
  useEffect(() => {
    onCompletionChange(allCompleted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCompleted]);

  // Object URLs are deliberately NOT revoked on unmount. They belong to the
  // store, which outlives this component, and the review step renders the same
  // URLs -- revoking here would blank the previews the moment we navigate.
  // The store revokes them when a photo is replaced, cleared, or the wizard
  // is reset.

  const handleUpload = (id: string, file: File) => setWallFile(id as WallAngle, file);
  const handleRemove = (id: string) => clearWall(id as WallAngle);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl mx-auto mb-12">
      {WALL_PRESENTATION.map(({ angle, label, rotation }) => {
        const stored = wizard.walls.find((wall) => wall.angle === angle);
        const slotState: WallCaptureState = {
          id: angle,
          label,
          file: stored?.file ?? null,
          previewUrl: stored?.previewUrl ?? null,
          rotation,
        };
        return (
          <WallUploadSlot
            key={angle}
            state={slotState}
            onUpload={handleUpload}
            onRemove={handleRemove}
          />
        );
      })}
    </div>
  );
}
