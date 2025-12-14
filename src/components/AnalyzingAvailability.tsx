import { useState, useEffect } from 'react';
import { Check, Loader2, Calendar, Shield, ChevronDown } from 'lucide-react';
import { SignupFormData } from './OnboardingSignup';

interface AnalyzingAvailabilityProps {
  formData: SignupFormData;
  onComplete: (consultationTime: string) => void;
  onCancel: () => void;
}

interface ChecklistStep {
  id: number;
  label: string;
  duration: number;
}

interface TimeSlot {
  id: string;
  date: Date;
  formatted: string;
}

const steps: ChecklistStep[] = [
  { id: 1, label: 'Preparing your demo environment…', duration: 2000 },
  { id: 2, label: 'Allocating onboarding resources…', duration: 1800 },
  { id: 3, label: 'Checking operator availability…', duration: 2200 },
  { id: 4, label: 'Matching you with the best setup window…', duration: 1900 },
  { id: 5, label: 'Reviewing initial setup requirements…', duration: 2100 },
  { id: 6, label: 'Finalizing consultation options…', duration: 1700 },
];

const refreshSteps: ChecklistStep[] = [
  { id: 1, label: 'Checking additional openings…', duration: 1800 },
  { id: 2, label: 'Reserving setup capacity…', duration: 2000 },
  { id: 3, label: 'Finalizing new options…', duration: 1700 },
];

