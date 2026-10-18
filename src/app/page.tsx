-- 1. Contas Bancárias
create table if not exists contas_bancarias (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  banco text not null,
  agencia text,
  conta text,
  saldo numeric(12,2) default 0.00,
  empresa text
);

-- 2. Boletos
create table if not exists boletos_erp (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  nosso_numero text not null,
  sacado text not null,
  valor numeric(12,2) not null,
  vencimento date,
  status text default 'Em Aberto',
  empresa text
);

-- 3. Tributos
create table if not exists tributos_erp (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  imposto text not null,
  competencia text,
  valor numeric(12,2) not null,
  vencimento date,
  status text default 'Previsto',
  empresa text
);

-- 4. Colunas de anexos separados em Contas a Pagar e Receber
alter table financeiro_lancamentos add column if not exists nf_nome text;
alter table financeiro_lancamentos add column if not exists nf_url text;
alter table financeiro_lancamentos add column if not exists comprovante_nome text;
alter table financeiro_lancamentos add column if not exists comprovante_url text;
alter table financeiro_lancamentos add column if not exists etiqueta text;

alter table financeiro_receber add column if not exists nf_nome text;
alter table financeiro_receber add column if not exists nf_url text;
alter table financeiro_receber add column if not exists comprovante_nome text;
alter table financeiro_receber add column if not exists comprovante_url text;
alter table financeiro_receber add column if not exists etiqueta text;

-- Desativar RLS para uso livre no ERP
alter table contas_bancarias disable row level security;
alter table boletos_erp disable row level security;
alter table tributos_erp disable row level security;
alter table financeiro_lancamentos disable row level security;
alter table financeiro_receber disable row level security;
