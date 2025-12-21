import { useState } from "react";
import {
  Calendar,
  Package,
  Users,
  FileText,
  Truck,
  Smartphone,
  X,
  Eye,
} from "lucide-react";
import LiveDemoModal from './LiveDemoModal';

export default function Features() {
  const [selectedFeature, setSelectedFeature] = useState<{ standard: string; hover?: string; title: string } | null>(null);
  const [isLiveDemoModalOpen, setIsLiveDemoModalOpen] = useState(false);
  const features = [
    {
      icon: Calendar,
      title: "Rental Calendar That Makes Sense",
      description:"Designed specifically for rental — designed for growth and flexibility.",
      standard_image: "./calendar.png",
      hover_image: "./calendar_hover.png",
    },
    {
      icon: Package,
      title: "Fleet & Availability Tracking",
      description:
        "Know what's out, what's due, and what's ready to rent instantly.",
      standard_image: "./equipment_inventory.png",
      hover_image: "./equipment_inventory_hover.png",
    },
    {
      icon: Users,
      title: "Rental CRM That Actually Works",
      description:
        "Turn one-time renters into loyal repeat customers with automated follow-ups.",
      standard_image: "./CRM_funnels-sm-clipped.png",
      hover_image: "./CRM_funnels-sm-clipped-hover.png",
    },
    {
      icon: FileText,
      title: "Paperwork Without the Paperwork",
      description:
        "Contracts, signatures, invoices, and payment handling all in one place.",
      standard_image: "./portal.png",
      hover_image: "./portal-hover.png",
    },
    {
      icon: Truck,
      title: "Dispatch & Delivery Tools",
      description:
        "Easy routing and driver workflows built for real rental life.",
      standard_image: "./mapping-v3.png",
      hover_image: "./mapping_hover-v3.png",
    },
    {
      icon: Smartphone,
      title: "Manage from the Palm of Your Hand",
      description:
        "Full mobile access to your rental business. Check availability, manage bookings, and run your shop from anywhere.",
      standard_image: "./mobile_app.png",
      hover_image: "./mobile_app_hover_v3.png",
    },
  ];

  return (
    <>
      <LiveDemoModal
        isOpen={isLiveDemoModalOpen}
        onClose={() => setIsLiveDemoModalOpen(false)}
        onContinue={() => {
          setIsLiveDemoModalOpen(false);
          window.open('https://RentnKing.com', '_blank');
        }}
      />

      <section id="product" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            See how your day changes with KABBA.
          </h2>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 sm:p-10 mb-12 border-2 border-amber-200 shadow-lg">
          <div className="text-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Rental shop specific features they've never dreamed of but you
              always wished you had!
            </h3>
          </div>
        </div>

        <div className="space-y-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-md hover:shadow-xl transition p-8 border border-slate-200 flex flex-col md:flex-row items-start gap-6"
            >
              <div className="bg-blue-100 rounded-lg p-4 flex-shrink-0">
                <feature.icon className="text-blue-600" size={32} />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-lg text-slate-600">{feature.description}</p>
              </div>
              <div
                className="bg-slate-200 rounded-lg h-40 w-full md:w-64 flex-shrink-0 flex items-center justify-center group cursor-pointer"
                onClick={() => feature.standard_image && setSelectedFeature({
                  standard: feature.standard_image,
                  hover: feature.hover_image,
                  title: feature.title
                })}
              >
                {feature.standard_image ? (
                  <>
                    <img
                      src={feature.standard_image}
                      alt={feature.title}
                      className="object-contain h-full w-full rounded-lg group-hover:hidden transition-transform duration-300 border border-slate-200"
                    />
                    {feature.hover_image && (
                      <img
                        src={feature.hover_image}
                        alt={`${feature.title} hover`}
                        className="object-contain h-full w-full rounded-lg hidden group-hover:block transition-transform duration-300 border border-slate-200"
                      />
                    )}
                  </>
                ) : (
                  <span className="text-slate-400 text-sm">Feature Image</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Capstone Block */}
        <div className="mt-20 bg-gradient-to-br from-blue-50 via-slate-50 to-blue-50 rounded-2xl shadow-xl border border-blue-100 overflow-hidden animate-fade-in">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image Column */}
            <div className="order-1 md:order-2">
              <img
                src="./cornerstone.png"
                alt="See how your day changes with KABBA"
                className="w-full h-full object-cover min-h-[400px]"
              />
            </div>

            {/* Content Column */}
            <div className="order-2 md:order-1 p-8 sm:p-12 flex flex-col justify-center">
              <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                And that's just the beginning.
              </h3>

              <div className="space-y-4 text-lg text-slate-700 mb-8 leading-relaxed">
                <p>
                  KABBA includes dozens of rental-specific tools that don't fit neatly into a feature list.
                </p>
                <p>
                  Some you'll discover on your own as you explore the demo.
                  Others we'll walk through with you in a personalized consultation — based on how your rental business actually operates.
                </p>
                <p className="font-semibold text-slate-900">
                  No generic demos.<br />
                  No wasted features.<br />
                  Just software that fits your day.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <button
                  className="group relative inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Eye className="mr-2" size={20} />
                  Explore the Demo

                  <div
                    className="absolute top-0 left-full ml-2 bg-white border-2 border-slate-300 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition z-10 flex flex-col w-48">
                    <button onClick={() => setIsLiveDemoModalOpen(true)}
                      className="text-left px-4 py-3 rounded-t-md border-b border-slate-200 transition hover:text-[rgb(2,255,255)] text-slate-700"
                      >
                      Live Rental Site
                    </button>
                    <button onClick={() => window.open('https://demo-admin.kabba.ai', '_blank')}
                      className="text-left px-4 py-3 rounded-b-md transition hover:text-[rgb(2,255,255)] text-slate-700"
                      >
                      Admin Demo
                    </button>
                  </div>
                </button>
                <a
                  href="#consultation"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  See It in a Personalized Consultation
                </a>
              </div>

              <p className="text-sm text-slate-500 italic">
                Choose self-guided demo exploration — or get a guided walkthrough tailored to your shop.
              </p>
            </div>
          </div>
        </div>
      </div>

      {selectedFeature && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedFeature(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition"
            onClick={() => setSelectedFeature(null)}
          >
            <X size={32} />
          </button>
          <div
            className="group relative max-w-[70vw] max-h-[70vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedFeature.standard}
              alt={selectedFeature.title}
              className="max-w-[70vw] max-h-[70vh] object-contain group-hover:hidden"
            />
            {selectedFeature.hover && (
              <img
                src={selectedFeature.hover}
                alt={`${selectedFeature.title} hover`}
                className="max-w-[70vw] max-h-[70vh] object-contain hidden group-hover:block"
              />
            )}
          </div>
        </div>
      )}
      </section>
    </>
  );
}
