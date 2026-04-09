-- Tabela de Roles
create table public.roles (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  descricao text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Inserir roles padrão
insert into public.roles (nome, descricao) values 
('admin', 'Administrador do Moto Clube'),
('membro', 'Membro oficial'),
('prospect', 'Candidato a membro');

-- Tabela de Profiles
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  nome text not null,
  email text not null,
  role_id uuid references public.roles(id),
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabela de Logs
create table public.logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  acao text not null,
  detalhes jsonb,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS
alter table public.profiles enable row level security;
alter table public.roles enable row level security;
alter table public.logs enable row level security;

-- Policies para Profiles
create policy "Perfis são visíveis por todos os membros autenticados"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Usuários podem atualizar o próprio perfil"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- Policies para Roles (Apenas leitura)
create policy "Roles são visíveis por todos"
  on public.roles for select
  to authenticated
  using (true);

-- Policies para Logs (Apenas Admin vê, todos inserem)
create policy "Qualquer um pode inserir logs"
  on public.logs for insert
  to authenticated
  with check (true);

create policy "Apenas admins veem logs"
  on public.logs for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      join public.roles r on p.role_id = r.id
      where p.id = auth.uid() and r.nome = 'admin'
    )
  );

-- Trigger para criar perfil automaticamente no cadastro
create or replace function public.handle_new_user()
returns trigger as $$
declare
  default_role_id uuid;
begin
  select id into default_role_id from public.roles where nome = 'prospect';
  
  insert into public.profiles (id, nome, email, role_id)
  values (new.id, coalesce(new.raw_user_meta_data->>'nome','Desconhecido'), new.email, default_role_id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();