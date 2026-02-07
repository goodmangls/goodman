export const metadata = {
  title: "About GOODMAN GLS - Company & Team | GOODMAN GLS",
  description: "Meet the GOODMAN GLS team committed to delivering excellence in global logistics since 2004.",
};

export default function CompanyPage() {
  const team = [
    {
      name: "Lee Chang-hee (이창희)",
      title: "Business Development Manager",
      department: "GSA/CSA Division",
      expertise: "Airline partnerships, Route development",
    },
    {
      name: "Kim Min-ji (김민지)",
      title: "Operations Director",
      department: "Air & Ocean Operations",
      expertise: "Supply chain optimization, Customer service",
    },
    {
      name: "Park Seung-ho (박승호)",
      title: "Project Cargo Specialist",
      department: "Special Projects",
      expertise: "Heavy-lift, Multi-modal logistics",
    },
  ];

  return (
    <main>
      {/* Header */}
      <section className="gradient-primary text-white py-20">
        <div className="container text-center">
          <h1 className="text-white mb-6">About GOODMAN GLS</h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Small Giant. Big Impact.
          </p>
        </div>
      </section>

      {/* CEO Message */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="card">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                  <div className="aspect-square bg-gradient-primary rounded-lg flex items-center justify-center">
                    <svg className="w-32 h-32 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="text-center mt-4">
                    <h4 className="font-bold text-lg">CEO Name</h4>
                    <p className="text-gray-600">Chief Executive Officer</p>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <h2 style={{ color: 'var(--color-primary-900)' }} className="mb-6">
                    CEO Message
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      Welcome to GOODMAN GLS. Since our founding in 2004, we&apos;ve built our reputation on a simple principle: <strong>trust through action</strong>.
                    </p>
                    <p>
                      While we may not be the largest forwarder, we are strategically positioned as Korea&apos;s gateway to global logistics. Our membership in MPL (MarcoPoloLine Group) and EAN (Exclusive Air Network) networks, combined with our GSA/CSA airline partnerships, gives us capabilities that rival companies many times our size.
                    </p>
                    <p>
                      Our team of logistics professionals brings decades of combined experience in time-critical air freight, complex ocean shipments, and specialized project cargo. We understand that in logistics, every shipment carries not just cargo, but our clients&apos; trust and reputation.
                    </p>
                    <p className="font-semibold" style={{ color: 'var(--color-primary-700)' }}>
                      Thank you for considering GOODMAN GLS as your strategic partner in Korea and beyond.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-center mb-12" style={{ color: 'var(--color-primary-900)' }}>
              Our Journey
            </h2>
            
            <div className="space-y-6">
              {[
                { year: "2004", milestone: "GOODMAN GLS founded in Seoul", desc: "Started with a focus on Korea-US air freight" },
                { year: "2015", milestone: "First GSA Partnership", desc: "Became General Sales Agent for major airline" },
                { year: "2018", milestone: "MPL & EAN Membership", desc: "Joined MarcoPoloLine Group and Exclusive Air Network" },
                { year: "2020", milestone: "Project Cargo Division Launch", desc: "Expanded into heavy-lift and specialized cargo" },
                { year: "2025", milestone: "Digital Platform Renewal", desc: "Investing in technology for better partner experience" },
              ].map((item, index) => (
                <div key={index} className="flex gap-6 items-start">
                  <div className="text-3xl font-black shrink-0 w-24" style={{ color: 'var(--color-accent-orange)' }}>
                    {item.year}
                  </div>
                  <div className="card flex-1">
                    <h4 className="font-bold text-lg mb-2" style={{ color: 'var(--color-primary-700)' }}>
                      {item.milestone}
                    </h4>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 style={{ color: 'var(--color-primary-900)' }}>Our Team</h2>
              <p className="text-xl text-gray-600 mt-4">
                People who make the difference
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div key={index} className="card text-center">
                  <div className="aspect-square bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-20 h-20 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-lg mb-1">{member.name}</h4>
                  <p className="text-orange-500 font-semibold mb-2">{member.title}</p>
                  <p className="text-sm text-gray-600 mb-3">{member.department}</p>
                  <p className="text-xs text-gray-500">{member.expertise}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 card bg-blue-50 text-center">
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-primary-700)' }}>
                People-Centered Logistics
              </h3>
              <p className="text-gray-700 max-w-2xl mx-auto">
                We believe logistics is fundamentally a people business. Behind every shipment is a relationship built on trust, communication, and reliability. That&apos;s why we invest in our team&apos;s expertise and empower them to make decisions that serve our clients&apos; best interests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section gradient-primary text-white">
        <div className="container text-center">
          <h2 className="text-white mb-12">Our Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: "🤝", value: "Trust", desc: "Earned through consistent delivery and transparency" },
              { icon: "⚡", value: "Velocity", desc: "Speed matters in time-critical logistics" },
              { icon: "🌐", value: "Connectivity", desc: "Global reach through strategic partnerships" },
            ].map((item, index) => (
              <div key={index}>
                <div className="text-6xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold mb-3 text-orange-400">{item.value}</h3>
                <p className="text-gray-200">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
