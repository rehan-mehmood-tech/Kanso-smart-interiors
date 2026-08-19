export default function specialistprofilekansoPage() {
  return (
    <>
      
{/* TopAppBar */}
<header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-gutter py-md max-w-container-max-marketing mx-auto bg-background border-b border-outline-variant">
<div className="text-headline-md font-headline-md tracking-tighter text-primary">
            Kanso
        </div>
<nav className="hidden md:flex gap-lg">
<a className="text-secondary hover:text-primary transition-colors duration-300 font-label-sm text-label-sm" href="#">Projects</a>
<a className="text-secondary hover:text-primary transition-colors duration-300 font-label-sm text-label-sm" href="#">Portfolio</a>
<a className="text-secondary hover:text-primary transition-colors duration-300 font-label-sm text-label-sm" href="#">Materials</a>
</nav>
<div className="flex items-center">
<button className="text-primary hover:opacity-80 transition-opacity duration-200">
<span className="material-symbols-outlined" data-icon="account_circle" style={{ fontVariationSettings: "'FILL' 0" }}>account_circle</span>
</button>
</div>
</header>
{/* Main Content */}
<main className="flex-grow pt-[100px] pb-xxl px-margin-mobile md:px-gutter max-w-container-max-app mx-auto w-full">
{/* Profile Header Section */}
<section className="flex flex-col md:flex-row gap-xl md:gap-xxl items-start mb-xxl">
{/* Profile Image */}
<div className="w-full md:w-1/3 flex-shrink-0">
<div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden ambient-shadow border border-surface-container-highest">
<img alt="Elena Rossi" className="object-cover w-full h-full" data-alt="A highly professional and sophisticated portrait of an architectural designer, Elena Rossi. She is standing in a brightly lit, minimalist studio with subtle architectural models in the background. The lighting is soft and natural, emphasizing a clean, contemporary aesthetic. She wears neutral, tailored clothing fitting a premium design consultant. The mood is calm, confident, and editorial, perfectly aligned with a luxury design brand." src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85"/>
</div>
</div>
{/* Profile Info */}
<div className="w-full md:w-2/3 flex flex-col justify-center">
<h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-primary mb-sm">Elena Rossi</h1>
<p className="text-body-lg font-body-lg text-secondary mb-lg">Architectural Designer &amp; Spatial Consultant</p>
<div className="prose prose-p:text-body-md prose-p:font-body-md text-on-surface-variant max-w-3xl mb-xl">
<p>
                        Elena specializes in crafting environments that embody 'Quiet Luxury'—spaces that speak through material integrity and spatial harmony rather than overt decoration. With over a decade of experience in residential and boutique commercial design, her approach is deeply tactile and intentionally reductive, drawing inspiration from natural light and pure architectural forms.
                    </p>
</div>
{/* Expertise/Materials */}
<div className="mb-xl">
<h3 className="text-label-sm font-label-sm text-secondary uppercase tracking-wider mb-md">Key Materials</h3>
<div className="flex flex-wrap gap-sm">
<span className="px-md py-xs bg-surface-container-lowest border border-outline-variant rounded-sm text-label-sm font-label-sm text-on-surface">Limestone</span>
<span className="px-md py-xs bg-surface-container-lowest border border-outline-variant rounded-sm text-label-sm font-label-sm text-on-surface">European Oak</span>
<span className="px-md py-xs bg-surface-container-lowest border border-outline-variant rounded-sm text-label-sm font-label-sm text-on-surface">Tadelakt</span>
<span className="px-md py-xs bg-surface-container-lowest border border-outline-variant rounded-sm text-label-sm font-label-sm text-on-surface">Brushed Brass</span>
</div>
</div>
{/* CTA */}
<div>
<button className="bg-primary text-on-primary px-lg py-md rounded-lg font-label-sm text-label-sm uppercase tracking-wider hover:bg-secondary transition-colors duration-300 ambient-shadow">
                        Schedule Introductory Call
                    </button>
</div>
</div>
</section>
{/* Gallery Section (Bento Grid) */}
<section>
<div className="flex justify-between items-end mb-lg">
<h2 className="text-headline-md font-headline-md text-primary">Selected Works</h2>
<span className="text-label-sm font-label-sm text-secondary uppercase">Quiet Luxury</span>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-md">
{/* Large Feature Image */}
<div className="md:col-span-2 relative aspect-[4/3] rounded-lg overflow-hidden ambient-shadow group cursor-pointer border border-surface-container-highest">
<img alt="Project 1" className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" data-alt="A stunning interior shot of a minimalist living space designed in a 'Quiet Luxury' style. The room features a large, plush modular sofa in bone white, resting on a textured limestone floor. Soft, diffused daylight pours through floor-to-ceiling sheer curtains, highlighting the subtle grain of a European oak coffee table. The overall palette is neutral, calm, and sophisticated, reflecting high-end architectural editorial photography." src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85"/>
<div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-lg">
<span className="text-on-primary font-body-md text-body-md">Villa Lyskamm</span>
</div>
</div>
{/* Stacked Smaller Images */}
<div className="flex flex-col gap-md">
<div className="relative flex-1 rounded-lg overflow-hidden ambient-shadow group cursor-pointer border border-surface-container-highest">
<img alt="Project 2" className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" data-alt="A detailed close-up shot of architectural materials in a high-end interior. The image focuses on a seamless transition between smooth Tadelakt plaster walls and a brushed brass fixture. The lighting is moody and directional, emphasizing the tactile quality of the surfaces. The aesthetic is extremely clean, modern, and aligned with minimalist luxury design principles." src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=85"/>
<div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-md">
<span className="text-on-primary font-label-sm text-label-sm">Materiality Study</span>
</div>
</div>
<div className="relative flex-1 rounded-lg overflow-hidden ambient-shadow group cursor-pointer border border-surface-container-highest">
<img alt="Project 3" className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" data-alt="A serene, minimalist dining room featuring a long, solid European oak table surrounded by sculptural wooden chairs. The walls are a soft, warm bone white with minimal art. A large window frames a view of a serene courtyard, allowing natural light to wash over the space. The composition is highly structured, elegant, and perfectly aligned with a premium architectural gallery style." src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85"/>
<div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-md">
<span className="text-on-primary font-label-sm text-label-sm">Oak House</span>
</div>
</div>
</div>
</div>
</section>
</main>
{/* Footer */}
<footer className="w-full py-xl px-gutter flex flex-col md:flex-row justify-between items-center max-w-container-max-marketing mx-auto bg-surface-container-lowest border-t border-outline-variant">
<div className="text-headline-md font-headline-md text-primary mb-md md:mb-0">
            Kanso
        </div>
<nav className="flex gap-lg mb-md md:mb-0">
<a className="text-secondary hover:text-primary transition-colors font-label-sm text-label-sm" href="#">Privacy Policy</a>
<a className="text-secondary hover:text-primary transition-colors font-label-sm text-label-sm" href="#">Terms of Service</a>
<a className="text-secondary hover:text-primary transition-colors font-label-sm text-label-sm" href="#">Sustainability</a>
<a className="text-secondary hover:text-primary transition-colors font-label-sm text-label-sm" href="#">Contact</a>
</nav>
<div className="text-secondary font-label-sm text-label-sm">
            © 2024 Kanso Interior Design. All rights reserved.
        </div>
</footer>

    </>
  );
}
