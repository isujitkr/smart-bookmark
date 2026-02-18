"use client";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/auth/callback",
      },
    });
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <button
        onClick={loginWithGoogle}
        className="bg-white text-black px-6 py-3 rounded-lg"
      >
        Sign in with Google
      </button>
    </div>
  );
}
