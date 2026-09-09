import React from 'react';
import { Store, Tag } from 'lucide-react';

export interface VendorProduct {
  id: string;
  name: string;
  category: string;
  /** Whole rupees. The backend converts from integer paisa. */
  price_pkr: number;
  material: string | null;
  color_hex: string | null;
  vendor_name: string | null;
  vendor_city: string | null;
}

interface VendorProductListProps {
  products: VendorProduct[];
}

/** 45000 -> "PKR 45,000". PKR is the only currency in this product. */
function formatPkr(rupees: number): string {
  return `PKR ${rupees.toLocaleString('en-US')}`;
}

/**
 * The pieces specified in the concept, and who sells them.
 *
 * This is the point of the render: every item shown was picked from the
 * catalogue of a verified, paying local vendor, so the concept doubles as a
 * shopping list the customer can act on.
 */
export function VendorProductList({ products }: VendorProductListProps) {
  if (products.length === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_4px_24px_rgba(0,0,0,0.04)] border border-outline-variant mb-8">
        <h3 className="text-label-sm font-label-sm text-secondary mb-2 uppercase tracking-widest">
          Shop This Concept
        </h3>
        <p className="text-body-md font-body-md text-secondary">
          No local vendor stock was matched to this concept yet. A consultation will pair you with a
          verified partner in your city.
        </p>
      </div>
    );
  }

  const total = products.reduce((sum, product) => sum + product.price_pkr, 0);

  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_4px_24px_rgba(0,0,0,0.04)] border border-outline-variant mb-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-5">
        <h3 className="text-label-sm font-label-sm text-secondary uppercase tracking-widest">
          Shop This Concept
        </h3>
        <p className="text-label-sm font-label-sm text-primary tabular-nums">
          {products.length} {products.length === 1 ? 'piece' : 'pieces'} &middot; {formatPkr(total)}
        </p>
      </div>

      <ul className="flex flex-col divide-y divide-outline-variant/60">
        {products.map((product) => (
          <li key={product.id} className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
            <div className="flex items-start gap-3 min-w-0">
              <span
                className="w-8 h-8 rounded-full border border-outline-variant shadow-sm shrink-0 mt-0.5"
                style={{ backgroundColor: product.color_hex ?? 'transparent' }}
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="text-body-lg font-body-lg text-primary truncate">{product.name}</p>
                <p className="text-label-sm font-label-sm text-secondary flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                  <span className="inline-flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    <span className="capitalize">{product.category.replace(/_/g, ' ')}</span>
                    {product.material ? ` / ${product.material}` : ''}
                  </span>
                  {product.vendor_name && (
                    <span className="inline-flex items-center gap-1.5">
                      <Store className="w-3.5 h-3.5" />
                      {product.vendor_name}
                      {product.vendor_city ? `, ${product.vendor_city}` : ''}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <p className="text-body-lg font-body-lg text-primary whitespace-nowrap tabular-nums">
              {formatPkr(product.price_pkr)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
