"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const statusConfig = {
  pending: {
    label: "Pending",
    dot: "bg-amber-700",
    text: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  "in progress": {
    label: "In Progress",
    dot: "bg-blue-700",
    text: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  resolved: {
    label: "Resolved",
    dot: "bg-green-600",
    text: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
  },
};

function StatusBadge({ status }) {
  const s =
    statusConfig[status?.toLowerCase()] ?? statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${s.text} ${s.bg} ${s.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function ComplaintRow({ complaint, onUpdateStatus }) {
  const [loading, setLoading] = useState(null);

  async function handleUpdate(status) {
    setLoading(status);
    await onUpdateStatus(complaint.id, status);
    setLoading(null);
  }

  const actions = ["Pending", "In Progress", "Resolved"];

  return (
    <div className="px-5 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-semibold text-gray-500 tracking-wide uppercase">
              {complaint.complaint_code}
            </span>

            <span className="text-gray-300">·</span>

            <span className="text-xs bg-gray-100 text-gray-700 font-medium px-2 py-0.5 rounded-full">
              {complaint.category}
            </span>

            <span className="text-gray-300">·</span>

            <span className="text-xs text-gray-500">
              Room {complaint.block}-{complaint.room_number}
            </span>
          </div>

          <p className="text-sm font-semibold text-gray-900">
            {complaint.title}
          </p>

          {complaint.description && (
            <p className="text-xs text-gray-500 mt-1">
              {complaint.description}
            </p>
          )}

        
        </div>

        <StatusBadge status={complaint.status} />
      </div>

     <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 flex-wrap">

  {complaint.image_url && (
    <a
      href={complaint.image_url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-[#003087] hover:text-[#003087] transition-all"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16l4-4a3 3 0 014.243 0L16 16m-2-2l1-1a3 3 0 014.243 0L21 14m-9-9h.01M6 21h12a2 2 0 002-2V5a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
      Evidence
    </a>
  )}

  <span className="text-xs text-gray-500 mr-1">
    Update status:
  </span>

  {actions.map((action) => {
    const isActive =
      complaint.status?.toLowerCase() === action.toLowerCase();

    const isLoading = loading === action;

    return (
      <button
        key={action}
        onClick={() => handleUpdate(action)}
        disabled={isActive || !!loading}
        className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all disabled:cursor-not-allowed
          ${
            isActive
              ? "bg-[#003087] text-white border-[#003087]"
              : "bg-white text-gray-600 border-gray-200 hover:border-[#003087] hover:text-[#003087]"
          }`}
      >
        {isLoading ? "..." : action}
      </button>
    );
  })}
</div>
    </div>
  );
}

export default function ComplaintTable({ complaints }) {
  const router = useRouter();

  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filteredComplaints = complaints.filter((complaint) => {
    const statusMatch =
      statusFilter === "All" || complaint.status === statusFilter;
    const categoryMatch =
      categoryFilter === "All" || complaint.category === categoryFilter;
    const searchMatch = complaint.complaint_code
      .toLowerCase()
      .includes(search.toLowerCase());
    return statusMatch && categoryMatch && searchMatch;
  });

  async function updateStatus(complaintId, status) {
    await fetch("/api/complaints/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ complaintId, status }),
    });
    router.refresh();
  }

  if (complaints.length === 0) {
    return (
      <div className="px-6 py-16 text-center">
        <p className="text-gray-500">No complaints yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search complaint code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:border-[#003087]"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 text-sm text-gray-700 bg-white focus:outline-none focus:border-[#003087]"
        >
          <option>All</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Resolved</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 text-sm text-gray-700 bg-white focus:outline-none focus:border-[#003087]"
        >
          <option>All</option>
          {[...new Set(complaints.map((c) => c.category))].map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="divide-y divide-gray-100">
        {filteredComplaints.map((complaint) => (
          <ComplaintRow
            key={complaint.id}
            complaint={complaint}
            onUpdateStatus={updateStatus}
          />
        ))}
      </div>
    </>
  );
}