"use client";

import React, { useId, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { MonthlyPoint } from '@/lib/pro/analytics';

interface RoiAnalyticsChartProps {
  data: MonthlyPoint[];
  /** Change in lead volume, latest month against the previous one. */
  delta: number;
}

/**
 * Monthly lead volume, last six months.
 *
 * One measure, one series -- so there is no legend to reconcile and no
 * categorical palette to validate; the title names what the bars are. Completed
 * leads are reported in the tooltip rather than as a second stacked colour,
 * which would have meant two near-neutral fills that fail a colour-vision
 * separation check in a deliberately monochrome palette.
 */

const VIEW_W = 720;
const VIEW_H = 260;
const PAD = { top: 24, right: 16, bottom: 36, left: 40 };
const PLOT_W = VIEW_W - PAD.left - PAD.right;
const PLOT_H = VIEW_H - PAD.top - PAD.bottom;
const BAR_RADIUS = 4;

/** Rounds the scale up to a clean tick so the top gridline is a real number. */
function niceMax(value: number): number {
  if (value <= 4) return 4;
  if (value <= 8) return 8;
  const step = value <= 20 ? 4 : value <= 50 ? 10 : 25;
  return Math.ceil(value / step) * step;
}

/** Bar with rounded data-end, square where it meets the baseline. */
function barPath(x: number, y: number, w: number, h: number): string {
  if (h <= 0) return '';
  const r = Math.min(BAR_RADIUS, h, w / 2);
  const bottom = y + h;
  return [
    `M ${x} ${bottom}`,
    `L ${x} ${y + r}`,
    `Q ${x} ${y} ${x + r} ${y}`,
    `L ${x + w - r} ${y}`,
    `Q ${x + w} ${y} ${x + w} ${y + r}`,
    `L ${x + w} ${bottom}`,
    'Z',
  ].join(' ');
}

export function RoiAnalyticsChart({ data, delta }: RoiAnalyticsChartProps) {
  const [active, setActive] = useState<number | null>(null);
  const titleId = useId();

  const max = niceMax(Math.max(...data.map((d) => d.total), 0));
  const ticks = [0, max / 2, max];
  const slot = PLOT_W / Math.max(data.length, 1);
  const barW = Math.min(slot * 0.52, 56);

  const peakIndex = data.reduce(
    (best, d, i) => (d.total > data[best].total ? i : best),
    0,
  );

  const yFor = (value: number) => PAD.top + PLOT_H - (value / max) * PLOT_H;
  const xFor = (i: number) => PAD.left + i * slot + (slot - barW) / 2;

  const DeltaIcon = delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus;
  const deltaText =
    delta === 0
      ? 'Level with last month'
      : `${delta > 0 ? '+' : ''}${delta} vs last month`;

  const activePoint = active === null ? null : data[active];

  return (
    <section className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] md:p-8">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 id={titleId} className="font-display-xl text-2xl tracking-tight text-[#1b1c19]">
            Lead Volume
          </h2>
          <p className="mt-1.5 font-body-md text-sm text-[#1b1c19]/55">
            Consultation requests assigned to you, last six months
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-outline-variant/50 bg-[#FBF9F4] px-3 py-1.5 font-label-sm text-xs whitespace-nowrap text-[#1b1c19]/70">
          <DeltaIcon className="h-3.5 w-3.5 shrink-0" />
          {deltaText}
        </span>
      </header>

      <div className="relative w-full">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="h-auto w-full overflow-visible"
          role="img"
          aria-labelledby={titleId}
          preserveAspectRatio="xMidYMid meet"
          onMouseLeave={() => setActive(null)}
        >
          {/* Recessive gridlines and value ticks */}
          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={PAD.left}
                x2={VIEW_W - PAD.right}
                y1={yFor(t)}
                y2={yFor(t)}
                stroke="#1b1c19"
                strokeOpacity={t === 0 ? 0.22 : 0.08}
                strokeWidth={1}
              />
              <text
                x={PAD.left - 10}
                y={yFor(t) + 4}
                textAnchor="end"
                fill="#1b1c19"
                fillOpacity={0.45}
                fontSize={11}
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {t}
              </text>
            </g>
          ))}

          {data.map((point, i) => {
            const h = (point.total / max) * PLOT_H;
            const x = xFor(i);
            const y = yFor(point.total);
            const isActive = active === i;
            return (
              <g key={point.key}>
                {/* Hit target is the full column, not just the bar. */}
                <rect
                  x={PAD.left + i * slot}
                  y={PAD.top}
                  width={slot}
                  height={PLOT_H}
                  fill="transparent"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${point.label}: ${point.total} leads, ${point.completed} completed`}
                  className="cursor-default focus:outline-none"
                />
                {point.total > 0 && (
                  <path
                    d={barPath(x, y, barW, h)}
                    fill="#1b1c19"
                    fillOpacity={isActive ? 1 : 0.86}
                    className="transition-opacity duration-200"
                    pointerEvents="none"
                  />
                )}
                {/* Direct-label the peak month only. */}
                {i === peakIndex && point.total > 0 && (
                  <text
                    x={x + barW / 2}
                    y={y - 9}
                    textAnchor="middle"
                    fill="#1b1c19"
                    fontSize={12}
                    fontWeight={600}
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                    pointerEvents="none"
                  >
                    {point.total}
                  </text>
                )}
                <text
                  x={x + barW / 2}
                  y={VIEW_H - 12}
                  textAnchor="middle"
                  fill="#1b1c19"
                  fillOpacity={isActive ? 0.8 : 0.5}
                  fontSize={12}
                  pointerEvents="none"
                >
                  {point.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Tooltip, positioned over the hovered column */}
        {activePoint && (
          <div
            role="status"
            className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-lg border border-outline-variant/50 bg-[#FBF9F4] px-3 py-2 shadow-md"
            style={{ left: `${((xFor(active!) + barW / 2) / VIEW_W) * 100}%` }}
          >
            <p className="font-label-sm text-[10px] tracking-widest text-[#1b1c19]/50 uppercase">
              {activePoint.label}
            </p>
            <p className="mt-1 font-body-md text-sm whitespace-nowrap text-[#1b1c19] tabular-nums">
              {activePoint.total} {activePoint.total === 1 ? 'lead' : 'leads'}
            </p>
            <p className="font-body-md text-xs whitespace-nowrap text-[#1b1c19]/60 tabular-nums">
              {activePoint.completed} completed
            </p>
          </div>
        )}
      </div>

      {/* Table view: the same numbers without relying on the plot. */}
      <details className="mt-6 border-t border-outline-variant/40 pt-4">
        <summary className="cursor-pointer font-label-sm text-xs tracking-widest text-[#1b1c19]/55 uppercase transition-colors hover:text-[#1b1c19]">
          View as table
        </summary>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[24rem] border-collapse text-left">
            <thead>
              <tr>
                {['Month', 'Leads', 'Completed'].map((h) => (
                  <th
                    key={h}
                    className="border-b border-outline-variant/40 pb-2 font-label-sm text-[10px] tracking-widest text-[#1b1c19]/45 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((point) => (
                <tr key={point.key}>
                  <td className="border-b border-outline-variant/20 py-2 font-body-md text-sm text-[#1b1c19]">
                    {point.label}
                  </td>
                  <td className="border-b border-outline-variant/20 py-2 font-body-md text-sm text-[#1b1c19] tabular-nums">
                    {point.total}
                  </td>
                  <td className="border-b border-outline-variant/20 py-2 font-body-md text-sm text-[#1b1c19]/65 tabular-nums">
                    {point.completed}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}
