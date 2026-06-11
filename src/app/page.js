import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
import { authConfig } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import SignInButton from "@/components/SignInButton";

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
    </svg>
  );
}



export default async function LandingPage() {
  const session = await getServerSession(authConfig);
  // if (session) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* Navbar */}
      <nav className="border-b border-gray-200 px-6 py-4 sticky top-0 bg-white z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/iitbbs-logo.png"
              alt="IIT Bhubaneswar Logo"
              width={36}
              height={36}
              className="rounded-full object-contain"
            />
            <div>
              <p className="text-sm font-semibold text-gray-900 leading-tight">Hostel Grievance Portal</p>
              <p className="text-xs text-gray-500">IIT Bhubaneswar</p>
            </div>
          </div>

         {session ? (
  <Link
    href="/dashboard"
    className="flex items-center gap-2 text-sm font-medium text-[#003087] border border-[#003087] px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
  >
    Dashboard
  </Link>
) : (
  <SignInButton className="flex items-center gap-2 text-sm font-medium text-[#003087] border border-[#003087] px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
    <GoogleIcon />
    Sign in with Google
  </SignInButton>
)}
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-20 text-center">
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#003087] bg-blue-50 px-3 py-1.5 rounded-full mb-6">
          Official Student Platform
        </span>

        <h1 className="text-5xl font-light text-gray-900 leading-tight mb-5" style={{ fontFamily: "'EB Garamond', Georgia, serif" }}>
          Raise. Track. <span className="text-[#003087] italic">Resolve.</span>
        </h1>

        <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed mb-3">
          Designed for students and hostel administrators to ensure transparent grievance management across all IIT Bhubaneswar hostels.
        </p>

        <p className="text-sm text-gray-400 mb-10">
          Access is restricted to IIT Bhubaneswar (@iitbbs.ac.in) accounts only.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
         {session ? (
  <Link
    href="/dashboard"
    className="bg-[#003087] text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-[#00256b] transition-colors"
  >
    Go to Dashboard
  </Link>
) : (
  <SignInButton className="flex items-center gap-2 bg-[#003087] text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-[#00256b] transition-colors">
    <GoogleIcon />
    Sign in with Google
  </SignInButton>
)}
          <a
            href="#how-it-works"
            className="text-sm font-medium text-gray-700 border border-gray-300 px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Learn more
          </a>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
          {[
            { value: "6",    label: "Hostels" },
            { value: "4",    label: "User roles" },
            { value: "24/7", label: "Complaint tracking" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-[#003087] mb-1">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              title: "Easy submission",
              desc: "Submit complaints in under a minute using your institute Google account.",
              icon: "M12 4v16m8-8H4",
            },
            {
              title: "Live tracking",
              desc: "Monitor complaint status from Pending to Resolved — no follow-up needed.",
              icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
            },
            {
              title: "Hostel administration",
              desc: "Complaints are automatically routed to the appropriate hostel authorities.",
              icon: "M5 13l4 4L19 7",
            },
          ].map((f) => (
            <div key={f.title}>
              <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-[#003087]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">Process</p>
          <h2 className="text-3xl font-light text-gray-900 mb-12" style={{ fontFamily: "'EB Garamond', Georgia, serif" }}>
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: "01", title: "Sign in",         desc: "Use your IIT Bhubaneswar Google account. Complete a one-time hostel registration." },
              { n: "02", title: "Submit complaint", desc: "Describe your issue — maintenance, internet, cleanliness, electrical, or any hostel concern." },
              { n: "03", title: "Track & resolve",  desc: "Monitor live status updates from Hall Office until the complaint is resolved." },
            ].map((step) => (
              <div key={step.n} className="flex gap-5">
                <span className="text-4xl font-light text-gray-200 leading-none select-none" style={{ fontFamily: "Georgia, serif" }}>
                  {step.n}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-[#003087]">
        <div className="max-w-5xl mx-auto px-6 py-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl font-light text-white mb-2" style={{ fontFamily: "'EB Garamond', Georgia, serif" }}>
              Need help with a hostel issue?
            </h2>
            <p className="text-sm text-blue-200 max-w-md leading-relaxed">
              Report maintenance, internet, cleanliness, electrical, plumbing, or facility-related concerns through the official IIT Bhubaneswar Hostel Grievance Portal.
            </p>
          </div>
         {session ? (
  <Link
    href="/dashboard"
    className="bg-white text-[#003087] text-sm font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors"
  >
    Go to Dashboard →
  </Link>
) : (
  <SignInButton className="flex items-center gap-2 bg-white text-[#003087] text-sm font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors">
    <GoogleIcon />
    Sign in with Google →
  </SignInButton>
)}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <Image
                src="/iitbbs-logo.png"
                alt="IIT Bhubaneswar"
                width={28}
                height={28}
                className="rounded-full object-contain"
              />
              <span className="text-sm font-semibold text-gray-900">IIT Bhubaneswar</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Argul, Jatni, Khordha<br />
              Odisha — PIN 752050
            </p>
            <p className="text-xs text-gray-500 mt-3">
              <a href="mailto:grievance@iitbbs.ac.in" className="text-[#003087] hover:underline">
                grievance@iitbbs.ac.in
              </a>
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Portal</p>
            <ul className="space-y-2">
              {["Student Support", "Hostel Administration", "Institute Services"].map((l) => (
                <li key={l}><span className="text-sm text-gray-500">{l}</span></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Roles</p>
            <ul className="space-y-2">
              {["Student", "Hall Office", "Warden", "Chief Warden"].map((l) => (
                <li key={l}><span className="text-sm text-gray-500">{l}</span></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-100 px-6 py-4 max-w-5xl mx-auto flex justify-between items-center flex-wrap gap-2">
          <p className="text-xs text-gray-400">© 2026 IIT Bhubaneswar. All rights reserved.</p>
          <p className="text-xs text-gray-400">Hostel Grievance Portal · IIT Bhubaneswar</p>
        </div>
      </footer>

    </div>
  );
}