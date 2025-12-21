import { useState } from 'react';
import { TrendingUp, Store, Package, Play } from 'lucide-react';

export default function SocialProof() {
  const [isPlaying, setIsPlaying] = useState(false);

  const stats = [
    { icon: TrendingUp, value: '0 to $M+', label: 'Revenue Growth in 3 Years' },
    { icon: Store, value: 'Multiple', label: 'Locations Built' },
    { icon: Package, value: 'Real', label: 'Rental Operations' }
  ];

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsPlaying(true);
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Real rental operators. Real results.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-slate-800 rounded-xl p-8 text-center border border-slate-700">
              <div className="bg-blue-900/50 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <stat.icon className="text-blue-400" size={32} />
              </div>
              <div className="text-4xl font-bold text-blue-400 mb-2">{stat.value}</div>
              <div className="text-slate-300 text-lg">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 sm:p-12 border border-slate-700">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4">Built in a shop. Proven in a shop.</h3>
              <p className="text-xl text-slate-300 leading-relaxed">
                While other software companies are guessing what rental operators need, we're running a thriving multi-million dollar rental business with the same software we're offering you.
              </p>
            </div>
            <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-800">
              {!isPlaying ? (
                <div
                  className="relative w-full h-full cursor-pointer group"
                  onClick={handlePlayClick}
                  onKeyDown={handleKeyPress}
                  role="button"
                  tabIndex={0}
                  aria-label="Play video about KABBA rental software"
                >
                  <img
                    src="/1_thing_they_never_show_you-sm.png"
                    alt="Video: The one thing other rental software companies won't show you"
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-500 transition-all shadow-lg">
                      <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                    </div>
                  </div>
                </div>
              ) : (
                <iframe
                  src="https://www.youtube-nocookie.com/embed/Q2j4vBtLzI4?autoplay=1&rel=0&modestbranding=1&controls=1&fs=1&iv_load_policy=3"
                  title="KABBA Rental Software - Built by Real Rental Operators"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
