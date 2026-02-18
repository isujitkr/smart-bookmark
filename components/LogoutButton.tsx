"use client";

import { supabase } from "@/lib/supabaseClient";

export default function LogoutButton() {
  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <button
      onClick={logout}
      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition duration-200"
    >
      Logout
    </button>
  );
}
