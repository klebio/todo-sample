-- Adicionar campos de moto ao perfil
alter table public.profiles 
add column if not exists moto_modelo text,
add column if not exists moto_ano text,
add column if not exists telefone text;

-- Tabela de Mural de Avisos (Feed do QG)
create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  conteudo text not null,
  prioridade text default 'normal' check (prioridade in ('baixa', 'normal', 'urgente')),
  criado_por uuid references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS
alter table public.announcements enable row level security;

-- Policies para Avisos
create policy "Todos os membros veem avisos"
  on public.announcements for select
  to authenticated
  using (true);

create policy "Apenas admins e oficiais postam avisos"
  on public.announcements for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles p
      join public.roles r on p.role_id = r.id
      where p.id = auth.uid() and r.nome in ('admin', 'oficial')
    )
  );

-- Inserir aviso inicial
insert into public.announcements (titulo, conteudo, prioridade)
values ('Reunião Mensal', 'Todos os membros devem comparecer ao QG na próxima sexta para alinhamento das rotas de inverno.', 'urgente');