"use client";

import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative bg-black px-8 md:px-20 text-white lg:py-24 overflow-hidden">
      <div className="max-w-7xl w-full mx-auto flex flex-col lg:flex-row items-center py-10 lg:gap-4">
        {/* Left Content */}
        <div className="mx-auto space-y-6 mt-24 lg:mt-0 z-10 w-full lg:w-1/2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/40 text-xs font-medium text-sky-300 mb-3">
            <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
            Public Good Funding on Sui
          </div>

          <div>
            <h1 className="text-3xl md:text-5xl font-bold">
              Flui enables changemakers to receive crypto donations with ease
            </h1>
            <p className="text-sm text-gray-400 mt-4 leading-relaxed">
              Join the growing community of changemakers. Start accepting crypto
              donations, showcase impact, and collaborate with supporters
              directly. No middlemen, just open funding.
            </p>
          </div>

          {/* Buttons */}
          <div className="mx-auto flex flex-wrap gap-4 pt-2">
            <Link href="/create">
              <button className="px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-md font-medium transition-all shadow-md shadow-sky-500/40">
                Launch Public Good
              </button>
            </Link>
            <Link href="/explore">
              <button className="px-6 py-2 bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 text-white rounded-md font-medium transition-all shadow-md shadow-indigo-500/40">
                Fund Public Goods
              </button>
            </Link>
          </div>

          <p className="text-xs text-gray-500 pt-1">
            No paywalls, no gatekeepers — build and fund things that stay open
            for everyone.
          </p>
        </div>

        <div className="mt-12 md:mt-0 md:w-1/2 flex justify-center relative">
          <div className="absolute w-72 h-72 bg-blue-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <Image
            src="/images/flui-home.png"
            alt="Flui"
            width={400}
            height={400}
            className="relative drop-shadow-[0_0_25px_rgba(0,0,255,0.3)]"
          />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-900/70 to-transparent"></div>
    </section>
  );
}
