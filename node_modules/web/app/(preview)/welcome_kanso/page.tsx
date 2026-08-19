import Image from 'next/image';

export default function welcomekansoPage() {
  return (
    <>
      
{/* Top Navigation */}
<nav className="bg-surface dark:bg-surface border-b border-outline-variant dark:border-on-surface-variant flex justify-between items-center h-20 px-lg max-w-container-max-marketing mx-auto w-full sticky top-0 z-50">
<div className="flex items-center gap-md">
<a className="font-display-xl text-headline-md tracking-tighter text-primary dark:text-on-primary-fixed hover:opacity-80 transition-opacity" href="#">KANSO</a>
</div>
<div className="hidden md:flex items-center gap-lg">
<a className="text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-on-primary-fixed transition-colors duration-300 font-body-md text-body-md" href="#">How It Works</a>
<a className="text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-on-primary-fixed transition-colors duration-300 font-body-md text-body-md" href="#">Explore</a>
</div>
<div className="flex items-center gap-md">
<button className="bg-primary text-on-primary px-6 py-3 rounded-lg font-label-sm text-label-sm hover:bg-surface-tint transition-colors duration-300">Design My Room</button>
</div>
</nav>
{/* Main Content Area with SideNav Layout */}
<div className="flex flex-1 max-w-container-max-marketing mx-auto w-full">
{/* Side Navigation (Desktop) */}
<aside className="hidden md:flex flex-col h-[calc(100vh-80px)] w-64 bg-surface-container dark:bg-surface-container border-r border-outline-variant p-md space-y-4 sticky top-20">
<div className="flex items-center gap-md mb-8 px-2 mt-4">
<div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center overflow-hidden">
<span className="material-symbols-outlined text-secondary">person</span>
</div>
<div>
<h3 className="font-label-sm text-label-sm text-primary">Kanso Pro</h3>
<p className="font-label-sm text-label-sm text-secondary">Interior Architect</p>
</div>
</div>
<nav className="flex-1 space-y-2">
<a className="flex items-center gap-md px-4 py-3 text-primary dark:text-on-primary-fixed bg-white dark:bg-surface-bright rounded-lg font-label-sm text-label-sm transition-all hover:scale-95 shadow-sm" href="#">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
                    Dashboard
                </a>
<a className="flex items-center gap-md px-4 py-3 text-secondary dark:text-secondary-fixed-dim hover:bg-surface-container-high rounded-lg font-label-sm text-label-sm transition-all" href="#">
<span className="material-symbols-outlined">architecture</span>
                    Projects
                </a>
<a className="flex items-center gap-md px-4 py-3 text-secondary dark:text-secondary-fixed-dim hover:bg-surface-container-high rounded-lg font-label-sm text-label-sm transition-all" href="#">
<span className="material-symbols-outlined">analytics</span>
                    Analytics
                </a>
<a className="flex items-center gap-md px-4 py-3 text-secondary dark:text-secondary-fixed-dim hover:bg-surface-container-high rounded-lg font-label-sm text-label-sm transition-all" href="#">
<span className="material-symbols-outlined">group</span>
                    Clients
                </a>
<a className="flex items-center gap-md px-4 py-3 text-secondary dark:text-secondary-fixed-dim hover:bg-surface-container-high rounded-lg font-label-sm text-label-sm transition-all" href="#">
<span className="material-symbols-outlined">settings</span>
                    Settings
                </a>
</nav>
<button className="w-full bg-primary text-on-primary py-3 rounded-lg font-label-sm text-label-sm mt-auto mb-4 hover:bg-surface-tint transition-colors shadow-sm">
                New Project
            </button>
<div className="mt-auto space-y-2 border-t border-outline-variant pt-4">
<a className="flex items-center gap-md px-4 py-2 text-secondary dark:text-secondary-fixed-dim hover:bg-surface-container-high rounded-lg font-label-sm text-label-sm transition-all" href="#">
<span className="material-symbols-outlined">help</span>
                    Support
                </a>
<a className="flex items-center gap-md px-4 py-2 text-secondary dark:text-secondary-fixed-dim hover:bg-surface-container-high rounded-lg font-label-sm text-label-sm transition-all" href="#">
<span className="material-symbols-outlined">logout</span>
                    Logout
                </a>
</div>
</aside>
{/* Main Dashboard Canvas - Empty State */}
<main className="flex-1 p-4 md:p-xl flex items-center justify-center min-h-[calc(100vh-80px)]">
<div className="w-full max-w-5xl bg-surface-container-lowest rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-outline-variant overflow-hidden flex flex-col md:flex-row h-full min-h-[600px]">
{/* Content Left Side */}
<div className="w-full md:w-1/2 p-xl md:p-xxl flex flex-col justify-center items-start z-10 relative bg-surface-container-lowest">
<div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-8 shadow-sm">
<span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 0" }}>chair</span>
</div>
<h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-4 tracking-tight">
                        Your first room is waiting.
                    </h1>
<p className="font-body-lg text-body-lg text-secondary mb-10 max-w-md leading-relaxed">
                        Start your journey to a beautifully designed home today. Tell us your style, and let our AI create a curated space tailored just for you.
                    </p>
<button className="bg-primary text-on-primary px-8 py-4 rounded-lg font-label-sm text-label-sm flex items-center gap-3 hover:bg-surface-tint hover:-translate-y-0.5 transition-all duration-300 shadow-sm group">
<span className="material-symbols-outlined text-lg group-hover:rotate-90 transition-transform duration-300">add</span>
                        Design My Room
                    </button>
<div className="mt-auto pt-12 flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
<span className="material-symbols-outlined text-sm">info</span>
                        Takes about 3 minutes to get your first concept.
                    </div>
</div>
{/* Image Right Side */}
<div className="w-full md:w-1/2 relative h-64 md:h-auto overflow-hidden">
<div className="absolute inset-0 bg-black/10 z-10 mix-blend-multiply"></div>
<Image fill sizes="(max-width: 768px) 100vw, 50vw" priority={true} className="object-cover absolute inset-0 object-center transition-transform duration-1000 hover:scale-105" alt="A bright, minimalist Japandi living room bathed in soft, natural morning light. The space features light oak wood flooring and architectural framing around large windows looking out to a serene garden. A low-profile, cream-colored modular sofa sits atop a textured natural fiber rug. An organic, solid wood coffee table is centered. A large potted olive tree adds organic life to the corner. The aesthetic is warm minimalism, highly aspirational, and deeply calming." src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80"/>
{/* Decorative subtle gradient overlay to blend image into background on some edges */}
<div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-surface-container-lowest to-transparent z-20 hidden md:block"></div>
</div>
</div>
</main>
</div>
{/* Footer */}
<footer className="bg-surface-container-lowest dark:bg-surface-container-lowest py-xl border-t border-outline-variant w-full mt-auto">
<div className="max-w-container-max-marketing mx-auto px-lg flex flex-col md:flex-row justify-between items-center gap-md">
<div className="font-display-xl text-headline-md text-primary">KANSO</div>
<div className="text-secondary dark:text-secondary-fixed-dim font-body-md text-body-md text-center md:text-left">
                © 2024 Kanso AI. All rights reserved.
            </div>
<div className="flex gap-lg">
<a className="text-secondary font-body-md text-body-md hover:text-primary transition-colors" href="#">Privacy Policy</a>
<a className="text-secondary font-body-md text-body-md hover:text-primary transition-colors" href="#">Terms of Service</a>
<a className="text-secondary font-body-md text-body-md hover:text-primary transition-colors" href="#">Cookies</a>
</div>
</div>
</footer>

    </>
  );
}
