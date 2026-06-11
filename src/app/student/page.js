
import Link from "next/link";
import { getStudentComplaints } from "@/lib/complaints";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { getUserByEmail } from "@/lib/users";
import { redirect } from "next/navigation";
import { getHostelById } from "@/lib/hostels";



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

export default async function StudentPage() {
  const session = await getServerSession(authConfig)
  const user = await getUserByEmail(
  session.user.email
);

if (!user) {
  redirect("/");
}
const complaints =
  await getStudentComplaints(
    user.id
  );

const hostel =
  user.hostel_id
    ? await getHostelById(user.hostel_id)
    : null;

  const total      = complaints.length;
  const pending    = complaints.filter((c) => c.status === "Pending").length;
  const inProgress = complaints.filter((c) => c.status === "In Progress").length;
  const resolved   = complaints.filter((c) => c.status === "Resolved").length;
  const recent     = complaints.slice(0, 3);

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
                Student
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Welcome back, <span className="font-medium text-gray-700">{session.user.name}</span>
            </p>
          </div>

          {/* Quick actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/track-complaints"
              className="text-sm font-medium text-gray-600 border border-gray-200 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors"
            >
              My complaints
            </Link>
            <Link
              href="/submit-complaint"
              className="flex items-center gap-2 bg-[#003087] hover:bg-[#00256b] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Submit grievance
            </Link>
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

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-8">

  {/* Header */}
  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-[#eef2ff] flex items-center justify-center flex-shrink-0">
        <svg className="w-4 h-4 text-[#003087]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      </div>
      <div>
        <h2 className="text-sm font-semibold text-gray-900">Hostel information</h2>
        <p className="text-xs text-gray-500">Your current registration details</p>
      </div>
    </div>
    <Link
      href="/register-hostel"
      className="flex items-center gap-1.5 text-xs font-medium text-[#003087] border border-[#003087] px-3 py-1.5 rounded-lg hover:bg-[#eef2ff] transition-colors"
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z" />
      </svg>
      Update
    </Link>
  </div>

  {/* Fields */}
  <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
    {[
     {
  label: "Hostel",
  value: hostel?.name || hostel?.code || "Not set",
},
      { label: "Block / Wing", value: user.block         || "Not set" },
      { label: "Room number",  value: user.room_number   || "Not set" },
    ].map((field) => (
      <div key={field.label} className="px-5 py-4">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1.5">
          {field.label}
        </p>
        <p className={`text-sm font-semibold ${field.value === "Not set" ? "text-gray-300" : "text-gray-900"}`}>
          {field.value}
        </p>
      </div>
    ))}
  </div>

</div>

        {/* Recent complaints */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Recent complaints</h2>
            <Link
              href="/track-complaints"
              className="text-xs font-medium text-[#003087] hover:underline"
            >
              View all →
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="w-10 h-10 rounded-2xl bg-[#eef2ff] flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-[#003087]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-900 mb-1">No complaints yet</p>
              <p className="text-sm text-gray-500 mb-5">Submit your first grievance and track it here.</p>
              <Link
                href="/submit-complaint"
                className="inline-flex items-center gap-2 bg-[#003087] hover:bg-[#00256b] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
              >
                Submit a grievance
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recent.map((complaint) => (
                <div
                  key={complaint.id}
                  className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate mb-0.5">
                      {complaint.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">
                        {complaint.complaint_code}
                      </span>
                      {complaint.category && (
                        <>
                          <span className="text-gray-200">·</span>
                          <span className="text-xs bg-gray-100 text-gray-600 font-medium px-2 py-0.5 rounded-full">
                            {complaint.category}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <StatusBadge status={complaint.status} />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}