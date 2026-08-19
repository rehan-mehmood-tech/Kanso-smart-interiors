export default function partnerdashboardkansoprorefinedPage() {
  return (
    <>
      
{/* SideNavBar Component */}
<nav className="hidden md:flex flex-col h-screen p-md space-y-4 docked left-0 w-64 bg-surface-container shadow-sm border-r border-surface-container-low shrink-0 sticky top-0">
<div className="flex items-center gap-sm mb-lg px-sm">
<span className="font-display-xl text-[28px] text-primary tracking-tighter">Kanso Pro</span>
</div>
<div className="flex items-center gap-md px-sm py-md border-b border-surface-container-high mb-md">
<div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
<img className="w-full h-full object-cover" data-alt="A close-up portrait of a professional interior architect in a well-lit modern studio setting. Soft natural light illuminates their face, conveying approachability and expertise. The aesthetic is clean, light-mode, and sophisticated, matching a premium warm minimalism style." src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85"/>
</div>
<div className="flex flex-col">
<span className="font-display-xl text-[16px] text-on-surface font-semibold tracking-tight">Pro User Profile</span>
<span className="font-label-sm text-label-sm text-secondary">Interior Architect</span>
</div>
</div>
<button className="w-full py-sm px-md bg-primary text-on-primary font-label-sm text-label-sm rounded-DEFAULT mb-md hover:opacity-90 transition-opacity">
            New Project
        </button>
<ul className="flex flex-col space-y-sm flex-grow">
<li>
<a className="flex items-center gap-md px-md py-sm rounded-lg text-primary bg-surface-bright font-label-sm text-label-sm hover:bg-surface-container-high transition-all" href="#">
<span className="material-symbols-outlined text-primary" data-icon="dashboard">dashboard</span>
                    Dashboard
                </a>
</li>
<li>
<a className="flex items-center gap-md px-md py-sm rounded-lg text-secondary font-label-sm text-label-sm hover:bg-surface-container-high transition-all" href="#">
<span className="material-symbols-outlined text-secondary" data-icon="architecture">architecture</span>
                    Projects
                </a>
</li>
<li>
<a className="flex items-center gap-md px-md py-sm rounded-lg text-secondary font-label-sm text-label-sm hover:bg-surface-container-high transition-all" href="#">
<span className="material-symbols-outlined text-secondary" data-icon="analytics">analytics</span>
                    Analytics
                </a>
</li>
<li>
<a className="flex items-center gap-md px-md py-sm rounded-lg text-secondary font-label-sm text-label-sm hover:bg-surface-container-high transition-all" href="#">
<span className="material-symbols-outlined text-secondary" data-icon="group">group</span>
                    Clients
                </a>
</li>
<li>
<a className="flex items-center gap-md px-md py-sm rounded-lg text-secondary font-label-sm text-label-sm hover:bg-surface-container-high transition-all" href="#">
<span className="material-symbols-outlined text-secondary" data-icon="settings">settings</span>
                    Settings
                </a>
</li>
</ul>
<ul className="flex flex-col space-y-sm mt-auto pt-md border-t border-surface-container-high">
<li>
<a className="flex items-center gap-md px-md py-sm rounded-lg text-secondary font-label-sm text-label-sm hover:bg-surface-container-high transition-all" href="#">
<span className="material-symbols-outlined text-secondary" data-icon="help">help</span>
                    Support
                </a>
</li>
<li>
<a className="flex items-center gap-md px-md py-sm rounded-lg text-secondary font-label-sm text-label-sm hover:bg-surface-container-high transition-all" href="#">
<span className="material-symbols-outlined text-secondary" data-icon="logout">logout</span>
                    Logout
                </a>
</li>
</ul>
</nav>
{/* Main Content Canvas */}
<main className="flex-1 flex flex-col w-full max-w-container-max-app mx-auto min-h-screen relative">
{/* TopAppBar (Mobile Only - representing the shell context) */}
<header className="md:hidden flex justify-between items-center h-20 px-md border-b border-outline-variant bg-surface sticky top-0 z-50">
<span className="font-display-xl text-headline-md tracking-tighter text-primary">Kanso Pro</span>
<button className="text-primary p-sm">
<span className="material-symbols-outlined" data-icon="menu">menu</span>
</button>
</header>
<div className="p-lg md:p-xl flex-1 flex flex-col gap-lg md:gap-xl max-w-full">
{/* Header Section */}
<section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-md">
<div>
<h1 className="font-display-xl text-[48px] md:text-[56px] leading-tight tracking-tight text-on-surface mb-xs">Welcome back, Architect.</h1>
<p className="font-body-md text-body-md text-secondary">Here's what's happening with your studio today.</p>
</div>
<div className="flex gap-sm">
<button className="px-md py-sm border border-outline text-on-surface font-label-sm text-label-sm rounded-DEFAULT hover:bg-surface-container transition-colors">Generate Report</button>
</div>
</section>
{/* Metrics Bento Grid */}
<section className="grid grid-cols-1 md:grid-cols-3 gap-md md:gap-lg">
{/* Metric Card 1 */}
<div className="bg-surface-container-lowest p-lg rounded-xl ambient-shadow border border-surface-container flex flex-col justify-between min-h-[160px]">
<div className="flex justify-between items-start mb-sm">
<span className="font-body-md text-body-md text-secondary">New Leads</span>
<span className="material-symbols-outlined text-primary" data-icon="person_add">person_add</span>
</div>
<div>
<div className="font-display-xl text-[56px] leading-none tracking-tight text-on-surface">12</div>
<div className="font-label-sm text-label-sm text-on-secondary-container mt-md flex items-center gap-xs">
<span className="material-symbols-outlined text-on-tertiary-container text-[16px]" data-icon="trending_up">trending_up</span>
                            +3 since last week
                        </div>
</div>
</div>
{/* Metric Card 2 */}
<div className="bg-surface-container-lowest p-lg rounded-xl ambient-shadow border border-surface-container flex flex-col justify-between min-h-[160px]">
<div className="flex justify-between items-start mb-sm">
<span className="font-body-md text-body-md text-secondary">Active Projects</span>
<span className="material-symbols-outlined text-primary" data-icon="architecture">architecture</span>
</div>
<div>
<div className="font-display-xl text-[56px] leading-none tracking-tight text-on-surface">8</div>
<div className="font-label-sm text-label-sm text-on-secondary-container mt-md flex items-center gap-xs">
<span className="material-symbols-outlined text-secondary text-[16px]" data-icon="pending_actions">pending_actions</span>
                            2 pending review
                        </div>
</div>
</div>
{/* Metric Card 3 */}
<div className="bg-surface-container-lowest p-lg rounded-xl ambient-shadow border border-surface-container flex flex-col justify-between min-h-[160px]">
<div className="flex justify-between items-start mb-sm">
<span className="font-body-md text-body-md text-secondary">Est. Earnings</span>
<span className="material-symbols-outlined text-primary" data-icon="payments">payments</span>
</div>
<div>
<div className="font-display-xl text-[56px] leading-none tracking-tight text-on-surface">$24.5k</div>
<div className="font-label-sm text-label-sm text-on-secondary-container mt-md flex items-center gap-xs">
<span className="material-symbols-outlined text-on-tertiary-container text-[16px]" data-icon="check_circle">check_circle</span>
                            On track for Q3
                        </div>
</div>
</div>
</section>
{/* Main Workspace Area */}
<section className="grid grid-cols-1 lg:grid-cols-3 gap-lg flex-1">
{/* Client Leads List (Takes up more space) */}
<div className="lg:col-span-2 bg-surface-container-lowest rounded-xl ambient-shadow border border-surface-container flex flex-col">
<div className="p-lg border-b border-surface-container flex justify-between items-center">
<h2 className="font-display-xl text-[28px] tracking-tight text-on-surface">Recent Leads</h2>
<a className="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors" href="#">View All</a>
</div>
<div className="flex-1 overflow-y-auto">
{/* Lead Item 1 */}
<div className="p-lg border-b border-surface-container hover:bg-surface-container-low transition-colors cursor-pointer flex flex-col md:flex-row gap-md items-start md:items-center justify-between">
<div className="flex gap-md items-center">
<div className="w-14 h-14 rounded-full bg-surface-container overflow-hidden shrink-0">
<img className="w-full h-full object-cover" data-alt="A bright, airy living room interior featuring minimalist warm-toned furniture, a textured cream rug, and a large window letting in natural light. The style is modern architectural editorial with a calm, inviting mood." src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85"/>
</div>
<div>
<h3 className="font-display-xl text-[18px] text-on-surface font-semibold tracking-tight">Sarah Jenkins</h3>
<p className="font-label-sm text-label-sm text-secondary mt-xs">Living Room &amp; Kitchen</p>
</div>
</div>
<div className="flex gap-sm flex-wrap">
<span className="px-sm py-xs border border-outline-variant text-secondary font-label-sm text-label-sm rounded-sm bg-surface-bright">Japandi</span>
<span className="px-sm py-xs border border-outline-variant text-secondary font-label-sm text-label-sm rounded-sm bg-surface-bright">High Budget</span>
</div>
</div>
{/* Lead Item 2 */}
<div className="p-lg border-b border-surface-container hover:bg-surface-container-low transition-colors cursor-pointer flex flex-col md:flex-row gap-md items-start md:items-center justify-between">
<div className="flex gap-md items-center">
<div className="w-14 h-14 rounded-full bg-surface-container overflow-hidden shrink-0">
<img className="w-full h-full object-cover" data-alt="A sleek, minimalist master bedroom with neutral gray walls, a low-profile timber bed frame, and crisp white linens. Ambient lighting highlights the subtle textures of the walls, conveying a sophisticated, quiet high-end aesthetic." src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85"/>
</div>
<div>
<h3 className="font-display-xl text-[18px] text-on-surface font-semibold tracking-tight">Michael Chen</h3>
<p className="font-label-sm text-label-sm text-secondary mt-xs">Master Suite Remodel</p>
</div>
</div>
<div className="flex gap-sm flex-wrap">
<span className="px-sm py-xs border border-outline-variant text-secondary font-label-sm text-label-sm rounded-sm bg-surface-bright">Minimalist</span>
<span className="px-sm py-xs border border-outline-variant text-secondary font-label-sm text-label-sm rounded-sm bg-surface-bright">Medium Budget</span>
</div>
</div>
{/* Lead Item 3 */}
<div className="p-lg hover:bg-surface-container-low transition-colors cursor-pointer flex flex-col md:flex-row gap-md items-start md:items-center justify-between">
<div className="flex gap-md items-center">
<div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center shrink-0 text-secondary">
<span className="font-display-xl text-[24px]">E</span>
</div>
<div>
<h3 className="font-display-xl text-[18px] text-on-surface font-semibold tracking-tight">Elena Rossi</h3>
<p className="font-label-sm text-label-sm text-secondary mt-xs">Home Office</p>
</div>
</div>
<div className="flex gap-sm flex-wrap">
<span className="px-sm py-xs border border-outline-variant text-secondary font-label-sm text-label-sm rounded-sm bg-surface-bright">Mid-Century</span>
<span className="px-sm py-xs bg-surface-container-high text-on-surface font-label-sm text-label-sm rounded-sm">Action Req</span>
</div>
</div>
</div>
</div>
{/* Secondary Panel (Schedule / Quick Actions) */}
<div className="flex flex-col gap-lg">
{/* Schedule */}
<div className="bg-surface-container-lowest p-lg rounded-xl ambient-shadow border border-surface-container flex-1">
<h2 className="font-display-xl text-[28px] tracking-tight text-on-surface mb-md">Today's Schedule</h2>
<div className="flex flex-col gap-md mt-lg">
<div className="flex gap-md">
<div className="w-16 text-right shrink-0 mt-1">
<span className="font-label-sm text-label-sm text-secondary">10:00 AM</span>
</div>
<div className="flex-1 border-l-2 border-outline-variant pl-md pb-md">
<div className="font-display-xl text-[18px] text-on-surface tracking-tight">Initial Consultation</div>
<div className="font-label-sm text-label-sm text-secondary mt-xs">Sarah Jenkins - Video Call</div>
</div>
</div>
<div className="flex gap-md">
<div className="w-16 text-right shrink-0 mt-1">
<span className="font-label-sm text-label-sm text-secondary">1:30 PM</span>
</div>
<div className="flex-1 border-l-2 border-primary pl-md pb-md relative">
<div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-primary"></div>
<div className="font-display-xl text-[18px] text-on-surface font-semibold tracking-tight">Material Review</div>
<div className="font-label-sm text-label-sm text-secondary mt-xs">Studio Downtown</div>
</div>
</div>
</div>
</div>
</div>
</section>
</div>
</main>

    </>
  );
}
