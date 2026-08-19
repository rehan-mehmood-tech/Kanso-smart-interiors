export default function chooseyourstylekansoPage() {
  return (
    <>
      
{/* TopAppBar */}
<header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-gutter py-md max-w-container-max-marketing mx-auto bg-background dark:bg-background border-b border-outline-variant dark:border-outline">
<div className="flex items-center gap-md">
<span className="text-headline-md font-headline-md tracking-tighter text-primary dark:text-on-background">Kanso</span>
</div>
<nav className="hidden md:flex gap-lg">
<a className="text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-on-background transition-colors duration-300" href="#">Projects</a>
<a className="text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-on-background transition-colors duration-300" href="#">Portfolio</a>
<a className="text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-on-background transition-colors duration-300" href="#">Materials</a>
</nav>
<div className="flex items-center">
<button className="p-xs text-secondary hover:text-primary transition-colors">
<span className="material-symbols-outlined">account_circle</span>
</button>
</div>
</header>
{/* Main Content Canvas */}
<main className="flex-grow pt-[100px] pb-xxl px-gutter md:px-[128px] max-w-container-max-marketing mx-auto w-full">
{/* Header Section */}
<div className="mb-xl text-center md:text-left mt-lg">
<span className="inline-block text-label-sm font-label-sm text-secondary tracking-widest uppercase mb-sm">Step 3 of 4</span>
<h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-primary mb-sm">Choose Your Style</h1>
<p className="text-body-lg font-body-lg text-secondary">Select the aesthetic that feels most like home.</p>
</div>
{/* Style Selection Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md md:gap-lg mb-xxl">
{/* Modern */}
<label className="cursor-pointer relative group block w-full h-full">
<input className="sr-only custom-radio" name="style_selection" type="radio" value="modern"/>
<div className="border border-outline-variant rounded-xl overflow-hidden bg-surface-container-lowest transition-all duration-300 h-full flex flex-col group-hover:border-outline">
<div className="relative w-full aspect-[4/3] overflow-hidden">
<img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" data-alt="A modern interior living space characterized by clean lines, a monochromatic palette of bone whites and soft grays, punctuated by sleek black metal accents. Natural light pours in through large, unadorned windows, casting soft shadows across a minimalist, low-profile sofa. The mood is sophisticated, uncluttered, and highly deliberate, embodying a premium, high-end editorial architectural style." src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=85"/>
<div className="image-overlay absolute inset-0 bg-transparent transition-colors duration-300"></div>
<div className="overlay-check absolute top-md right-md bg-primary text-on-primary rounded-full p-xs opacity-0 transition-opacity duration-300 flex items-center justify-center">
<span className="material-symbols-outlined text-[16px]">check</span>
</div>
</div>
<div className="p-md flex flex-col flex-grow">
<h3 className="text-headline-md font-headline-md text-primary mb-xs">Modern</h3>
<p className="text-body-md font-body-md text-secondary">Clean lines, neutral palette, and functional elegance.</p>
</div>
</div>
</label>
{/* Minimal */}
<label className="cursor-pointer relative group block w-full h-full">
<input className="sr-only custom-radio" name="style_selection" type="radio" value="minimal"/>
<div className="border border-outline-variant rounded-xl overflow-hidden bg-surface-container-lowest transition-all duration-300 h-full flex flex-col group-hover:border-outline">
<div className="relative w-full aspect-[4/3] overflow-hidden">
<img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" data-alt="An ultra-minimalist interior space featuring vast expanses of white walls and light oak flooring. A single, sculptural wooden chair sits in the center of the room, illuminated by a sharp, dramatic beam of sunlight. The aesthetic relies entirely on negative space, texture, and the interaction of light, evoking a serene, almost gallery-like atmosphere in a pristine light-mode aesthetic." src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=85"/>
<div className="image-overlay absolute inset-0 bg-transparent transition-colors duration-300"></div>
<div className="overlay-check absolute top-md right-md bg-primary text-on-primary rounded-full p-xs opacity-0 transition-opacity duration-300 flex items-center justify-center">
<span className="material-symbols-outlined text-[16px]">check</span>
</div>
</div>
<div className="p-md flex flex-col flex-grow">
<h3 className="text-headline-md font-headline-md text-primary mb-xs">Minimal</h3>
<p className="text-body-md font-body-md text-secondary">Intentional simplicity emphasizing space and light.</p>
</div>
</div>
</label>
{/* Scandinavian */}
<label className="cursor-pointer relative group block w-full h-full">
<input className="sr-only custom-radio" name="style_selection" type="radio" value="scandinavian"/>
<div className="border border-outline-variant rounded-xl overflow-hidden bg-surface-container-lowest transition-all duration-300 h-full flex flex-col group-hover:border-outline">
<div className="relative w-full aspect-[4/3] overflow-hidden">
<img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" data-alt="A bright, inviting Scandinavian living room defined by pale woods, plush white textiles, and subtle touches of muted sage green. Soft, diffused daylight fills the space, highlighting the tactile quality of a knitted throw on a low slung sofa. The overall vibe is cozy (hygge) yet structured, maintaining a crisp, light-mode editorial standard." src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=85"/>
<div className="image-overlay absolute inset-0 bg-transparent transition-colors duration-300"></div>
<div className="overlay-check absolute top-md right-md bg-primary text-on-primary rounded-full p-xs opacity-0 transition-opacity duration-300 flex items-center justify-center">
<span className="material-symbols-outlined text-[16px]">check</span>
</div>
</div>
<div className="p-md flex flex-col flex-grow">
<h3 className="text-headline-md font-headline-md text-primary mb-xs">Scandinavian</h3>
<p className="text-body-md font-body-md text-secondary">Hygge comfort blended with bright, functional design.</p>
</div>
</div>
</label>
{/* Grey */}
<label className="cursor-pointer relative group block w-full h-full">
<input className="sr-only custom-radio" name="style_selection" type="radio" value="grey"/>
<div className="border border-outline-variant rounded-xl overflow-hidden bg-surface-container-lowest transition-all duration-300 h-full flex flex-col group-hover:border-outline">
<div className="relative w-full aspect-[4/3] overflow-hidden">
<img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" data-alt="A sophisticated interior study dominated by varying shades of grey, from soft dove to deep charcoal. The textures are rich: matte plaster walls, a velvet armchair, and brushed steel lighting fixtures. The lighting is moody yet clear, creating an atmosphere of quiet luxury and architectural precision within a modern, refined context." src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85"/>
<div className="image-overlay absolute inset-0 bg-transparent transition-colors duration-300"></div>
<div className="overlay-check absolute top-md right-md bg-primary text-on-primary rounded-full p-xs opacity-0 transition-opacity duration-300 flex items-center justify-center">
<span className="material-symbols-outlined text-[16px]">check</span>
</div>
</div>
<div className="p-md flex flex-col flex-grow">
<h3 className="text-headline-md font-headline-md text-primary mb-xs">Grey</h3>
<p className="text-body-md font-body-md text-secondary">Sophisticated monochromatic layers for a calm atmosphere.</p>
</div>
</div>
</label>
{/* Warm Neutral */}
<label className="cursor-pointer relative group block w-full h-full">
<input className="sr-only custom-radio" name="style_selection" type="radio" value="warm_neutral"/>
<div className="border border-outline-variant rounded-xl overflow-hidden bg-surface-container-lowest transition-all duration-300 h-full flex flex-col group-hover:border-outline">
<div className="relative w-full aspect-[4/3] overflow-hidden">
<img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" data-alt="An inviting, sun-drenched bedroom interior awash in warm neutral tones: beige, camel, soft terracotta, and cream. Organic materials like linen bedding, a jute rug, and unglazed ceramics add tactile warmth. The light is golden and soft, emphasizing an aesthetic of approachable, grounded, high-end comfort." src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=85"/>
<div className="image-overlay absolute inset-0 bg-transparent transition-colors duration-300"></div>
<div className="overlay-check absolute top-md right-md bg-primary text-on-primary rounded-full p-xs opacity-0 transition-opacity duration-300 flex items-center justify-center">
<span className="material-symbols-outlined text-[16px]">check</span>
</div>
</div>
<div className="p-md flex flex-col flex-grow">
<h3 className="text-headline-md font-headline-md text-primary mb-xs">Warm Neutral</h3>
<p className="text-body-md font-body-md text-secondary">Earthy, inviting tones providing grounded tranquility.</p>
</div>
</div>
</label>
{/* Industrial */}
<label className="cursor-pointer relative group block w-full h-full">
<input className="sr-only custom-radio" name="style_selection" type="radio" value="industrial"/>
<div className="border border-outline-variant rounded-xl overflow-hidden bg-surface-container-lowest transition-all duration-300 h-full flex flex-col group-hover:border-outline">
<div className="relative w-full aspect-[4/3] overflow-hidden">
<img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" data-alt="A refined industrial loft interior showcasing exposed brick walls painted white, polished concrete floors, and matte black steel architectural elements. Large, steel-framed factory windows allow bright, natural light to flood the space, softening the raw materials. The furniture is a mix of rich brown leather and raw timber, maintaining a premium, curated aesthetic." src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85"/>
<div className="image-overlay absolute inset-0 bg-transparent transition-colors duration-300"></div>
<div className="overlay-check absolute top-md right-md bg-primary text-on-primary rounded-full p-xs opacity-0 transition-opacity duration-300 flex items-center justify-center">
<span className="material-symbols-outlined text-[16px]">check</span>
</div>
</div>
<div className="p-md flex flex-col flex-grow">
<h3 className="text-headline-md font-headline-md text-primary mb-xs">Industrial</h3>
<p className="text-body-md font-body-md text-secondary">Raw materials, exposed elements, and urban edge.</p>
</div>
</div>
</label>
{/* Luxury */}
<label className="cursor-pointer relative group block w-full h-full">
<input className="sr-only custom-radio" name="style_selection" type="radio" value="luxury"/>
<div className="border border-outline-variant rounded-xl overflow-hidden bg-surface-container-lowest transition-all duration-300 h-full flex flex-col group-hover:border-outline">
<div className="relative w-full aspect-[4/3] overflow-hidden">
<img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" data-alt="A high-end, luxury dining room featuring a sculptural marble dining table, bespoke brass lighting fixtures, and deeply textured silk drapery. The color palette is restrained—principally crisp white and deep charcoal, with metallic gold accents catching the light. The composition is flawlessly balanced, exuding exclusivity and timeless architectural editorial quality." src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85"/>
<div className="image-overlay absolute inset-0 bg-transparent transition-colors duration-300"></div>
<div className="overlay-check absolute top-md right-md bg-primary text-on-primary rounded-full p-xs opacity-0 transition-opacity duration-300 flex items-center justify-center">
<span className="material-symbols-outlined text-[16px]">check</span>
</div>
</div>
<div className="p-md flex flex-col flex-grow">
<h3 className="text-headline-md font-headline-md text-primary mb-xs">Luxury</h3>
<p className="text-body-md font-body-md text-secondary">Premium materials, bespoke finishes, and refined details.</p>
</div>
</div>
</label>
{/* Japandi */}
<label className="cursor-pointer relative group block w-full h-full">
<input className="sr-only custom-radio" name="style_selection" type="radio" value="japandi"/>
<div className="border border-outline-variant rounded-xl overflow-hidden bg-surface-container-lowest transition-all duration-300 h-full flex flex-col group-hover:border-outline">
<div className="relative w-full aspect-[4/3] overflow-hidden">
<img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" data-alt="A serene Japandi style interior blending Scandinavian warmth with Japanese wabi-sabi minimalism. The space features low-profile, crafted timber furniture against textured, pale plaster walls. A carefully placed branch in a ceramic vase provides an organic focal point. The lighting is diffused and ethereal, reinforcing a mood of calm, intentional living in a light-mode editorial context." src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85"/>
<div className="image-overlay absolute inset-0 bg-transparent transition-colors duration-300"></div>
<div className="overlay-check absolute top-md right-md bg-primary text-on-primary rounded-full p-xs opacity-0 transition-opacity duration-300 flex items-center justify-center">
<span className="material-symbols-outlined text-[16px]">check</span>
</div>
</div>
<div className="p-md flex flex-col flex-grow">
<h3 className="text-headline-md font-headline-md text-primary mb-xs">Japandi</h3>
<p className="text-body-md font-body-md text-secondary">Wabi-sabi simplicity meets Nordic warmth.</p>
</div>
</div>
</label>
</div>
{/* Sticky Bottom CTA Area */}
<div className="fixed bottom-0 left-0 w-full bg-background border-t border-outline-variant p-md z-40">
<div className="max-w-container-max-marketing mx-auto flex justify-between items-center px-gutter md:px-[128px]">
<button className="text-body-md font-body-md text-secondary hover:text-primary transition-colors py-sm px-md rounded-lg border border-transparent hover:border-outline-variant">
                    Back
                </button>
<button className="bg-primary text-on-primary text-body-md font-body-md py-sm px-xl rounded-lg hover:opacity-90 transition-opacity">
                    Continue
                </button>
</div>
</div>
</main>

    </>
  );
}
