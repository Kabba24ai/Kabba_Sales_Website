import { useState, useEffect } from "react";
import {
  Users,
  Calendar,
  Mail,
  Phone,
  Building,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
// import { supabase } from "../lib/supabase";

interface Signup {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  business_name: string;
  consultation_time: string | null;
  status: string;
  created_at: string;
}

interface AdminSignupsListProps {
  onViewDetails: (signupId: string) => void;
}

export default function AdminSignupsList({
  onViewDetails,
}: AdminSignupsListProps) {
  const [signups, setSignups] = useState<Signup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSignups = async () => {
    setLoading(true);
    setError(null);

    try {
      // const { data, error: fetchError } = await supabase
      //   .from("signups")
      //   .select("*")
      //   .order("created_at", { ascending: false });
      // if (fetchError) throw fetchError;
      // setSignups(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load signups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignups();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
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

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Trial Signups</h1>
              <p className="text-gray-400 text-sm mt-1">
                {signups.length} {signups.length === 1 ? "signup" : "signups"}{" "}
                total
              </p>
            </div>
          </div>

          <button
            onClick={fetchSignups}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
          </div>
        ) : signups.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-400 mb-2">
              No signups yet
            </h2>
            <p className="text-gray-500">New trial signups will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {signups.map((signup) => (
              <button
                key={signup.id}
                onClick={() => onViewDetails(signup.id)}
                className="w-full bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-lg p-6 transition-all text-left group"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-4 flex-wrap">
                      <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
                        {signup.first_name} {signup.last_name}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          signup.status
                        )}`}
                      >
                        {signup.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Building className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{signup.business_name}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-400">
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{signup.email}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-400">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        <span>{signup.phone_number}</span>
                      </div>

                      {signup.consultation_time && (
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span className="text-emerald-400">
                            {formatDate(signup.consultation_time)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-gray-500">
                      Signed up: {formatDate(signup.created_at)}
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-emerald-500 flex-shrink-0 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
