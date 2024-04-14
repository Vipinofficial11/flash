import React from "react";
import { AuroraBackground } from "@/Components/ui/landing";
import { motion } from "framer-motion";
import Search from "@/Components/ui/search";

function Main() {
  return (
    <AuroraBackground className="h-screen">
      <div className="text-5xl md:text-7xl font-bold text-white font-sans">
        Flash ⚡
      </div>
      <div className="font-serif text-base md:text-2xl text-neutral-200 py-6">
        A high-performance API built with Hono, Next.js and Cloudflare. <br />{" "}
        Type a query below and get your results in milliseconds.
      </div>
      <Search />
    </AuroraBackground>
  );
}

export default Main;
