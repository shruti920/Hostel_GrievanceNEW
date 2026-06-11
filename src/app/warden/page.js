import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { getHostelByCode } from "@/lib/hostels";
import { getComplaintsByHostel } from "@/lib/complaints";

export default async function WardenPage() {
  const session = await getServerSession(authConfig);

  if (!session || session.user.role !== "warden") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-8 py-12 text-center max-w-sm w-full">
          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-900 mb-1">Access restricted</p>
          <p className="text-sm text-gray-500">You do not have permission to view this page. Please sign in with a Warden account.</p>
        </div>
      </div>
    );
  }

  const hostel = await getHostelByCode(session.user.hostelCode);
  const complaints = await getComplaintsByHostel(hostel.id);

  const total      = complaints.length;
  const pending    = complaints.filter((c) => c.status === "Pending").length;
  const inProgress = complaints.filter((c) => c.status === "In Progress").length;
  const resolved   = complaints.filter((c) => c.status === "Resolved").length;

  const categoryStats = {};
  complaints.forEach((c) => {
    categoryStats[c.category] = (categoryStats[c.category] || 0) + 1;
  });

  const categoryEntries = Object.entries(categoryStats).sort((a, b) => b[1] - a[1]);
  const maxCount = categoryEntries[0]?.[1] ?? 1;

  const stats = [
    { label: "Total",       value: total,      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2", color: "bg-[#eef2ff] text-[#003087]" },
    { label: "Pending",     value: pending,    icon: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",                   color: "bg-amber-50 text-amber-700"  },
    { label: "In Progress", value: inProgress, icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",                         color: "bg-blue-50 text-blue-700"    },
    { label: "Resolved",    value: resolved,   icon: "M5 13l4 4L19 7",                                                       color: "bg-green-50 text-green-700"  },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-4xl mx-auto">

        {/* Page header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-[#003087] bg-[#eef2ff] px-2.5 py-1 rounded-full tracking-wide uppercase">
                Warden
              </span>
              <span className="text-xs text-gray-400">{hostel.name}</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Hostel dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">Overview of grievances for {hostel.name}</p>
          </div>
          <div className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-xl px-3.5 py-2 shadow-sm">
            <div className="w-7 h-7 rounded-full bg-[#eef2ff] flex items-center justify-center text-[#003087] text-xs font-bold">
              {session.user.name?.[0] ?? "W"}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900 leading-tight">{session.user.name ?? "Warden"}</p>
              <p className="text-[11px] text-gray-400">{hostel.name}</p>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {stats.map((s) => (
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

        {/* Category breakdown */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Category breakdown</h2>
            <span className="text-xs text-gray-400">{categoryEntries.length} categories</span>
          </div>

          {categoryEntries.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-gray-400">No complaints data available.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {categoryEntries.map(([category, count]) => {
                const pct = Math.round((count / maxCount) * 100);
                return (
                  <div key={category} className="px-6 py-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-800">{category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">{count}</span>
                        <span className="text-xs text-gray-400">
                          {total > 0 ? Math.round((count / total) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#003087] rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}