import React from 'react';
import type { Metadata } from 'next';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { ProSidebar } from '@/components/pro/layout/ProSidebar';
import { InventoryBoard } from '@/components/pro/inventory/InventoryBoard';
import {
  createProduct,
  deleteProduct,
  getProducts,
  setProductStock,
  updateProduct,
} from '@/lib/pro/inventory';

export const metadata: Metadata = {
  title: 'Product Inventory — Kanso Partner Portal',
  description:
    'Manage the products Kanso can specify inside customer room designs.',
};

export default async function ProInventoryPage() {
  const products = await getProducts();

  const inStockCount = products.filter((p) => p.inStock).length;
  const taggedCount = products.filter((p) => p.styleTags.length > 0).length;

  return (
    <div className="min-h-screen bg-[#FBF9F4] text-[#1B1C19] font-body-md">
      <SiteHeader position="fixed" />

      <div className="flex pt-16">
        <ProSidebar />

        <main className="flex-1 flex flex-col w-full lg:ml-64 min-h-screen">
          <div className="p-4 md:p-8 lg:p-12 flex-1 flex flex-col max-w-[1400px] mx-auto w-full">
            <header className="mb-8 flex flex-col gap-4 border-b border-[#c4c7c7] pb-8">
              <span className="font-body text-xs tracking-[0.2em] text-[#1b1c19]/45 uppercase">
                Catalogue
              </span>
              <h1 className="font-display-xl text-3xl tracking-tight text-[#1b1c19] md:text-4xl">
                Product Inventory
              </h1>
              <p className="max-w-[46rem] font-body text-sm leading-relaxed text-[#1b1c19]/65 sm:text-base">
                Products you list here are what Kanso AI reaches for when it
                specifies materials and furniture inside a customer&apos;s
                approved concept. Style tags are how it finds them.
              </p>

              <dl className="mt-2 flex flex-wrap gap-x-10 gap-y-3">
                <div className="flex items-baseline gap-2">
                  <dd className="font-serif text-xl text-[#1b1c19] tabular-nums">
                    {products.length}
                  </dd>
                  <dt className="font-body text-xs tracking-[0.1em] text-[#1b1c19]/50 uppercase">
                    Active items
                  </dt>
                </div>
                <div className="flex items-baseline gap-2">
                  <dd className="font-serif text-xl text-[#1b1c19] tabular-nums">
                    {inStockCount}
                  </dd>
                  <dt className="font-body text-xs tracking-[0.1em] text-[#1b1c19]/50 uppercase">
                    In stock
                  </dt>
                </div>
                <div className="flex items-baseline gap-2">
                  <dd className="font-serif text-xl text-[#1b1c19] tabular-nums">
                    {taggedCount}
                  </dd>
                  <dt className="font-body text-xs tracking-[0.1em] text-[#1b1c19]/50 uppercase">
                    Style tagged
                  </dt>
                </div>
              </dl>
            </header>

            <InventoryBoard
              products={products}
              createAction={createProduct}
              updateAction={updateProduct}
              stockAction={setProductStock}
              archiveAction={deleteProduct}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
