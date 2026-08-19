import Image from 'next/image';

export default function yournewspacekansorefinedPage() {
  return (
    <>
      
{/* TopAppBar */}
<nav className="bg-background dark:bg-background border-b border-outline-variant dark:border-outline fixed top-0 left-0 w-full z-50 flex justify-between items-center px-gutter py-md max-w-container-max-marketing mx-auto">
<div className="text-headline-md font-headline-md tracking-tighter text-primary dark:text-on-background">
            Kanso
        </div>
<ul className="hidden md:flex space-x-lg text-body-md font-body-md items-center">
<li>
<a className="text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-on-background transition-colors duration-300" href="#">
                    Projects
                </a>
</li>
<li>
<a className="text-primary dark:text-on-background font-bold border-b-2 border-primary hover:text-primary dark:hover:text-on-background transition-colors duration-300 opacity-80 transition-opacity duration-200" href="#">
                    Portfolio
                </a>
</li>
<li>
<a className="text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-on-background transition-colors duration-300" href="#">
                    Materials
                </a>
</li>
</ul>
<div className="flex items-center space-x-sm text-primary dark:text-on-background">
<button className="p-sm hover:text-primary dark:hover:text-on-background transition-colors duration-300">
<span className="material-symbols-outlined block">account_circle</span>
</button>
</div>
</nav>
{/* Main Content */}
<main className="flex-grow pt-[100px] pb-xxl">
<div className="max-w-container-max-app mx-auto px-gutter md:px-xl">
{/* Hero Section */}
<section className="mb-xxl">
<div className="mb-lg flex flex-col md:flex-row md:items-end justify-between gap-lg">
<div>
<h1 className="text-display-xl font-display-xl text-primary mb-sm">The Serene Retreat</h1>
<p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl">
                            AI-Generated Primary Concept emphasizing Warm Minimalism, tactile natural materials, and abundant natural light. Designed for contemplation and calm.
                        </p>
</div>
<button className="bg-primary text-on-primary font-label-sm text-label-sm rounded-[4px] px-xl py-md hover:bg-inverse-surface transition-colors duration-300 whitespace-nowrap">
                        Book a Specialist
                    </button>
</div>
<div className="w-full aspect-[16/9] md:aspect-[2/1] rounded-xl overflow-hidden ambient-shadow relative border border-outline-variant">
<Image alt="Primary AI Concept" fill sizes="100vw" priority={true} className="object-cover" src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=80"/>
</div>
</section>
{/* 2-Column Layout */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-xl items-start">
{/* Left: Alternative Concepts */}
<div className="lg:col-span-8 flex flex-col gap-lg">
<h2 className="text-headline-lg font-headline-lg text-primary mb-md">Alternative Explorations</h2>
<div className="grid grid-cols-1 md:grid-cols-2 gap-lg h-full">
{/* Concept Card 1 */}
<div className="bg-surface-container-lowest rounded-[16px] p-lg ambient-shadow border border-surface-dim flex flex-col transition-transform duration-500 hover:-translate-y-1 h-full">
<div className="w-full aspect-square rounded-lg overflow-hidden mb-lg flex-shrink-0">
<Image fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" alt="A sophisticated living room design interior with an urban zen aesthetic. The space features deep charcoal walls contrasting with light natural oak flooring. Low-slung, minimalist furniture arranged around a monolithic stone coffee table. Soft, directional architectural lighting highlights the textures of a raw linen sofa and a sparse, sculptural Ikebana floral arrangement in the corner. The mood is moody, quiet, and highly curated." src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80"/>
</div>
<h3 className="text-headline-md font-headline-md text-primary mb-sm">Concept 2: Urban Zen</h3>
<p className="text-body-md font-body-md text-on-surface-variant mb-lg flex-grow">
                                A darker, more introspective take using deep charcoals and raw stone elements to anchor the space.
                            </p>
<button className="border border-outline text-primary font-label-sm text-label-sm rounded-[4px] px-lg py-sm w-fit hover:bg-surface-container transition-colors duration-300 mt-auto">
                                View Details
                            </button>
</div>
{/* Concept Card 2 */}
<div className="bg-surface-container-lowest rounded-[16px] p-lg ambient-shadow border border-surface-dim flex flex-col transition-transform duration-500 hover:-translate-y-1 h-full">
<div className="w-full aspect-square rounded-lg overflow-hidden mb-lg flex-shrink-0">
<Image fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" alt="A bright, airy architectural interior space focusing on raw elements. Expansive floor-to-ceiling glass reveals a sparse desert landscape. Inside, the design utilizes monolithic forms made of polished concrete and pale travertine stone. Minimalist seating elements upholstered in textured white bouclé fabric. The lighting is intensely bright and natural, casting sharp shadows that emphasize the geometric purity of the architecture. The atmosphere is stark, pure, and monumental." src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80"/>
</div>
<h3 className="text-headline-md font-headline-md text-primary mb-sm">Concept 3: Raw Elements</h3>
<p className="text-body-md font-body-md text-on-surface-variant mb-lg flex-grow">
                                Pushing the minimalist boundary with monolithic concrete forms and stark, geometric light play.
                            </p>
<button className="border border-outline text-primary font-label-sm text-label-sm rounded-[4px] px-lg py-sm w-fit hover:bg-surface-container transition-colors duration-300 mt-auto">
                                View Details
                            </button>
</div>
</div>
</div>
{/* Right: Design Specs Panel */}
<aside className="lg:col-span-4 h-full">
<div className="sticky top-[120px] bg-surface-container-lowest rounded-[16px] p-xl ambient-shadow border border-surface-dim flex flex-col h-full">
<h2 className="text-headline-md font-headline-md text-primary mb-lg pb-sm border-b border-outline-variant">Design Specs</h2>
<div className="mb-xl flex-grow">
<h4 className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-widest mb-md">Primary Materials</h4>
<div className="flex flex-wrap gap-sm">
<span className="border border-outline-variant rounded-[4px] px-md py-sm text-label-sm font-label-sm text-primary">Polished Limestone</span>
<span className="border border-outline-variant rounded-[4px] px-md py-sm text-label-sm font-label-sm text-primary">Natural Oak</span>
<span className="border border-outline-variant rounded-[4px] px-md py-sm text-label-sm font-label-sm text-primary">Textured Linen</span>
<span className="border border-outline-variant rounded-[4px] px-md py-sm text-label-sm font-label-sm text-primary">Matte Black Steel</span>
</div>
</div>
<div className="mb-xl flex-grow">
<h4 className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-widest mb-md">Spatial Tone</h4>
<p className="text-body-md font-body-md text-primary">
                                Calm, grounding, and expansive. The layout prioritizes negative space, allowing the high-quality materials to dictate the room's character without visual clutter.
                            </p>
</div>
<div className="pt-lg border-t border-outline-variant mt-auto">
<button className="w-full bg-primary text-on-primary font-label-sm text-label-sm rounded-[4px] px-lg py-md hover:bg-inverse-surface transition-colors duration-300 flex items-center justify-center gap-sm">
<span>Book a Specialist</span>
<span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_forward</span>
</button>
<p className="text-label-sm font-label-sm text-on-surface-variant text-center mt-md">
                                Discuss this concept with our design team.
                            </p>
</div>
</div>
</aside>
</div>
</div>
</main>
{/* Footer */}
<footer className="bg-surface-container-lowest dark:bg-surface-container-lowest w-full py-xl px-gutter flex flex-col md:flex-row justify-between items-center max-w-container-max-marketing mx-auto mt-auto border-t border-outline-variant">
<div className="text-headline-md font-headline-md text-primary mb-md md:mb-0">
            Kanso
        </div>
<div className="flex flex-wrap gap-lg justify-center text-label-sm font-label-sm mb-md md:mb-0">
<a className="text-secondary hover:text-primary transition-colors" href="#">Privacy Policy</a>
<a className="text-secondary hover:text-primary transition-colors" href="#">Terms of Service</a>
<a className="text-secondary hover:text-primary transition-colors" href="#">Sustainability</a>
<a className="text-secondary hover:text-primary transition-colors" href="#">Contact</a>
</div>
<div className="text-body-md font-body-md text-secondary dark:text-secondary">
            © 2024 Kanso Interior Design. All rights reserved.
        </div>
</footer>

    </>
  );
}
