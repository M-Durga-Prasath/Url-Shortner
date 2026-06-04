"use client";

import { useSession, signOut } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <div className="px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            Welcome back,{" "}
            <span className="gradient-text">
              {session.user?.name?.split(" ")[0] || "there"}
            </span>
          </h1>
          <p className="text-text-secondary text-lg">
            Manage your shortened links and track performance.
          </p>
        </div>

        {/* Profile card */}
        <div
          className="gradient-border p-6 sm:p-8 mb-8 animate-fade-in-up"
          style={{ animationDelay: "0.1s", animationFillMode: "both" }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              {session.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User avatar"}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-border"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl gradient-btn flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {session.user?.name?.[0] || "U"}
                  </span>
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-success border-2 border-surface flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold text-text-primary mb-1">
                {session.user?.name || "User"}
              </h2>
              <p className="text-sm text-text-secondary mb-2 truncate">
                {session.user?.email}
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-alt border border-border text-xs text-text-muted">
                {session.user?.provider === "github" ? (
                  <svg
                    className="w-3.5 h-3.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                <span className="capitalize">
                  {session.user?.provider || "OAuth"} account
                </span>
              </div>
            </div>

            {/* Actions */}
            <button
              id="dashboard-signout"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-error bg-surface-alt hover:bg-error/10 border border-border hover:border-error/30 transition-all duration-200 cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Stats cards */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8 animate-fade-in-up"
          style={{ animationDelay: "0.2s", animationFillMode: "both" }}
        >
          {[
            {
              label: "Total Links",
              value: "0",
              icon: (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              ),
              color: "text-accent-purple",
              glow: "bg-accent-purple/10",
            },
            {
              label: "Total Clicks",
              value: "0",
              icon: (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                  />
                </svg>
              ),
              color: "text-accent-cyan",
              glow: "bg-accent-cyan/10",
            },
            {
              label: "Active Links",
              value: "0",
              icon: (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ),
              color: "text-success",
              glow: "bg-success/10",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-surface border border-border rounded-2xl p-6 card-hover"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-text-muted">{stat.label}</span>
                <div
                  className={`w-10 h-10 rounded-xl ${stat.glow} flex items-center justify-center`}
                >
                  <span className={stat.color}>{stat.icon}</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-text-primary tabular-nums">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Empty state for links */}
        <div
          className="bg-surface border border-border rounded-2xl p-12 text-center animate-fade-in-up"
          style={{ animationDelay: "0.3s", animationFillMode: "both" }}
        >
          <div className="w-16 h-16 rounded-2xl bg-accent-purple/10 flex items-center justify-center mx-auto mb-5">
            <svg
              className="w-8 h-8 text-accent-purple"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            No links yet
          </h3>
          <p className="text-sm text-text-secondary mb-6 max-w-sm mx-auto">
            Start shortening URLs from the homepage and they&apos;ll appear here for
            tracking and management.
          </p>
          <a
            href="/"
            className="inline-flex gradient-btn text-sm font-medium text-white px-6 py-3 rounded-xl cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create your first link
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
