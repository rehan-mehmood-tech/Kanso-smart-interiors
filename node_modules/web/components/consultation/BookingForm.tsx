"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export interface BookingFormData {
  fullName: string;
  phone: string;
  location: string;
  mode: string;
  timeSlot: string;
  notes: string;
}

interface BookingFormProps {
  projectId: string;
}

export function BookingForm({ projectId }: BookingFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    fullName: '',
    phone: '',
    location: '',
    mode: '',
    timeSlot: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate network request
    setTimeout(() => {
      router.push(`/project/${projectId}/matching`);
    }, 1200);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="bg-surface-container-lowest rounded-[16px] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] border border-surface-variant p-6 md:p-8 mt-6 relative overflow-hidden">
      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        <div className="space-y-5">
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface mb-1" htmlFor="fullName">Full Name</label>
            <input 
              className="w-full bg-transparent border-0 border-b border-outline-variant px-0 py-2 focus:ring-0 focus:border-primary transition-colors text-body-md font-body-md" 
              id="fullName" 
              name="fullName" 
              placeholder="Jane Doe" 
              required 
              type="text"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface mb-1" htmlFor="phone">Phone / WhatsApp</label>
            <div className="flex gap-4">
              <select className="bg-transparent border-0 border-b border-outline-variant px-0 py-2 focus:ring-0 focus:border-primary transition-colors text-body-md font-body-md w-24 cursor-pointer">
                <option value="+1">+1 (US)</option>
                <option value="+44">+44 (UK)</option>
                <option value="+92">+92 (PK)</option>
                <option value="+971">+971 (UAE)</option>
              </select>
              <input 
                className="w-full bg-transparent border-0 border-b border-outline-variant px-0 py-2 focus:ring-0 focus:border-primary transition-colors text-body-md font-body-md flex-1" 
                id="phone" 
                name="phone" 
                placeholder="(555) 123-4567" 
                required 
                type="tel"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface mb-1" htmlFor="location">City & Area</label>
            <input 
              className="w-full bg-transparent border-0 border-b border-outline-variant px-0 py-2 focus:ring-0 focus:border-primary transition-colors text-body-md font-body-md" 
              id="location" 
              name="location" 
              placeholder="e.g., Gulberg, Lahore" 
              required 
              type="text"
              value={formData.location}
              onChange={handleChange}
            />
          </div>
          
          <div className="pt-2">
            <label className="block font-label-sm text-label-sm text-on-surface mb-3">Preferred Mode</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="radio" name="mode" value="in-person" className="text-primary focus:ring-primary w-4 h-4 cursor-pointer" required onChange={handleChange} />
                <span className="text-body-md text-primary group-hover:opacity-80 transition-opacity">In-Person On-Site</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="radio" name="mode" value="video" className="text-primary focus:ring-primary w-4 h-4 cursor-pointer" required onChange={handleChange} />
                <span className="text-body-md text-primary group-hover:opacity-80 transition-opacity">Video Call</span>
              </label>
            </div>
          </div>

          <div className="pt-2">
            <label className="block font-label-sm text-label-sm text-on-surface mb-3">Time Slot</label>
            <div className="flex flex-wrap gap-3">
              {['Morning', 'Afternoon', 'Evening'].map(slot => (
                <label key={slot} className={`px-4 py-2 border rounded-full text-label-sm font-label-sm cursor-pointer transition-colors ${formData.timeSlot === slot ? 'border-primary bg-primary text-on-primary' : 'border-outline-variant text-secondary hover:border-primary hover:text-primary'}`}>
                  <input type="radio" name="timeSlot" value={slot} className="sr-only" required onChange={handleChange} />
                  {slot}
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <label className="block font-label-sm text-label-sm text-on-surface mb-1" htmlFor="notes">Special Requirements (Optional)</label>
            <textarea 
              className="w-full bg-transparent border-0 border-b border-outline-variant px-0 py-2 focus:ring-0 focus:border-primary transition-colors text-body-md font-body-md resize-none" 
              id="notes" 
              name="notes" 
              rows={2}
              placeholder="Any specific access instructions or constraints..." 
              value={formData.notes}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="pt-4">
          <button 
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-primary text-on-primary py-4 px-6 rounded-lg font-label-sm text-label-sm flex justify-between items-center group transition-all duration-300 ${isSubmitting ? 'opacity-80 cursor-wait' : 'hover:bg-surface-tint shadow-sm hover:shadow-md'}`}
          >
            <span>{isSubmitting ? 'Processing...' : 'Confirm Specialist Match'}</span>
            {!isSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </button>
        </div>
      </form>
    </div>
  );
}
