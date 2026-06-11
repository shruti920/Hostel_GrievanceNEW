import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { getHostelByCode } from "@/lib/hostels";
import { getComplaintsByHostel } from "@/lib/complaints";
import Complainttable from "./ComplaintTable";

export default async function HallOfficePage() {
  const session = await getServerSession(authConfig);

  if (!session || session.user.role !== "hall_office") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-8 py-12 text-center max-w-sm w-full">
          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-900 mb-1">Access restricted</p>
          <p className="text-sm text-gray-500">You do not have permission to view this page. Please sign in with a Hall Office account.</p>
        </div>
      </div>
    );
  }

  const hostel = await getHostelByCode(session.user.hostelCode);
  const complaints = await getComplaintsByHostel(hostel.id);

  const total    = complaints.length;
  const open     = complaints.filter((c) => c.status?.toLowerCase() === "open").length;
  const pending  = complaints.filter((c) => c.status?.toLowerCase() === "pending").length;
  const resolved = complaints.filter((c) => c.status?.toLowerCase() === "resolved").length;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-5xl mx-auto">

        {/* Page header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-[#003087] bg-[#eef2ff] px-2.5 py-1 rounded-full tracking-wide uppercase">
                Hall Office
              </span>
              <span className="text-xs text-gray-400">{hostel.name}</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Complaints dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">Review and manage grievances submitted by students</p>
          </div>
          {/* Logged-in user pill */}
          <div className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-xl px-3.5 py-2 shadow-sm">
            <div className="w-7 h-7 rounded-full bg-[#eef2ff] flex items-center justify-center text-[#003087] text-xs font-bold">
              {session.user.name?.[0] ?? "H"}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900 leading-tight">{session.user.name ?? "Hall Office"}</p>
              <p className="text-[11px] text-gray-400">{hostel.name}</p>
            </div>
          </div>
        </div>

        {/* Stat strip */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total",    value: total,    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2", color: "bg-[#eef2ff] text-[#003087]" },
            { label: "Open",     value: open,     icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",                          color: "bg-blue-50 text-blue-700"    },
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

        {/* Table card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-black-900">All complaints</h2>
            <span className="text-xs text-black-400">{total} total</span>
          </div>
          <div className="p-0">
            <Complainttable complaints={complaints} />
          </div>
        </div>

      </div>
    </div>
  );
}