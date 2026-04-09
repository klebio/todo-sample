-- Tabela de Rotas (Viagens do Clube)
create table public.routes (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text,
  ponto_encontro text not null,
  destino text not null,
  data_saida timestamp with time zone not null,
  criado_por uuid references auth.users(id),
  status text default 'agendada' check (status in ('agendada', 'em_andamento', 'concluida', 'cancelada')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS para Rotas
alter table public.routes enable row level security;

-- Policies para Rotas
create policy "Qualquer membro autenticado vê as rotas"
  on public.routes for select
  to authenticated
  using (true);

create policy "Apenas admins e oficiais criam rotas"
  on public.routes for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles p
      join public.roles r on p.role_id = r.id
      where p.id = auth.uid() and r.nome in ('admin', 'oficial')
    )
  );

-- Inserir algumas rotas de exemplo
insert into public.routes (titulo, descricao, ponto_encontro, destino, data_saida, status)
values 
('Bate e Volta: Serra do Rio do Rastro', 'Subida épica com parada para café no topo.', 'Posto Ipiranga Central', 'Bom Jardim da Serra', now() + interval '5 days', 'agendada'),
('Expedição Rota 66 Brasileira', 'Viagem de 3 dias pelo interior.', 'QG Los Motokas', 'Chapada dos Veadeiros', now() + interval '15 days', 'agendada');