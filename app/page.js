"use client";

import { useState } from "react";
import { ToastProvider } from "../components/Toast";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import RecentLinks from "../components/RecentLinks";
import Footer from "../components/Footer";

function HomeContent() {
  const [recentLinks, setRecentLinks] = useState([]);

  const handleLinkCreated = (link) => {
    setRecentLinks((prev) => [link, ...prev]);
  };

  const handleLinkDeleted = (id) => {
    setRecentLinks((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero onLinkCreated={handleLinkCreated} />
        <Features />
        <RecentLinks extraLinks={recentLinks} onLinkDeleted={handleLinkDeleted} />
      </main>
      <Footer />
    </>
  );
}

export default function Home() {
  return (
    <ToastProvider>
      <HomeContent />
    </ToastProvider>
  );
}
