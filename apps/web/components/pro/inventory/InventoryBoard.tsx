"use client";

import React, { useMemo, useState, useTransition } from 'react';
import Image from 'next/image';
import {
  Search,
  Plus,
  Pencil,
  Archive,
  Package,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { ProductFormModal } from './ProductFormModal';
import { styleLabel } from '@/lib/pro/styles';
import {
  PRODUCT_CATEGORIES,
  categoryLabel,
  formatDimensions,
  formatPkr,
  type BusinessProduct,
  type ProductActionResult,
  type ProductInput,
} from '@/lib/pro/inventory-types';

type CategoryFilter = 'all' | BusinessProduct['category'];

interface InventoryBoardProps {
  products: BusinessProduct[];
  createAction: (input: ProductInput) => Promise<ProductActionResult>;
  updateAction: (id: string, input: ProductInput) => Promise<ProductActionResult>;
  stockAction: (id: string, inStock: boolean) => Promise<{ ok: boolean; error?: string }>;
  archiveAction: (id: string) => Promise<{ ok: boolean; error?: string }>;
}

export function InventoryBoard({
  products,
  createAction,
  updateAction,
  stockAction,
  archiveAction,
}: InventoryBoardProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<BusinessProduct | null>(null);
  const [archiving, setArchiving] = useState<BusinessProduct | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const counts = useMemo<Record<string, number>>(() => {
    const byCategory = products.reduce<Record<string, number>>((acc, p) => {
      acc[p.category] = (acc[p.category] ?? 0) + 1;
      return acc;
    }, {});
    return { all: products.length, ...byCategory };
  }, [products]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesQuery =
        q === '' ||
        p.name.toLowerCase().includes(q) ||
        categoryLabel(p.category).toLowerCase().includes(q) ||
        (p.material ?? '').toLowerCase().includes(q) ||
        p.styleTags.some((t) => styleLabel(t).toLowerCase().includes(q));
      const matchesCategory = category === 'all' || p.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [products, query, category]);

  const handleStockToggle = (product: BusinessProduct) => {
    setNotice(null);
    startTransition(async () => {
      const result = await stockAction(product.id, !product.inStock);
      if (!result.ok) setNotice(result.error ?? 'Could not update stock status.');
    });
  };

  const handleArchive = () => {
    if (!archiving) return;
    const target = archiving;
    setArchiving(null);
    setNotice(null);
    startTransition(async () => {
      const result = await archiveAction(target.id);
      if (!result.ok) setNotice(result.error ?? 'Could not archive that product.');
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Controls */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-[24rem]">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-secondary" />
          </div>
          <label htmlFor="inventory-search" className="sr-only">
            Search products
          </label>
          <input
            id="inventory-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Product name, category, material or style"
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
          Add New Product
        </button>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Filter by category">
        {[{ id: 'all' as const, label: 'All' }, ...PRODUCT_CATEGORIES].map(({ id, label }) => {
          const active = category === id;
          const count = counts[id] ?? 0;
          return (
            <button
              key={id}
              role="tab"
              aria-selected={active}
              onClick={() => setCategory(id as CategoryFilter)}
              className={`min-h-[36px] rounded-full border px-4 py-1.5 font-body text-xs whitespace-nowrap transition-colors duration-200 ${
                active
                  ? 'border-[#1b1c19] bg-[#1b1c19] text-[#fbf9f4]'
                  : 'border-[#c4c7c7] bg-[#fbf9f4] text-[#1b1c19]/70 hover:border-[#1b1c19] hover:text-[#1b1c19]'
              }`}
            >
              {label}
              <span className={active ? 'ml-2 opacity-70' : 'ml-2 opacity-55'}>{count}</span>
            </button>
          );
        })}
      </div>

      {notice && (
        <p role="alert" className="flex items-start gap-2 font-body text-sm text-[#9d3f30]">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {notice}
        </p>
      )}

      {/* Catalogue */}
      {visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[#c4c7c7] bg-[#f4f0ea] px-6 py-20 text-center">
          <Package className="h-6 w-6 text-[#1b1c19]/40" />
          <p className="font-serif text-lg text-[#1b1c19]">
            {products.length === 0 ? 'No products yet' : 'Nothing matches that filter'}
          </p>
          <p className="max-w-[28rem] font-body text-sm leading-relaxed text-[#1b1c19]/60">
            {products.length === 0
              ? 'Add your stock so Kanso can specify your products inside the concepts customers approve.'
              : 'Try a different category, or clear the search.'}
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((product) => (
            <li
              key={product.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-[#c4c7c7] bg-[#fbf9f4]"
            >
              <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-[#f4f0ea]">
                {product.imagePaths[0] ? (
                  product.imagePaths[0].startsWith('data:') ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.imagePaths[0]}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Image
                      src={product.imagePaths[0]}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover"
                    />
                  )
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Package className="h-6 w-6 text-[#1b1c19]/25" />
                  </div>
                )}

                {!product.inStock && (
                  <span className="absolute top-3 left-3 rounded bg-[#1b1c19]/80 px-2 py-1 font-body text-[10px] tracking-[0.12em] text-[#fbf9f4] uppercase">
                    Out of Stock
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-4 p-5">
                <div>
                  <span className="font-body text-[10px] tracking-[0.14em] text-[#1b1c19]/45 uppercase">
                    {categoryLabel(product.category)}
                  </span>
                  <h3 className="mt-1.5 font-serif text-lg leading-snug text-[#1b1c19]">
                    {product.name}
                  </h3>
                  <p className="mt-2 font-serif text-base text-[#1b1c19] tabular-nums">
                    {formatPkr(product.priceMinor)}
                  </p>
                  {(product.material || formatDimensions(product.dimensions)) && (
                    <p className="mt-1.5 font-body text-xs text-[#1b1c19]/55">
                      {[product.material, formatDimensions(product.dimensions)]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  )}
                </div>

                {product.styleTags.length > 0 && (
                  <ul className="flex flex-wrap gap-1.5">
                    {product.styleTags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded border border-[#c4c7c7] bg-[#f4f0ea] px-2 py-0.5 font-body text-[10px] tracking-[0.08em] text-[#1b1c19]/70 uppercase"
                      >
                        {styleLabel(tag)}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#c4c7c7] pt-4">
                  {/* Stock switch */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={product.inStock}
                    aria-label={`${product.name} in stock`}
                    disabled={pending}
                    onClick={() => handleStockToggle(product)}
                    className="flex items-center gap-2.5 disabled:opacity-60"
                  >
                    <span
                      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-300 ${
                        product.inStock ? 'bg-[#1b1c19]' : 'bg-[#c4c7c7]'
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-[#fbf9f4] transition-transform duration-300 ${
                          product.inStock ? 'translate-x-[1.15rem]' : 'translate-x-[0.15rem]'
                        }`}
                      />
                    </span>
                    <span className="font-body text-xs whitespace-nowrap text-[#1b1c19]/70">
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </button>

                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      aria-label={`Edit ${product.name}`}
                      onClick={() => {
                        setEditing(product);
                        setFormOpen(true);
                      }}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#c4c7c7] text-[#1b1c19] transition-colors hover:bg-[#f4f0ea]"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Archive ${product.name}`}
                      onClick={() => setArchiving(product)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#c4c7c7] text-[#1b1c19] transition-colors hover:border-[#9d3f30] hover:text-[#9d3f30]"
                    >
                      <Archive className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {formOpen && (
        <ProductFormModal
          key={editing?.id ?? 'new-product'}
          product={editing}
          onClose={() => {
            setFormOpen(false);
            setEditing(null);
          }}
          onSubmit={(input) => (editing ? updateAction(editing.id, input) : createAction(input))}
        />
      )}

      {/* Archive confirmation */}
      {archiving && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Cancel"
            onClick={() => setArchiving(null)}
            className="absolute inset-0 h-full w-full cursor-default bg-[#1b1c19]/50 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="archive-title"
            className="relative w-full max-w-[26rem] rounded-2xl border border-[#c4c7c7] bg-[#fbf9f4] p-6 shadow-2xl sm:p-8"
          >
            <h2 id="archive-title" className="font-serif text-xl leading-tight text-[#1b1c19]">
              Archive &ldquo;{archiving.name}&rdquo;?
            </h2>
            <p className="mt-3 font-body text-sm leading-relaxed text-[#1b1c19]/65">
              It will stop appearing in your catalogue and stop being matched to
              new designs. Concepts that already specify it keep their reference,
              which is why this archives rather than deletes.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setArchiving(null)}
                className="min-h-[44px] rounded-2xl border border-[#c4c7c7] px-6 py-3 font-body text-sm font-medium text-[#1b1c19] transition-colors hover:bg-[#f4f0ea]"
              >
                Keep It
              </button>
              <button
                type="button"
                onClick={handleArchive}
                disabled={pending}
                className="flex min-h-[44px] items-center justify-center gap-2 rounded-2xl bg-[#1b1c19] px-6 py-3 font-body text-sm font-medium text-[#fbf9f4] transition-colors hover:bg-black disabled:cursor-wait disabled:opacity-80"
              >
                {pending && <Loader2 className="h-4 w-4 shrink-0 animate-spin" />}
                Archive Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
