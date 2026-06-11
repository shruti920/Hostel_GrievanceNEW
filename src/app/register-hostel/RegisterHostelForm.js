"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterHostelForm({ hostels }) {
  const router = useRouter();
  const [hostelId, setHostelId] = useState("");
  const [block, setBlock] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const response = await fetch("/api/register-hostel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hostelId, block, roomNumber }),
    });
    if (response.ok) {
      router.push("/student");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-full bg-[#003087] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[11px] font-bold tracking-wide">IIT</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 leading-tight">Hostel Grievance Portal</p>
            <p className="text-xs text-gray-500">IIT Bhubaneswar</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

          {/* Card header */}
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-1">
              {/* Building icon */}
              <div className="w-8 h-8 rounded-lg bg-[#eef2ff] flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-[#003087]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11M8 14v3m4-3v3m4-3v3" />
                </svg>
              </div>
              <h1 className="text-lg font-semibold text-gray-900">Hostel registration</h1>
            </div>
            <p className="text-sm text-gray-500 ml-11">
              This is a one-time setup. Tell us where you stay.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6 flex flex-col gap-5">

            {/* Hostel select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Hostel <span className="text-red-500">*</span>
              </label>
              <select
                value={hostelId}
                onChange={(e) => setHostelId(e.target.value)}
                required
                className="w-full text-sm text-gray-900 bg-white border-[1.5px] border-gray-300 rounded-xl px-3.5 py-2.5 outline-none appearance-none cursor-pointer transition-all focus:border-[#003087] focus:ring-2 focus:ring-[#003087]/10"
              >
                <option value="">Select your hostel</option>
                {hostels.map((hostel) => (
                  <option key={hostel.id} value={hostel.id}>
                    {hostel.code}
                  </option>
                ))}
              </select>
            </div>

            {/* Block + Room — side by side */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Block / Wing <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. A"
                  value={block}
                  onChange={(e) => setBlock(e.target.value)}
                  required
                  className="w-full text-sm text-gray-900 bg-white border-[1.5px] border-gray-300 rounded-xl px-3.5 py-2.5 outline-none transition-all placeholder:text-gray-300 focus:border-[#003087] focus:ring-2 focus:ring-[#003087]/10"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Room number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 204"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  required
                  className="w-full text-sm text-gray-900 bg-white border-[1.5px] border-gray-300 rounded-xl px-3.5 py-2.5 outline-none transition-all placeholder:text-gray-300 focus:border-[#003087] focus:ring-2 focus:ring-[#003087]/10"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-1 flex items-center justify-center gap-2 bg-[#003087] hover:bg-[#00256b] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold py-3 rounded-xl transition-colors"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  Save & continue
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-xs text-center text-gray-400 mt-5">
          You can update your room details later from your profile.
        </p>
      </div>
    </div>
  );
}