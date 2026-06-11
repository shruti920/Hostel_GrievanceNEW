import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { getUserByEmail } from "@/lib/users";
import { getComplaintsByStudent } from "@/lib/complaints";
import Link from "next/link";

const statusConfig = {
  pending:  { label: "Pending",  dot: "bg-amber-500",  text: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-200" },
  open:     { label: "Open",     dot: "bg-blue-600",   text: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200"  },
  resolved: { label: "Resolved", dot: "bg-green-600",  text: "text-green-700",  bg: "bg-green-50",  border: "border-green-200" },
  rejected: { label: "Rejected", dot: "bg-red-500",    text: "text-red-700",    bg: "bg-red-50",    border: "border-red-200"   },
};

function StatusBadge({ status }) {
  const s = statusConfig[status?.toLowerCase()] ?? statusConfig.open;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${s.text} ${s.bg} ${s.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

export default async function TrackComplaintsPage() {
  const session = await getServerSession(authConfig);
  const user = await getUserByEmail(session.user.email);
  const complaints = await getComplaintsByStudent(user.id);

  const total    = complaints.length;
  const pending  = complaints.filter((c) => c.status?.toLowerCase() === "pending").length;
  const resolved = complaints.filter((c) => c.status?.toLowerCase() === "resolved").length;
  const InProgress    = complaints.filter((c) => c.status?.toLowerCase() === "In Progress").length;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-3xl mx-auto">

        {/* Page heading */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My complaints</h1>
            <p className="text-sm text-gray-500 mt-0.5">Track the status of your submitted grievances</p>
          </div>
          <Link
            href="/submit-complaint"
            className="flex items-center gap-2 bg-[#003087] hover:bg-[#00256b] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New grievance
          </Link>
        </div>

        {/* Stat strip */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total",    value: total,    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2", color: "bg-[#eef2ff] text-[#003087]" },
            { label: "In Progress",     value: InProgress,     icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",                          color: "bg-blue-50 text-blue-700"    },
            { label: "Pending",  value: pending,  icon: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",                   color: "bg-amber-50 text-amber-700"  },
            { label: "Resolved", value: resolved, icon: "M5 13l4 4L19 7",                                                       color: "bg-green-50 text-green-700"  },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                </svg>
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* List */}
        {complaints.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-6 py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#eef2ff] flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-[#003087]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-900 mb-1">No complaints yet</p>
            <p className="text-sm text-gray-500 mb-6">Submit your first grievance and track it here.</p>
            <Link
              href="/submit-complaint"
              className="inline-flex items-center gap-2 bg-[#003087] hover:bg-[#00256b] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              Submit a grievance
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {complaints.map((complaint) => (
              <div
                key={complaint.id}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm px-5 py-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-gray-400 tracking-wide uppercase">
                        {complaint.complaint_code}
                      </span>
                      <span className="text-gray-200">·</span>
                      <span className="text-xs bg-gray-100 text-gray-600 font-medium px-2 py-0.5 rounded-full">
                        {complaint.category}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 truncate">{complaint.title}</p>
                  </div>
                  <StatusBadge status={complaint.status} />
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    {complaint.created_at
                      ? new Date(complaint.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                      : "—"}
                  </p>
                  <Link
  href={`/complaints/${complaint.id}`}
  className="text-sm font-medium text-[#003087] hover:underline"
>
  View details →
</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}