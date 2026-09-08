export default function bookingconfirmedkansoPage() {
  return (
    <>
      
{/* Ambient background texture / subtle gradient */}
<div className="absolute inset-0 z-0 opacity-30 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 30%, #e6e2dc 0%, transparent 60%)" }}></div>
{/* Main Content Canvas */}
<main className="w-full max-w-2xl mx-auto px-gutter py-xl relative z-10 flex flex-col items-center text-center">
{/* Success Icon */}
<div className="w-24 h-24 rounded-full bg-surface-container-highest flex items-center justify-center mb-12 animate-fade-in">
<span className="material-symbols-outlined text-primary text-4xl" data-weight="fill" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
</div>
{/* Headline */}
<h1 className="font-display-xl text-display-xl text-primary mb-6 animate-fade-in delay-100">
            Your Journey Begins
        </h1>
{/* Confirmation Message */}
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-[32rem] mb-12 animate-fade-in delay-200">
            Elena Rossi has been assigned to your project. Expect a call within 24 hours to discuss your vision and next steps.
        </p>
{/* Actions */}
<div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center animate-fade-in delay-300">
{/* Primary Action */}
<a className="inline-flex items-center justify-center px-8 py-4 bg-primary text-on-primary font-label-sm text-label-sm rounded-lg hover:bg-inverse-surface transition-colors duration-300 min-w-[240px]" href="#">
                View Project Dashboard
            </a>
{/* Secondary Action */}
<a className="inline-flex items-center justify-center px-8 py-4 border border-outline text-primary font-label-sm text-label-sm rounded-lg hover:bg-surface-container transition-colors duration-300 min-w-[240px]" href="#">
<span className="material-symbols-outlined mr-2 text-xl" style={{ fontVariationSettings: "'FILL' 0" }}>calendar_add_on</span>
                Add to Calendar
            </a>
</div>
</main>

    </>
  );
}
