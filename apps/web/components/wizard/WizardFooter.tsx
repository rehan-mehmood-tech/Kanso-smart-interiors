import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface WizardFooterProps {
  onBack: () => void;
  onContinue: () => void;
  canContinue: boolean;
  ctaText?: string;
  ctaIcon?: React.ReactNode;
  isLoading?: boolean;
}

export function WizardFooter({ onBack, onContinue, canContinue, ctaText = "Continue", ctaIcon = <ArrowRight className="w-4 h-4" />, isLoading = false }: WizardFooterProps) {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-surface-container-lowest/90 backdrop-blur-md border-t border-outline-variant p-4 md:px-6 z-40 flex justify-between items-center shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
      <div className="max-w-container-max-app mx-auto w-full flex justify-between items-center px-2 md:px-6">
        <button 
          onClick={onBack}
          className="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button 
          onClick={onContinue}
          disabled={!canContinue || isLoading}
          className={`bg-primary text-on-primary font-label-sm text-label-sm px-8 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 ${
            canContinue && !isLoading ? 'opacity-100 hover:bg-surface-tint' : 'opacity-50 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
          ) : ctaText}
          {!isLoading && ctaIcon}
        </button>
      </div>
    </div>
  );
}
