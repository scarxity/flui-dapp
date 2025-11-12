import SuiFeatureCard from "./SuiFeatureCard";

export default function SuiSection() {
  return (
    <section className="px-8 md:px-20 py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Built for Public Good Funding
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Sui&apos;s high throughput and low fees make it a natural base layer
            for recurring grants, matching pools, and transparent funding
            streams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <SuiFeatureCard
            cardClassName="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-xl p-8"
            iconWrapperClassName="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0"
            icon="⚡"
            title="High Throughput, Low Friction"
            description={`Sui's parallelized execution keeps contributions fast
                    and UX smooth, even during peak funding rounds and matching
                    campaigns.`}
          />

          <SuiFeatureCard
            cardClassName="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-xl p-8"
            iconWrapperClassName="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0"
            icon="💰"
            title="Low Fees, High Impact"
            description={`Minimal gas costs mean more of every contribution reaches
                    the public goods being funded — not infrastructure overhead.`}
          />

          <SuiFeatureCard
            cardClassName="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-xl p-8"
            iconWrapperClassName="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0"
            icon="🔍"
            title="Fully Transparent Flows"
            description={`Every contribution and payout is recorded on-chain.
                    Anyone can verify where funds came from and where they went.`}
          />

          <SuiFeatureCard
            cardClassName="bg-gradient-to-br from-orange-900/30 to-red-900/30 border border-orange-500/30 rounded-xl p-8"
            iconWrapperClassName="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0"
            icon="🧩"
            title="Instant Finality, Real-Time UX"
            description={`Sui's fast finality means contributions and payouts confirm instantly,
                    immediate matching, and a smooth donation
                    experience without long waits for confirmations.`}
          />
        </div>

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
  );
}
