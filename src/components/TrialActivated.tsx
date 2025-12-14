import { CheckCircle2, Calendar, LayoutDashboard, FileText, DollarSign, MessageCircle, Phone } from 'lucide-react';
import { SignupFormData } from './OnboardingSignup';

interface TrialActivatedProps {
  formData: SignupFormData;
  consultationTime: string;
  onGoToDashboard: () => void;
  onViewDetails: () => void;
}

export default function TrialActivated({ formData, consultationTime, onGoToDashboard, onViewDetails }: TrialActivatedProps) {
  const formattedDate = new Date(consultationTime).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedTime = new Date(consultationTime).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">

        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Your Trial Is Activated
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            You're officially up and running.
          </p>

          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 max-w-2xl mx-auto">
            <p className="text-lg text-emerald-400 font-medium">
              Your $4.95 KABBA trial is now active, and we've locked in your setup & strategy session.
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto space-y-8">

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6">Here's what we've completed:</h2>
            <ul className="space-y-4">
              {[
                'Your trial has been activated',
                'Your consultation time is confirmed',
                'Your demo environment is ready',
                'An onboarding specialist has been assigned',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-6 border-t border-gray-800">
              <div className="flex items-start gap-3 text-gray-300">
                <Calendar className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold mb-1">Your consultation is scheduled:</div>
                  <div className="text-emerald-400">{formattedDate} at {formattedTime}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6">What happens next</h2>
            <ol className="space-y-6">
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-200 mb-2">Explore the software now</h3>
                  <p className="text-gray-400 text-sm">
                    You can start using KABBA immediately in demo mode.
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-200 mb-2">We'll contact you shortly</h3>
                  <p className="text-gray-400 text-sm">
                    We'll gather your website URL/domain and setup preferences.
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-200 mb-2">Your consultation</h3>
                  <p className="text-gray-400 text-sm">
                    We'll finalize your rental website setup, confirm equipment/pricing/workflows, and share proven growth strategies.
                  </p>
                </div>
              </li>
            </ol>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <button
              onClick={onGoToDashboard}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-4 px-6 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <LayoutDashboard className="w-5 h-5" />
              Go to My Demo Dashboard
            </button>

            <button
              onClick={onViewDetails}
              className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-750 text-gray-300 font-semibold py-4 px-6 rounded-lg transition-colors"
            >
              <FileText className="w-5 h-5" />
              View My Consultation Details
            </button>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
            <p className="text-gray-300 text-center leading-relaxed">
              We don't rush onboarding. This process is designed to make sure your rental business is set up correctly the first time.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
            <div className="flex items-start gap-3 mb-6">
              <DollarSign className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-200 mb-4">Billing Transparency</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Today:</span>
                    <span className="text-emerald-400 font-semibold">$4.95 trial</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-gray-400">After trial:</span>
                    <div className="text-right">
                      <div className="text-gray-300 font-semibold">$9.95/month</div>
                      <div className="text-gray-500 text-xs">+ $0.39 per rental transaction</div>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-800">
                    <p className="text-gray-500 text-xs text-center">
                      No contracts. Cancel anytime.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <MessageCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-gray-300 text-sm mb-2">
                  Need anything before your session? We're here.
                </p>
                <p className="text-gray-400 text-sm mb-4">
                  Reply to our message or reach out directly.
                </p>
                <div className="flex justify-center">
                  <a
                    href="tel:+16293094154"
                    className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-bold text-lg transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    Call Us: (629) 309-4154
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center py-8">
            <p className="text-2xl font-semibold text-emerald-400">
              Welcome to KABBA.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
