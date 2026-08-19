export default function kansopremiumaiinteriordesignPage() {
  return (
    <>
      
{/* TopNavBar */}
<nav className="bg-surface border-b border-outline-variant w-full sticky top-0 z-50">
<div className="flex justify-between items-center h-20 px-lg max-w-container-max-marketing mx-auto w-full">
<a className="font-display-xl text-headline-md tracking-tighter text-primary" href="#">Kanso</a>
<div className="hidden md:flex gap-lg items-center">
<a className="text-secondary font-body-md text-body-md hover:text-primary transition-colors duration-300" href="#how-it-works">How It Works</a>
<a className="text-secondary font-body-md text-body-md hover:text-primary transition-colors duration-300" href="#explore">Explore</a>
</div>
<button className="bg-primary text-on-primary font-body-md text-body-md px-lg py-sm rounded-lg hover:opacity-80 transition-opacity">Design My Room</button>
</div>
</nav>
<main className="flex-grow">
{/* Hero Section */}
<section className="max-w-container-max-marketing mx-auto px-margin-mobile md:px-lg py-xxl flex flex-col items-center text-center gap-lg">
<div className="max-w-3xl flex flex-col gap-md">
<h1 className="font-display-xl text-display-xl text-primary leading-tight">See what your room could look like — before you spend a dollar.</h1>
<p className="font-body-lg text-body-lg text-secondary">Upload photos of your room, choose a style, and explore realistic interior concepts designed around your space.</p>
</div>
<div className="w-full mt-xl rounded-xl overflow-hidden shadow-sm border border-outline-variant">
<img alt="Hero Room Design" className="w-full h-auto max-h-[70vh] object-cover" data-alt="A highly realistic, wide-angle interior photograph of a beautifully designed living room in a Japandi style. Soft natural light floods the space, highlighting natural textures, light wood accents, and minimalist, high-quality furniture. The room feels serene, expansive, and professionally styled with warm neutral tones." src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=85"/>
</div>
</section>
{/* Before/After Interactive Section */}
<section className="max-w-container-max-app mx-auto px-margin-mobile md:px-lg py-xxl flex flex-col items-center gap-lg">
<h2 className="font-headline-lg text-headline-lg text-primary mb-md">Experience the Transformation</h2>
<div className="w-full relative h-[60vh] rounded-xl overflow-hidden border border-outline-variant shadow-sm slider-container" id="before-after-slider">
{/* After Image (Background) */}
<img alt="After Design" className="w-full h-full object-cover object-center absolute inset-0 z-10" data-alt="A highly realistic, wide-angle interior photograph of a beautifully designed living room in a Japandi style. Soft natural light floods the space, highlighting natural textures, light wood accents, and minimalist, high-quality furniture. The room feels serene, expansive, and professionally styled with warm neutral tones." src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85"/>
{/* Before Image (Overlay) */}
<div className="slider-image-before" id="slider-before">
<img alt="Before Design" className="w-full h-full object-cover object-center" src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85"/>
</div>
{/* Slider Handle */}
<div className="slider-handle" id="slider-handle"></div>
</div>
</section>
{/* How It Works (Editorial Style) */}
<section className="bg-surface-container-low py-xxl" id="how-it-works">
<div className="max-w-container-max-marketing mx-auto px-margin-mobile md:px-lg">
<div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
<div className="flex flex-col gap-sm">
<span className="font-display-xl text-headline-lg text-tertiary-fixed-dim">01</span>
<h3 className="font-headline-md text-headline-md text-primary">Capture Your Space</h3>
<p className="font-body-md text-body-md text-secondary mt-2">Take a few clear photos of your empty or current room. The better the lighting, the more precise the concept.</p>
</div>
<div className="flex flex-col gap-sm">
<span className="font-display-xl text-headline-lg text-tertiary-fixed-dim">02</span>
<h3 className="font-headline-md text-headline-md text-primary">Choose Your Style</h3>
<p className="font-body-md text-body-md text-secondary mt-2">Select from our curated list of professional design aesthetics, from Warm Neutral to Industrial.</p>
</div>
<div className="flex flex-col gap-sm">
<span className="font-display-xl text-headline-lg text-tertiary-fixed-dim">03</span>
<h3 className="font-headline-md text-headline-md text-primary">Explore Your New Room</h3>
<p className="font-body-md text-body-md text-secondary mt-2">Instantly receive photorealistic renderings of your space transformed, ready to inspire your project.</p>
</div>
</div>
</div>
</section>
{/* Style Showcase */}
<section className="max-w-container-max-marketing mx-auto px-margin-mobile md:px-lg py-xxl flex flex-col gap-xl" id="explore">
<div className="flex justify-between items-end mb-lg">
<h2 className="font-headline-lg text-headline-lg text-primary">Curated Aesthetics</h2>
<a className="text-secondary font-body-md hover:text-primary transition-colors hidden md:block" href="#">View all styles →</a>
</div>
<div className="grid grid-cols-2 md:grid-cols-4 gap-md">
{/* Style Card 1 */}
<div className="group relative rounded-xl overflow-hidden aspect-[4/5] cursor-pointer border border-outline-variant">
<div className="bg-cover bg-center w-full h-full transition-transform duration-700 group-hover:scale-105" data-alt="A modern interior living space, minimalist furniture, sleek lines, monochromatic palette with subtle warm accents, high-end architectural styling, bright natural light." style={{ backgroundImage: "url('https" }}></div>
<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
<div className="absolute bottom-md left-md">
<span className="text-on-primary font-headline-md text-headline-md">Modern</span>
</div>
</div>
{/* Style Card 2 */}
<div className="group relative rounded-xl overflow-hidden aspect-[4/5] cursor-pointer border border-outline-variant">
<div className="bg-cover bg-center w-full h-full transition-transform duration-700 group-hover:scale-105" data-alt="A minimal interior room, extremely clean aesthetic, negative space, sparse but highly intentional furniture placement, stark white walls, soft diffuse lighting." style={{ backgroundImage: "url('https" }}></div>
<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
<div className="absolute bottom-md left-md">
<span className="text-on-primary font-headline-md text-headline-md">Minimal</span>
</div>
</div>
{/* Style Card 3 */}
<div className="group relative rounded-xl overflow-hidden aspect-[4/5] cursor-pointer border border-outline-variant">
<div className="bg-cover bg-center w-full h-full transition-transform duration-700 group-hover:scale-105" data-alt="A Scandinavian style living room, light ash wood furniture, cozy textiles, white and pale grey palette, functional and simple design, natural light." style={{ backgroundImage: "url('https" }}></div>
<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
<div className="absolute bottom-md left-md">
<span className="text-on-primary font-headline-md text-headline-md">Scandinavian</span>
</div>
</div>
{/* Style Card 4 */}
<div className="group relative rounded-xl overflow-hidden aspect-[4/5] cursor-pointer border border-outline-variant">
<div className="bg-cover bg-center w-full h-full transition-transform duration-700 group-hover:scale-105" data-alt="A sophisticated living area dominated by varying shades of grey, elegant soft furnishings, matte finishes, dramatic and moody lighting, contemporary feel." style={{ backgroundImage: "url('https" }}></div>
<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
<div className="absolute bottom-md left-md">
<span className="text-on-primary font-headline-md text-headline-md">Grey</span>
</div>
</div>
{/* Style Card 5 */}
<div className="group relative rounded-xl overflow-hidden aspect-[4/5] cursor-pointer border border-outline-variant">
<div className="bg-cover bg-center w-full h-full transition-transform duration-700 group-hover:scale-105" data-alt="A warm neutral living space, beige and cream tones, textured fabrics like boucle and linen, organic shapes, inviting and calm atmosphere, soft golden hour light." style={{ backgroundImage: "url('https" }}></div>
<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
<div className="absolute bottom-md left-md">
<span className="text-on-primary font-headline-md text-headline-md">Warm Neutral</span>
</div>
</div>
{/* Style Card 6 */}
<div className="group relative rounded-xl overflow-hidden aspect-[4/5] cursor-pointer border border-outline-variant">
<div className="bg-cover bg-center w-full h-full transition-transform duration-700 group-hover:scale-105" data-alt="An industrial loft interior, exposed brick walls, steel framed windows, dark leather sofa, raw materials, concrete floor, dramatic architectural lighting." style={{ backgroundImage: "url('https" }}></div>
<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
<div className="absolute bottom-md left-md">
<span className="text-on-primary font-headline-md text-headline-md">Industrial</span>
</div>
</div>
{/* Style Card 7 */}
<div className="group relative rounded-xl overflow-hidden aspect-[4/5] cursor-pointer border border-outline-variant">
<div className="bg-cover bg-center w-full h-full transition-transform duration-700 group-hover:scale-105" data-alt="A luxury interior space, high-end materials like marble and velvet, metallic accents in brass or gold, rich deep colors, opulent and refined aesthetic, perfect studio lighting." style={{ backgroundImage: "url('https" }}></div>
<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
<div className="absolute bottom-md left-md">
<span className="text-on-primary font-headline-md text-headline-md">Luxury</span>
</div>
</div>
{/* Style Card 8 */}
<div className="group relative rounded-xl overflow-hidden aspect-[4/5] cursor-pointer border border-outline-variant">
<div className="bg-cover bg-center w-full h-full transition-transform duration-700 group-hover:scale-105" data-alt="A Japandi style room, blending Japanese minimalism with Scandinavian functionality. Wabi-sabi elements, low furniture, natural fibers, bamboo, tranquil and serene mood." style={{ backgroundImage: "url('https" }}></div>
<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
<div className="absolute bottom-md left-md">
<span className="text-on-primary font-headline-md text-headline-md">Japandi</span>
</div>
</div>
</div>
</section>
</main>
{/* Footer */}
<footer className="bg-surface-container-lowest border-t border-outline-variant full-width py-xl mt-xxl">
<div className="max-w-container-max-marketing mx-auto px-lg flex flex-col md:flex-row justify-between items-center gap-md">
<div className="flex flex-col items-center md:items-start gap-sm">
<img alt="Kanso Logo" className="h-8 w-auto" src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=85"/>
<span className="text-secondary font-label-sm mt-2">© 2024 Kanso AI. All rights reserved.</span>
</div>
<div className="flex gap-lg">
<a className="text-secondary font-body-md hover:text-primary transition-colors" href="#">Privacy Policy</a>
<a className="text-secondary font-body-md hover:text-primary transition-colors" href="#">Terms of Service</a>
<a className="text-secondary font-body-md hover:text-primary transition-colors" href="#">Cookies</a>
</div>
<div className="text-secondary-fixed-dim font-label-sm text-center md:text-right max-w-xs">
                Concepts generated are AI representations and may not reflect exact architectural feasibility.
            </div>
</div>
</footer>
<script dangerouslySetInnerHTML={{ __html: `
        // Simple slider logic
        const sliderContainer = document.getElementById('before-after-slider');
        const sliderHandle = document.getElementById('slider-handle');
        const sliderBefore = document.getElementById('slider-before');
        
        let isDragging = false;

        sliderHandle.addEventListener('mousedown', (e) => {
            isDragging = true;
            sliderContainer.style.cursor = 'ew-resize';
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
            sliderContainer.style.cursor = 'default';
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const rect = sliderContainer.getBoundingClientRect();
            let x = e.clientX - rect.left;
            
            // Constrain within bounds
            x = Math.max(0, Math.min(x, rect.width));
            
            const percentage = (x / rect.width) * 100;
            
            sliderHandle.style.left = \`\${percentage}%\`;
            sliderBefore.style.width = \`\${percentage}%\`;
        });
        
        // Touch support
        sliderHandle.addEventListener('touchstart', (e) => {
            isDragging = true;
        }, {passive: true});
        
        window.addEventListener('touchend', () => {
            isDragging = false;
        });
        
        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const touch = e.touches[0];
            const rect = sliderContainer.getBoundingClientRect();
            let x = touch.clientX - rect.left;
            x = Math.max(0, Math.min(x, rect.width));
            const percentage = (x / rect.width) * 100;
            sliderHandle.style.left = \`\${percentage}%\`;
            sliderBefore.style.width = \`\${percentage}%\`;
        }, {passive: true});
    ` }} />

    </>
  );
}
