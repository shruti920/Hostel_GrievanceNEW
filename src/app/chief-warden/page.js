import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { getAllComplaints } from "@/lib/complaints";
import { getAllHostels } from "@/lib/hostels";

const statusConfig = {
  "pending":     { label: "Pending",     dot: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50",  border: "border-amber-200" },
  "in progress": { label: "In Progress", dot: "bg-blue-600",  text: "text-blue-700",  bg: "bg-blue-50",   border: "border-blue-200"  },
  "resolved":    { label: "Resolved",    dot: "bg-green-600", text: "text-green-700", bg: "bg-green-50",  border: "border-green-200" },
  "rejected":    { label: "Rejected",    dot: "bg-red-500",   text: "text-red-700",   bg: "bg-red-50",    border: "border-red-200"   },
};

function StatusBadge({ status }) {
  const s = statusConfig[status?.toLowerCase()] ?? statusConfig["pending"];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${s.text} ${s.bg} ${s.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

export default async function ChiefWardenPage() {
  const session = await getServerSession(authConfig);

  if (!session || session.user.role !== "chief_warden") {
    redirect("/dashboard");
  }

  const complaints = await getAllComplaints();
  const hostels    = await getAllHostels();

  const total      = complaints.length;
  const pending    = complaints.filter((c) => c.status === "Pending").length;
  const inProgress = complaints.filter((c) => c.status === "In Progress").length;
  const resolved   = complaints.filter((c) => c.status === "Resolved").length;

  // Hostel stats
  const hostelStats = {};
  complaints.forEach((c) => {
    hostelStats[c.hostel_id] = (hostelStats[c.hostel_id] || 0) + 1;
  });
  const maxHostelCount = Math.max(...hostels.map((h) => hostelStats[h.id] || 0), 1);

  // Category stats
  const categoryStats = {};
  complaints.forEach((c) => {
    categoryStats[c.category] = (categoryStats[c.category] || 0) + 1;
  });
  const categoryEntries = Object.entries(categoryStats).sort((a, b) => b[1] - a[1]);
  const maxCategoryCount = categoryEntries[0]?.[1] ?? 1;

  // Recent complaints
  const recentComplaints = complaints.slice(0, 10);

  const stats = [
    { label: "Total",       value: total,      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2", color: "bg-[#eef2ff] text-[#003087]" },
    { label: "Pending",     value: pending,    icon: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",                   color: "bg-amber-50 text-amber-700"  },
    { label: "In Progress", value: inProgress, icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",                         color: "bg-blue-50 text-blue-700"    },
    { label: "Resolved",    value: resolved,   icon: "M5 13l4 4L19 7",                                                       color: "bg-green-50 text-green-700"  },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-5xl mx-auto">

        {/* Page header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-[#003087] bg-[#eef2ff] px-2.5 py-1 rounded-full tracking-wide uppercase">
                Chief Warden
              </span>
              <span className="text-xs text-gray-400">IIT Bhubaneswar</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Campus dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">Campus-wide grievance overview across all hostels</p>
          </div>
          <div className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-xl px-3.5 py-2 shadow-sm">
            <div className="w-7 h-7 rounded-full bg-[#eef2ff] flex items-center justify-center text-[#003087] text-xs font-bold">
              {session.user.name?.[0] ?? "C"}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900 leading-tight">{session.user.name ?? "Chief Warden"}</p>
              <p className="text-[11px] text-gray-400">Chief Warden</p>
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

        {/* Bottom two-col grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">

          {/* Hostel-wise */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Hostel-wise complaints</h2>
              <span className="text-xs text-gray-400">{hostels.length} hostels</span>
            </div>
            <div className="divide-y divide-gray-100">
              {hostels.map((hostel) => {
                const count = hostelStats[hostel.id] || 0;
                const pct   = Math.round((count / maxHostelCount) * 100);
                return (
                  <div key={hostel.id} className="px-5 py-3.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-gray-800">{hostel.name ?? hostel.code}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">{count}</span>
                        <span className="text-xs text-gray-400">
                          {total > 0 ? Math.round((count / total) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#003087] rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category breakdown */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Category breakdown</h2>
              <span className="text-xs text-gray-400">{categoryEntries.length} categories</span>
            </div>
            <div className="divide-y divide-gray-100">
              {categoryEntries.map(([category, count]) => {
                const pct = Math.round((count / maxCategoryCount) * 100);
                return (
                  <div key={category} className="px-5 py-3.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-gray-800">{category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">{count}</span>
                        <span className="text-xs text-gray-400">
                          {total > 0 ? Math.round((count / total) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#003087] rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent complaints */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Recent complaints</h2>
            <span className="text-xs text-gray-400">Latest {recentComplaints.length}</span>
          </div>
          <div className="divide-y divide-gray-100">
            {recentComplaints.map((complaint) => (
              <div key={complaint.id} className="px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-semibold text-gray-400 tracking-wide uppercase shrink-0">
                    {complaint.complaint_code}
                  </span>
                  <span className="text-gray-200 shrink-0">·</span>
                  <span className="text-xs bg-gray-100 text-gray-600 font-medium px-2 py-0.5 rounded-full shrink-0">
                    {complaint.category}
                  </span>
                  <span className="text-sm text-gray-700 font-medium truncate hidden sm:block">
                    {complaint.title}
                  </span>
                </div>
                <StatusBadge status={complaint.status} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}