import Link from "next/link";

export const metadata = {
  title: "Global Network & GSA/CSA Solutions | GOODMAN GLS",
  description: "MPL and EAN member with GSA/CSA airline partnerships serving 50+ countries worldwide.",
};

export default function NetworkSolutionsPage() {
  const airlines = [
    { name: "Korean Air Cargo", routes: "Seoul-LAX, Seoul-JFK, Seoul-FRA" },
    { name: "Asiana Cargo", routes: "Seoul-SFO, Seoul-ORD, Seoul-CDG" },
    { name: "Air China Cargo", routes: "Seoul-PEK, PEK-LAX, PEK-FRA" },
    { name: "Singapore Airlines Cargo", routes: "Seoul-SIN, SIN-AMS, SIN-NYC" },
  ];

  return (
    <main>
      {/* Header */}
      <section className="gradient-primary text-white py-20">
        <div className="container text-center">
          <h1 className="text-white mb-6">Global Network & Solutions</h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Connected to the world through trusted partnerships
          </p>
        </div>
      </section>

      {/* Network Memberships */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 style={{ color: 'var(--color-primary-900)' }}>Premium Network Memberships</h2>
            <p className="text-xl text-gray-600 mt-4">
              Access to 50+ countries through elite logistics networks
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="card">
              <div className="text-4xl font-black mb-4" style={{ color: 'var(--color-primary-700)' }}>MPL</div>
              <h3 className="text-xl font-bold mb-3">MarcoPoloLine Group</h3>
              <p className="text-gray-700 mb-4">
                Premium logistics network focused on quality service and innovation across Asia-Pacific.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Exclusive territory protection</li>
                <li>✓ Quality certification standards</li>
                <li>✓ Advanced IT integration</li>
              </ul>
            </div>

            <div className="card">
              <div className="text-4xl font-black mb-4" style={{ color: 'var(--color-primary-700)' }}>EAN</div>
              <h3 className="text-xl font-bold mb-3">Exclusive Air Network</h3>
              <p className="text-gray-700 mb-4">
                Elite network of air cargo logistics providers committed to service excellence and innovation.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Best-in-class service standards</li>
                <li>✓ Collaborative partnerships</li>
                <li>✓ Continuous improvement focus</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* GSA/CSA Section */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 style={{ color: 'var(--color-primary-900)' }}>GSA/CSA Airline Partnerships</h2>
            <p className="text-xl text-gray-600 mt-4">
              Your gateway to Korean market capacity and competitive rates
            </p>
          </div>

          <div className="max-w-4xl mx-auto mb-12">
            <div className="card text-white" style={{ background: 'linear-gradient(135deg, #0A2463 0%, #1E3A8A 100%)' }}>
              <h3 className="text-2xl font-bold mb-6 text-white">What is GSA/CSA?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-orange-400 mb-2">GSA (General Sales Agent)</h4>
                  <p className="text-gray-200">
                    Exclusive representation of airlines in specific markets, handling all passenger and cargo sales activities.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-orange-400 mb-2">CSA (Cargo Sales Agent)</h4>
                  <p className="text-gray-200">
                    Specialized cargo sales representation, providing capacity guarantees and preferential rates for logistics partners.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {airlines.map((airline, index) => (
              <div key={index} className="card">
                <h4 className="text-lg font-bold mb-2" style={{ color: 'var(--color-primary-700)' }}>
                  {airline.name}
                </h4>
                <p className="text-gray-600 text-sm">Key Routes:</p>
                <p className="text-gray-800">{airline.routes}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-block card bg-orange-50 border-2 border-orange-200">
              <p className="text-gray-700 mb-4">
                <strong>Partner Benefits:</strong> Priority space allocation • Competitive rates • Direct carrier relationships • Real-time capacity updates
              </p>
              <Link href="/#contact" className="btn btn-primary">
                Inquire About Partnership
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Map */}
      <section className="section bg-white">
        <div className="container text-center">
          <h2 style={{ color: 'var(--color-primary-900)' }} className="mb-8">Global Coverage</h2>
          <div className="max-w-4xl mx-auto">
            <div className="aspect-video bg-gradient-primary rounded-lg flex items-center justify-center text-white">
              <div>
                <svg className="w-24 h-24 mx-auto mb-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-2xl font-bold">50+ Countries</p>
                <p className="text-gray-300 mt-2">Connected through our global network partnerships</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
