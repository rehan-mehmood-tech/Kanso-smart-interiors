export default function leaddetailskansoproPage() {
  return (
    <>
      
{/* SideNavBar */}
<nav className="bg-surface-container dark:bg-surface-container docked left-0 h-full w-64 flex flex-col h-screen p-md space-y-4 border-r border-outline-variant shadow-sm z-20 flex-shrink-0 hidden md:flex">
<div className="flex items-center gap-sm mb-lg">
<span className="material-symbols-outlined text-primary text-[32px]" data-weight="fill" style={{ fontVariationSettings: "'FILL' 1" }}>architecture</span>
<div>
<h1 className="font-display-xl text-headline-md text-primary tracking-tighter">Kanso Pro</h1>
<p className="font-label-sm text-label-sm text-secondary">Interior Architect</p>
</div>
</div>
<button className="bg-primary text-on-primary w-full py-3 rounded-lg font-label-sm text-label-sm mb-lg hover:opacity-90 transition-opacity flex justify-center items-center gap-sm">
<span className="material-symbols-outlined text-[18px]">add</span> New Project
        </button>
<ul className="flex-grow space-y-2">
<li><a className="flex items-center gap-md px-md py-3 rounded-lg text-secondary dark:text-secondary-fixed-dim font-label-sm text-label-sm hover:bg-surface-container-high transition-all" href="#"><span className="material-symbols-outlined">dashboard</span> Dashboard</a></li>
<li><a className="flex items-center gap-md px-md py-3 rounded-lg text-secondary dark:text-secondary-fixed-dim font-label-sm text-label-sm hover:bg-surface-container-high transition-all" href="#"><span className="material-symbols-outlined">architecture</span> Projects</a></li>
<li><a className="flex items-center gap-md px-md py-3 rounded-lg text-secondary dark:text-secondary-fixed-dim font-label-sm text-label-sm hover:bg-surface-container-high transition-all" href="#"><span className="material-symbols-outlined">analytics</span> Analytics</a></li>
<li><a className="flex items-center gap-md px-md py-3 rounded-lg text-primary dark:text-on-primary-fixed bg-white dark:bg-surface-bright rounded-lg font-label-sm text-label-sm shadow-sm scale-95" href="#"><span className="material-symbols-outlined">group</span> Clients</a></li>
<li><a className="flex items-center gap-md px-md py-3 rounded-lg text-secondary dark:text-secondary-fixed-dim font-label-sm text-label-sm hover:bg-surface-container-high transition-all" href="#"><span className="material-symbols-outlined">settings</span> Settings</a></li>
</ul>
<div className="mt-auto pt-4 border-t border-surface-container-low space-y-2">
<a className="flex items-center gap-md px-md py-3 rounded-lg text-secondary dark:text-secondary-fixed-dim font-label-sm text-label-sm hover:bg-surface-container-high transition-all" href="#"><span className="material-symbols-outlined">help</span> Support</a>
<a className="flex items-center gap-md px-md py-3 rounded-lg text-secondary dark:text-secondary-fixed-dim font-label-sm text-label-sm hover:bg-surface-container-high transition-all" href="#"><span className="material-symbols-outlined">logout</span> Logout</a>
</div>
</nav>
{/* Main Content Area */}
<main className="flex-1 flex flex-col h-screen overflow-y-auto w-full relative">
{/* Header */}
<header className="bg-surface sticky top-0 z-10 border-b border-outline-variant px-lg py-md flex justify-between items-center bg-opacity-90 backdrop-blur-md">
<div>
<a className="text-secondary font-label-sm text-label-sm flex items-center gap-xs hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined text-[16px]">arrow_back</span> Back to Clients</a>
<h2 className="font-display-xl text-headline-md mt-xs">Lead Inquiry: Emma Watson</h2>
</div>
<div className="flex gap-md">
<button className="border border-outline text-secondary font-label-sm text-label-sm px-lg py-sm rounded-lg hover:bg-surface-container transition-colors">Decline</button>
<button className="bg-primary text-on-primary font-label-sm text-label-sm px-lg py-sm rounded-lg hover:opacity-90 transition-opacity">Accept Lead</button>
</div>
</header>
{/* Canvas */}
<div className="p-lg md:p-xl max-w-container-max-app mx-auto w-full flex flex-col gap-xl pb-xxl">
<div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
{/* Left Column: Concepts & Photos */}
<div className="lg:col-span-2 flex flex-col gap-lg">
{/* AI Concept Highlight */}
<section className="bg-surface-container-lowest rounded-[16px] shadow-ambient border border-surface-container-high p-lg flex flex-col gap-md">
<div className="flex justify-between items-center">
<h3 className="font-headline-md text-headline-md text-primary">AI Proposed Concept</h3>
<span className="bg-surface-container text-secondary font-label-sm text-label-sm px-sm py-xs rounded-sm">Japandi Minimalism</span>
</div>
<div className="relative w-full aspect-video rounded-lg overflow-hidden bg-surface-container-high">
<img className="w-full h-full object-cover" data-alt="A high-resolution, photorealistic render of a minimalist living room blending Japanese and Scandinavian design (Japandi). The space features warm oak wood tones, light cream walls, and low-profile furniture. Large windows let in soft, diffused natural daylight. A subtle, textured rug grounds the seating area. The mood is serene, highly curated, and architectural, adhering strictly to a premium light-mode aesthetic." src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85"/>
</div>
<div className="flex gap-sm">
<span className="border border-outline-variant text-secondary font-label-sm text-label-sm px-sm py-xs rounded-sm">Oak Wood</span>
<span className="border border-outline-variant text-secondary font-label-sm text-label-sm px-sm py-xs rounded-sm">Linen</span>
<span className="border border-outline-variant text-secondary font-label-sm text-label-sm px-sm py-xs rounded-sm">Matte Black Accents</span>
</div>
</section>
{/* Original Photos */}
<section className="bg-surface-container-lowest rounded-[16px] shadow-ambient border border-surface-container-high p-lg flex flex-col gap-md">
<h3 className="font-headline-md text-headline-md text-primary">Original Space</h3>
<div className="grid grid-cols-2 gap-sm">
<div className="aspect-square rounded-lg overflow-hidden bg-surface-container-high">
<img className="w-full h-full object-cover" data-alt="A raw, unedited photo of an empty, slightly dated living room before renovation. The room has off-white walls, standard hardwood floors, and typical residential windows. The lighting is average interior daylight. The image is functional, serving as a 'before' reference for an interior design project, maintaining a neutral, slightly cool color palette." src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85"/>
</div>
<div className="aspect-square rounded-lg overflow-hidden bg-surface-container-high">
<img className="w-full h-full object-cover" data-alt="Another angle of the raw, unedited empty living room before renovation. Showing an alternate corner with a plain radiator and standard baseboards. The lighting is functional, average interior daylight. The image serves as a structural reference for an interior architect, neutral and unstyled." src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=85"/>
</div>
</div>
</section>
</div>
{/* Right Column: Info & Messaging */}
<div className="lg:col-span-1 flex flex-col gap-lg h-full">
{/* Client Details */}
<section className="bg-surface-container-lowest rounded-[16px] shadow-ambient border border-surface-container-high p-lg flex flex-col gap-md">
<h3 className="font-headline-md text-headline-md text-primary border-b border-surface-container-high pb-sm">Client Brief</h3>
<div className="flex flex-col gap-sm">
<div>
<p className="font-label-sm text-label-sm text-secondary">Budget</p>
<p className="font-body-md text-body-md text-primary">$15,000 - $25,000</p>
</div>
<div>
<p className="font-label-sm text-label-sm text-secondary">Timeline</p>
<p className="font-body-md text-body-md text-primary">Flexible (3-6 months)</p>
</div>
<div>
<p className="font-label-sm text-label-sm text-secondary">Scope</p>
<p className="font-body-md text-body-md text-primary">Living Room &amp; Entryway redesign. Needs better flow and integration of natural light.</p>
</div>
</div>
</section>
{/* Messaging Interface */}
<section className="bg-surface-container-lowest rounded-[16px] shadow-ambient border border-surface-container-high flex flex-col flex-grow min-h-[400px]">
<div className="p-md border-b border-surface-container-high">
<h3 className="font-headline-md text-headline-md text-primary">Messages</h3>
</div>
<div className="flex-grow p-md overflow-y-auto flex flex-col gap-md bg-surface-container-low">
{/* System Msg */}
<div className="text-center text-secondary font-label-sm text-label-sm my-sm">
                                Lead inquiry received today
                            </div>
{/* Client Msg */}
<div className="flex flex-col items-start gap-xs max-w-[85%]">
<span className="font-label-sm text-label-sm text-secondary ml-sm">Emma</span>
<div className="bg-surface-container-lowest border border-surface-container-high p-sm rounded-lg rounded-tl-none font-body-md text-body-md text-primary shadow-sm">
                                    Hi! I generated this concept using Kanso and I love the direction. Are you available to help me actually build this out?
                                </div>
</div>
</div>
<div className="p-md border-t border-surface-container-high bg-surface-container-lowest mt-auto rounded-b-[16px]">
<div className="flex gap-sm">
<input className="flex-grow border-b border-outline-variant bg-transparent font-body-md text-body-md focus:outline-none focus:border-secondary py-sm" disabled={true} placeholder="Type a message to accept..." type="text"/>
<button className="text-secondary hover:text-primary transition-colors cursor-not-allowed opacity-50" disabled={true}>
<span className="material-symbols-outlined text-[24px]">send</span>
</button>
</div>
<p className="font-label-sm text-label-sm text-secondary mt-sm text-center">Accept lead to start messaging</p>
</div>
</section>
</div>
</div>
</div>
</main>

    </>
  );
}
