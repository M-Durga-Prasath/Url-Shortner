"use client";

import { useState, useRef } from "react";
import { useToast } from "./Toast";

function isValidUrl(str) {
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function generateShortCode() {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 7; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export default function Hero({ onLinkCreated }) {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [urlError, setUrlError] = useState("");
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);
  const toast = useToast();

  const handleShorten = async (e) => {
    e.preventDefault();
    setUrlError("");

    if (!url.trim()) {
      setUrlError("Please enter a URL");
      inputRef.current?.focus();
      return;
    }

    if (!isValidUrl(url)) {
      setUrlError("Please enter a valid URL (e.g. https://example.com)");
      inputRef.current?.focus();
      return;
    }

    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const code = alias.trim() || generateShortCode();
    const shortened = `snip.link/${code}`;

    setShortenedUrl(shortened);
    setLoading(false);
    toast("Link shortened successfully!", "success");

    if (onLinkCreated) {
      onLinkCreated({
        id: Date.now(),
        originalUrl: url,
        shortUrl: shortened,
        clicks: 0,
        createdAt: new Date().toISOString(),
      });
    }
  };

  const handleCopy = async () => {
    if (!shortenedUrl) return;
    try {
      await navigator.clipboard.writeText(`https://${shortenedUrl}`);
      setCopied(true);
      toast("Copied to clipboard!", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast("Failed to copy", "error");
    }
  };

  const handleReset = () => {
    setUrl("");
    setAlias("");
    setShortenedUrl(null);
    setUrlError("");
    setCopied(false);
    inputRef.current?.focus();
  };

  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden" id="hero">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none opacity-30">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-purple/20 via-accent-blue/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-surface/50 backdrop-blur-sm mb-8 animate-fade-in-up">
          <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
          <span className="text-xs text-text-secondary font-medium tracking-wide uppercase">
            Fast &amp; Secure URL Shortener
          </span>
        </div>

        {/* Heading */}
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6 animate-fade-in-up"
          style={{ animationDelay: "0.1s", animationFillMode: "both" }}
        >
          Shorten Links.{" "}
          <span className="gradient-text">Share Smarter.</span>
        </h1>

        {/* Subheading */}
        <p
          className="text-lg sm:text-xl text-text-secondary max-w-xl mx-auto mb-12 animate-fade-in-up"
          style={{ animationDelay: "0.2s", animationFillMode: "both" }}
        >
          Transform long URLs into clean, trackable short links. Monitor performance
          with real-time analytics.
        </p>

        {/* URL shortener form */}
        <form
          onSubmit={handleShorten}
          className="animate-fade-in-up"
          style={{ animationDelay: "0.3s", animationFillMode: "both" }}
        >
          <div className="gradient-border p-6 sm:p-8">
            <div className="flex flex-col gap-4">
              {/* URL input */}
              <div className="relative">
                <input
                  ref={inputRef}
                  id="url-input"
                  type="text"
                  value={url}
                  onChange={(e) => { setUrl(e.target.value); setUrlError(""); }}
                  placeholder="Paste your long URL here..."
                  className={`w-full bg-background border ${
                    urlError ? "border-error" : "border-border focus:border-accent-purple"
                  } rounded-xl px-5 py-4 text-text-primary text-sm placeholder:text-text-muted transition-colors duration-200`}
                  aria-label="URL to shorten"
                  aria-invalid={!!urlError}
                />
                {urlError && (
                  <p className="absolute -bottom-6 left-1 text-xs text-error" role="alert">
                    {urlError}
                  </p>
                )}
              </div>

              {/* Alias + Button row */}
              <div className="flex flex-col sm:flex-row gap-3 mt-1">
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-sm select-none">
                    snip.link/
                  </span>
                  <input
                    id="alias-input"
                    type="text"
                    value={alias}
                    onChange={(e) => setAlias(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ""))}
                    placeholder="custom-alias"
                    maxLength={20}
                    className="w-full bg-background border border-border focus:border-accent-purple rounded-xl pl-24 pr-5 py-4 text-text-primary text-sm placeholder:text-text-muted transition-colors duration-200"
                    aria-label="Custom alias (optional)"
                  />
                </div>
                <button
                  id="shorten-btn"
                  type="submit"
                  disabled={loading}
                  className="gradient-btn text-white font-semibold px-8 py-4 rounded-xl text-sm disabled:opacity-60 disabled:cursor-not-allowed sm:min-w-[160px] cursor-pointer"
                >
                  <span className="flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <span className="spinner" />
                        Shortening...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        Shorten URL
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>

            {/* Result card */}
            {shortenedUrl && (
              <div className="mt-6 p-4 bg-background rounded-xl border border-border animate-slide-down">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs text-text-muted mb-1">Your shortened URL</span>
                    <a
                      href={`https://${shortenedUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-cyan font-mono text-sm hover:underline truncate"
                      id="shortened-url-link"
                    >
                      https://{shortenedUrl}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      id="copy-btn"
                      onClick={handleCopy}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                        copied
                          ? "bg-success/15 text-success border border-success/30"
                          : "bg-surface-alt hover:bg-border text-text-primary border border-border"
                      }`}
                    >
                      {copied ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                    <button
                      id="new-link-btn"
                      onClick={handleReset}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary bg-surface-alt hover:bg-border border border-border transition-all duration-200 cursor-pointer"
                    >
                      New Link
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
