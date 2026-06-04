"use client";

import { useState } from "react";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <a href="#" className="flex items-center gap-2 group" id="nav-brand">
          <div className="w-8 h-8 rounded-lg gradient-btn flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="text-lg font-semibold text-text-primary tracking-tight">
            Snip<span className="gradient-text">link</span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              id={`nav-${link.label.toLowerCase()}`}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="flex items-center gap-4" id="desktop-actions"> 
          <button
            id="nav-signin"
            className=" text-sm text-text-secondary hover:text-text-primary transition-colors duration-200 cursor-pointer"
          >
            Sign In
          </button>
          <button
            id="nav-get-started"
            className="gradient-btn text-sm font-medium text-white px-5 py-2 rounded-xl cursor-pointer"
          >
            <span>Get Started</span>
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          id="nav-menu-toggle"
          className="md:hidden text-text-secondary hover:text-text-primary p-2 cursor-pointer"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-surface border-t border-border animate-slide-down">
          <div className="px-6 py-4 flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <hr className="border-border" />
            <button className="text-sm text-text-secondary hover:text-text-primary text-left cursor-pointer">
              Sign In
            </button>
            <button className="gradient-btn text-sm font-medium text-white px-5 py-2.5 rounded-xl w-full cursor-pointer">
              <span>Get Started</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
