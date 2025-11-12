import { Metadata } from "next";
import NextImage from "@/components/NextImage";
import BackButton from "@/components/BackButton";

export const metadata: Metadata = {
  title: "404 - Not Found",
};

export default function NotFound() {
  return (
    <main className="min-h-screen w-screen bg-black text-white flex items-center justify-center px-6">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-6xl md:text-8xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-300 mb-6">Page not found</p>

        <div className="flex justify-center">
          <BackButton />
        </div>
      </div>
    </main>
  );
}
