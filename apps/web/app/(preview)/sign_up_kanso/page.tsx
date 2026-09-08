import Image from 'next/image';

export default function signupkansoPage() {
  return (
    <>
      
{/* Left Split: Image (Hidden on Mobile) */}
<div className="hidden lg:block lg:w-1/2 relative bg-surface-container-lowest overflow-hidden">
<Image
  src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85"
  alt="A serene, minimalist living space featuring a sculptural wooden chair against a smooth, soft beige plaster wall."
  fill
  priority
  sizes="(max-width: 1024px) 100vw, 50vw"
  className="object-cover object-center transition-transform duration-[20s] ease-out hover:scale-105"
/>
{/* Subtle gradient overlay to soften the image edge */}
<div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface/40"></div>
{/* Logo Overlay */}
<div className="absolute top-xl left-xl z-10">
<span className="font-display-xl text-headline-md tracking-tighter text-on-primary">Kanso</span>
</div>
</div>
{/* Right Split: Form */}
<div className="w-full lg:w-1/2 flex flex-col justify-center px-margin-mobile md:px-xl py-xxl bg-surface relative z-10">
{/* Mobile Logo (Visible only on mobile) */}
<div className="lg:hidden absolute top-xl left-margin-mobile">
<span className="font-display-xl text-headline-md tracking-tighter text-primary">Kanso</span>
</div>
<div className="w-full max-w-[28rem] mx-auto fade-in">
{/* Header */}
<div className="mb-xl text-center lg:text-left">
<h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-sm">Create an Account</h1>
<p className="font-body-md text-body-md text-secondary">Begin your journey to a more intentional space.</p>
</div>
{/* Form */}
<form action="#" className="space-y-md fade-in delay-100" method="POST">
{/* Full Name Input */}
<div className="relative">
<label className="sr-only" htmlFor="fullName">Full Name</label>
<input className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-secondary focus:ring-0 px-0 py-sm font-body-lg text-body-lg text-primary placeholder-secondary-fixed-dim transition-colors duration-300" id="fullName" name="fullName" placeholder="Full Name" required={true} type="text"/>
</div>
{/* Email Input */}
<div className="relative">
<label className="sr-only" htmlFor="email">Email address</label>
<input className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-secondary focus:ring-0 px-0 py-sm font-body-lg text-body-lg text-primary placeholder-secondary-fixed-dim transition-colors duration-300" id="email" name="email" placeholder="Email address" required={true} type="email"/>
</div>
{/* Password Input */}
<div className="relative">
<label className="sr-only" htmlFor="password">Password</label>
<input className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-secondary focus:ring-0 px-0 py-sm font-body-lg text-body-lg text-primary placeholder-secondary-fixed-dim transition-colors duration-300" id="password" name="password" placeholder="Password" required={true} type="password"/>
</div>
<div className="pt-sm">
<p className="font-label-sm text-label-sm text-secondary-fixed-dim normal-case tracking-normal mb-md">
                        By signing up, you agree to our <a className="text-primary hover:underline underline-offset-4" href="#">Terms of Service</a> and <a className="text-primary hover:underline underline-offset-4" href="#">Privacy Policy</a>.
                    </p>
</div>
{/* Submit Button */}
<button className="w-full bg-primary text-on-primary font-body-md text-body-md py-md rounded-DEFAULT hover:opacity-90 transition-opacity duration-300 flex items-center justify-center gap-sm mt-lg" type="submit">
                    Get Started
                    <span className="material-symbols-outlined text-[20px]" data-icon="arrow_forward">arrow_forward</span>
</button>
</form>
{/* Footer Link */}
<div className="mt-xl text-center fade-in delay-200">
<p className="font-body-md text-body-md text-secondary">
                    Already have an account? 
                    <a className="text-primary font-medium hover:underline underline-offset-4 transition-all" href="#">Log in</a>
</p>
</div>
</div>
</div>

    </>
  );
}
