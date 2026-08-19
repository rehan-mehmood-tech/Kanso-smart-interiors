export default function adminonboardingkansoproPage() {
  return (
    <>
      
{/* SideNavBar (Suppressed due to linear/task-focused intent) */}
{/* Content Canvas */}
<main className="flex-1 flex flex-col h-full overflow-y-auto">
{/* Header */}
<header className="px-xl py-lg border-b border-outline-variant bg-surface-container-lowest sticky top-0 z-10">
<div className="max-w-container-max-app mx-auto flex justify-between items-center">
<div>
<h1 className="font-headline-lg text-headline-lg tracking-tighter text-primary">Pending Verifications</h1>
<p className="font-body-md text-body-md text-secondary mt-xs">Review and approve new interior design specialists for Kanso Pro.</p>
</div>
<div className="flex items-center gap-md">
<button className="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors flex items-center gap-xs">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>filter_list</span>
                        Filter
                    </button>
<button className="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors flex items-center gap-xs">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>sort</span>
                        Sort
                    </button>
</div>
</div>
</header>
{/* Main Content */}
<div className="flex-1 max-w-container-max-app mx-auto w-full px-xl py-xxl">
<div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
{/* Application List */}
<div className="md:col-span-8 flex flex-col gap-lg">
{/* Candidate Card 1 */}
<article className="bg-surface-container-lowest rounded-xl p-lg ambient-shadow border border-outline-variant/30 flex flex-col md:flex-row gap-xl items-start md:items-center group">
<div className="flex-shrink-0">
<img className="w-24 h-24 rounded-full object-cover border-2 border-surface-container-highest" data-alt="A highly detailed portrait of a modern, professional interior designer in a minimalist studio setting. The lighting is soft and architectural, casting gentle shadows. The overall aesthetic is 'Quiet Luxury' with a warm neutral color palette consisting of bone white, soft greys, and deep charcoal. The mood is calm and authoritative." src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85"/>
</div>
<div className="flex-1 flex flex-col gap-xs">
<div className="flex items-center justify-between">
<h2 className="font-headline-md text-headline-md text-primary">Elena Rodriguez</h2>
<span className="bg-surface-container-highest text-secondary font-label-sm text-label-sm px-sm py-xs rounded">Pending Review</span>
</div>
<p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-sm">
<span className="material-symbols-outlined text-[18px]">architecture</span>
                                Residential Architecture &amp; Minimalism
                            </p>
<p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-sm">
<span className="material-symbols-outlined text-[18px]">work_history</span>
                                8 Years Experience
                            </p>
<div className="mt-md flex gap-sm">
<span className="border border-outline-variant text-secondary font-label-sm text-label-sm px-sm py-xs rounded">Portfolio Attached</span>
<span className="border border-outline-variant text-secondary font-label-sm text-label-sm px-sm py-xs rounded">References Checked</span>
</div>
</div>
<div className="flex-shrink-0 flex flex-col md:flex-row gap-sm w-full md:w-auto mt-lg md:mt-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
<button className="border border-outline text-primary font-label-sm text-label-sm px-md py-sm rounded-lg hover:bg-surface-container-low transition-colors w-full md:w-auto text-center">
                                Request More Info
                            </button>
<button className="bg-primary text-on-primary font-label-sm text-label-sm px-md py-sm rounded-lg hover:opacity-90 transition-opacity w-full md:w-auto text-center">
                                Approve
                            </button>
</div>
</article>
{/* Candidate Card 2 */}
<article className="bg-surface-container-lowest rounded-xl p-lg ambient-shadow border border-outline-variant/30 flex flex-col md:flex-row gap-xl items-start md:items-center group">
<div className="flex-shrink-0">
<img className="w-24 h-24 rounded-full object-cover border-2 border-surface-container-highest" data-alt="A highly detailed portrait of a sophisticated male interior designer in a brightly lit, high-end showroom. The lighting highlights textures of stone and wood in the background. The overall aesthetic is 'Warm Minimalism' with a clean, high-contrast palette of crisp white and deep black. The mood is professional and creative." src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=85"/>
</div>
<div className="flex-1 flex flex-col gap-xs">
<div className="flex items-center justify-between">
<h2 className="font-headline-md text-headline-md text-primary">Julian Vance</h2>
<span className="bg-surface-container-highest text-secondary font-label-sm text-label-sm px-sm py-xs rounded">Pending Review</span>
</div>
<p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-sm">
<span className="material-symbols-outlined text-[18px]">chair</span>
                                Commercial Spaces &amp; Hospitality
                            </p>
<p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-sm">
<span className="material-symbols-outlined text-[18px]">work_history</span>
                                12 Years Experience
                            </p>
<div className="mt-md flex gap-sm">
<span className="border border-outline-variant text-secondary font-label-sm text-label-sm px-sm py-xs rounded">Portfolio Attached</span>
</div>
</div>
<div className="flex-shrink-0 flex flex-col md:flex-row gap-sm w-full md:w-auto mt-lg md:mt-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
<button className="border border-outline text-primary font-label-sm text-label-sm px-md py-sm rounded-lg hover:bg-surface-container-low transition-colors w-full md:w-auto text-center">
                                Request More Info
                            </button>
<button className="bg-primary text-on-primary font-label-sm text-label-sm px-md py-sm rounded-lg hover:opacity-90 transition-opacity w-full md:w-auto text-center">
                                Approve
                            </button>
</div>
</article>
</div>
{/* Contextual Sidebar/Summary */}
<aside className="md:col-span-4 flex flex-col gap-lg">
<div className="bg-surface-container-lowest rounded-xl p-lg ambient-shadow border border-outline-variant/30">
<h3 className="font-headline-md text-headline-md text-primary mb-md">Verification Queue</h3>
<div className="flex justify-between items-center py-sm border-b border-surface-container-highest">
<span className="font-body-md text-body-md text-secondary">Total Pending</span>
<span className="font-headline-md text-headline-md text-primary">24</span>
</div>
<div className="flex justify-between items-center py-sm border-b border-surface-container-highest">
<span className="font-body-md text-body-md text-secondary">Awaiting Info</span>
<span className="font-headline-md text-headline-md text-primary">5</span>
</div>
<div className="flex justify-between items-center py-sm">
<span className="font-body-md text-body-md text-secondary">Approved Today</span>
<span className="font-headline-md text-headline-md text-primary">12</span>
</div>
</div>
</aside>
</div>
</div>
</main>

    </>
  );
}
