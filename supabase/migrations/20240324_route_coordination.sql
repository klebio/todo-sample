-- Tabela de comentários/chat da rota
create table public.route_comments (
  id uuid primary key default gen_random_uuid(),
  route_id uuid references public.routes(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS
alter table public.route_comments enable row level security;

-- Políticas
create policy "Comentários visíveis para todos os membros"
  on public.route_comments for select
  to authenticated
  using (true);

create policy "Membros podem comentar em rotas"
  on public.route_comments for insert
  to authenticated
  with check (auth.uid() = profile_id);

create policy "Membros podem apagar seus próprios comentários"
  on public.route_comments for delete
  to authenticated
  using (auth.uid() = profile_id);