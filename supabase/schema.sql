-- =====================================================================
-- TORQUATO ERP: schema completo
-- Cole no Supabase: SQL Editor -> New query -> Run
-- É seguro rodar mais de uma vez (usa IF NOT EXISTS).
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------- Empresas ----------
create table if not exists empresas_erp (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  created_at timestamptz default now()
);

-- ---------- Financeiro ----------
create table if not exists financeiro_lancamentos (
  id uuid primary key default gen_random_uuid(),
  descricao text not null,
  valor numeric(14,2) not null default 0,
  vencimento date,
  categoria text,
  centro_custo text,
  status text default 'Pendente',
  empresa text not null,
  nf_nome text,
  nf_url text,
  comprovante_nome text,
  comprovante_url text,
  created_at timestamptz default now()
);

create table if not exists financeiro_receber (like financeiro_lancamentos including all);

create table if not exists contas_bancarias (
  id uuid primary key default gen_random_uuid(),
  banco text not null,
  agencia text,
  conta text,
  saldo numeric(14,2) default 0,
  empresa text not null,
  created_at timestamptz default now()
);

create table if not exists tributos_erp (
  id uuid primary key default gen_random_uuid(),
  imposto text not null,
  competencia text,
  valor numeric(14,2) default 0,
  vencimento date,
  status text default 'Previsto',
  empresa text not null,
  created_at timestamptz default now()
);

-- Se as tabelas financeiras JÁ existiam sem alguma destas colunas, elas são adicionadas aqui:
do $$
declare t text;
begin
  foreach t in array array['financeiro_lancamentos','financeiro_receber'] loop
    execute format('alter table %I add column if not exists centro_custo text', t);
    execute format('alter table %I add column if not exists nf_nome text', t);
    execute format('alter table %I add column if not exists nf_url text', t);
    execute format('alter table %I add column if not exists comprovante_nome text', t);
    execute format('alter table %I add column if not exists comprovante_url text', t);
    execute format('alter table %I add column if not exists empresa text', t);
  end loop;
end $$;

-- ---------- Suprimentos ----------
create sequence if not exists suprimentos_produtos_codigo_seq start 100;

create table if not exists suprimentos_produtos (
  id uuid primary key default gen_random_uuid(),
  codigo bigint default nextval('suprimentos_produtos_codigo_seq'),
  nome text not null,
  especificacao text,
  apelido text,
  tipo text default 'Material',
  unidade text default 'un',
  marca text,
  categoria text,
  subcategoria text,
  valor_estimado numeric(14,2) default 0,
  observacoes text,
  status text default 'Ativo',
  empresa text not null,
  created_at timestamptz default now()
);

create table if not exists suprimentos_locais (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cidade text,
  empresa text not null,
  created_at timestamptz default now()
);

create table if not exists suprimentos_entradas (
  id uuid primary key default gen_random_uuid(),
  produto text not null,
  quantidade numeric(14,3) not null default 0,
  local text,
  data_entrada date default current_date,
  fornecedor text,
  nota_fiscal text,
  valor_total numeric(14,2),
  empresa text not null,
  created_at timestamptz default now()
);

create table if not exists suprimentos_consumos (
  id uuid primary key default gen_random_uuid(),
  produto text not null,
  quantidade numeric(14,3) not null default 0,
  local text,
  data_consumo date default current_date,
  responsavel text,
  observacoes text,
  empresa text not null,
  created_at timestamptz default now()
);

create table if not exists suprimentos_equipamentos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  produto_associado text,
  especificacao text,
  ano_fabricacao text,
  ano_modelo text,
  data_aquisicao date,
  local_alocado text,
  empresa text not null,
  created_at timestamptz default now()
);

create table if not exists suprimentos_epis (
  id uuid primary key default gen_random_uuid(),
  colaborador text not null,
  epi text not null,
  ca text,
  data_entrega date default current_date,
  validade date,
  empresa text not null,
  created_at timestamptz default now()
);

create table if not exists suprimentos_balancos (
  id uuid primary key default gen_random_uuid(),
  local text,
  data_balanco date default current_date,
  responsavel text,
  status text default 'Aberto',
  observacoes text,
  empresa text not null,
  created_at timestamptz default now()
);

create table if not exists suprimentos_solicitacoes (
  id uuid primary key default gen_random_uuid(),
  descricao text not null,
  produto text,
  quantidade numeric(14,3),
  solicitante text,
  prioridade text default 'Média',
  status text default 'Pendente',
  empresa text not null,
  created_at timestamptz default now()
);

