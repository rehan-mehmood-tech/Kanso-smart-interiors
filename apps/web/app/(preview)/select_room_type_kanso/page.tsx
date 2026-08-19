export default function selectroomtypekansoPage() {
  return (
    <>
      
{/* Header / Nav Shell */}
<header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-gutter py-md max-w-container-max-marketing mx-auto bg-background dark:bg-background border-b border-outline-variant dark:border-outline">
<div className="text-headline-md font-headline-md tracking-tighter text-primary dark:text-on-background">
            Kanso
        </div>
<nav className="hidden md:flex space-x-lg">
<a className="text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-on-background transition-colors duration-300 font-label-sm text-label-sm" href="#">Projects</a>
<a className="text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-on-background transition-colors duration-300 font-label-sm text-label-sm" href="#">Portfolio</a>
<a className="text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-on-background transition-colors duration-300 font-label-sm text-label-sm" href="#">Materials</a>
</nav>
<button className="text-primary dark:text-on-background opacity-80 transition-opacity duration-200 hover:opacity-100">
<span aria-hidden="true" className="material-symbols-outlined" data-icon="account_circle">account_circle</span>
</button>
</header>
{/* Main Content Canvas */}
<main className="flex-grow pt-[100px] pb-[120px] px-gutter md:px-xl max-w-container-max-app mx-auto w-full flex flex-col items-center">
{/* Wizard Progress & Header */}
<div className="w-full max-w-4xl mb-xl text-center md:text-left mt-lg">
<p className="font-label-sm text-label-sm text-secondary uppercase tracking-widest mb-sm">Step 1 of 4</p>
<h1 className="font-display-xl text-display-xl text-primary mb-md">Which room are we designing?</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">Select the primary space you want to focus on to help us tailor our architectural editorial approach to your project.</p>
</div>
{/* Room Selection Grid */}
<div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
{/* Living Room Card */}
<div className="room-card cursor-pointer bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden flex flex-col shadow-[0_4px_24px_rgba(0,0,0,0.04)]" >
<div className="h-48 w-full overflow-hidden relative bg-surface-variant">
<img alt="Living Room preview" className="object-cover w-full h-full absolute inset-0 transition-transform duration-700 hover:scale-105" data-alt="A brightly lit, minimalist living room featuring warm bone white walls, a plush low-profile cream sofa, and subtle architectural details. The space is styled with high-end editorial precision, natural light pouring in from tall windows, casting soft ambient shadows on wide-plank oak flooring. The mood is calm, sophisticated, and spatial." src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85"/>
</div>
<div className="p-md flex items-center justify-between">
<span className="font-headline-md text-headline-md text-primary">Living Room</span>
<span className="material-symbols-outlined text-outline-variant check-icon hidden" data-icon="check_circle">check_circle</span>
</div>
</div>
{/* Bedroom Card */}
<div className="room-card cursor-pointer bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden flex flex-col shadow-[0_4px_24px_rgba(0,0,0,0.04)]" >
<div className="h-48 w-full overflow-hidden relative bg-surface-variant">
<img alt="Bedroom preview" className="object-cover w-full h-full absolute inset-0 transition-transform duration-700 hover:scale-105" data-alt="A serene, minimalist bedroom bathed in soft morning light. A low-profile platform bed dressed in crisp white luxury linens sits centrally. The walls are a calming light stone tone. Subtle tactile textures like a wool rug and a sculptural bedside lamp add warmth. The aesthetic is clean, restorative, and architectural." src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85"/>
</div>
<div className="p-md flex items-center justify-between">
<span className="font-headline-md text-headline-md text-primary">Bedroom</span>
<span className="material-symbols-outlined text-outline-variant check-icon hidden" data-icon="check_circle">check_circle</span>
</div>
</div>
{/* Dining Room Card */}
<div className="room-card cursor-pointer bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden flex flex-col shadow-[0_4px_24px_rgba(0,0,0,0.04)]" >
<div className="h-48 w-full overflow-hidden relative bg-surface-variant">
<img alt="Dining Room preview" className="object-cover w-full h-full absolute inset-0 transition-transform duration-700 hover:scale-105" data-alt="An elegant minimalist dining room featuring a sculptural solid oak table and understated black dining chairs. A striking oversized contemporary pendant light hangs above. The room is enveloped in warm minimalist hues, with generous whitespace and diffuse ambient shadows creating a sophisticated, gallery-like atmosphere." src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=85"/>
</div>
<div className="p-md flex items-center justify-between">
<span className="font-headline-md text-headline-md text-primary">Dining Room</span>
<span className="material-symbols-outlined text-outline-variant check-icon hidden" data-icon="check_circle">check_circle</span>
</div>
</div>
{/* Home Office Card */}
<div className="room-card cursor-pointer bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden flex flex-col shadow-[0_4px_24px_rgba(0,0,0,0.04)]" >
<div className="h-48 w-full overflow-hidden relative bg-surface-variant">
<img alt="Home Office preview" className="object-cover w-full h-full absolute inset-0 transition-transform duration-700 hover:scale-105" data-alt="A focused, minimalist home office space. A sleek, unadorned walnut desk is positioned against a clean white wall. Minimalist shelving holds a few curated architectural books and an architectural model. The lighting is bright and intentional, creating a productive yet calming environment with sharp, clean lines and warm undertones." src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85"/>
</div>
<div className="p-md flex items-center justify-between">
<span className="font-headline-md text-headline-md text-primary">Home Office</span>
<span className="material-symbols-outlined text-outline-variant check-icon hidden" data-icon="check_circle">check_circle</span>
</div>
</div>
{/* Kids Room Card */}
<div className="room-card cursor-pointer bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden flex flex-col shadow-[0_4px_24px_rgba(0,0,0,0.04)]" >
<div className="h-48 w-full overflow-hidden relative bg-surface-variant">
<img alt="Kids Room preview" className="object-cover w-full h-full absolute inset-0 transition-transform duration-700 hover:scale-105" data-alt="A modern, sophisticated kids room that maintains a minimalist aesthetic. Soft pastel accents in muted terracotta and sage green compliment a bone white base. Simple, playful geometric furniture pieces are arranged thoughtfully. The room feels airy, bright, and organized, reflecting a high-end editorial approach to playful spaces." src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85"/>
</div>
<div className="p-md flex items-center justify-between">
<span className="font-headline-md text-headline-md text-primary">Kids Room</span>
<span className="material-symbols-outlined text-outline-variant check-icon hidden" data-icon="check_circle">check_circle</span>
</div>
</div>
{/* Other / Custom Card */}
<div className="room-card cursor-pointer bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden flex flex-col shadow-[0_4px_24px_rgba(0,0,0,0.04)]" >
<div className="h-48 w-full flex items-center justify-center bg-surface-container-low border-b border-outline-variant">
<span className="material-symbols-outlined text-display-xl text-outline-variant font-light" data-icon="add" style={{ fontSize: "64px" }}>add</span>
</div>
<div className="p-md flex flex-col justify-center h-full min-h-[72px]">
<div className="flex items-center justify-between w-full" id="other-label-container">
<span className="font-headline-md text-headline-md text-primary">Other</span>
<span className="material-symbols-outlined text-outline-variant check-icon hidden" data-icon="check_circle">check_circle</span>
</div>
{/* Hidden input field shown only when selected */}
<div className="hidden w-full mt-sm" id="custom-room-input-container" >
<input className="kanso-input w-full font-body-md text-body-md text-primary placeholder:text-outline-variant" id="custom-room-input" placeholder="Specify room type..." type="text"/>
</div>
</div>
</div>
</div>
</main>
{/* Sticky Bottom Action Bar */}
<div className="fixed bottom-0 left-0 w-full bg-surface-container-lowest/90 backdrop-blur-md border-t border-outline-variant p-md md:px-xl z-40 flex justify-between items-center shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
<div className="max-w-container-max-app mx-auto w-full flex justify-between items-center">
<button className="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors flex items-center gap-sm">
<span className="material-symbols-outlined text-sm" data-icon="arrow_back">arrow_back</span>
                Back
            </button>
<button className="bg-primary text-on-primary font-label-sm text-label-sm px-lg py-sm rounded-lg opacity-50 cursor-not-allowed transition-all duration-300 flex items-center gap-sm" disabled={true} id="continue-btn">
                Continue
                <span className="material-symbols-outlined text-sm" data-icon="arrow_forward">arrow_forward</span>
</button>
</div>
</div>
{/* Script for interaction logic */}
<script dangerouslySetInnerHTML={{ __html: `
        function selectCard(clickedCard, isCustom = false) {
            // Deselect all cards
            document.querySelectorAll('.room-card').forEach(card => {
                card.classList.remove('selected');
                card.querySelector('.check-icon')?.classList.add('hidden');
                
                // Reset the 'Other' card specific elements if needed
                const customInputContainer = card.querySelector('#custom-room-input-container');
                const labelContainer = card.querySelector('#other-label-container');
                if (customInputContainer && !isCustom) {
                    customInputContainer.classList.add('hidden');
                    labelContainer.classList.remove('hidden');
                }
            });

            // Select clicked card
            clickedCard.classList.add('selected');
            
            // Show checkmark, but handle custom differently
            if (!isCustom) {
                const checkIcon = clickedCard.querySelector('.check-icon');
                if (checkIcon) {
                    checkIcon.classList.remove('hidden');
                    checkIcon.classList.add('text-primary');
                    checkIcon.classList.remove('text-outline-variant');
                }
            } else {
                // Handle 'Other' card specifics
                const inputContainer = clickedCard.querySelector('#custom-room-input-container');
                const labelContainer = clickedCard.querySelector('#other-label-container');
                const input = clickedCard.querySelector('#custom-room-input');
                
                labelContainer.classList.add('hidden');
                inputContainer.classList.remove('hidden');
                setTimeout(() => input.focus(), 50); // slight delay to allow layout to settle
            }

            // Enable Continue button
            const continueBtn = document.getElementById('continue-btn');
            continueBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            continueBtn.removeAttribute('disabled');
        }

        // Prevent input clicks from deselecting the 'Other' card
        document.getElementById('custom-room-input').addEventListener('click', function(e) {
            e.stopPropagation();
        });
    ` }} />

    </>
  );
}
