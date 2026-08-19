import React from 'react';
import { Edit2 } from 'lucide-react';

export function ProfileEditButton() {
  return (
    <button className="fixed bottom-6 right-6 md:bottom-12 md:right-12 z-50 bg-primary text-on-primary w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[#FBF9F4]">
      <Edit2 className="w-5 h-5" />
      <span className="sr-only">Edit Profile</span>
    </button>
  );
}
