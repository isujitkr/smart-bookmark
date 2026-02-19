"use client";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <button
        onClick={loginWithGoogle}
        className="bg-white text-black px-6 py-3 rounded-lg cursor-pointer hover:bg-gray-200 transition"
      >
        Sign in with Google
      </button>
    </div>
  );
}
