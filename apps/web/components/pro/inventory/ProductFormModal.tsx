"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { X, Upload, Trash2, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { STYLE_TAGS, type StyleTag } from '@/lib/pro/styles';
import {
  PRODUCT_CATEGORIES,
  priceMinorToInput,
  type BusinessProduct,
  type ProductActionResult,
  type ProductCategory,
  type ProductInput,
} from '@/lib/pro/inventory-types';

interface ProductFormModalProps {
  /** Present when editing; absent when creating. */
  product?: BusinessProduct | null;
  onClose: () => void;
  onSubmit: (input: ProductInput) => Promise<ProductActionResult>;
}

const MAX_IMAGES = 4;
const MAX_IMAGE_BYTES = 1_500_000;

const labelClass = 'mb-2 block font-body text-sm font-medium text-[#1b1c19]';
const fieldClass =
  'w-full min-h-[44px] rounded-2xl border border-[#c4c7c7] bg-[#f4f0ea] px-4 py-3 font-body text-sm text-[#1b1c19] outline-none transition-colors placeholder:text-[#1b1c19]/40 focus:border-[#1b1c19] focus:ring-1 focus:ring-[#1b1c19]';
const errorClass = 'mt-2 flex items-start gap-1.5 font-body text-xs text-[#9d3f30]';

function emptyInput(): ProductInput {
  return {
    name: '',
    category: 'furniture',
    description: '',
    pricePkr: '',
    dimensions: { w_mm: '', h_mm: '', d_mm: '' },
    material: '',
    colourHex: '',
    imagePaths: [],
    styleTags: [],
    inStock: true,
  };
}

function fromProduct(product: BusinessProduct): ProductInput {
  return {
    name: product.name,
    category: product.category,
    description: product.description ?? '',
    pricePkr: priceMinorToInput(product.priceMinor),
    dimensions: {
      w_mm: product.dimensions?.w_mm?.toString() ?? '',
      h_mm: product.dimensions?.h_mm?.toString() ?? '',
      d_mm: product.dimensions?.d_mm?.toString() ?? '',
    },
    material: product.material ?? '',
    colourHex: product.colourHex ?? '',
    imagePaths: product.imagePaths,
    styleTags: product.styleTags,
    inStock: product.inStock,
  };
}

/**
 * The parent mounts this only while the form is open and keys it by product,
 * so opening a different product gives a fresh component with the right
 * initial state. That is why there is no effect syncing props into state.
 */
