"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

const navLinks = {
  student: [
    { href: "/student",           label: "Dashboard" },
    { href: "/submit-complaint",  label: "Submit grievance" },
    { href: "/track-complaints",  label: "My complaints" },
  ],
  hall_office:  [{ href: "/hall-office",  label: "Dashboard" }],
  warden:       [{ href: "/warden",       label: "Dashboard" }],
  chief_warden: [{ href: "/chief-warden", label: "Dashboard" }],
};

const roleLabels = {
  student:      "Student",
  hall_office:  "Hall Office",
  warden:       "Warden",
  chief_warden: "Chief Warden",
};

export default function Navbar() {
  const { data: session } = useSession();
  const role  = session?.user?.role;
  const links = navLinks[role] ?? [];
  const pathname = usePathname();

  if (
    pathname === "/" ||
    pathname === "/login"
  ) {
    return null;
  }


  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-[60px] flex items-center justify-between gap-6">

        {/* Brand */}
        <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded-full bg-[#003087] flex items-center justify-center">
            <span className="text-white text-[10px] font-bold tracking-wide">
                <Image
                  src="/iitbbs-logo.png"
                  alt="IIT Bhubaneswar Logo"
                  width={28}
                  height={28}
                  className="object-contain"
                />
            </span>
          </div>
          <span className="text-sm font-semibold text-gray-900 hidden sm:block">
            Hostel Grievance Portal
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1 flex-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors
                  ${active
                    ? "bg-[#eef2ff] text-[#003087]"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                  }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right: role pill + user + logout */}
        <div className="flex items-center gap-3 shrink-0">
          {role && (
            <span className="hidden md:inline text-xs font-semibold text-[#003087] bg-[#eef2ff] px-2.5 py-1 rounded-full tracking-wide uppercase">
              {roleLabels[role]}
            </span>
          )}

          {session?.user && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#eef2ff] flex items-center justify-center text-[#003087] text-xs font-bold">
                {session.user.name?.[0] ?? session.user.email?.[0]?.toUpperCase() ?? "U"}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden md:block">
                {session.user.name ?? session.user.email}
              </span>
            </div>
          )}

          <div className="w-px h-5 bg-gray-200" />

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
            </svg>
            <span className="hidden sm:block">Sign out</span>
          </button>
        </div>

      </div>
    </nav>
  );
}
