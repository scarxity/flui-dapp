import UseCaseCard from "../cards/UseCaseCard";

export default function UseCaseSection() {
  return (
    <section className="px-8 md:px-20 py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Fund What Helps Everyone
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Channel capital into open, shared resources — open-source tools,
            education, climate initiatives, and community infrastructure that
            stay accessible to all.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <UseCaseCard
            cardClassName="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-sky-500 transition-all hover:shadow-lg hover:shadow-sky-500/20"
            iconWrapperClassName="w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center mb-4"
            icon="💻"
            title="Open-Source & Dev Tooling"
            description="Support libraries, infra, and tooling that every builder can use. No licenses, no paywalls — just public code that lifts the whole ecosystem."
          />

          <UseCaseCard
            cardClassName="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-green-500 transition-all hover:shadow-lg hover:shadow-green-500/20"
            iconWrapperClassName="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-4"
            icon="📚"
            title="Education & Public Research"
            description="Fund open courses, tutorials, and research that stay freely accessible, so future builders don't start from zero."
          />

          <UseCaseCard
            cardClassName="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-purple-500 transition-all hover:shadow-lg hover:shadow-purple-500/20"
            iconWrapperClassName="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-4"
            icon="🏛️"
            title="Community & Governance"
            description="Support community spaces, meetups, and governance experiments that keep the ecosystem credibly neutral and community-owned."
          />

          <UseCaseCard
            cardClassName="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-emerald-500 transition-all hover:shadow-lg hover:shadow-emerald-500/20"
            iconWrapperClassName="w-12 h-12 bg-gradient-to-br from-emerald-500 to-lime-600 rounded-lg flex items-center justify-center mb-4"
            icon="🌱"
            title="Climate & Environment"
            description="Back initiatives that protect shared resources — air, water, forests, and climate data — for current and future generations."
          />

          <UseCaseCard
            cardClassName="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-yellow-500 transition-all hover:shadow-lg hover:shadow-yellow-500/20"
            iconWrapperClassName="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center mb-4"
            icon="🛰️"
            title="Digital Public Infrastructure"
            description="Fund shared APIs, identity layers, explorers, and dashboards that make the ecosystem usable for everyone."
          />

          <UseCaseCard
            cardClassName="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-cyan-500 transition-all hover:shadow-lg hover:shadow-cyan-500/20"
            iconWrapperClassName="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mb-4"
            icon="🧬"
            title="Sui Ecosystem Public Goods"
            description="Allocate funding to core Sui ecosystem public goods: tooling, education, and infra that every app on Sui relies on."
          />
        </div>
      </div>
    </section>
  );
}
