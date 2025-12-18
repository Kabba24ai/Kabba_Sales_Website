import { Calendar, Sparkles, TrendingUp } from 'lucide-react';

export default function ValueProposition() {
  const pillars = [
    {
      icon: Calendar,
      title: 'Smarter Scheduling & Availability',
      description: 'Real-time equipment tracking with conflict-free bookings, flawless visibility, and no more overbooking.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Sparkles,
      title: 'AI That Handles the Busywork',
      description: 'Automated reminders, follow-ups, invoicing, and workflow tools designed by operators who know the pain points.',
      color: 'from-amber-500 to-amber-600'
    },
    {
      icon: TrendingUp,
      title: 'Built for Growth',
      description: 'Simple enough for new rental shops, powerful enough to scale into multiple locations.',
      color: 'from-emerald-500 to-emerald-600'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Everything your rental shop needs to run, scale & grow
            <span className="block text-slate-600 mt-2">— without the chaos.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition p-8 border border-slate-200">
              <div className={`bg-gradient-to-br ${pillar.color} w-16 h-16 rounded-lg flex items-center justify-center mb-6`}>
                <pillar.icon className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{pillar.title}</h3>
              <p className="text-slate-600 leading-relaxed">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
