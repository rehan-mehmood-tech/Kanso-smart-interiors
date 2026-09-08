import Link from "next/link";

interface AuthFooterProps {
  mode: "login" | "signup";
}

export function AuthFooter({ mode }: AuthFooterProps) {
  const isLogin = mode === "login";

  return (
    <p className="mt-8 w-full text-center font-body text-sm leading-relaxed text-[#1b1c19]/65">
      {isLogin ? "Don't have an account? " : "Already have an account? "}
      <Link
        href={isLogin ? "/signup" : "/login"}
        className="font-medium whitespace-nowrap text-[#1b1c19] underline underline-offset-4 transition-colors hover:text-[#1b1c19]/65"
      >
        {isLogin ? "Create an account" : "Log in"}
      </Link>
    </p>
  );
}
