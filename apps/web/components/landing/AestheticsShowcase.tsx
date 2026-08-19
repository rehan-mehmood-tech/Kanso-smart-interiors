import React from "react";

const AESTHETICS = [
  {
    name: "Japandi",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Warm Minimalist",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Quiet Luxury",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Modern Organic",
    image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=800&q=80",
  }
];

export function AestheticsShowcase() {
  return (
    <section className="w-full py-20 lg:py-28 bg-[#fbf9f4]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-tight text-[#1b1c19] mb-4 text-center">
            Signature Styles
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {AESTHETICS.map((style, index) => (
            <div 
              key={index}
              className="flex flex-col bg-[#f4f0ea] rounded-2xl overflow-hidden border border-[#c4c7c7]"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#c4c7c7]">
                <img 
                  src={style.image} 
                  alt={style.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="p-4 flex items-center justify-center bg-[#fbf9f4] border-t border-[#c4c7c7]">
                <span className="font-body text-sm font-medium text-[#1b1c19] tracking-wide">
                  {style.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

