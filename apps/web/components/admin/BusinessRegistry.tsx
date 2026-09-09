"use client";

import React, { useMemo, useState, useTransition } from 'react';
import {
  Search,
  Plus,
  Pencil,
  Ban,
  BadgeCheck,
  Power,
  AlertCircle,
  Loader2,
  X,
} from 'lucide-react';
import { StatusPill } from './StatusPill';
import { TIERS } from '@/lib/pro/tiers';
import {
  BUSINESS_STATUS_LABELS,
  TRADE_LABELS,
  TRADE_OPTIONS,
  type AdminBusiness,
  type BusinessKind,
  type TradeCategory,
} from '@/lib/admin/types';
import type { BusinessInput } from '@/lib/admin/actions';

type Result = { ok: boolean; error?: string };

interface BusinessRegistryProps {
  businesses: AdminBusiness[];
  createAction: (input: BusinessInput) => Promise<Result>;
  updateAction: (id: string, input: Partial<BusinessInput>) => Promise<Result>;
  disableAction: (id: string, disabled: boolean) => Promise<Result>;
  verifyAction: (id: string, verified: boolean) => Promise<Result>;
}

const fieldClass =
  'w-full min-h-[44px] rounded-2xl border border-[#c4c7c7] bg-[#f4f0ea] px-4 py-3 font-body text-sm text-[#1b1c19] outline-none transition-colors placeholder:text-[#1b1c19]/40 focus:border-[#1b1c19] focus:ring-1 focus:ring-[#1b1c19]';
const labelClass = 'mb-2 block font-body text-sm font-medium text-[#1b1c19]';

function emptyInput(): BusinessInput {
  return {
    name: '',
    contactName: '',
    email: '',
    phone: '',
    location: '',
    kind: 'solo_tradesman',
    trade: 'carpenter',
  };
}

function toInput(b: AdminBusiness): BusinessInput {
  return {
    name: b.name,
    contactName: b.contactName,
    email: b.email,
    phone: b.phone,
    location: b.location,
    kind: b.kind,
    trade: b.trade,
  };
}