export function ProductFormModal({ product, onClose, onSubmit }: ProductFormModalProps) {
  const [form, setForm] = useState<ProductInput>(() =>
    product ? fromProduct(product) : emptyInput(),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const set = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleTag = (tag: StyleTag) =>
    setForm((prev) => ({
      ...prev,
      styleTags: prev.styleTags.includes(tag)
        ? prev.styleTags.filter((t) => t !== tag)
        : [...prev.styleTags, tag],
    }));

  /**
   * Local-only upload handler: files are read into data URLs and held with the
   * product. Real uploads go to the private `business-products` storage bucket
   * once Supabase is connected.
   */
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadNotice(null);

    const room = MAX_IMAGES - form.imagePaths.length;
    if (room <= 0) {
      setUploadNotice(`Up to ${MAX_IMAGES} images per product.`);
      return;
    }

    const accepted: string[] = [];
    for (const file of Array.from(files).slice(0, room)) {
      if (!file.type.startsWith('image/')) {
        setUploadNotice('Only image files can be attached.');
        continue;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        setUploadNotice(`"${file.name}" is over 1.5 MB and was skipped.`);
        continue;
      }
      accepted.push(
        await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.readAsDataURL(file);
        }),
      );
    }

    if (accepted.length > 0) {
      set('imagePaths', [...form.imagePaths, ...accepted]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrors({});

    const result = await onSubmit(form);
    if (result.ok) {
      setIsSaving(false);
      onClose();
      return;
    }

    setErrors(result.errors as Record<string, string>);
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto p-4 py-8">
      <button
        type="button"
        aria-label="Close product form"
        onClick={onClose}
        className="fixed inset-0 h-full w-full cursor-default bg-[#1b1c19]/50 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-form-title"
        className="relative w-full max-w-[42rem] rounded-2xl border border-[#c4c7c7] bg-[#fbf9f4] shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#c4c7c7] p-6 sm:p-8">
          <div>
            <span className="font-body text-[10px] tracking-[0.18em] text-[#1b1c19]/45 uppercase">
              {product ? 'Edit Product' : 'New Product'}
            </span>
            <h2 id="product-form-title" className="mt-3 font-serif text-2xl leading-tight text-[#1b1c19]">
              {product ? product.name : 'Add a product to your catalogue'}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#c4c7c7] text-[#1b1c19] transition-colors hover:bg-[#f4f0ea]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6 sm:p-8">
          {errors.form && (
            <p role="alert" className={errorClass}>
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {errors.form}
            </p>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="p-name" className={labelClass}>
                Product name <span className="text-[#1b1c19]/45">(required)</span>
              </label>
              <input
                id="p-name"
                className={fieldClass}
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="Fluted Oak Sideboard"
                required
              />
              {errors.name && (
                <p className={errorClass}>
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="p-category" className={labelClass}>
                Category
              </label>
              <select
                id="p-category"
                className={`${fieldClass} cursor-pointer`}
                value={form.category}
                onChange={(e) => set('category', e.target.value as ProductCategory)}
              >
                {PRODUCT_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="p-price" className={labelClass}>
                Price (PKR)
              </label>
              <input
                id="p-price"
                inputMode="decimal"
                className={fieldClass}
                value={form.pricePkr}
                onChange={(e) => set('pricePkr', e.target.value)}
                placeholder="85000"
              />
              {errors.pricePkr && (
                <p className={errorClass}>
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {errors.pricePkr}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="p-description" className={labelClass}>
                Description
              </label>
              <textarea
                id="p-description"
                rows={3}
                className={`${fieldClass} resize-none`}
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Materials, finish, lead time, anything a specifier needs to know."
              />
            </div>
          </div>

          {/* Dimensions -> the `dimensions` jsonb column */}
          <fieldset>
            <legend className={labelClass}>Dimensions (mm)</legend>
            <div className="grid grid-cols-3 gap-3">
              {(['w_mm', 'h_mm', 'd_mm'] as const).map((key) => (
                <div key={key}>
                  <label
                    htmlFor={`p-${key}`}
                    className="mb-1.5 block font-body text-[10px] tracking-[0.14em] text-[#1b1c19]/45 uppercase"
                  >
                    {key === 'w_mm' ? 'Width' : key === 'h_mm' ? 'Height' : 'Depth'}
                  </label>
                  <input
                    id={`p-${key}`}
                    inputMode="numeric"
                    className={fieldClass}
                    value={form.dimensions[key]}
                    onChange={(e) =>
                      set('dimensions', { ...form.dimensions, [key]: e.target.value })
                    }
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
            {errors.dimensions && (
              <p className={errorClass}>
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {errors.dimensions}
              </p>
            )}
          </fieldset>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="p-material" className={labelClass}>
                Material
              </label>
              <input
                id="p-material"
                className={fieldClass}
                value={form.material}
                onChange={(e) => set('material', e.target.value)}
                placeholder="White Oak"
              />
            </div>

            <div>
              <label htmlFor="p-colour" className={labelClass}>
                Primary colour
              </label>
              <div className="flex gap-3">
                <input
                  type="color"
                  aria-label="Pick primary colour"
                  className="h-[44px] w-[52px] shrink-0 cursor-pointer rounded-2xl border border-[#c4c7c7] bg-[#f4f0ea] p-1"
                  value={/^#[0-9a-f]{6}$/i.test(form.colourHex) ? form.colourHex : '#c9b79c'}
                  onChange={(e) => set('colourHex', e.target.value)}
                />
                <input
                  id="p-colour"
                  className={`${fieldClass} flex-1 min-w-0 font-mono`}
                  value={form.colourHex}
                  onChange={(e) => set('colourHex', e.target.value)}
                  placeholder="#C9B79C"
                />
              </div>
              {errors.colourHex && (
                <p className={errorClass}>
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {errors.colourHex}
                </p>
              )}
            </div>
          </div>

          {/* Images */}
          <div>
            <span className={labelClass}>Product images</span>
            <div className="flex flex-wrap gap-3">
              {form.imagePaths.map((src, index) => (
                <div
                  key={`${src.slice(0, 24)}-${index}`}
                  className="relative h-24 w-24 overflow-hidden rounded-2xl border border-[#c4c7c7] bg-[#f4f0ea]"
                >
                  {/* Data URLs from a local upload cannot go through next/image. */}
                  {src.startsWith('data:') ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Image src={src} alt="" fill sizes="96px" className="object-cover" />
                  )}
                  <button
                    type="button"
                    aria-label={`Remove image ${index + 1}`}
                    onClick={() =>
                      set(
                        'imagePaths',
                        form.imagePaths.filter((_, i) => i !== index),
                      )
                    }
                    className="absolute top-1 right-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1b1c19]/75 text-[#fbf9f4] transition-colors hover:bg-[#1b1c19]"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}

              {form.imagePaths.length < MAX_IMAGES && (
                <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed border-[#c4c7c7] bg-[#f4f0ea] text-[#1b1c19]/55 transition-colors hover:border-[#1b1c19] hover:text-[#1b1c19]">
                  <Upload className="h-4 w-4" />
                  <span className="font-body text-[10px] tracking-[0.1em] uppercase">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    onChange={(e) => {
                      void handleFiles(e.target.files);
                      e.target.value = '';
                    }}
                  />
                </label>
              )}
            </div>
            <p className="mt-2 font-body text-xs text-[#1b1c19]/45">
              Up to {MAX_IMAGES} images, 1.5 MB each. Stored locally until the
              product storage bucket is connected.
            </p>
            {uploadNotice && (
              <p className={errorClass}>
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {uploadNotice}
              </p>
            )}
          </div>

          {/* Style tags — the AI retrieval key */}
          <fieldset className="rounded-2xl border border-[#c4c7c7] bg-[#f4f0ea] p-5">
            <legend className="flex items-center gap-2 px-2">
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#1b1c19]" />
              <span className="font-body text-sm font-medium text-[#1b1c19]">Style tags</span>
            </legend>
            <p className="mb-4 font-body text-xs leading-relaxed text-[#1b1c19]/65">
              Tagging styles helps Kanso AI prioritize your product in matching
              customer room designs.
            </p>
            <div className="flex flex-wrap gap-2">
              {STYLE_TAGS.map(({ id, label }) => {
                const active = form.styleTags.includes(id);
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleTag(id)}
                    className={`min-h-[36px] rounded-full border px-4 py-1.5 font-body text-xs transition-colors duration-200 ${
                      active
                        ? 'border-[#1b1c19] bg-[#1b1c19] text-[#fbf9f4]'
                        : 'border-[#c4c7c7] bg-[#fbf9f4] text-[#1b1c19]/70 hover:border-[#1b1c19] hover:text-[#1b1c19]'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            {errors.styleTags && (
              <p className={errorClass}>
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {errors.styleTags}
              </p>
            )}
          </fieldset>

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={form.inStock}
              onChange={(e) => set('inStock', e.target.checked)}
              className="h-4 w-4 shrink-0 rounded-sm border-[#c4c7c7] accent-[#1b1c19]"
            />
            <span className="font-body text-sm text-[#1b1c19]">Currently in stock</span>
          </label>

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
              disabled={isSaving}
              className="flex min-h-[44px] items-center justify-center gap-2 rounded-2xl bg-[#1b1c19] px-6 py-3 font-body text-sm font-medium text-[#fbf9f4] transition-colors hover:bg-black disabled:cursor-wait disabled:opacity-80"
            >
              {isSaving && <Loader2 className="h-4 w-4 shrink-0 animate-spin" />}
              {isSaving ? 'Saving' : product ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
