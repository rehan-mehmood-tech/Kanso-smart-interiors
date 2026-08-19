import React from "react";

const AESTHETICS = [
  {
    name: "Japandi",
    description: "A harmonious fusion of Scandinavian functionality and Japanese rustic minimalism.",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80",
    palette: ["#D4CFC7", "#8C8276", "#2D2A26"]
  },
  {
    name: "Warm Minimalist",
    description: "Clean lines and uncluttered spaces warmed by natural textures and soft tones.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
    palette: ["#FBF9F4", "#EAE8E3", "#9D9589"]
  },
  {
    name: "Quiet Luxury",
    description: "Understated elegance featuring high-quality bespoke materials and muted palettes.",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",
    palette: ["#4A4A4A", "#E6E2DA", "#1B1C19"]
  },
  {
    name: "Modern Organic",
    description: "Bringing the outdoors in with flowing organic shapes and raw, natural elements.",
    image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=800&q=80",
    palette: ["#B8A792", "#7A8B76", "#3E362E"]
  }
];

export function CuratedAestheticsSection() {
  return (
    <section className="w-full py-20 sm:py-24 bg-[#fbf9f4]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-serif text-[#1b1c19]">
            Curated Kanso Aesthetics
          </h2>
          <p className="mt-4 text-stone-600 text-sm sm:text-base leading-relaxed">
            Explore our signature spatial styles backed by a locked database of locally-sourcable materials.
          </p>
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
              <div className="p-5 flex flex-col items-start bg-[#fbf9f4] border-t border-[#c4c7c7]">
                <h3 className="text-lg font-medium text-[#1b1c19] mb-2">{style.name}</h3>
                <p className="text-sm text-stone-600 leading-relaxed mb-4">{style.description}</p>
                <div className="flex gap-2">
                  {style.palette.map((color, idx) => (
                    <div 
                      key={idx}
                      className="w-6 h-6 rounded-full border border-stone-200"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