-- ---------- Compatibilidade: completa colunas em tabelas que já existiam ----------
do $$
declare item text; p text[];
begin
  foreach item in array array[
    'empresas_erp|nome|text','empresas_erp|created_at|timestamptz default now()',
    'financeiro_lancamentos|descricao|text','financeiro_lancamentos|valor|numeric(14,2) default 0','financeiro_lancamentos|vencimento|date','financeiro_lancamentos|categoria|text','financeiro_lancamentos|status|text default ''Pendente''','financeiro_lancamentos|created_at|timestamptz default now()',
    'financeiro_receber|descricao|text','financeiro_receber|valor|numeric(14,2) default 0','financeiro_receber|vencimento|date','financeiro_receber|categoria|text','financeiro_receber|status|text default ''Pendente''','financeiro_receber|created_at|timestamptz default now()',
    'contas_bancarias|banco|text','contas_bancarias|agencia|text','contas_bancarias|conta|text','contas_bancarias|saldo|numeric(14,2) default 0','contas_bancarias|empresa|text','contas_bancarias|created_at|timestamptz default now()',
    'tributos_erp|imposto|text','tributos_erp|competencia|text','tributos_erp|valor|numeric(14,2) default 0','tributos_erp|vencimento|date','tributos_erp|status|text default ''Previsto''','tributos_erp|empresa|text','tributos_erp|created_at|timestamptz default now()',
    'suprimentos_produtos|nome|text','suprimentos_produtos|especificacao|text','suprimentos_produtos|apelido|text','suprimentos_produtos|tipo|text','suprimentos_produtos|unidade|text','suprimentos_produtos|marca|text','suprimentos_produtos|categoria|text','suprimentos_produtos|subcategoria|text','suprimentos_produtos|valor_estimado|numeric(14,2) default 0','suprimentos_produtos|observacoes|text','suprimentos_produtos|status|text','suprimentos_produtos|empresa|text','suprimentos_produtos|created_at|timestamptz default now()',
    'suprimentos_locais|nome|text','suprimentos_locais|cidade|text','suprimentos_locais|empresa|text','suprimentos_locais|created_at|timestamptz default now()',
    'suprimentos_entradas|produto|text','suprimentos_entradas|quantidade|numeric(14,3) default 0','suprimentos_entradas|local|text','suprimentos_entradas|data_entrada|date','suprimentos_entradas|fornecedor|text','suprimentos_entradas|nota_fiscal|text','suprimentos_entradas|valor_total|numeric(14,2)','suprimentos_entradas|empresa|text','suprimentos_entradas|created_at|timestamptz default now()',
    'suprimentos_consumos|produto|text','suprimentos_consumos|quantidade|numeric(14,3) default 0','suprimentos_consumos|local|text','suprimentos_consumos|data_consumo|date','suprimentos_consumos|responsavel|text','suprimentos_consumos|observacoes|text','suprimentos_consumos|empresa|text','suprimentos_consumos|created_at|timestamptz default now()',
    'suprimentos_equipamentos|nome|text','suprimentos_equipamentos|produto_associado|text','suprimentos_equipamentos|especificacao|text','suprimentos_equipamentos|ano_fabricacao|text','suprimentos_equipamentos|ano_modelo|text','suprimentos_equipamentos|data_aquisicao|date','suprimentos_equipamentos|local_alocado|text','suprimentos_equipamentos|empresa|text','suprimentos_equipamentos|created_at|timestamptz default now()',
    'suprimentos_epis|colaborador|text','suprimentos_epis|epi|text','suprimentos_epis|ca|text','suprimentos_epis|data_entrega|date','suprimentos_epis|validade|date','suprimentos_epis|empresa|text','suprimentos_epis|created_at|timestamptz default now()',
    'suprimentos_balancos|local|text','suprimentos_balancos|data_balanco|date','suprimentos_balancos|responsavel|text','suprimentos_balancos|status|text','suprimentos_balancos|observacoes|text','suprimentos_balancos|empresa|text','suprimentos_balancos|created_at|timestamptz default now()',
    'suprimentos_solicitacoes|descricao|text','suprimentos_solicitacoes|produto|text','suprimentos_solicitacoes|quantidade|numeric(14,3)','suprimentos_solicitacoes|solicitante|text','suprimentos_solicitacoes|prioridade|text','suprimentos_solicitacoes|status|text','suprimentos_solicitacoes|empresa|text','suprimentos_solicitacoes|created_at|timestamptz default now()'
  ] loop
    p := string_to_array(item, '|');
    execute format('alter table %I add column if not exists %I %s', p[1], p[2], p[3]);
  end loop;
end $$;

-- ---------- Compatibilidade: tira a obrigatoriedade de colunas antigas (ex.: cnpj) ----------
do $$
declare r record;
begin
  for r in
    select table_name, column_name
    from information_schema.columns
    where table_schema = 'public'
      and is_nullable = 'NO'
      and column_name <> 'id'
      and table_name in (
        'empresas_erp','financeiro_lancamentos','financeiro_receber','contas_bancarias','tributos_erp',
        'suprimentos_produtos','suprimentos_locais','suprimentos_entradas','suprimentos_consumos',
        'suprimentos_equipamentos','suprimentos_epis','suprimentos_balancos','suprimentos_solicitacoes'
      )
  loop
    execute format('alter table public.%I alter column %I drop not null', r.table_name, r.column_name);
  end loop;
end $$;

-- ---------- Segurança: Row Level Security ----------
-- Só usuários LOGADOS (Supabase Auth) leem e escrevem. Visitantes anônimos não acessam nada.
do $$
declare t text;
begin
  foreach t in array array[
    'empresas_erp','financeiro_lancamentos','financeiro_receber','contas_bancarias','tributos_erp',
    'suprimentos_produtos','suprimentos_locais','suprimentos_entradas','suprimentos_consumos',
    'suprimentos_equipamentos','suprimentos_epis','suprimentos_balancos','suprimentos_solicitacoes'
  ] loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists "usuarios logados" on %I', t);
    execute format(
      'create policy "usuarios logados" on %I for all to authenticated using (true) with check (true)', t
    );
  end loop;
end $$;

-- ---------- Storage: bucket privado de anexos (NF e comprovantes) ----------
insert into storage.buckets (id, name, public)
values ('anexos', 'anexos', false)
on conflict (id) do nothing;

drop policy if exists "anexos logados" on storage.objects;
create policy "anexos logados" on storage.objects
  for all to authenticated
  using (bucket_id = 'anexos')
  with check (bucket_id = 'anexos');

-- ---------- Empresa inicial (opcional, pode apagar) ----------
insert into empresas_erp (nome)
select 'Torquato Engenharia Ltda'
where not exists (select 1 from empresas_erp where nome = 'Torquato Engenharia Ltda');
