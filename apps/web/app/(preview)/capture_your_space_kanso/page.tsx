export default function captureyourspacekansoPage() {
  return (
    <>
      
{/* Minimal Header for Wizard Flow */}
<header className="w-full px-gutter py-md flex justify-between items-center border-b border-outline-variant/30">
<div className="text-headline-md font-headline-md font-bold tracking-tight text-primary">Kanso</div>
<div className="text-label-sm font-label-sm text-secondary uppercase tracking-wider">Step 2 of 4</div>
</header>
{/* Main Content Area */}
<main className="flex-grow w-full max-w-container-max-app mx-auto px-gutter py-xl md:py-xxl flex flex-col items-center">
{/* Typography Header */}
<div className="text-center max-w-2xl mx-auto mb-xl">
<h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-primary mb-sm">Capture Your Space</h1>
<p className="text-body-lg font-body-lg text-secondary">We'll use four views of your room to create a more complete visual concept.</p>
</div>
{/* 2x2 Grid for Photos */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-md w-full max-w-4xl mx-auto mb-xl">
{/* Upload Slot 1 */}
<button className="upload-slot group relative bg-surface-container-lowest border border-outline-variant rounded-xl aspect-[4/3] flex flex-col items-center justify-center p-lg overflow-hidden transition-all duration-300 hover:border-outline focus:outline-none focus:ring-2 focus:ring-outline" data-slot="1">
<div className="absolute inset-0 bg-surface-variant opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-0"></div>
<div className="relative z-10 flex flex-col items-center transition-transform duration-300 group-hover:-translate-y-1">
<span className="material-symbols-outlined text-outline text-4xl mb-md" data-icon="view_in_ar">view_in_ar</span>
<span className="text-label-sm font-label-sm text-secondary uppercase mb-xs">Wall 1 of 4</span>
<span className="text-body-md font-body-md text-primary font-medium">Upload Photo</span>
</div>
</button>
{/* Upload Slot 2 */}
<button className="upload-slot group relative bg-surface-container-lowest border border-outline-variant rounded-xl aspect-[4/3] flex flex-col items-center justify-center p-lg overflow-hidden transition-all duration-300 hover:border-outline focus:outline-none focus:ring-2 focus:ring-outline" data-slot="2">
<div className="absolute inset-0 bg-surface-variant opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-0"></div>
<div className="relative z-10 flex flex-col items-center transition-transform duration-300 group-hover:-translate-y-1">
<span className="material-symbols-outlined text-outline text-4xl mb-md" data-icon="view_in_ar" style={{ transform: "rotate(90deg)" }}>view_in_ar</span>
<span className="text-label-sm font-label-sm text-secondary uppercase mb-xs">Wall 2 of 4</span>
<span className="text-body-md font-body-md text-primary font-medium">Upload Photo</span>
</div>
</button>
{/* Upload Slot 3 */}
<button className="upload-slot group relative bg-surface-container-lowest border border-outline-variant rounded-xl aspect-[4/3] flex flex-col items-center justify-center p-lg overflow-hidden transition-all duration-300 hover:border-outline focus:outline-none focus:ring-2 focus:ring-outline" data-slot="3">
<div className="absolute inset-0 bg-surface-variant opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-0"></div>
<div className="relative z-10 flex flex-col items-center transition-transform duration-300 group-hover:-translate-y-1">
<span className="material-symbols-outlined text-outline text-4xl mb-md" data-icon="view_in_ar" style={{ transform: "rotate(180deg)" }}>view_in_ar</span>
<span className="text-label-sm font-label-sm text-secondary uppercase mb-xs">Wall 3 of 4</span>
<span className="text-body-md font-body-md text-primary font-medium">Upload Photo</span>
</div>
</button>
{/* Upload Slot 4 */}
<button className="upload-slot group relative bg-surface-container-lowest border border-outline-variant rounded-xl aspect-[4/3] flex flex-col items-center justify-center p-lg overflow-hidden transition-all duration-300 hover:border-outline focus:outline-none focus:ring-2 focus:ring-outline" data-slot="4">
<div className="absolute inset-0 bg-surface-variant opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-0"></div>
<div className="relative z-10 flex flex-col items-center transition-transform duration-300 group-hover:-translate-y-1">
<span className="material-symbols-outlined text-outline text-4xl mb-md" data-icon="view_in_ar" style={{ transform: "rotate(270deg)" }}>view_in_ar</span>
<span className="text-label-sm font-label-sm text-secondary uppercase mb-xs">Wall 4 of 4</span>
<span className="text-body-md font-body-md text-primary font-medium">Upload Photo</span>
</div>
</button>
</div>
{/* Tips Section */}
<div className="bg-surface-container px-lg py-md rounded-lg flex items-start gap-md max-w-2xl w-full mb-xl">
<span className="material-symbols-outlined text-secondary mt-xs" data-icon="lightbulb">lightbulb</span>
<div>
<span className="text-label-sm font-label-sm text-secondary uppercase block mb-xs">Tips for best results</span>
<p className="text-body-md font-body-md text-on-surface-variant">Face the wall directly and keep your phone around eye level. Ensure the room is well lit.</p>
</div>
</div>
{/* Actions */}
<div className="w-full max-w-4xl flex justify-center mt-auto md:mt-0 pt-lg border-t border-outline-variant/30">
<button className="bg-surface-variant text-on-surface-variant px-xxl py-md rounded-lg text-body-md font-body-md font-medium transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto" disabled={true} id="continue-btn">
                Continue
            </button>
</div>
</main>
{/* JavaScript for Interactive Prototyping (Simulates Upload) */}
<script dangerouslySetInnerHTML={{ __html: `
        document.addEventListener('DOMContentLoaded', () => {
            const slots = document.querySelectorAll('.upload-slot');
            const continueBtn = document.getElementById('continue-btn');
            let uploadedCount = 0;

            slots.forEach(slot => {
                slot.addEventListener('click', function() {
                    // Simulate checking if already uploaded
                    if (!this.classList.contains('uploaded')) {
                        // Mark as uploaded visually
                        this.classList.add('uploaded');
                        
                        // Update inner HTML to reflect uploaded state (subtle checkmark, remove text)
                        const content = this.querySelector('.z-10');
                        content.innerHTML = \`
                            <span class="material-symbols-outlined text-secondary text-4xl mb-sm" data-icon="check_circle">check_circle</span>
                            <span class="text-label-sm font-label-sm text-secondary uppercase">Captured</span>
                        \`;
                        
                        // Change border color to indicate success subtly
                        this.classList.remove('border-outline-variant');
                        this.classList.add('border-secondary/50', 'bg-surface');

                        uploadedCount++;
                        checkCompletion();
                    }
                });
            });

            function checkCompletion() {
                if (uploadedCount === 4) {
                    continueBtn.disabled = false;
                    continueBtn.classList.remove('bg-surface-variant', 'text-on-surface-variant');
                    continueBtn.classList.add('bg-primary', 'text-on-primary', 'hover:bg-primary/90');
                }
            }
        });
    ` }} />

    </>
  );
}
