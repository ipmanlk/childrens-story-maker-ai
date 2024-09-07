import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Navbar() {
  const { data: sessionData } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            Children's Story Maker AI
          </Link>
          <div className="hidden md:flex md:space-x-4">
            {/* Desktop menu items */}
            <NavItem href="/" isActive={router.pathname === "/"}>
              Home
            </NavItem>
            <NavItem href="/gallery" isActive={router.pathname === "/gallery"}>
              Gallery
            </NavItem>
            {sessionData ? (
              <NavItem
                href="/dashboard"
                isActive={router.pathname === "/dashboard"}
              >
                Dashboard
              </NavItem>
            ) : (
              <button
                onClick={() => void signIn()}
                className="text-indigo-600 hover:text-indigo-800"
              >
                Login
              </button>
            )}
          </div>
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {/* Hamburger icon */}
            <svg
              className="h-6 w-6 text-indigo-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="mt-4 md:hidden">
            <NavItem href="/" isActive={router.pathname === "/"} mobile>
              Home
            </NavItem>
            <NavItem
              href="/community"
              isActive={router.pathname === "/community"}
              mobile
            >
              Community
            </NavItem>
            {sessionData ? (
              <NavItem
                href="/dashboard"
                isActive={router.pathname === "/dashboard"}
                mobile
              >
                Dashboard
              </NavItem>
            ) : (
              <button
                onClick={() => void signIn()}
                className="block w-full py-2 text-left text-indigo-600 hover:text-indigo-800"
              >
                Login
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

function NavItem({
  href,
  children,
  isActive,
  mobile = false,
}: {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
  mobile?: boolean;
}) {
  const baseClasses = "transition-colors duration-200";
  const activeClasses = isActive
    ? "text-indigo-800 font-semibold"
    : "text-indigo-600 hover:text-indigo-800";
  const mobileClasses = mobile ? "block py-2" : "";

  return (
    <Link
      href={href}
      className={`${baseClasses} ${activeClasses} ${mobileClasses}`}
    >
      {children}
    </Link>
  );
}
