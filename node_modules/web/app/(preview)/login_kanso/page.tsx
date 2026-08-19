import Image from 'next/image';

export default function loginkansoPage() {
  return (
    <>
      
<main className="flex min-h-screen w-full flex-col lg:flex-row">
{/* Left Hemisphere: Imagery Canvas */}
<section className="hidden lg:flex lg:w-1/2 relative bg-surface-container-lowest overflow-hidden">
<Image
  src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=85"
  alt="A high-fidelity architectural editorial photograph of a serene, minimalist living room bathed in soft natural light."
  fill
  priority
  sizes="(max-width: 1024px) 100vw, 50vw"
  className="object-cover object-center transition-transform duration-[20s] ease-out hover:scale-105"
/>
{/* Optional subtle overlay for text contrast if needed in future, currently kept perfectly clean */}
<div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent"></div>
<div className="absolute top-12 left-12">
{/* Branding embedded in the canvas */}
<span className="font-display-xl text-headline-md tracking-tighter text-on-primary drop-shadow-md">Kanso</span>
</div>
</section>
{/* Right Hemisphere: Authentication Form */}
<section className="flex-1 flex flex-col justify-center items-center px-margin-mobile py-xl lg:px-xxl lg:py-xxl bg-surface relative">
{/* Mobile Branding Header (Only visible on small screens) */}
<div className="absolute top-8 left-margin-mobile lg:hidden">
<span className="font-display-xl text-headline-md tracking-tighter text-primary">Kanso</span>
</div>
<div className="w-full max-w-[420px] mx-auto space-y-xl">
{/* Intent Header */}
<div className="space-y-sm text-center lg:text-left">
<h1 className="font-headline-lg-mobile text-headline-lg-mobile lg:font-headline-lg lg:text-headline-lg text-on-surface">
                        Welcome back.
                    </h1>
<p className="font-body-md text-body-md text-secondary">
                        Sign in to continue designing your space.
                    </p>
</div>
{/* Form Canvas */}
<form action="#" className="space-y-lg" method="POST">
<div className="space-y-md">
{/* Email Field */}
<div className="relative">
<label className="sr-only" htmlFor="email">Email address</label>
<input autoComplete="email" className="w-full appearance-none border-0 border-b border-outline-variant bg-transparent px-0 py-sm font-body-md text-body-md text-on-surface placeholder:text-outline focus:border-on-surface focus:ring-0 transition-colors duration-300" id="email" name="email" placeholder="Email address" required={true} type="email"/>
</div>
{/* Password Field */}
<div className="relative">
<label className="sr-only" htmlFor="password">Password</label>
<input autoComplete="current-password" className="w-full appearance-none border-0 border-b border-outline-variant bg-transparent px-0 py-sm font-body-md text-body-md text-on-surface placeholder:text-outline focus:border-on-surface focus:ring-0 transition-colors duration-300" id="password" name="password" placeholder="Password" required={true} type="password"/>
</div>
</div>
<div className="flex items-center justify-between">
<div className="flex items-center">
<input className="h-4 w-4 rounded-sm border-outline-variant text-primary focus:ring-primary focus:ring-offset-surface bg-transparent" id="remember-me" name="remember-me" type="checkbox"/>
<label className="ml-2 block font-label-sm text-label-sm text-secondary cursor-pointer" htmlFor="remember-me">
                                Remember me
                            </label>
</div>
<div className="text-sm">
<a className="font-label-sm text-label-sm text-primary hover:text-secondary transition-colors duration-300" href="#">
                                Forgot password?
                            </a>
</div>
</div>
{/* Actions */}
<div className="pt-sm space-y-md">
<button className="w-full flex justify-center py-md px-lg border border-transparent rounded-lg shadow-sm font-label-sm text-label-sm text-on-primary bg-primary hover:bg-inverse-surface focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300" type="submit">
                            Sign In
                        </button>
<div className="text-center">
<span className="font-body-md text-body-md text-secondary">Don't have an account? </span>
<a className="font-label-sm text-label-sm text-primary hover:text-secondary transition-colors duration-300 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[1px] after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left" href="#">
                                Create an account
                            </a>
</div>
</div>
</form>
</div>
</section>
</main>

    </>
  );
}
