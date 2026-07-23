"use client";

import { useState, useEffect } from "react";
import { useToast } from "./Toast";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function truncateUrl(url, max = 45) {
  return url.length > max ? url.slice(0, max) + "…" : url;
}

export default function RecentLinks({ extraLinks = [] }) {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    async function fetchLinks() {
      try {
        const res = await fetch("/api/links");
        const data = await res.json();

        if (data.success && data.links) {
          setLinks(
            data.links.map((l) => ({
              id: l.id,
              originalUrl: l.originalUrl,
              shortUrl: `snip.link/${l.shortCode}`,
              clicks: l.clicks,
              createdAt: l.createdAt,
            }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch links:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLinks();
  }, []);

  const allLinks = [...extraLinks, ...links];

  const handleCopy = async (shortUrl) => {
    try {
      await navigator.clipboard.writeText(`https://${shortUrl}`);
      toast("Copied to clipboard!", "success");
    } catch {
      toast("Failed to copy", "error");
    }
  };

  const handleDelete = (id) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
    toast("Link deleted", "info");
  };

  return (
    <section className="py-24 px-6" id="recent-links">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent-cyan mb-3 block">
            Recent Links
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Your{" "}
            <span className="gradient-text">shortened links</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Manage and monitor all your shortened links in one place.
          </p>
        </div>

        {/* Links table */}
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          {/* Header row — desktop */}
          <div className="hidden lg:grid lg:grid-cols-[1fr_180px_80px_100px_120px] gap-4 px-6 py-4 border-b border-border text-xs font-semibold text-text-muted uppercase tracking-wider">
            <span>URL</span>
            <span>Short Link</span>
            <span className="text-center">Clicks</span>
            <span>Created</span>
            <span className="text-right">Actions</span>
          </div>

          {allLinks.length === 0 ? (
            <div className="px-6 py-16 text-center text-text-muted">
              <p className="text-sm">No links yet. Shorten your first URL above!</p>
            </div>
          ) : (
            allLinks.map((link, index) => (
              <div
                key={link.id ?? index}
                className="group grid grid-cols-1 lg:grid-cols-[1fr_180px_80px_100px_120px] gap-3 lg:gap-4 px-6 py-5 border-b border-border last:border-0 hover:bg-surface-alt/50 transition-colors duration-200"
                id={`link-${link.id}`}
              >
                {/* Original URL */}
                <div className="flex flex-col min-w-0">
                  <span className="text-xs text-text-muted lg:hidden mb-1">Original URL</span>
                  <a
                    href={link.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-text-primary hover:text-accent-cyan truncate transition-colors"
                    title={link.originalUrl}
                  >
                    {truncateUrl(link.originalUrl)}
                  </a>
                </div>

                {/* Short URL */}
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs text-text-muted lg:hidden">Short:</span>
                  <span className="text-sm font-mono text-accent-cyan truncate">
                    {link.shortUrl}
                  </span>
                </div>

                {/* Clicks */}
                <div className="flex items-center lg:justify-center">
                  <span className="text-xs text-text-muted lg:hidden mr-2">Clicks:</span>
                  <span className="text-sm font-semibold text-text-primary tabular-nums">
                    {link.clicks.toLocaleString()}
                  </span>
                </div>

                {/* Created date */}
                <div className="flex items-center">
                  <span className="text-xs text-text-muted lg:hidden mr-2">Created:</span>
                  <span className="text-sm text-text-secondary">
                    {formatDate(link.createdAt)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 lg:justify-end">
                  <button
                    onClick={() => handleCopy(link.shortUrl)}
                    className="p-2 rounded-lg text-text-muted hover:text-accent-cyan hover:bg-accent-cyan/10 transition-all duration-200 cursor-pointer"
                    title="Copy link"
                    aria-label={`Copy ${link.shortUrl}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => toast("Edit coming soon", "info")}
                    className="p-2 rounded-lg text-text-muted hover:text-accent-blue hover:bg-accent-blue/10 transition-all duration-200 cursor-pointer"
                    title="Edit link"
                    aria-label={`Edit ${link.shortUrl}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(link.id)}
                    className="p-2 rounded-lg text-text-muted hover:text-error hover:bg-error/10 transition-all duration-200 cursor-pointer"
                    title="Delete link"
                    aria-label={`Delete ${link.shortUrl}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
