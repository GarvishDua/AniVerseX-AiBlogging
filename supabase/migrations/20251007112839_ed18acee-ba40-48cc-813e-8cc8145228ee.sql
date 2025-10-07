-- Create blogs table
create table public.blogs (
  id text primary key,
  title text not null,
  content text not null,
  description text,
  excerpt text,
  category text not null,
  author text default 'Garvish Dua',
  read_time text,
  publish_date text,
  views text default '0',
  tags text[],
  featured boolean default false,
  thumbnail text,
  featured_image text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS but make it publicly accessible (no auth required)
alter table public.blogs enable row level security;

-- Allow anyone to read blogs
create policy "Anyone can read blogs"
  on public.blogs
  for select
  to anon, authenticated
  using (true);

-- Allow anyone to insert blogs (for admin panel)
create policy "Anyone can insert blogs"
  on public.blogs
  for insert
  to anon, authenticated
  with check (true);

-- Allow anyone to update blogs
create policy "Anyone can update blogs"
  on public.blogs
  for update
  to anon, authenticated
  using (true);

-- Allow anyone to delete blogs
create policy "Anyone can delete blogs"
  on public.blogs
  for delete
  to anon, authenticated
  using (true);

-- Create index for better query performance
create index blogs_category_idx on public.blogs(category);
create index blogs_publish_date_idx on public.blogs(publish_date);
create index blogs_featured_idx on public.blogs(featured);