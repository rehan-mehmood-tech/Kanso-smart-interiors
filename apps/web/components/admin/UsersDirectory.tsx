"use client";

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { StatusPill } from './StatusPill';
import { getUniqueAsset } from '@/lib/constants/assets';
import type { AdminUser, UserRole } from '@/lib/admin/types';

const ROLE_TONE: Record<UserRole, 'positive' | 'neutral' | 'warning'> = {
  admin: 'warning',
  business: 'positive',
  customer: 'neutral',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function UsersDirectory({ users }: { users: AdminUser[] }) {
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  }, [users, query]);

  return (
    <div className="flex flex-col gap-5">
      <div className="relative w-full lg:max-w-[24rem]">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-[#1b1c19]/45" />
        </div>
        <label htmlFor="user-search" className="sr-only">
          Search users by name or email
        </label>
        <input
          id="user-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or email"
          className="block min-h-[44px] w-full rounded-2xl border border-[#c4c7c7] bg-[#f4f0ea] py-2 pr-3 pl-10 font-body text-sm text-[#1b1c19] outline-none transition-colors placeholder:text-[#1b1c19]/40 focus:border-[#1b1c19] focus:ring-1 focus:ring-[#1b1c19]"
        />
      </div>

      <p className="font-label-sm text-xs tracking-wider text-[#1b1c19]/50 uppercase tabular-nums">
        {visible.length} of {users.length} accounts
      </p>

      <div className="overflow-x-auto rounded-xl border border-[#c4c7c7] bg-[#fbf9f4]">
        <table className="w-full min-w-[46rem] border-collapse text-left">
          <thead>
            <tr>
              {['Name', 'Email', 'Role', 'Created', 'Status'].map((h) => (
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
            {visible.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center font-body text-sm text-[#1b1c19]/55">
                  No account matches &ldquo;{query}&rdquo;.
                </td>
              </tr>
            ) : (
              visible.map((user) => (
                <tr key={user.id} className="transition-colors hover:bg-[#f4f0ea]">
                  <td className="border-b border-[#c4c7c7]/40 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-[#c4c7c7]">
                        <Image
                          src={getUniqueAsset('portfolios', user.id)}
                          alt=""
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      </div>
                      <span className="font-body-md text-sm font-medium text-[#1b1c19]">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="border-b border-[#c4c7c7]/40 px-5 py-4 font-body text-sm text-[#1b1c19]/70">
                    {user.email}
                  </td>
                  <td className="border-b border-[#c4c7c7]/40 px-5 py-4">
                    <StatusPill label={user.role} tone={ROLE_TONE[user.role]} />
                  </td>
                  <td className="border-b border-[#c4c7c7]/40 px-5 py-4 font-body text-sm whitespace-nowrap text-[#1b1c19]/60 tabular-nums">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="border-b border-[#c4c7c7]/40 px-5 py-4">
                    <StatusPill
                      label={user.status}
                      tone={user.status === 'active' ? 'positive' : 'critical'}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
