-- Limpar tabelas antigas
drop table if exists public.route_comments;
drop table if exists public.route_participants;
drop table if exists public.routes;
drop table if exists public.announcements;
drop table if exists public.profiles cascade;

-- Criar perfis de usuário
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone default now()
);

-- Criar tabela de tarefas
create table public.tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  status text default 'todo' check (status in ('todo', 'in_progress', 'done')),
  priority text default 'medium' check (priority in ('low', 'medium', 'high')),
  due_date timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- Habilitar RLS
alter table public.profiles enable row level security;
alter table public.tasks enable row level security;

-- Políticas de Segurança
create policy "Usuários gerenciam próprio perfil" on public.profiles
  for all to authenticated using (auth.uid() = id);

create policy "Usuários gerenciam próprias tarefas" on public.tasks
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Trigger para criar perfil automaticamente no signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'nome');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();