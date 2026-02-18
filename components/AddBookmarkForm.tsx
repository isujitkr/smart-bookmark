"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AddBookmarkForm({ user }: any) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const addBookmark = async () => {
    if (!title || !url) return;

    setLoading(true);

    await supabase.from("bookmarks").insert({
      title,
      url,
      user_id: user.id,
    });

    setTitle("");
    setUrl("");
    setLoading(false);
  };

  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-lg space-y-4">
      <h2 className="text-xl font-semibold">Add New Bookmark</h2>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        placeholder="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full p-3 bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={addBookmark}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 p-3 rounded-lg font-semibold transition duration-200 cursor-pointer disabled:cursor-not-allowed"
      >
        {loading ? "Adding..." : "Add Bookmark"}
      </button>
    </div>
  );
}
