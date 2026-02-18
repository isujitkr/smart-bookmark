# 🔖 Realtime Bookmark Manager

A full-stack bookmark management application built with **Next.js (App
Router)** and **Supabase**, featuring secure authentication, Row Level
Security (RLS), and realtime database updates.

------------------------------------------------------------------------

# 🚀 Features

-   🔐 Supabase Authentication
-   🛡 Secure database using Row Level Security (RLS)
-   ⚡ Realtime updates (Insert & Delete)
-   🧠 Server-side session validation
-   📱 Clean and responsive UI
-   🔄 Live sync across multiple tabs

------------------------------------------------------------------------

# 🛠 Tech Stack

-   Next.js (App Router)
-   Supabase (Auth + Database + Realtime)
-   TypeScript
-   Tailwind CSS
-   PostgreSQL

------------------------------------------------------------------------

# 📦 Installation

## 1️⃣ Clone the repository

``` bash
git clone https://github.com/isujitkr/smart-bookmark.git
cd smart-bookmark
```

## 2️⃣ Install dependencies

``` bash
npm install
```

## 3️⃣ Setup Environment Variables

Create a `.env.local` file in the root directory:

``` env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these in:

Supabase → Project Settings → API

------------------------------------------------------------------------

# 🗄 Database Setup

Run the following SQL in Supabase SQL Editor:

``` sql
create table public.bookmarks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  url text not null,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now()
);
```

------------------------------------------------------------------------

# 🔒 Enable Row Level Security (RLS)

Enable RLS on the `bookmarks` table.

## SELECT Policy

``` sql
create policy "Users can view own bookmarks"
on public.bookmarks
for select
to authenticated
using (auth.uid() = user_id);
```

## INSERT Policy

``` sql
create policy "Users can insert own bookmarks"
on public.bookmarks
for insert
to authenticated
with check (auth.uid() = user_id);
```

## DELETE Policy

``` sql
create policy "Users can delete own bookmarks"
on public.bookmarks
for delete
to authenticated
using (auth.uid() = user_id);
```

------------------------------------------------------------------------

# ⚡ Enable Realtime (Important)

To ensure DELETE events work properly in realtime, run:

``` sql
ALTER TABLE public.bookmarks REPLICA IDENTITY FULL;
```

Without this command, delete events will not trigger in realtime.

------------------------------------------------------------------------

# ▶ Run the Development Server

``` bash
npm run dev
```

Open in browser:

http://localhost:3000

------------------------------------------------------------------------

# 🧠 How Realtime Works

The application subscribes to Postgres changes using Supabase Realtime:

``` ts
supabase
  .channel("bookmarks")
  .on("postgres_changes", {
    event: "*",
    schema: "public",
    table: "bookmarks",
    filter: `user_id=eq.${user.id}`,
  }, handler)
  .subscribe()
```

When:

-   INSERT → Bookmark appears instantly
-   DELETE → Bookmark disappears instantly
-   UPDATE → Bookmark updates in UI
-   No page refresh required

------------------------------------------------------------------------

# 📌 Future Improvements

-   ✏ Edit bookmarks
-   🔎 Search & filtering
-   🏷 Tags support
-   🔔 Toast notifications
-   📊 Pagination
-   🌐 Public shareable bookmarks

------------------------------------------------------------------------

# 📄 License

MIT License
