import { SignupFormData } from './OnboardingSignup';

interface AnalyzingAvailabilityProps {
  formData: SignupFormData;
  onComplete: (consultationTime: string) => void;
}

export default function AnalyzingAvailability({ formData, onComplete }: AnalyzingAvailabilityProps) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Analyzing Availability</h1>
        <p className="text-gray-400">Page 2 - Coming next...</p>
        <p className="text-sm text-gray-500 mt-4">Signed up as: {formData.email}</p>
        <button
          onClick={() => onComplete('2025-01-20T10:00:00Z')}
          className="mt-8 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg"
        >
          Continue (Placeholder)
        </button>
      </div>
    </div>
  );
}
