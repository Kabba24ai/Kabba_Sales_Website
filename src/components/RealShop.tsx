import { useState, useEffect } from 'react';

const shopImages = [
  { src: '/image_1_front_sign.png', alt: 'Front sign and equipment yard' },
  { src: '/image_2_right_side.png', alt: 'Equipment lineup along the road' },
  { src: '/image_3_loading_unloading.png', alt: 'Loading and unloading equipment' },
  { src: '/image_4_bulldozer_on_truck.png', alt: 'Bulldozer on truck' },
  { src: '/image_4_inside_office.png', alt: 'Inside rental counter office' },
  { src: '/image_5_service_building.png', alt: 'New building under construction' },
];

export default function RealShop() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % shopImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              The one thing the other software companies will never show you:
              <span className="block text-blue-600 mt-2">their rental shop.</span>
            </h2>
            <p className="text-2xl font-semibold text-slate-700 mb-6">
              That's because they don't have one.
            </p>
            <div className="space-y-4 text-lg text-slate-600">
              <p>
                KABBA was built inside a real rental business — the same business that went from zero to multi-million dollars and multiple locations in under 3 years.
              </p>
              <p className="font-semibold text-slate-800">
                We built the software we needed.<br />
                Then we built the systems and strategies that turned a small local shop into a thriving operation.
              </p>
              <p className="text-xl font-bold text-blue-600">
                Now you get both.
              </p>
            </div>
          </div>

          <div className="relative">
            <div
              className="relative rounded-2xl shadow-2xl h-96 overflow-hidden"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {shopImages.map((image, index) => (
                <img
                  key={index}
                  src={image.src}
                  alt={image.alt}
                  className={`absolute inset-0 w-full h-full object-cover rounded-2xl transition-opacity duration-500 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {shopImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? 'bg-white w-6'
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 bg-amber-500 text-white px-6 py-3 rounded-lg shadow-lg font-semibold transform rotate-3">
              Real Operators. Real Results.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
