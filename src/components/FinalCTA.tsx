import { ArrowRight, Eye } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
          Ready to run your rental shop the smarter way?
        </h2>
        <p className="text-xl sm:text-2xl text-blue-100 mb-10 leading-relaxed">
          Start today for $4.95. See everything instantly.
          <span className="block mt-2 font-semibold">
            And get the real-world growth strategies you can't get anywhere else.
          </span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button className="bg-amber-500 hover:bg-amber-600 text-white px-10 py-5 rounded-lg font-bold text-xl transition shadow-2xl hover:shadow-3xl flex items-center justify-center group">
            Start Your $4.95 Trial
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition" size={24} />
          </button>
          <button className="bg-white hover:bg-slate-100 text-blue-600 px-10 py-5 rounded-lg font-bold text-xl transition shadow-xl flex items-center justify-center group">
            <Eye className="mr-2" size={24} />
            See the Product First
          </button>
        </div>

        <div className="inline-block bg-blue-800/50 px-8 py-4 rounded-full border border-blue-500/50">
          <p className="text-blue-100">
            Join rental operators who are growing smarter, not harder.
          </p>
        </div>
      </div>
    </section>
  );
}
