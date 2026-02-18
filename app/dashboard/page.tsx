import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import AddBookmarkForm from "@/components/AddBookmarkForm";
import BookmarkList from "@/components/BookmarkList";
import LogoutButton from "@/components/LogoutButton";

export default async function Dashboard() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white flex justify-center py-12 px-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">My Bookmarks</h1>
          <LogoutButton />
        </div>

        {/* Add Form */}
        <AddBookmarkForm user={data.user} />

        {/* List */}
        <BookmarkList user={data.user} />
      </div>
    </div>
  );
}
