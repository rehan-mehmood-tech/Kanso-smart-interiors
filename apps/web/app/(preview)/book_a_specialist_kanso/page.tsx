export default function bookaspecialistkansoPage() {
  return (
    <>
      
{/* TopAppBar */}
<header className="bg-background text-primary docked full-width top-0 border-b border-outline-variant flat no shadows fixed top-0 left-0 w-full z-50 flex justify-between items-center px-gutter py-md max-w-container-max-marketing mx-auto">
<a className="text-headline-md font-headline-md tracking-tighter text-primary" href="#">Kanso</a>
<nav className="hidden md:flex gap-lg">
<a className="text-secondary hover:text-primary transition-colors duration-300 font-label-sm text-label-sm" href="#">Projects</a>
<a className="text-secondary hover:text-primary transition-colors duration-300 font-label-sm text-label-sm" href="#">Portfolio</a>
<a className="text-secondary hover:text-primary transition-colors duration-300 font-label-sm text-label-sm" href="#">Materials</a>
</nav>
<div className="flex items-center gap-sm">
<button className="p-sm text-secondary hover:text-primary transition-colors duration-300">
<span className="material-symbols-outlined" data-icon="account_circle">account_circle</span>
</button>
</div>
</header>
{/* Main Content Canvas (Navigation Suppressed logic handles hiding sidenav/bottomnav for transactional page) */}
<main className="flex-grow pt-[80px] pb-xl md:pb-xxl">
{/* Split Layout for Lead Gen */}
<section className="max-w-container-max-app mx-auto px-margin-mobile md:px-gutter grid grid-cols-1 md:grid-cols-12 gap-xl md:gap-gutter min-h-[calc(100vh-80px-200px)] items-center">
{/* Left Side: Editorial Context & Form */}
<div className="md:col-span-5 md:col-start-2 lg:col-span-4 lg:col-start-2 flex flex-col justify-center space-y-xl z-10 py-xl">
<div className="space-y-sm md:space-y-md">
<p className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">Book a Specialist</p>
<h1 className="font-display-xl text-[48px] md:text-display-xl leading-tight">Begin Your Physical Transformation</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-md pt-sm">Connect with a local Kanso-certified specialist to bring your vision to life.</p>
</div>
<div className="bg-surface-container-lowest rounded-xl shadow-ambient border border-surface-highest p-lg md:p-xl mt-lg relative overflow-hidden">
<form className="space-y-lg relative z-10">
<div className="space-y-md">
<div>
<label className="block font-label-sm text-label-sm text-on-surface mb-xs" htmlFor="fullName">Full Name</label>
<input className="w-full text-body-md font-body-md placeholder-secondary-fixed-dim focus:ring-0" id="fullName" name="fullName" placeholder="Jane Doe" required={true} type="text"/>
</div>
<div>
<label className="block font-label-sm text-label-sm text-on-surface mb-xs" htmlFor="email">Email Address</label>
<input className="w-full text-body-md font-body-md placeholder-secondary-fixed-dim focus:ring-0" id="email" name="email" placeholder="jane@example.com" required={true} type="email"/>
</div>
<div>
<label className="block font-label-sm text-label-sm text-on-surface mb-xs" htmlFor="location">Project Location</label>
<input className="w-full text-body-md font-body-md placeholder-secondary-fixed-dim focus:ring-0" id="location" name="location" placeholder="City, State, or Zip" required={true} type="text"/>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-md">
<div>
<label className="block font-label-sm text-label-sm text-on-surface mb-xs" htmlFor="budget">Budget Range</label>
<select className="w-full text-body-md font-body-md text-on-surface bg-transparent focus:ring-0" id="budget" name="budget">
<option disabled={true} selected={true} value="">Select Budget</option>
<option value="10k-50k">$10k - $50k</option>
<option value="50k-150k">$50k - $150k</option>
<option value="150k+">$150k+</option>
</select>
</div>
<div>
<label className="block font-label-sm text-label-sm text-on-surface mb-xs" htmlFor="timeline">Timeline</label>
<select className="w-full text-body-md font-body-md text-on-surface bg-transparent focus:ring-0" id="timeline" name="timeline">
<option disabled={true} selected={true} value="">Select Timeline</option>
<option value="asap">Immediate</option>
<option value="3months">1-3 Months</option>
<option value="6months+">6+ Months</option>
</select>
</div>
</div>
</div>
<div className="pt-md">
<button className="w-full bg-primary text-on-primary py-3 px-6 rounded hover:bg-tertiary-container transition-colors duration-300 font-label-sm text-label-sm flex justify-between items-center group" type="submit">
<span>Request Consultation</span>
<span className="material-symbols-outlined transform group-hover:translate-x-1 transition-transform" data-icon="arrow_forward">arrow_forward</span>
</button>
</div>
</form>
</div>
</div>
{/* Right Side: High-End Photography Background */}
<div className="md:col-span-6 lg:col-span-6 h-[400px] md:h-full min-h-[600px] relative rounded-xl overflow-hidden shadow-ambient">
<div className="bg-cover bg-center w-full h-full absolute inset-0" data-alt="A striking interior architectural photograph featuring a minimalist living space bathed in natural light from floor-to-ceiling windows. The room showcases high-end, tactile materials like raw travertine stone floors, limewashed bone-white walls, and deeply grained charcoal oak furniture. The composition is highly structured and editorial, evoking a sense of calm and sophisticated spatial intelligence, perfectly aligned with a premium light-mode aesthetic." style={{ backgroundImage: "url('https" }}></div>
{/* Subtle overlay to ensure it feels integrated, not just slapped on */}
<div className="absolute inset-0 bg-gradient-to-t from-primary-container/20 to-transparent mix-blend-multiply"></div>
</div>
</section>
</main>
{/* Footer */}
<footer className="bg-surface-container-lowest text-secondary full-width bottom-0 border-t border-outline-variant flat no shadows w-full py-xl px-gutter flex flex-col md:flex-row justify-between items-center max-w-container-max-marketing mx-auto mt-auto">
<div className="mb-lg md:mb-0">
<span className="text-headline-md font-headline-md text-primary">Kanso</span>
<p className="font-label-sm text-label-sm mt-xs">© 2024 Kanso Interior Design. All rights reserved.</p>
</div>
<nav className="flex flex-wrap justify-center gap-lg">
<a className="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors ease-in-out" href="#">Privacy Policy</a>
<a className="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors ease-in-out" href="#">Terms of Service</a>
<a className="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors ease-in-out" href="#">Sustainability</a>
<a className="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors ease-in-out" href="#">Contact</a>
</nav>
</footer>

    </>
  );
}
