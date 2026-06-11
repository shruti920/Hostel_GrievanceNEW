import Link from "next/link";
import { notFound } from "next/navigation";
import { getComplaintById } from "@/lib/complaints";
import Image from "next/image";

const statusConfig = {
  Pending: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-700",
  },
  "In Progress": {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-700",
  },
  Resolved: {
    bg: "bg-green-50",
    text: "text-green-600",
    border: "border-green-200",
    dot: "bg-green-600",
  },
  Rejected: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-600",
  },
};

// Returns how many steps are fully completed (0-indexed milestone)
function getProgressStep(status) {
  switch (status) {
    case "Pending":     return 1; // Submitted done, Received is current
    case "In Progress": return 2; // Submitted+Received done, Under Review is current
    case "Resolved":    return 4; // all done
    case "Rejected":    return -1; // special case
    default:            return 1;
  }
}

const timelineSteps = [
  "Submitted",
  "Received by Office",
  "Under Review",
  "Resolved",
];

export default async function ComplaintDetailsPage({ params }) {
   const { id } = await params;

  const complaint = await getComplaintById(id);

  if (!complaint) notFound();


  const s = statusConfig[complaint.status] ?? statusConfig.Pending;
  const progressStep = getProgressStep(complaint.status);
  const isRejected = complaint.status === "Rejected";

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* ── Back link ─────────────────────────────────────────── */}
        <Link
          href="/track-complaints"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#003087] transition-colors"
        >
          <svg
            width="15" height="15"
            fill="none" stroke="currentColor" strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M19 12H5M5 12l7 7M5 12l7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to complaints
        </Link>

        {/* ── Main card ──────────────────────────────────────────── */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

          {/* Navy header band */}
          <div className="bg-[#003087] px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white/50 tracking-widest uppercase mb-1.5">
                  {complaint.complaint_code}
                </p>
                <h1 className="text-xl font-bold text-white leading-snug">
                  {complaint.title}
                </h1>
              </div>
              {/* Status badge — white bg for contrast on navy */}
              <span
                className={`shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${s.text} ${s.bg} ${s.border}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                {complaint.status}
              </span>
            </div>
          </div>

          {/* Card body */}
          <div className="p-6 space-y-6">

            {/* ── Meta grid ─────────────────────────────────────── */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Category
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {complaint.category}
                </p>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Location
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  Block {complaint.block}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Room {complaint.room_number}
                </p>
              </div>
            </div>

            {/* ── Description ───────────────────────────────────── */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Description
              </p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {complaint.description}
              </p>
            </div>

            {/* ── Progress timeline ─────────────────────────────── */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Progress
              </p>

              {isRejected ? (
                /* Rejected state — show all steps grey + rejected pill */
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-100 border-2 border-red-300 text-red-600 text-sm font-bold shrink-0">
                    ✕
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-red-700">
                      Complaint Rejected
                    </p>
                    <p className="text-xs text-red-500 mt-0.5">
                      This complaint has been reviewed and rejected.
                    </p>
                  </div>
                </div>
              ) : (
                <ol className="space-y-3">
                  {timelineSteps.map((step, i) => {
                    const stepNum = i + 1;
                    const isDone    = progressStep > stepNum;
                    const isCurrent = progressStep === stepNum;
                    const isWaiting = progressStep < stepNum;

                    return (
                      <li key={step} className="flex items-center gap-3">
                        {/* Dot */}
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 shrink-0 transition-colors
                            ${isDone
                              ? "bg-green-50 border-green-300 text-green-600"
                              : isCurrent
                              ? "bg-[#eef2ff] border-[#c7d4f0] text-[#003087]"
                              : "bg-gray-100 border-gray-200 text-gray-400"
                            }`}
                        >
                          {isDone ? "✓" : isCurrent ? "→" : "○"}
                        </div>

                        {/* Label */}
                        <span
                          className={`text-sm font-medium flex-1
                            ${isDone
                              ? "text-green-700"
                              : isCurrent
                              ? "text-[#003087] font-semibold"
                              : "text-gray-400"
                            }`}
                        >
                          {step}
                        </span>

                        {/* "Current" pill */}
                        {isCurrent && (
                          <span className="text-xs font-semibold text-[#003087] bg-[#eef2ff] border border-[#c7d4f0] px-2.5 py-0.5 rounded-full">
                            Current
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ol>
              )}
            </div>

            {/* ── Evidence image ────────────────────────────────── */}
            {complaint.image_url && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Evidence
                </p>
                <Image
  src={complaint.image_url}
  alt="Complaint evidence"
  width={1200}
  height={800}
  className="w-full max-h-[450px] object-cover rounded-xl border border-gray-200"
/>                <p className="text-xs text-gray-500 mt-2">
                  Uploaded on{" "}
                  {complaint.created_at
                    ? new Date(complaint.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                    : "—"}
                </p>
              </div>
            )}

            {/* ── Submitted date ─────────────────────────────────── */}
            <div className="flex items-center justify-between pt-5 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Submitted
              </p>
              <p className="text-sm font-medium text-gray-700">
                {new Date(complaint.created_at).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}