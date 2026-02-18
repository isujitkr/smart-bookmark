"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function BookmarkList({ user }: any) {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setBookmarks(data || []);
    setLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        console.log("No session for realtime");
        return;
      }

      fetchBookmarks();

      const channel = supabase
        .channel("bookmarks")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "bookmarks",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log("Realtime:", payload);

            if (payload.eventType === "INSERT") {
              setBookmarks((prev) => {
                const exists = prev.some((b) => b.id === payload.new.id);
                if (exists) return prev;
                return [payload.new, ...prev];
              });
            }

            if (payload.eventType === "DELETE") {
              setBookmarks((prev) =>
                prev.filter((b) => b.id !== payload.old.id),
              );
            }

            if (payload.eventType === "UPDATE") {
              setBookmarks((prev) =>
                prev.map((b) => (b.id === payload.new.id ? payload.new : b)),
              );
            }
          },
        )

        .subscribe((status) => {
          console.log("Subscription status:", status);
        });

      return () => {
        supabase.removeChannel(channel);
      };
    };

    init();
  }, [user.id]);

  const deleteBookmark = async (id: string) => {
    if (!confirm("Are you sure you want to delete this bookmark?")) return;

    await supabase.from("bookmarks").delete().eq("id", id);
  };

  if (loading) {
    return <p className="text-gray-400">Loading bookmarks...</p>;
  }

  if (bookmarks.length === 0) {
    return (
      <div className="bg-gray-900 p-6 rounded-2xl text-center text-gray-400">
        No bookmarks yet 🚀 <br />
        Add your first one above.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookmarks.map((bm) => (
        <div
          key={bm.id}
          className="bg-gray-900 p-4 rounded-xl flex justify-between items-center hover:bg-gray-800 transition duration-200"
        >
          <div>
            <p className="font-semibold">{bm.title}</p>
            <a
              href={bm.url}
              target="_blank"
              className="text-sm text-gray-400 hover:underline"
            >
              {bm.url}
            </a>
          </div>

          <button
            onClick={() => deleteBookmark(bm.id)}
            className="text-red-500 hover:text-red-400 transition cursor-pointer"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
