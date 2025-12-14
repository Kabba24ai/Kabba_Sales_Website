import { SignupFormData } from './OnboardingSignup';

interface TrialActivatedProps {
  formData: SignupFormData;
  consultationTime: string;
}

export default function TrialActivated({ formData, consultationTime }: TrialActivatedProps) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Trial Activated!</h1>
        <p className="text-gray-400">Page 3 - Coming next...</p>
        <p className="text-sm text-gray-500 mt-4">Business: {formData.businessName}</p>
        <p className="text-sm text-gray-500">Consultation: {new Date(consultationTime).toLocaleString()}</p>
      </div>
    </div>
  );
}
