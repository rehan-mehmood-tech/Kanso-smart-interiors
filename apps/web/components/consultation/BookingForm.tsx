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

const FIELD_CLASS =
  'w-full bg-transparent border-0 border-b border-outline-variant px-0 py-2 focus:ring-0 focus:border-primary transition-colors text-body-md font-body-md';

/** Shared pill styling for the mode and time-slot toggles. */
const toggleClass = (active: boolean) =>
  `flex items-center justify-center text-center px-4 py-2.5 border rounded-full text-label-sm font-label-sm cursor-pointer transition-colors duration-300 ${
    active
      ? 'border-primary bg-primary text-on-primary'
      : 'border-outline-variant text-secondary hover:border-primary hover:text-primary'
  }`;

const MODES = [
  { value: 'in-person', label: 'In-Person On-Site' },
  { value: 'video', label: 'Video Call' },
];

const TIME_SLOTS = ['Morning', 'Afternoon', 'Evening'];

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
        <div className="space-y-6">
          {/* Name and phone sit side by side from md up, stacked below it. */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface mb-1" htmlFor="fullName">Full Name</label>
              <input
                className={FIELD_CLASS}
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
              <div className="flex gap-3">
                <select
                  aria-label="Country dialling code"
                  className={`${FIELD_CLASS} w-24 shrink-0 cursor-pointer`}
                >
                  <option value="+1">+1 (US)</option>
                  <option value="+44">+44 (UK)</option>
                  <option value="+92">+92 (PK)</option>
                  <option value="+971">+971 (UAE)</option>
                </select>
                <input
                  className={`${FIELD_CLASS} flex-1 min-w-0`}
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
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface mb-1" htmlFor="location">City &amp; Area</label>
            <input
              className={FIELD_CLASS}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MODES.map(({ value, label }) => (
                <label key={value} className={toggleClass(formData.mode === value)}>
                  <input
                    type="radio"
                    name="mode"
                    value={value}
                    className="sr-only"
                    required
                    checked={formData.mode === value}
                    onChange={handleChange}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <label className="block font-label-sm text-label-sm text-on-surface mb-3">Time Slot</label>
            <div className="grid grid-cols-3 gap-3">
              {TIME_SLOTS.map(slot => (
                <label key={slot} className={toggleClass(formData.timeSlot === slot)}>
                  <input
                    type="radio"
                    name="timeSlot"
                    value={slot}
                    className="sr-only"
                    required
                    checked={formData.timeSlot === slot}
                    onChange={handleChange}
                  />
                  {slot}
                </label>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <label className="block font-label-sm text-label-sm text-on-surface mb-1" htmlFor="notes">Special Requirements (Optional)</label>
            <textarea
              className={`${FIELD_CLASS} resize-none`}
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
            className={`h-12 w-full bg-[#1b1c19] text-[#fbf9f4] px-6 rounded-lg font-label-sm text-label-sm flex justify-between items-center group transition-all duration-300 ${isSubmitting ? 'opacity-80 cursor-wait' : 'hover:bg-surface-tint shadow-sm hover:shadow-md'}`}
          >
            <span>{isSubmitting ? 'Processing...' : 'Confirm Specialist Match'}</span>
            {!isSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </button>
        </div>
      </form>
    </div>
  );
}
