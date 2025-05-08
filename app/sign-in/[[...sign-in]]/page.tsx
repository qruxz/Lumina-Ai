'use client';

import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-center">Welcome back</h1>
        <p className="text-gray-600 text-center">Sign in to continue to Lumina</p>
      </div>
      
      <div className="w-full max-w-[400px] mx-auto bg-white rounded-xl shadow-lg p-6">
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-black hover:bg-gray-800 text-sm normal-case",
              headerTitle: "text-gray-900 text-xl",
              headerSubtitle: "text-gray-600",
              socialButtonsBlockButton:
                "bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 text-sm normal-case",
              formFieldLabel: "text-gray-700",
              formFieldInput:
                "border-gray-300 focus:border-black focus:ring-black",
              footerActionLink: "text-black hover:text-gray-800",
              card: "",
            },
          }}
          redirectUrl="/dashboard"
          signUpUrl="/sign-up"
        />
      </div>
    </div>
  );
}
