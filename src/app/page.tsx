import HeroSection from "@/components/home/HeroSection";
import SuiSection from "@/components/home/SuiSection";
import UseCaseSection from "@/components/home/UseCaseSection";

export default function Home() {
  return (
    <main className="bg-black">
      <HeroSection />
      <UseCaseSection />
      <SuiSection />

      {/* Stats / Value Props Section */}
      <section className="px-8 md:px-20 py-16 bg-gradient-to-b from-black to-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-sky-400 mb-2">
                0%
              </div>
              <div className="text-gray-400 text-sm">Platform Cut*</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-400 mb-2">
                Public
              </div>
              <div className="text-gray-400 text-sm">Open to Everyone</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">
                100%
              </div>
              <div className="text-gray-400 text-sm">On-Chain Transparency</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-400 mb-2">
                24/7
              </div>
              <div className="text-gray-400 text-sm">Funding Access</div>
            </div>
          </div>
          <p className="text-[11px] text-gray-500 text-center mt-4">
            *Configurable by protocol governance — defaults to no platform fee
            for public goods.
          </p>
        </div>
      </section>
    </main>
  );
}
