"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ConnectButton,
  useCurrentAccount,
  useSuiClient,
} from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import Image from "next/image";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: balance, isLoading: isLoadingBalance } = useQuery({
    queryKey: ["balance", account?.address],
    queryFn: async () => {
      if (!account) return null;
      const result = await suiClient.getBalance({
        owner: account.address,
        coinType: "0x2::sui::SUI",
      });
      return result.totalBalance ?? null;
    },
    enabled: !!account,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const formattedBalance = useMemo(
    () => formatSuiBalance(balance as string | null),
    [balance],
  );

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/create", label: "Create" },
    { href: "/event", label: "Event" },
  ];

  return (
    <>
      <nav className="absolute top-0 left-0 w-full px-8 md:px-20 py-6 bg-transparent z-20">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Image
            src="/images/flui-no-bg.png"
            alt="Flui"
            width={100}
            height={100}
            className="w-28"
          />
          <div className="hidden lg:flex items-center gap-6 absolute left-1/2 transform -translate-x-1/2">
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

          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="flex flex-col flex-shrink-0 items-end">
              <span className="text-xs lg:text-sm text-gray-400">
                Testnet SUI Balance
              </span>
              <span className="text-sm lg:text-lg font-semibold text-white">
                {isLoadingBalance ? (
                  <Loader className="animate-spin w-5" />
                ) : (
                  `${formattedBalance} SUI`
                )}
              </span>
            </div>
            <div className="hidden lg:flex">
              <ConnectButton className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-700 hover:from-sky-400 hover:to-blue-600 rounded-md text-white font-medium transition" />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden flex flex-col gap-1.5 p-2"
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
        <div className="lg:hidden absolute top-24 left-0 w-full px-8 py-6 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 z-[9999]">
          <div className="flex flex-col gap-4">
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
          <div className="flex lg:hidden mt-4">
            <ConnectButton className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-700 hover:from-sky-400 hover:to-blue-600 rounded-md text-white font-medium transition" />
          </div>
        </div>
      )}
    </>
  );
}
