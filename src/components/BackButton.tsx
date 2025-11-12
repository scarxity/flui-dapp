"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="text-gray-400 hover:text-white mb-6 flex items-center space-x-2"
      type="button"
    >
      <span className="text-xl">←</span>
      <span>Back</span>
    </button>
  );
}
