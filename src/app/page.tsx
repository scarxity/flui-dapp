import HeroSection from "@/components/HeroSection";

export default function Home() {
  return (
    <main className="bg-black">
      <HeroSection />

      {/* Use Cases Section */}
      <section className="px-8 md:px-20 py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Endless Possibilities
            </h2>
            <p className="text-gray-400 text-lg">
              Empower your projects with decentralized crowdfunding
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Use Case 1 */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-sky-500 transition-all hover:shadow-lg hover:shadow-sky-500/20">
              <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Creative Projects
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Fund art, music, films, and creative endeavors. Give artists the
                support they need to bring their visions to life.
              </p>
            </div>

            {/* Use Case 2 */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-green-500 transition-all hover:shadow-lg hover:shadow-green-500/20">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Tech Innovation
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Launch startups, develop apps, and build cutting-edge
                technology. Turn innovative ideas into reality with community
                backing.
              </p>
            </div>

            {/* Use Case 3 */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-purple-500 transition-all hover:shadow-lg hover:shadow-purple-500/20">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Social Impact
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Support charitable causes, community projects, and social
                initiatives. Make a difference with transparent, traceable
                donations.
              </p>
            </div>

            {/* Use Case 4 */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-yellow-500 transition-all hover:shadow-lg hover:shadow-yellow-500/20">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Education & Research
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Fund academic research, educational programs, and learning
                initiatives. Advance knowledge and education globally.
              </p>
            </div>

            {/* Use Case 5 */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-red-500 transition-all hover:shadow-lg hover:shadow-red-500/20">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎮</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Gaming & Entertainment
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Develop games, organize esports tournaments, and create
                entertainment content. Build communities around shared passions.
              </p>
            </div>

            {/* Use Case 6 */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-cyan-500 transition-all hover:shadow-lg hover:shadow-cyan-500/20">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🏢</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Business Ventures
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Launch products, expand operations, and scale businesses. Access
                capital from supporters who believe in your vision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Sui Blockchain Section */}
      <section className="px-8 md:px-20 py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Powered by Sui Blockchain
            </h2>
            <p className="text-gray-400 text-lg">
              Experience the next generation of blockchain technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-xl p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">⚡</span>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-3">
                    Lightning Fast
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Sui's parallel transaction processing delivers sub-second
                    finality. Create campaigns and receive donations instantly
                    without network congestion.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-xl p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💰</span>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-3">
                    Low Cost
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Enjoy minimal transaction fees that don't eat into your
                    funding goals. More of your contributions go directly to
                    campaigns.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-xl p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🔒</span>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-3">
                    Secure & Transparent
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Every transaction is recorded on-chain with cryptographic
                    security. Track your contributions with complete
                    transparency and trust.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 border border-orange-500/30 rounded-xl p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🌐</span>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-3">
                    Truly Decentralized
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    No intermediaries, no gatekeepers. Campaign creators have
                    full control over their funds with smart contract
                    automation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <a
              href="https://sui.io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-500/25"
            >
              Learn More About Sui
              <span>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-8 md:px-20 py-16 bg-gradient-to-b from-black to-gray-900 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-sky-400 mb-2">
                Fast
              </div>
              <div className="text-gray-400 text-sm">Transaction Speed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-400 mb-2">
                Low
              </div>
              <div className="text-gray-400 text-sm">Gas Fees</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">
                100%
              </div>
              <div className="text-gray-400 text-sm">Transparent</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2">
                24/7
              </div>
              <div className="text-gray-400 text-sm">Available</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
