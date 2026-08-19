"use client";

import React, { useState } from 'react';
import { Save } from 'lucide-react';

export function ProNotesForm() {
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 800);
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex flex-col h-full">
      <div className="flex items-center justify-between mb-6 border-b border-outline-variant/30 pb-4">
        <h2 className="font-display-xl text-xl text-primary tracking-tight">Internal Notes & Estimates</h2>
      </div>
      
      <textarea 
        className="flex-1 w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-4 font-body-md text-sm text-primary focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none min-h-[200px] placeholder:text-secondary/60"
        placeholder="Add material rough estimates, contractor measurements, or client follow-up reminders... (These are only visible to your studio)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-outline-variant/30">
        <span className="font-label-sm text-[10px] text-secondary">
          {lastSaved ? `Last saved at ${lastSaved}` : 'Unsaved changes'}
        </span>
        <button 
          onClick={handleSave}
          disabled={isSaving || !notes.trim()}
          className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded font-label-sm text-[10px] uppercase tracking-widest hover:bg-surface-tint transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Notes'}
        </button>
      </div>
    </div>
  );
}