export default function AnalyzingAvailability({ formData, onComplete, onCancel }: AnalyzingAvailabilityProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showScheduling, setShowScheduling] = useState(false);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [generationCount, setGenerationCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshStep, setRefreshStep] = useState(0);
  const [refreshCompletedSteps, setRefreshCompletedSteps] = useState<number[]>([]);

  const generateTimeSlots = (offset: number = 0): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const now = new Date();
    const baseDay = 3;

    const timeVariations = [
      [
        { hour: 11, minute: 0 },
        { hour: 13, minute: 30 },
        { hour: 12, minute: 15 },
      ],
      [
        { hour: 10, minute: 30 },
        { hour: 14, minute: 0 },
        { hour: 15, minute: 30 },
      ],
      [
        { hour: 9, minute: 0 },
        { hour: 11, minute: 30 },
        { hour: 16, minute: 0 },
      ],
      [
        { hour: 10, minute: 0 },
        { hour: 13, minute: 0 },
        { hour: 14, minute: 30 },
      ],
    ];

    const times = timeVariations[offset % timeVariations.length];
    const dayOffsets = offset === 0 ? [0, 1, 2] : [0, 1, 3];

    for (let i = 0; i < 3; i++) {
      const slotDate = new Date(now);
      slotDate.setDate(now.getDate() + baseDay + dayOffsets[i]);
      slotDate.setHours(times[i].hour, times[i].minute, 0, 0);

      const dayName = slotDate.toLocaleDateString('en-US', { weekday: 'short' });
      const dateStr = slotDate.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
      const timeStr = slotDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

      slots.push({
        id: `${slotDate.getTime()}-${i}`,
        date: slotDate,
        formatted: `${dayName} ${dateStr} at ${timeStr}`,
      });
    }

    return slots;
  };

  useEffect(() => {
    if (currentStep >= steps.length) {
      setTimeout(() => {
        setShowScheduling(true);
        setTimeSlots(generateTimeSlots());
      }, 500);
      return;
    }

    const timer = setTimeout(() => {
      setCompletedSteps((prev) => [...prev, currentStep]);
      setCurrentStep((prev) => prev + 1);
    }, steps[currentStep].duration);

    return () => clearTimeout(timer);
  }, [currentStep]);

  const handleShowMoreOptions = () => {
    setIsRefreshing(true);
    setRefreshStep(0);
    setRefreshCompletedSteps([]);
    setSelectedSlot(null);
  };

  useEffect(() => {
    if (!isRefreshing || refreshStep >= refreshSteps.length) {
      if (isRefreshing && refreshStep >= refreshSteps.length) {
        setTimeout(() => {
          const newOffset = generationCount + 1;
          setTimeSlots(generateTimeSlots(newOffset));
          setGenerationCount((prev) => prev + 1);
          setIsRefreshing(false);
        }, 300);
      }
      return;
    }

    const timer = setTimeout(() => {
      setRefreshCompletedSteps((prev) => [...prev, refreshStep]);
      setRefreshStep((prev) => prev + 1);
    }, refreshSteps[refreshStep].duration);

    return () => clearTimeout(timer);
  }, [isRefreshing, refreshStep, generationCount]);

  const handleConfirm = () => {
    if (selectedSlot) {
      const slot = timeSlots.find((s) => s.id === selectedSlot);
      if (slot) {
        onComplete(slot.date.toISOString());
      }
    }
  };


  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">

        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Analyzing Availability
          </h1>
          <p className="text-xl text-gray-400">
            We're preparing your setup.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-12">

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
            <div className="space-y-4 mb-8">
              {steps.map((step, index) => {
                const isCompleted = completedSteps.includes(index);
                const isActive = currentStep === index;

                return (
                  <div key={step.id} className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      ) : isActive ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-800 border border-gray-700" />
                      )}
                    </div>
                    <span
                      className={`text-sm ${
                        isCompleted
                          ? 'text-gray-400'
                          : isActive
                          ? 'text-gray-200 font-medium'
                          : 'text-gray-600'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {showScheduling && (
              <div className="mt-8 mb-6">
                <div className="bg-emerald-500/10 border-2 border-emerald-500/30 rounded-xl p-6 text-center animate-pulse">
                  <p className="text-emerald-400 font-bold text-lg mb-2">
                    Your Consultation Options Are Now Available
                  </p>
                  <p className="text-emerald-300 font-semibold mb-3">
                    Scroll Below To Choose
                  </p>
                  <ChevronDown className="w-6 h-6 text-emerald-400 mx-auto animate-bounce" />
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-gray-800 space-y-4">
              <p className="text-gray-300 leading-relaxed">
                We don't rush onboarding.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Before we activate your trial and charge your card, we prepare your environment and confirm availability to make sure your rental business is set up correctly the first time.
              </p>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6">What's already happening</h2>
            <ul className="space-y-4">
              {[
                'Your demo environment is being prepared',
                'A KABBA onboarding specialist is being assigned',
                'Your setup preferences are being reviewed',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-gray-300 leading-relaxed">
              A KABBA team member will contact you shortly to gather your website URL and confirm how you'd like your rental site configured.
            </p>
            <p className="mt-2 text-emerald-400 font-medium">
              You won't be waiting days to get started.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
            <p className="text-gray-300 leading-relaxed mb-4">
              While we prepare your customized setup, you'll have immediate access to the demo version of KABBA so you can begin exploring the system right away.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Your live rental website and final configuration will be completed during your consultation to ensure everything is done correctly.
            </p>
          </div>

          {showScheduling && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 space-y-6 animate-fade-in">
              <div>
                <h2 className="text-2xl font-bold mb-4">Choose a setup & strategy session</h2>
                <p className="text-gray-300 mb-4">
                  To complete your setup and activate your trial, please select a consultation time below.
                </p>

                <ul className="space-y-3 mb-6">
                  {[
                    'Finalize your rental website and domain',
                    'Confirm your business details and preferences',
                    'Set up your equipment, pricing, and workflows',
                    'Share proven strategies we used to grow a multi-location rental business',
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-400 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-gray-300 leading-relaxed">
                  We want to make sure the timing works for you before we activate your trial and charge your card.
                </p>
              </div>

{isRefreshing ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-4">Finding more availability…</h3>
                    <div className="space-y-3">
                      {refreshSteps.map((step, index) => {
                        const isCompleted = refreshCompletedSteps.includes(index);
                        const isActive = refreshStep === index;

                        return (
                          <div key={step.id} className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              {isCompleted ? (
                                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                                  <Check className="w-3 h-3 text-white" />
                                </div>
                              ) : isActive ? (
                                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                  <Loader2 className="w-3 h-3 text-emerald-500 animate-spin" />
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-full bg-gray-800 border border-gray-700" />
                              )}
                            </div>
                            <span
                              className={`text-sm ${
                                isCompleted
                                  ? 'text-gray-400'
                                  : isActive
                                  ? 'text-gray-200 font-medium'
                                  : 'text-gray-600'
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-200">Available Times</h3>
                    <span className="text-xs text-gray-500">Times shown in your local time zone</span>
                  </div>

                  {generationCount > 0 && (
                    <p className="text-gray-300 mb-3 text-sm font-medium">
                      Here are three more available times:
                    </p>
                  )}

                  <p className="text-gray-400 mb-4 text-sm">Do any of these times work for you?</p>

                  <div className="space-y-3 mb-6">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedSlot(slot.id)}
                        className={`w-full flex items-center gap-3 p-4 rounded-lg border transition-all ${
                          selectedSlot === slot.id
                            ? 'border-emerald-500 bg-emerald-500/10'
                            : 'border-gray-700 bg-gray-950 hover:border-gray-600'
                        }`}
                      >
                        <Calendar className={`w-5 h-5 ${selectedSlot === slot.id ? 'text-emerald-500' : 'text-gray-500'}`} />
                        <span className={`font-medium ${selectedSlot === slot.id ? 'text-emerald-400' : 'text-gray-300'}`}>
                          {slot.formatted}
                        </span>
                      </button>
                    ))}
                  </div>

                  {generationCount >= 2 && (
                    <div className="mb-4 p-4 bg-gray-800/50 border border-gray-700/50 rounded-lg">
                      <p className="text-sm text-gray-400 leading-relaxed">
                        Still not seeing a good time? Choose 'cancel setup' and we'll ensure no charge is made.
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <button
                      onClick={handleConfirm}
                      disabled={!selectedSlot}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none"
                    >
                      Yes — one of these times works for me
                    </button>

                    <button
                      onClick={handleShowMoreOptions}
                      className="w-full bg-gray-800 hover:bg-gray-750 text-gray-300 font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                      These times don't work — show more options
                    </button>

                    <button
                      onClick={onCancel}
                      className="w-full text-gray-500 hover:text-gray-400 font-medium py-2 transition-colors text-sm"
                    >
                      This won't work for me — cancel setup
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-emerald-400 font-medium">
                Your card will not be charged until you confirm a consultation time. No charge. No obligation. No surprises.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
