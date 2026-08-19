import Link from 'next/link';

interface AuthFooterProps {
  mode: 'login' | 'signup';
}

export function AuthFooter({ mode }: AuthFooterProps) {
  const isLogin = mode === 'login';
  
  return (
    <div className="text-center mt-6 pt-4">
      <span className="font-body-md text-body-md text-secondary">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
      </span>
      <Link 
        href={isLogin ? "/signup" : "/login"} 
        className="font-label-sm text-label-sm text-primary font-medium hover:text-secondary transition-colors duration-300 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[1px] after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
      >
        {isLogin ? "Create an account" : "Log in"}
      </Link>
    </div>
  );
}
