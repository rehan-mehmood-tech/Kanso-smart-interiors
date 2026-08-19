export default function myschedulekansoproPage() {
  return (
    <>
      
{/* Desktop Side Navigation */}
<aside className="hidden md:flex flex-col h-screen p-md space-y-4 bg-surface-container dark:bg-surface-container docked left-0 w-64 fixed top-0 z-50 border-r border-outline-variant/30">
<div className="px-md pt-lg pb-xl">
<h1 className="font-display-xl text-headline-md text-primary tracking-tighter">Kanso</h1>
</div>
<nav className="flex-1 space-y-2 px-sm">
<a className="flex items-center gap-sm px-md py-sm rounded-lg text-secondary dark:text-secondary-fixed-dim hover:bg-surface-container-high transition-all" href="#">
<span className="material-symbols-outlined text-[20px]" data-icon="dashboard">dashboard</span>
<span className="font-label-sm text-label-sm">Dashboard</span>
</a>
<a className="flex items-center gap-sm px-md py-sm rounded-lg text-primary dark:text-on-primary-fixed bg-white dark:bg-surface-bright shadow-sm transition-all" href="#">
<span className="material-symbols-outlined fill text-[20px]" data-icon="calendar_month" data-weight="fill">calendar_month</span>
<span className="font-label-sm text-label-sm">Schedule</span>
</a>
<a className="flex items-center gap-sm px-md py-sm rounded-lg text-secondary dark:text-secondary-fixed-dim hover:bg-surface-container-high transition-all" href="#">
<span className="material-symbols-outlined text-[20px]" data-icon="architecture">architecture</span>
<span className="font-label-sm text-label-sm">Projects</span>
</a>
<a className="flex items-center gap-sm px-md py-sm rounded-lg text-secondary dark:text-secondary-fixed-dim hover:bg-surface-container-high transition-all" href="#">
<span className="material-symbols-outlined text-[20px]" data-icon="group">group</span>
<span className="font-label-sm text-label-sm">Clients</span>
</a>
<a className="flex items-center gap-sm px-md py-sm rounded-lg text-secondary dark:text-secondary-fixed-dim hover:bg-surface-container-high transition-all" href="#">
<span className="material-symbols-outlined text-[20px]" data-icon="analytics">analytics</span>
<span className="font-label-sm text-label-sm">Analytics</span>
</a>
<a className="flex items-center gap-sm px-md py-sm rounded-lg text-secondary dark:text-secondary-fixed-dim hover:bg-surface-container-high transition-all" href="#">
<span className="material-symbols-outlined text-[20px]" data-icon="settings">settings</span>
<span className="font-label-sm text-label-sm">Settings</span>
</a>
</nav>
<div className="p-sm">
<button className="w-full bg-primary text-on-primary font-label-sm text-label-sm py-sm px-md rounded-DEFAULT hover:opacity-90 transition-opacity flex items-center justify-center gap-sm">
<span className="material-symbols-outlined text-[18px]">add</span>
                New Project
            </button>
</div>
<div className="mt-auto px-sm pb-md space-y-2 border-t border-outline-variant/30 pt-md">
<a className="flex items-center gap-sm px-md py-sm rounded-lg text-secondary dark:text-secondary-fixed-dim hover:bg-surface-container-high transition-all" href="#">
<span className="material-symbols-outlined text-[20px]" data-icon="help">help</span>
<span className="font-label-sm text-label-sm">Support</span>
</a>
<div className="flex items-center gap-sm px-md py-sm mt-4">
<img className="w-8 h-8 rounded-full object-cover outline outline-1 outline-outline-variant/50" data-alt="A small, circular avatar portrait of an elegant professional interior architect, styled in a minimalist, high-key lighting environment with soft neutral tones." src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=85"/>
<div className="flex flex-col">
<span className="font-label-sm text-label-sm text-primary">Kanso Pro</span>
<span className="font-body-md text-[10px] text-secondary">Interior Architect</span>
</div>
</div>
<a className="flex items-center gap-sm px-md py-sm rounded-lg text-secondary dark:text-secondary-fixed-dim hover:bg-surface-container-high transition-all" href="#">
<span className="material-symbols-outlined text-[20px]" data-icon="logout">logout</span>
<span className="font-label-sm text-label-sm">Logout</span>
</a>
</div>
</aside>
{/* Main Content Area */}
<main className="flex-1 md:ml-64 w-full min-h-screen flex flex-col">
{/* Mobile Top Nav */}
<header className="md:hidden flex justify-between items-center h-20 px-lg bg-surface sticky top-0 z-40">
<div className="font-display-xl text-headline-md tracking-tighter text-primary">Kanso</div>
<button className="text-primary p-sm rounded-full hover:bg-surface-container transition-colors">
<span className="material-symbols-outlined">menu</span>
</button>
</header>
{/* Content Canvas */}
<div className="flex-1 max-w-container-max-app mx-auto w-full px-margin-mobile md:px-lg py-xl">
{/* Page Header */}
<div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-xxl gap-lg">
<div>
<h2 className="font-headline-lg-mobile md:font-headline-lg text-primary mb-sm">Schedule</h2>
<p className="font-body-lg text-secondary">Manage your upcoming consultations and site visits.</p>
</div>
<div className="flex gap-md">
<button className="px-lg py-sm border border-outline-variant rounded-DEFAULT font-label-sm text-label-sm text-primary hover:bg-surface-container transition-colors flex items-center gap-sm">
<span className="material-symbols-outlined text-[18px]">sync</span>
                        Sync Calendar
                    </button>
<button className="px-lg py-sm bg-primary text-on-primary rounded-DEFAULT font-label-sm text-label-sm hover:opacity-90 transition-opacity flex items-center gap-sm">
<span className="material-symbols-outlined text-[18px]">add</span>
                        New Event
                    </button>
</div>
</div>
{/* Bento Grid Layout for Schedule */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
{/* Left Column: Mini Calendar & Stats */}
<div className="lg:col-span-4 flex flex-col gap-gutter">
{/* Date Picker Card */}
<div className="bg-surface-container-lowest rounded-xl p-lg ambient-shadow border border-outline-variant/30">
<div className="flex justify-between items-center mb-lg">
<h3 className="font-headline-md text-primary">October 2024</h3>
<div className="flex gap-sm">
<button className="p-xs text-secondary hover:text-primary transition-colors"><span className="material-symbols-outlined">chevron_left</span></button>
<button className="p-xs text-secondary hover:text-primary transition-colors"><span className="material-symbols-outlined">chevron_right</span></button>
</div>
</div>
{/* Simple Calendar Grid */}
<div className="grid grid-cols-7 gap-y-sm text-center mb-sm">
<div className="font-label-sm text-label-sm text-secondary">S</div>
<div className="font-label-sm text-label-sm text-secondary">M</div>
<div className="font-label-sm text-label-sm text-secondary">T</div>
<div className="font-label-sm text-label-sm text-secondary">W</div>
<div className="font-label-sm text-label-sm text-secondary">T</div>
<div className="font-label-sm text-label-sm text-secondary">F</div>
<div className="font-label-sm text-label-sm text-secondary">S</div>
</div>
<div className="grid grid-cols-7 gap-y-sm text-center font-body-md">
{/* Empty days */}
<div className="p-sm text-outline">29</div>
<div className="p-sm text-outline">30</div>
<div className="p-sm text-outline">1</div>
<div className="p-sm text-primary">2</div>
<div className="p-sm text-primary">3</div>
<div className="p-sm text-primary">4</div>
<div className="p-sm text-primary relative">5
                                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"></div>
</div>
<div className="p-sm text-primary">6</div>
<div className="p-sm text-primary relative">7
                                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-secondary"></div>
</div>
<div className="p-sm text-primary">8</div>
<div className="p-sm text-primary">9</div>
<div className="p-sm text-primary">10</div>
<div className="p-sm text-primary">11</div>
<div className="p-sm text-primary">12</div>
<div className="p-sm text-primary relative">13</div>
<div className="p-sm text-primary">14</div>
<div className="p-sm bg-primary text-on-primary rounded-full relative">15</div> {/* Active Day */}
<div className="p-sm text-primary relative">16
                                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"></div>
</div>
<div className="p-sm text-primary">17</div>
<div className="p-sm text-primary">18</div>
<div className="p-sm text-primary">19</div>
</div>
</div>
{/* Availability Summary */}
<div className="bg-surface-container-lowest rounded-xl p-lg ambient-shadow border border-outline-variant/30 flex flex-col gap-md">
<h4 className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">This Week</h4>
<div className="flex justify-between items-end border-b border-outline-variant/20 pb-sm">
<span className="font-body-md text-primary">Consultations</span>
<span className="font-headline-md text-primary">8</span>
</div>
<div className="flex justify-between items-end border-b border-outline-variant/20 pb-sm">
<span className="font-body-md text-primary">Site Visits</span>
<span className="font-headline-md text-primary">3</span>
</div>
<div className="flex justify-between items-end pb-sm">
<span className="font-body-md text-primary">Open Slots</span>
<span className="font-headline-md text-secondary">4</span>
</div>
</div>
</div>
{/* Right Column: Agenda View */}
<div className="lg:col-span-8 flex flex-col gap-lg">
<div className="flex justify-between items-center mb-md border-b border-outline-variant/30 pb-sm">
<h3 className="font-headline-md text-primary">Tuesday, Oct 15</h3>
<div className="flex gap-md font-label-sm text-label-sm">
<button className="text-primary border-b-2 border-primary pb-xs">Agenda</button>
<button className="text-secondary hover:text-primary pb-xs transition-colors">Week</button>
</div>
</div>
{/* Event Item: Consultation */}
<div className="bg-surface-container-lowest rounded-xl p-lg ambient-shadow border-l-4 border-l-primary flex flex-col sm:flex-row gap-lg sm:items-center hover:bg-surface-container-low transition-colors group cursor-pointer">
<div className="flex flex-col min-w-[100px]">
<span className="font-headline-md text-primary">09:00</span>
<span className="font-label-sm text-label-sm text-secondary">10:00 AM</span>
</div>
<div className="flex-1 flex flex-col gap-xs">
<div className="flex items-center gap-sm">
<span className="px-2 py-1 bg-surface-dim rounded-sm font-label-sm text-[10px] text-primary uppercase tracking-widest">Virtual Call</span>
</div>
<h4 className="font-body-lg text-primary font-medium">Initial Design Consultation</h4>
<p className="font-body-md text-secondary flex items-center gap-xs">
<span className="material-symbols-outlined text-[16px]">person</span>
                                Sarah Jenkins • Minimalist Living Room Reno
                            </p>
</div>
<div className="flex sm:flex-col gap-sm sm:items-end opacity-0 group-hover:opacity-100 transition-opacity">
<button className="px-4 py-2 border border-outline-variant rounded-DEFAULT font-label-sm text-label-sm text-primary hover:bg-surface-container transition-colors">Join</button>
</div>
</div>
{/* Event Item: Site Visit */}
<div className="bg-surface-container-lowest rounded-xl p-lg ambient-shadow border-l-4 border-l-secondary flex flex-col sm:flex-row gap-lg sm:items-center hover:bg-surface-container-low transition-colors group cursor-pointer">
<div className="flex flex-col min-w-[100px]">
<span className="font-headline-md text-primary">11:30</span>
<span className="font-label-sm text-label-sm text-secondary">01:00 PM</span>
</div>
<div className="flex-1 flex flex-col gap-xs">
<div className="flex items-center gap-sm">
<span className="px-2 py-1 border border-outline-variant rounded-sm font-label-sm text-[10px] text-secondary uppercase tracking-widest">Site Visit</span>
</div>
<h4 className="font-body-lg text-primary font-medium">Space Measurement &amp; Assessment</h4>
<p className="font-body-md text-secondary flex items-center gap-xs">
<span className="material-symbols-outlined text-[16px]">location_on</span>
                                142 Artisan Lofts, Brooklyn
                            </p>
</div>
<div className="flex sm:flex-col gap-sm sm:items-end opacity-0 group-hover:opacity-100 transition-opacity">
<button className="px-4 py-2 border border-outline-variant rounded-DEFAULT font-label-sm text-label-sm text-primary hover:bg-surface-container transition-colors">Details</button>
</div>
</div>
{/* Break / Empty State Indicator */}
<div className="flex items-center gap-lg py-md opacity-60">
<div className="flex flex-col min-w-[100px]">
<span className="font-body-md text-secondary">01:00</span>
</div>
<div className="flex-1 border-t border-dashed border-outline-variant"></div>
<span className="font-label-sm text-label-sm text-secondary">Open Block</span>
</div>
{/* Event Item: Review */}
<div className="bg-surface-container-lowest rounded-xl p-lg ambient-shadow border-l-4 border-l-primary flex flex-col sm:flex-row gap-lg sm:items-center hover:bg-surface-container-low transition-colors group cursor-pointer">
<div className="flex flex-col min-w-[100px]">
<span className="font-headline-md text-primary">15:00</span>
<span className="font-label-sm text-label-sm text-secondary">16:30 PM</span>
</div>
<div className="flex-1 flex flex-col gap-xs">
<div className="flex items-center gap-sm">
<span className="px-2 py-1 bg-surface-dim rounded-sm font-label-sm text-[10px] text-primary uppercase tracking-widest">Virtual Call</span>
</div>
<h4 className="font-body-lg text-primary font-medium">Concept Presentation</h4>
<p className="font-body-md text-secondary flex items-center gap-xs">
<span className="material-symbols-outlined text-[16px]">person</span>
                                Marcus &amp; Elena • Kitchen Redesign
                            </p>
</div>
<div className="flex sm:flex-col gap-sm sm:items-end opacity-0 group-hover:opacity-100 transition-opacity">
<button className="px-4 py-2 border border-outline-variant rounded-DEFAULT font-label-sm text-label-sm text-primary hover:bg-surface-container transition-colors">Join</button>
</div>
</div>
</div>
</div>
</div>
</main>
{/* Mobile Bottom Nav (Visible only on mobile) */}
<nav className="md:hidden fixed bottom-0 w-full bg-surface-container border-t border-outline-variant/30 flex justify-around items-center h-16 z-50">
<a className="flex flex-col items-center gap-1 text-secondary p-2" href="#">
<span className="material-symbols-outlined text-[24px]">dashboard</span>
</a>
<a className="flex flex-col items-center gap-1 text-primary p-2" href="#">
<span className="material-symbols-outlined fill text-[24px]">calendar_month</span>
</a>
<a className="flex flex-col items-center gap-1 text-secondary p-2" href="#">
<span className="material-symbols-outlined text-[24px]">architecture</span>
</a>
<a className="flex flex-col items-center gap-1 text-secondary p-2" href="#">
<span className="material-symbols-outlined text-[24px]">group</span>
</a>
</nav>

    </>
  );
}
