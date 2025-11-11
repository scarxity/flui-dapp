"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ConnectButton,
  useCurrentAccount,
  useSuiClient,
} from "@mysten/dapp-kit";

const MIST_PER_SUI = BigInt(1_000_000_000);

function formatSuiBalance(totalBalance: string | null): string {
  if (!totalBalance) {
    return "0";
  }

  try {
    const balanceBigInt = BigInt(totalBalance);
    const whole = balanceBigInt / MIST_PER_SUI;
    const remainder = balanceBigInt % MIST_PER_SUI;

    if (remainder === BigInt(0)) {
      return whole.toString();
    }

    const remainderString = remainder.toString().padStart(9, "0");
    // Limit to 5 decimal places
    const limitedFraction = remainderString.slice(0, 5);
    const trimmedFraction = limitedFraction.replace(/0+$/, "");

    if (trimmedFraction === "") {
      return whole.toString();
    }

    return `${whole.toString()}.${trimmedFraction}`;
  } catch (error) {
    console.error("Failed to format balance", error);
    return "0";
  }
}

export default function Navbar() {
  const pathname = usePathname();
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!account) {
      setBalance(null);
      return;
    }

    let isCancelled = false;
    setIsLoadingBalance(true);

    suiClient
      .getBalance({ owner: account.address, coinType: "0x2::sui::SUI" })
      .then((result) => {
        if (isCancelled) {
          return;
        }
        setBalance(result.totalBalance ?? null);
      })
      .catch((error) => {
        console.error("Failed to fetch SUI balance", error);
        if (!isCancelled) {
          setBalance(null);
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoadingBalance(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [account, suiClient]);

  const formattedBalance = useMemo(() => formatSuiBalance(balance), [balance]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/create", label: "Create" },
    { href: "/explore", label: "Explore" },
  ];

  return (
    <>
      <nav className="absolute top-0 left-0 w-full px-8 md:px-20 py-6 bg-transparent z-20">
        <div className="flex items-center justify-between">
          {/* Left: Balance */}
          <div className="flex flex-col flex-shrink-0">
            <span className="text-xs lg:text-sm text-gray-400">
              Testnet SUI Balance
            </span>
            <span className="text-sm lg:text-lg font-semibold text-white">
              {isLoadingBalance ? "Fetching..." : `${formattedBalance} SUI`}
            </span>
          </div>

          {/* Center: Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 absolute left-1/2 transform -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-base font-medium transition-colors ${
                  pathname === link.href
                    ? "text-sky-400"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: Connect Button & Mobile Menu */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <ConnectButton className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-700 hover:from-sky-400 hover:to-blue-600 rounded-md text-white font-medium transition" />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex flex-col gap-1.5 p-2"
              aria-label="Toggle menu"
            >
              <span
                className={`block w-6 h-0.5 bg-white transition-transform ${
                  isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-white transition-opacity ${
                  isMobileMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-white transition-transform ${
                  isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-24 left-0 w-full bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 z-[9999]">
          <div className="flex flex-col px-8 py-6 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-lg font-medium transition-colors py-2 ${
                  pathname === link.href
                    ? "text-sky-400"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
