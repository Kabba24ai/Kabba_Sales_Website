import { useState, useEffect } from "react";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  Clock,
  RefreshCw,
} from "lucide-react";
// import { supabase } from '../lib/supabase';

interface Signup {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  business_name: string;
  billing_street: string;
  billing_city: string;
  billing_state: string;
  billing_zip: string;
  consultation_time: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface AdminSignupDetailsProps {
  signupId: string;
  onBack: () => void;
}

export default function AdminSignupDetails({
  signupId,
  onBack,
}: AdminSignupDetailsProps) {
  const [signup, setSignup] = useState<Signup | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchSignup = async () => {
    setLoading(true);
    setError(null);

    try {
      // const { data, error: fetchError } = await supabase
      //   .from('signups')
      //   .select('*')
      //   .eq('id', signupId)
      //   .maybeSingle();
      // if (fetchError) throw fetchError;
      // if (!data) throw new Error('Signup not found');
      // setSignup(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load signup details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignup();
  }, [signupId]);

  const updateStatus = async (newStatus: string) => {
    if (!signup) return;

    setUpdating(true);
    try {
      // const { error: updateError } = await supabase
      //   .from("signups")
      //   .update({ status: newStatus, updated_at: new Date().toISOString() })
      //   .eq("id", signupId);
      // if (updateError) throw updateError;
      // setSignup({ ...signup, status: newStatus });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/30";
      case "trial":
        return "bg-cyan-500/10 text-cyan-500 border-cyan-500/30";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/30";
      case "canceled":
        return "bg-gray-500/10 text-gray-500 border-gray-500/30";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/30";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (error || !signup) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-200 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to list
          </button>

          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-8 text-center">
            <p className="text-red-400 text-lg">
              {error || "Signup not found"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-200 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to list
        </button>

        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {signup.first_name} {signup.last_name}
                </h1>
                <p className="text-gray-400">{signup.business_name}</p>
              </div>
              <span
                className={`px-4 py-2 rounded-lg text-sm font-medium border ${getStatusColor(
                  signup.status
                )}`}
              >
                {signup.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-500 mb-1">Email</div>
                  <a
                    href={`mailto:${signup.email}`}
                    className="text-gray-200 hover:text-emerald-400 transition-colors"
                  >
                    {signup.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-500 mb-1">Phone</div>
                  <a
                    href={`tel:${signup.phone_number}`}
                    className="text-gray-200 hover:text-emerald-400 transition-colors"
                  >
                    {signup.phone_number}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-500 mb-1">
                    Business Name
                  </div>
                  <div className="text-gray-200">{signup.business_name}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-500 mb-1">Full Name</div>
                  <div className="text-gray-200">
                    {signup.first_name} {signup.last_name}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-500" />
              Billing Address
            </h2>

            <div className="space-y-3 text-gray-300">
              <div>{signup.billing_street}</div>
              <div>
                {signup.billing_city}, {signup.billing_state}{" "}
                {signup.billing_zip}
              </div>
            </div>
          </div>

          {signup.consultation_time && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-500" />
                Consultation Scheduled
              </h2>

              <div className="text-gray-300 text-lg">
                {formatDate(signup.consultation_time)}
              </div>
            </div>
          )}

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-500" />
              Timeline
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Created:</span>
                <span className="text-gray-300">
                  {formatDate(signup.created_at)}
                </span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Last Updated:</span>
                <span className="text-gray-300">
                  {formatDate(signup.updated_at)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
            <h2 className="text-xl font-semibold mb-6">Update Status</h2>

            <div className="flex flex-wrap gap-3">
              {["pending", "trial", "active", "canceled"].map((status) => (
                <button
                  key={status}
                  onClick={() => updateStatus(status)}
                  disabled={updating || signup.status === status}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    signup.status === status
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-800 hover:bg-gray-750 text-gray-300 border border-gray-700"
                  } disabled:opacity-50 disabled:cursor-not-allowed capitalize`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
