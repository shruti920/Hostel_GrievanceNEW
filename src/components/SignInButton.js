"use client";
import { signIn } from "next-auth/react";

export default function SignInButton({ className, children }) {
  return (
    <button onClick={() => signIn("google")} className={className}>
      {children}
    </button>
  );
}