"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { COMPLAINT_CATEGORIES } from "@/constants/complaintCategories";
import { supabase } from "@/lib/supabase";

export default function SubmitComplaintPage() {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = null;

if (image) {
  const fileName = `${Date.now()}-${image.name}`;

  const { error: uploadError } =
    await supabase.storage
      .from("compaint-images")
      .upload(fileName, image);

  if (uploadError) {
    console.error(uploadError);
    alert(uploadError.message);
    setLoading(false);
    return;
  }

  const { data } = supabase.storage
    .from("compaint-images")
    .getPublicUrl(fileName);

  imageUrl = data.publicUrl;
}

const response = await fetch("/api/complaints", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    category,
    title,
    description,
    imageUrl,
  }),
});
      if (response.ok) {
        router.push("/track-complaints");
      } else {
        alert("Failed to submit complaint");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-xl mx-auto">

        {/* Back link */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back
        </button>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

          {/* Card header */}
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#eef2ff] flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-[#003087]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h1 className="text-base font-semibold text-gray-900">Submit a grievance</h1>
                <p className="text-xs text-gray-500">Fill in the details below. Be as specific as possible.</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6 flex flex-col gap-5">

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full text-sm text-gray-900 bg-white border-[1.5px] border-gray-300 rounded-xl px-3.5 py-2.5 outline-none appearance-none cursor-pointer transition-all focus:border-[#003087] focus:ring-2 focus:ring-[#003087]/10"
              >
                <option value="">Select a category</option>
                {COMPLAINT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief summary of your issue"
                required
                className="w-full text-sm text-gray-900 bg-white border-[1.5px] border-gray-300 rounded-xl px-3.5 py-2.5 outline-none transition-all placeholder:text-gray-300 focus:border-[#003087] focus:ring-2 focus:ring-[#003087]/10"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue — when it started, who is affected, any steps already taken…"
                required
                className="w-full text-sm text-gray-900 bg-white border-[1.5px] border-gray-300 rounded-xl px-3.5 py-2.5 outline-none transition-all placeholder:text-gray-300 focus:border-[#003087] focus:ring-2 focus:ring-[#003087]/10 resize-none"
              />
              <p className="text-xs text-gray-400">Being specific helps the Hall Office act faster.</p>
            </div>
            
            
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Upload evidence (optional)
              </label>
            <input
  type="file"
  className="w-full text-sm text-gray-900 bg-white border-[1.5px] border-gray-300 rounded-xl px-3.5 py-2.5 outline-none transition-all placeholder:text-gray-300 focus:border-[#003087] focus:ring-2 focus:ring-[#003087]/10 resize-none"
  accept="image/*"
  onChange={(e) =>
    setImage(e.target.files?.[0] || null)
  }
/>
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
                  Submitting...
                </>
              ) : (
                <>
                  Submit grievance
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-xs text-center text-gray-400 mt-5">
          You will receive status updates as your grievance is reviewed.
        </p>
      </div>
    </div>
  );
}