export function BusinessRegistry({
  businesses,
  createAction,
  updateAction,
  disableAction,
  verifyAction,
}: BusinessRegistryProps) {
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<AdminBusiness | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return businesses;
    return businesses.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.contactName.toLowerCase().includes(q) ||
        b.location.toLowerCase().includes(q) ||
        TRADE_LABELS[b.trade].toLowerCase().includes(q),
    );
  }, [businesses, query]);

  const run = (fn: () => Promise<Result>) => {
    setNotice(null);
    startTransition(async () => {
      const result = await fn();
      if (!result.ok) setNotice(result.error ?? 'That action could not be completed.');
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-[24rem]">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-[#1b1c19]/45" />
          </div>
          <label htmlFor="biz-search" className="sr-only">
            Search businesses
          </label>
          <input
            id="biz-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name, contact, trade or city"
            className="block min-h-[44px] w-full rounded-2xl border border-[#c4c7c7] bg-[#f4f0ea] py-2 pr-3 pl-10 font-body text-sm text-[#1b1c19] outline-none transition-colors placeholder:text-[#1b1c19]/40 focus:border-[#1b1c19] focus:ring-1 focus:ring-[#1b1c19]"
          />
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#1b1c19] px-6 py-3 font-body text-sm font-medium text-[#fbf9f4] transition-colors hover:bg-black"
        >
          <Plus className="h-4 w-4 shrink-0" />
          Add New Partner
        </button>
      </div>

      {notice && (
        <p role="alert" className="flex items-start gap-2 font-body text-sm text-[#9d3f30]">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {notice}
        </p>
      )}

      <div className="overflow-x-auto rounded-xl border border-[#c4c7c7] bg-[#fbf9f4]">
        <table className="w-full min-w-[62rem] border-collapse text-left">
          <thead>
            <tr>
              {['Business', 'Trade', 'Tier', 'Verification', 'Status', 'Actions'].map((h) => (
                <th
                  key={h}
                  className="border-b border-[#c4c7c7] px-5 py-3 font-label-sm text-[10px] tracking-widest text-[#1b1c19]/45 uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((b) => (
              <tr key={b.id} className="transition-colors hover:bg-[#f4f0ea]">
                <td className="border-b border-[#c4c7c7]/40 px-5 py-4">
                  <span className="block font-body-md text-sm font-medium text-[#1b1c19]">
                    {b.name}
                  </span>
                  <span className="mt-0.5 block font-body text-xs text-[#1b1c19]/55">
                    {b.contactName} &middot; {b.location}
                  </span>
                </td>
                <td className="border-b border-[#c4c7c7]/40 px-5 py-4 font-body text-sm whitespace-nowrap text-[#1b1c19]/70">
                  {TRADE_LABELS[b.trade]}
                </td>
                <td className="border-b border-[#c4c7c7]/40 px-5 py-4 font-body text-sm whitespace-nowrap text-[#1b1c19]/70">
                  {TIERS[b.tier].name}
                </td>
                <td className="border-b border-[#c4c7c7]/40 px-5 py-4">
                  {b.verifiedAt ? (
                    <StatusPill label="Verified" tone="positive" />
                  ) : (
                    <StatusPill label="Unverified" tone="warning" />
                  )}
                </td>
                <td className="border-b border-[#c4c7c7]/40 px-5 py-4">
                  <StatusPill
                    label={BUSINESS_STATUS_LABELS[b.status]}
                    tone={
                      b.status === 'active'
                        ? 'positive'
                        : b.status === 'banned'
                          ? 'critical'
                          : 'neutral'
                    }
                  />
                </td>
                <td className="border-b border-[#c4c7c7]/40 px-5 py-4">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label={`Edit ${b.name}`}
                      onClick={() => {
                        setEditing(b);
                        setFormOpen(true);
                      }}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#c4c7c7] text-[#1b1c19] transition-colors hover:bg-[#f4f0ea]"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label={b.verifiedAt ? `Unverify ${b.name}` : `Verify ${b.name}`}
                      disabled={pending || b.status === 'banned'}
                      onClick={() => run(() => verifyAction(b.id, !b.verifiedAt))}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#c4c7c7] text-[#1b1c19] transition-colors hover:bg-[#f4f0ea] disabled:opacity-40"
                    >
                      <BadgeCheck className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label={
                        b.status === 'disabled' ? `Enable ${b.name}` : `Disable ${b.name}`
                      }
                      disabled={pending || b.status === 'banned'}
                      onClick={() => run(() => disableAction(b.id, b.status !== 'disabled'))}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#c4c7c7] text-[#1b1c19] transition-colors hover:border-[#92651a] hover:text-[#92651a] disabled:opacity-40"
                    >
                      {b.status === 'banned' ? (
                        <Ban className="h-3.5 w-3.5" />
                      ) : (
                        <Power className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {formOpen && (
        <BusinessFormModal
          business={editing}
          onClose={() => {
            setFormOpen(false);
            setEditing(null);
          }}
          onSubmit={(input) =>
            editing ? updateAction(editing.id, input) : createAction(input)
          }
        />
      )}
    </div>
  );
}

function BusinessFormModal({
  business,
  onClose,
  onSubmit,
}: {
  business: AdminBusiness | null;
  onClose: () => void;
  onSubmit: (input: BusinessInput) => Promise<Result>;
}) {
  const [form, setForm] = useState<BusinessInput>(() =>
    business ? toInput(business) : emptyInput(),
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof BusinessInput>(k: K, v: BusinessInput[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const result = await onSubmit(form);
    if (!result.ok) {
      setError(result.error ?? 'Could not save that partner.');
      setSaving(false);
      return;
    }
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto p-4 py-8">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="fixed inset-0 h-full w-full cursor-default bg-[#1b1c19]/50 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="biz-form-title"
        className="relative w-full max-w-[38rem] rounded-2xl border border-[#c4c7c7] bg-[#fbf9f4] shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#c4c7c7] p-6 sm:p-8">
          <div>
            <span className="font-body text-[10px] tracking-[0.18em] text-[#1b1c19]/45 uppercase">
              {business ? 'Edit Partner' : 'New Partner'}
            </span>
            <h2 id="biz-form-title" className="mt-3 font-serif text-2xl leading-tight text-[#1b1c19]">
              {business ? business.name : 'Register a business'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#c4c7c7] text-[#1b1c19] transition-colors hover:bg-[#f4f0ea]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-5 p-6 sm:p-8">
          <div>
            <label htmlFor="b-name" className={labelClass}>
              Business name
            </label>
            <input
              id="b-name"
              className={fieldClass}
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="b-contact" className={labelClass}>
                Contact person
              </label>
              <input
                id="b-contact"
                className={fieldClass}
                value={form.contactName}
                onChange={(e) => set('contactName', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="b-email" className={labelClass}>
                Email
              </label>
              <input
                id="b-email"
                type="email"
                className={fieldClass}
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="b-phone" className={labelClass}>
                Phone
              </label>
              <input
                id="b-phone"
                className={fieldClass}
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                placeholder="+92 300 1234567"
              />
            </div>
            <div>
              <label htmlFor="b-location" className={labelClass}>
                City &amp; area
              </label>
              <input
                id="b-location"
                className={fieldClass}
                value={form.location}
                onChange={(e) => set('location', e.target.value)}
                placeholder="Gulberg III, Lahore"
              />
            </div>
            <div>
              <label htmlFor="b-kind" className={labelClass}>
                Account type
              </label>
              <select
                id="b-kind"
                className={`${fieldClass} cursor-pointer`}
                value={form.kind}
                onChange={(e) => set('kind', e.target.value as BusinessKind)}
              >
                <option value="solo_tradesman">Solo Tradesman</option>
                <option value="shop_with_crew">Shop + Crew</option>
              </select>
            </div>
            <div>
              <label htmlFor="b-trade" className={labelClass}>
                Trade
              </label>
              <select
                id="b-trade"
                className={`${fieldClass} cursor-pointer`}
                value={form.trade}
                onChange={(e) => set('trade', e.target.value as TradeCategory)}
              >
                {TRADE_OPTIONS.map(({ id, label }) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <p role="alert" className="flex items-start gap-2 font-body text-sm text-[#9d3f30]">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </p>
          )}

          <p className="font-body text-xs leading-relaxed text-[#1b1c19]/45">
            New partners start on the Free tier and unverified. Verify them from the
            registry once their details check out.
          </p>

          <div className="flex flex-col gap-3 border-t border-[#c4c7c7] pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] rounded-2xl border border-[#c4c7c7] px-6 py-3 font-body text-sm font-medium text-[#1b1c19] transition-colors hover:bg-[#f4f0ea]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex min-h-[44px] items-center justify-center gap-2 rounded-2xl bg-[#1b1c19] px-6 py-3 font-body text-sm font-medium text-[#fbf9f4] transition-colors hover:bg-black disabled:cursor-wait disabled:opacity-80"
            >
              {saving && <Loader2 className="h-4 w-4 shrink-0 animate-spin" />}
              {business ? 'Save Changes' : 'Create Partner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
