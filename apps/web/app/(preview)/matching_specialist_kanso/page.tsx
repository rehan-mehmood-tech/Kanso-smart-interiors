export default function matchingspecialistkansoPage() {
  return (
    <>
      
{/* Blurred Background Image Container */}
<div className="absolute inset-0 z-0">
<div className="w-full h-full bg-cover bg-center opacity-30" data-alt="A highly blurred, out-of-focus interior shot of a high-end, minimalist living room with abundant natural light. Soft tones of bone white, taupe, and light stone create a calm, warm minimalist aesthetic. The light filters through sheer curtains, creating a serene, almost dreamlike backdrop perfect for an architectural editorial UI. The overall feel is premium, tranquil, and spacious." style={{ backgroundImage: "url('https" }}></div>
{/* Gradient Overlay to ensure text readability */}
<div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background"></div>
</div>
{/* Main Content Canvas (Transactional - Navigation Suppressed) */}
<main className="flex-grow flex flex-col items-center justify-center relative z-10 px-gutter md:px-0 max-w-container-max-app mx-auto w-full pt-xxl pb-xxl">
{/* Pulse Animation Section */}
<div className="relative flex items-center justify-center mb-xl w-48 h-48">
<div className="absolute inset-0 border border-primary/20 rounded-full pulse-ring"></div>
<div className="absolute inset-4 border border-primary/40 rounded-full pulse-ring" style={{ animationDelay: "0.8s" }}></div>
<div className="w-16 h-16 bg-primary rounded-full pulse-dot flex items-center justify-center shadow-ambient">
<span className="material-symbols-outlined text-on-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    search
                </span>
</div>
</div>
{/* Typography Context */}
<div className="text-center mb-xl max-w-lg">
<h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-primary mb-md tracking-tight">
                Finding your local specialist...
            </h1>
<p className="font-body-lg text-body-lg text-secondary">
                We are searching our network of curated interior designers and architects to find the perfect match for your vision.
            </p>
</div>
{/* Matching Criteria Card (Glassmorphism/Minimalist) */}
<div className="bg-surface-container-lowest/80 backdrop-blur-md rounded-xl p-xl shadow-ambient border border-outline-variant/50 w-full max-w-2xl">
<h2 className="font-label-sm text-label-sm text-secondary uppercase tracking-widest mb-lg text-center">
                Matching based on
            </h2>
<div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
{/* Criteria 1 */}
<div className="flex flex-col items-center p-md bg-surface-container-low rounded-lg border border-surface-container">
<span className="material-symbols-outlined text-secondary mb-sm text-2xl">
                        chair
                    </span>
<span className="font-label-sm text-label-sm text-secondary mb-xs">Your Style</span>
<span className="font-body-md text-body-md font-medium text-primary text-center">Japandi</span>
</div>
{/* Criteria 2 */}
<div className="flex flex-col items-center p-md bg-surface-container-low rounded-lg border border-surface-container">
<span className="material-symbols-outlined text-secondary mb-sm text-2xl">
                        location_on
                    </span>
<span className="font-label-sm text-label-sm text-secondary mb-xs">Your Location</span>
<span className="font-body-md text-body-md font-medium text-primary text-center">San Francisco</span>
</div>
{/* Criteria 3 */}
<div className="flex flex-col items-center p-md bg-surface-container-low rounded-lg border border-surface-container">
<span className="material-symbols-outlined text-secondary mb-sm text-2xl">
                        architecture
                    </span>
<span className="font-label-sm text-label-sm text-secondary mb-xs">Your Scope</span>
<span className="font-body-md text-body-md font-medium text-primary text-center">Full Living Room Remodel</span>
</div>
</div>
{/* Progress indication bar */}
<div className="mt-xl h-1 w-full bg-surface-container rounded-full overflow-hidden">
<div className="h-full bg-primary rounded-full w-1/3 animate-[progress_2s_ease-in-out_infinite_alternate]"></div>
</div>
</div>
{/* Cancel Action (Subtle) */}
<div className="mt-xl">
<button className="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors duration-300 uppercase tracking-widest bg-transparent border-none cursor-pointer">
                Cancel Search
            </button>
</div>
</main>
<style dangerouslySetInnerHTML={{ __html: `
        @keyframes progress {
            0% { width: 10%; transform: translateX(0); }
            100% { width: 30%; transform: translateX(230%); }
        }
    ` }} />

    </>
  );
}
