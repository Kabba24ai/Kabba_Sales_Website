import { X } from 'lucide-react';

interface LiveDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

export default function LiveDemoModal({ isOpen, onClose, onContinue }: LiveDemoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition z-10"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col md:flex-row">
          <div className="flex-1 p-8 md:p-12">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              You're about to view a live rental website!
            </h2>

            <div className="space-y-4 text-slate-700 text-lg">
              <p>
                This demo link opens a <span className="font-bold">real rental shop website</span> that is actively used by a real business.
              </p>

              <p>
                You're seeing this on purpose so you can experience how KABBA works in the real world.
              </p>

              <p>
                <span className="font-bold">Please do not place any orders</span>, as transactions on this site are live and will result in real charges.
              </p>

              <p className="text-sm text-slate-600 italic mt-6">
                *We're showing you the real thing — not a sandbox — because transparency matters.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={onClose}
                className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-lg transition shadow-lg hover:shadow-xl"
              >
                Go Back
              </button>
              <button
                onClick={onContinue}
                className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-lg transition shadow-lg hover:shadow-xl"
              >
                View Live Rental Site
              </button>
            </div>
          </div>

          <div className="hidden md:block md:w-80 relative">
            <img
              src="https://images.pexels.com/photos/2100063/pexels-photo-2100063.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
