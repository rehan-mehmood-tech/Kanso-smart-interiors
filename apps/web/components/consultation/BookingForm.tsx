"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { submitConsultation } from '@/lib/api/projects';
import { ApiError } from '@/lib/api/client';

export interface BookingFormData {
  fullName: string;
  dialCode: string;
  phone: string;
  location: string;
  mode: string;
  timeSlot: string;
  notes: string;
}

interface BookingFormProps {
  projectId: string;
  /** The project's own city, used to prefill the location field. */
  defaultCity?: string | null;
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
] as const;

const TIME_SLOTS = ['Morning', 'Afternoon', 'Evening'] as const;

/** Pakistan first: this is a PKR product serving Pakistani cities. */
const DIAL_CODES = [
  { value: '+92', label: '+92 (PK)' },
  { value: '+971', label: '+971 (UAE)' },
  { value: '+44', label: '+44 (UK)' },
  { value: '+1', label: '+1 (US)' },
];

/**
 * Split "Gulberg, Lahore" into an area and a city.
 *
 * The form asks for both in one field, but the lead stores them separately:
 * `city` is what vendor matching runs on, and a lead whose city is the whole
 * string never matches anyone.
 */
function splitLocation(value: string): { city: string; fullAddress: string } {
  const trimmed = value.trim();
  const parts = trimmed.split(',').map((part) => part.trim()).filter(Boolean);
  // The city is conventionally written last: "Gulberg, Lahore".
  const city = parts.length > 1 ? parts[parts.length - 1] : trimmed;
  return { city, fullAddress: trimmed };
}

export function BookingForm({ projectId, defaultCity }: BookingFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touchedLocation, setTouchedLocation] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    fullName: '',
    dialCode: '+92',
    phone: '',
    location: '',
    mode: '',
    timeSlot: '',
    notes: ''
  });

  // Prefilled from the project until the customer types their own. Derived
  // rather than copied into state by an effect, which would fight their edits.
  const location = touchedLocation ? formData.location : formData.location || (defaultCity ?? '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    const { city, fullAddress } = splitLocation(location);

    try {
      const result = await submitConsultation({
        customer_name: formData.fullName.trim(),
        // The dialling code is part of the number: a vendor cannot call
        // "3001234567". It used to be an unbound <select>, so whatever the
        // customer chose was discarded.
        phone: `${formData.dialCode} ${formData.phone.trim()}`.trim(),
        city,
        full_address: fullAddress,
        project_id: projectId,
        preferred_mode: (formData.mode || undefined) as 'in-person' | 'video' | undefined,
        preferred_time_slot: (formData.timeSlot || undefined) as
          | 'Morning'
          | 'Afternoon'
          | 'Evening'
          | undefined,
        notes: formData.notes.trim() || undefined,
      });

      // The lead id travels to the confirmation, which reads the real
      // assignment back rather than naming an invented specialist.
      router.push(`/project/${projectId}/matching?lead=${encodeURIComponent(result.lead_id)}`);
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'We could not submit your request. Please check your connection and try again.',
      );
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (e.target.name === 'location') setTouchedLocation(true);
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
                  name="dialCode"
                  value={formData.dialCode}
                  onChange={handleChange}
                  className={`${FIELD_CLASS} w-24 shrink-0 cursor-pointer`}
                >
                  {DIAL_CODES.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <input
                  className={`${FIELD_CLASS} flex-1 min-w-0`}
                  id="phone"
                  name="phone"
                  placeholder="300 1234567"
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
              value={location}
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

        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-error/40 bg-error/5 p-4"
          >
            <AlertTriangle className="w-5 h-5 text-error shrink-0 mt-0.5" />
            <p className="text-body-md font-body-md text-primary">{error}</p>
          </div>
        )}

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`h-12 w-full bg-[#1b1c19] text-[#fbf9f4] px-6 rounded-lg font-label-sm text-label-sm flex justify-between items-center group transition-all duration-300 ${isSubmitting ? 'opacity-80 cursor-wait' : 'hover:bg-surface-tint shadow-sm hover:shadow-md'}`}
          >
            <span>{isSubmitting ? 'Submitting your request...' : 'Confirm Specialist Match'}</span>
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-[#fbf9f4] border-t-transparent rounded-full animate-spin" />
            ) : (
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
