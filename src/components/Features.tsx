import { useState } from "react";
import {
  Calendar,
  Package,
  Users,
  FileText,
  Truck,
  Smartphone,
  X,
} from "lucide-react";

export default function Features() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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
    },
    {
      icon: Smartphone,
      title: "Manage from the Palm of Your Hand",
      description:
        "Full mobile access to your rental business. Check availability, manage bookings, and run your shop from anywhere.",
    },
  ];

  return (
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
                className="bg-slate-200 rounded-lg h-40 w-full md:w-64 flex-shrink-0 flex items-center justify-center group overflow-hidden cursor-pointer"
                onClick={() => feature.standard_image && setSelectedImage(feature.standard_image)}
              >
                {feature.standard_image ? (
                  <>
                    <img
                      src={feature.standard_image}
                      alt={feature.title}
                      className="object-scale-down h-full w-full rounded-lg group-hover:hidden group-hover:scale-110 transition-transform duration-300 border border-slate-200"
                    />
                    {feature.hover_image && (
                      <img
                        src={feature.hover_image}
                        alt={`${feature.title} hover`}
                        className="object-scale-down h-full w-full rounded-lg hidden group-hover:block group-hover:scale-110 transition-transform duration-300 border border-slate-200"
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
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} />
          </button>
          <img
            src={selectedImage}
            alt="Enlarged view"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
