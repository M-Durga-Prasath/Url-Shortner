const FOOTER_LINKS = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Contact", href: "#" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border py-10 px-6 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg gradient-btn flex items-center justify-center">
            <span className="text-white font-bold text-xs">S</span>
          </div>
          <span className="text-sm font-semibold text-text-primary tracking-tight">
            Snip<span className="gradient-text">link</span>
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-text-muted hover:text-text-secondary transition-colors duration-200"
              id={`footer-${link.label.toLowerCase()}`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-xs text-text-muted">
          &copy; {new Date().getFullYear()} Sniplink. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
