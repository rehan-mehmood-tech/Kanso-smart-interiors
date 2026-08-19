export default function reviewprojectkansoPage() {
  return (
    <>
      
{/* Header (Transactional - No Navigation Links) */}
<header className="w-full fixed top-0 left-0 z-50 bg-background border-b border-outline-variant px-gutter py-md">
<div className="max-w-container-max-app mx-auto flex justify-between items-center">
<div className="flex items-center gap-sm cursor-pointer group">
<span className="material-symbols-outlined text-primary group-hover:-translate-x-1 transition-transform">arrow_back</span>
<span className="text-body-md font-body-md text-primary">Back</span>
</div>
<div className="text-headline-md font-headline-md tracking-tighter text-primary">Kanso</div>
<div className="text-label-sm font-label-sm text-secondary">Step 4 of 4</div>
</div>
</header>
{/* Main Content */}
<main className="flex-grow pt-xxl pb-xxl px-gutter md:px-xl">
<div className="max-w-3xl mx-auto w-full flex flex-col gap-xl">
{/* Headline */}
<div className="text-center md:text-left pt-lg">
<h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-primary mb-sm">Ready to see your room?</h1>
<p className="text-body-lg font-body-lg text-secondary">Review your selections before we generate your concepts.</p>
</div>
{/* Review Summary Cards */}
<div className="flex flex-col gap-lg">
{/* Room Type Card */}
<div className="bg-surface-container-lowest rounded-xl p-xl ambient-shadow border border-outline-variant flex flex-col md:flex-row justify-between md:items-center gap-md">
<div>
<h3 className="text-label-sm font-label-sm text-secondary mb-xs uppercase">Room Type</h3>
<p className="text-headline-md font-headline-md text-primary">Living Room</p>
</div>
<button className="text-label-sm font-label-sm text-primary underline hover:text-secondary transition-colors text-left md:text-right w-fit">Edit</button>
</div>
{/* Style Card */}
<div className="bg-surface-container-lowest rounded-xl p-xl ambient-shadow border border-outline-variant flex flex-col md:flex-row justify-between md:items-center gap-md">
<div>
<h3 className="text-label-sm font-label-sm text-secondary mb-xs uppercase">Selected Style</h3>
<p className="text-headline-md font-headline-md text-primary">Modern Grey</p>
</div>
<button className="text-label-sm font-label-sm text-primary underline hover:text-secondary transition-colors text-left md:text-right w-fit">Edit</button>
</div>
{/* Photos Card */}
<div className="bg-surface-container-lowest rounded-xl p-xl ambient-shadow border border-outline-variant flex flex-col gap-lg">
<div className="flex justify-between items-center">
<h3 className="text-label-sm font-label-sm text-secondary uppercase">Uploaded Photos</h3>
<button className="text-label-sm font-label-sm text-primary underline hover:text-secondary transition-colors">Edit</button>
</div>
<div className="grid grid-cols-2 md:grid-cols-4 gap-sm">
<div className="aspect-square rounded-lg overflow-hidden border border-outline-variant bg-surface-variant relative group cursor-pointer">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="A brightly lit living room interior before renovation, showing bare walls, wooden flooring, and a large window letting in natural daylight. The space feels empty and waiting for a minimalist design intervention. High fidelity photography." src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=85"/>
</div>
<div className="aspect-square rounded-lg overflow-hidden border border-outline-variant bg-surface-variant relative group cursor-pointer">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Another angle of an empty living room prior to interior design, focusing on a corner with plain white walls and hardwood floors. Natural light spills across the room, highlighting the textures of the raw space. Architectural photography style." src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=85"/>
</div>
<div className="aspect-square rounded-lg overflow-hidden border border-outline-variant bg-surface-variant relative group cursor-pointer">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="A close-up shot of architectural details in an unfinished room, showing window frames and clean lines where walls meet the floor. The image has a calm, minimalist tone, setting a blank canvas for high-end interior styling." src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=85"/>
</div>
<div className="aspect-square rounded-lg overflow-hidden border border-outline-variant bg-surface-variant relative group cursor-pointer">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Wide shot of a spacious, empty room destined to be a living area. The lighting is soft and diffused, emphasizing the volume and potential of the space. Styled as a premium pre-renovation architectural photograph." src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85"/>
</div>
</div>
</div>
</div>
{/* CTA */}
<div className="pt-lg flex justify-end">
<button className="bg-primary text-on-primary rounded-lg px-xl py-md text-body-md font-label-sm font-semibold hover:opacity-90 transition-opacity w-full md:w-auto flex items-center justify-center gap-sm">
                    Generate Concepts
                    <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
</button>
</div>
</div>
</main>

    </>
  );
}
