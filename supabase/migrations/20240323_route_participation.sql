-- Tabela para rastrear quem vai em cada rota
create table public.route_participants (
  id uuid primary key default gen_random_uuid(),
  route_id uuid references public.routes(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(route_id, profile_id)
);

-- Habilitar RLS
alter table public.route_participants enable row level security;

-- Políticas
create policy "Membros veem participantes"
  on public.route_participants for select
  to authenticated
  using (true);

create policy "Membros podem se inscrever em rotas"
  on public.route_participants for insert
  to authenticated
  with check (auth.uid() = profile_id);

create policy "Membros podem cancelar inscrição"
  on public.route_participants for delete
  to authenticated
  using (auth.uid() = profile_id);