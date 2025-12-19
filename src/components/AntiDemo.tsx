import { useState } from 'react';
import { X, Eye } from 'lucide-react';
import LiveDemoModal from './LiveDemoModal';

export default function AntiDemo() {
  const [isLiveDemoModalOpen, setIsLiveDemoModalOpen] = useState(false);

  const problems = [
    'Hidden pricing',
    'Forced demos',
    'No screenshots',
    'No trial',
    'No transparency',
    'No real-world rental experience'
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

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Why do other rental software companies hide everything behind a demo?
            </h2>
            <p className="text-xl text-slate-300">
              If the software is so good, why won't they let you see it without talking to a salesperson first?
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {problems.map((problem, index) => (
              <div key={index} className="bg-red-900/30 border border-red-700/50 rounded-lg p-4 flex items-start gap-3">
                <X className="text-red-400 flex-shrink-0 mt-1" size={20} />
                <span className="text-slate-200">{problem}</span>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 sm:p-12 text-center shadow-2xl">
            <h3 className="text-3xl sm:text-4xl font-bold mb-4">KABBA is different.</h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              You can explore the software instantly, see the pricing upfront, and start using it today — all for $4.95.
            </p>
            <button className="group relative bg-white hover:bg-slate-100 text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition shadow-lg inline-flex items-center">
              <Eye className="mr-2" size={20} />
              See the Product Now
              <span className="ml-2 group-hover:translate-x-1 transition inline-block">→</span>

              <div
                className="absolute top-0 left-full bg-white border-2 border-slate-300 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition z-10 flex flex-col w-48">
                <button onClick={() => setIsLiveDemoModalOpen(true)}
                  className="text-left px-4 py-3 rounded-t-md border-b border-slate-200 transition hover:text-[rgb(2,255,255)]"
                  >
                  Live Rental Site
                </button>
                <button onClick={()=> window.open('https://demo-admin.kabba.ai', '_blank')}
                  className="text-left px-4 py-3 rounded-b-md transition hover:text-[rgb(2,255,255)]"
                  >
                  Admin Demo
                </button>
              </div>
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
