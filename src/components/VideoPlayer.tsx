import { useState } from 'react';
import { Play } from 'lucide-react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

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
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
              Built in a shop. Proven in a shop.
            </h2>
            <p className="text-xl text-slate-300 leading-relaxed">
              While other software companies are guessing what rental operators need, we're running a thriving multi-million dollar rental business with the same software we're offering you.
            </p>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video bg-slate-800">
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
                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-500 transition-all shadow-lg">
                      <Play className="w-10 h-10 text-white ml-1" fill="currentColor" />
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
