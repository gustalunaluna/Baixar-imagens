-- LS Confecções CMS — Schema completo
-- Execute no SQL Editor do Supabase

-- Extensões
create extension if not exists "uuid-ossp";

-- =============================
-- PROFILES (espelha auth.users)
-- =============================
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  nome text,
  role text not null default 'editor' check (role in ('admin', 'editor', 'viewer')),
  criado_em timestamptz not null default now()
);

-- Trigger: cria profile automaticamente ao criar usuário
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, email, nome, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nome', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'editor')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- =============================
-- CATEGORIAS
-- =============================
create table if not exists categorias (
  id uuid primary key default uuid_generate_v4(),
  nome text not null,
  slug text not null unique,
  descricao text,
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

-- =============================
-- PRODUTOS
-- =============================
create table if not exists produtos (
  id uuid primary key default uuid_generate_v4(),
  nome text not null,
  slug text not null unique,
  descricao text,
  categoria_id uuid references categorias(id) on delete set null,
  imagem text,
  caracteristicas text[] default '{}',
  destaque boolean not null default false,
  ativo boolean not null default true,
  meta_titulo text,
  meta_descricao text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create or replace function update_atualizado_em()
returns trigger language plpgsql as $$
begin new.atualizado_em = now(); return new; end;
$$;

drop trigger if exists produtos_atualizado_em on produtos;
create trigger produtos_atualizado_em
  before update on produtos
  for each row execute procedure update_atualizado_em();

-- =============================
-- PORTFOLIO
-- =============================
create table if not exists portfolio (
  id uuid primary key default uuid_generate_v4(),
  cliente text not null,
  titulo text not null,
  descricao text,
  imagens text[] default '{}',
  categoria text,
  data date,
  destaque boolean not null default false,
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

-- =============================
-- BANNERS HOME
-- =============================
create table if not exists banners_home (
  id uuid primary key default uuid_generate_v4(),
  titulo text not null,
  subtitulo text,
  imagem text,
  botao_texto text,
  botao_link text,
  ordem integer not null default 0,
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

-- =============================
-- DEPOIMENTOS
-- =============================
create table if not exists depoimentos (
  id uuid primary key default uuid_generate_v4(),
  nome_cliente text not null,
  empresa text,
  texto text not null,
  imagem text,
  nota integer not null default 5 check (nota between 1 and 5),
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

-- =============================
-- LEADS
-- =============================
create table if not exists leads (
  id uuid primary key default uuid_generate_v4(),
  nome text not null,
  email text,
  telefone text not null,
  empresa text,
  mensagem text,
  origem text not null default 'site',
  status text not null default 'novo' check (status in ('novo', 'atendido', 'arquivado')),
  observacoes text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

drop trigger if exists leads_atualizado_em on leads;
create trigger leads_atualizado_em
  before update on leads
  for each row execute procedure update_atualizado_em();

-- =============================
-- MÍDIA
-- =============================
create table if not exists midia (
  id uuid primary key default uuid_generate_v4(),
  nome text not null,
  url text not null,
  tipo text,
  tamanho bigint,
  pasta text not null default 'geral',
  criado_em timestamptz not null default now()
);

-- =============================
-- CONFIGURAÇÕES
-- =============================
create table if not exists configuracoes (
  chave text primary key,
  valor text,
  label text,
  grupo text not null default 'geral',
  criado_em timestamptz not null default now()
);

-- Valores padrão
insert into configuracoes (chave, valor, label, grupo) values
  ('empresa_nome', 'LS Confecções', 'Nome da empresa', 'empresa'),
  ('empresa_cnpj', '', 'CNPJ', 'empresa'),
  ('empresa_email', '', 'Email', 'empresa'),
  ('empresa_telefone', '', 'Telefone', 'empresa'),
  ('empresa_whatsapp', '', 'WhatsApp (só números)', 'empresa'),
  ('empresa_endereco', '', 'Endereço', 'empresa'),
  ('empresa_instagram', '', 'Instagram (@)', 'redes_sociais'),
  ('empresa_facebook', '', 'Facebook', 'redes_sociais'),
  ('empresa_linkedin', '', 'LinkedIn', 'redes_sociais'),
  ('seo_titulo', 'LS Confecções — Uniformes e Confecções B2B', 'Título SEO', 'seo'),
  ('seo_descricao', 'Uniformes e confecções sob medida para empresas.', 'Descrição SEO', 'seo'),
  ('leads_notificar_email', '', 'Email para notificação de leads', 'leads')
on conflict (chave) do nothing;

-- =============================
-- STORAGE — bucket "media"
-- =============================
insert into storage.buckets (id, name, public) values ('media', 'media', true)
on conflict (id) do nothing;

-- =============================
-- RLS — Row Level Security
-- =============================

-- Profiles
alter table profiles enable row level security;
create policy "profiles: leitura autenticados" on profiles for select using (auth.role() = 'authenticated');
create policy "profiles: escrita próprio" on profiles for update using (auth.uid() = id);

-- Categorias
alter table categorias enable row level security;
create policy "categorias: leitura todos" on categorias for select using (true);
create policy "categorias: escrita autenticados" on categorias for all using (auth.role() = 'authenticated');

-- Produtos
alter table produtos enable row level security;
create policy "produtos: leitura todos" on produtos for select using (true);
create policy "produtos: escrita autenticados" on produtos for all using (auth.role() = 'authenticated');

-- Portfolio
alter table portfolio enable row level security;
create policy "portfolio: leitura todos" on portfolio for select using (true);
create policy "portfolio: escrita autenticados" on portfolio for all using (auth.role() = 'authenticated');

-- Banners
alter table banners_home enable row level security;
create policy "banners: leitura todos" on banners_home for select using (true);
create policy "banners: escrita autenticados" on banners_home for all using (auth.role() = 'authenticated');

-- Depoimentos
alter table depoimentos enable row level security;
create policy "depoimentos: leitura todos" on depoimentos for select using (true);
create policy "depoimentos: escrita autenticados" on depoimentos for all using (auth.role() = 'authenticated');

-- Leads
alter table leads enable row level security;
create policy "leads: insert público" on leads for insert with check (true);
create policy "leads: select autenticados" on leads for select using (auth.role() = 'authenticated');
create policy "leads: update autenticados" on leads for update using (auth.role() = 'authenticated');
create policy "leads: delete autenticados" on leads for delete using (auth.role() = 'authenticated');

-- Mídia
alter table midia enable row level security;
create policy "midia: leitura todos" on midia for select using (true);
create policy "midia: escrita autenticados" on midia for all using (auth.role() = 'authenticated');

-- Configurações
alter table configuracoes enable row level security;
create policy "configuracoes: leitura todos" on configuracoes for select using (true);
create policy "configuracoes: escrita autenticados" on configuracoes for all using (auth.role() = 'authenticated');

-- Storage policies
create policy "media: leitura pública" on storage.objects for select using (bucket_id = 'media');
create policy "media: upload autenticados" on storage.objects for insert with check (bucket_id = 'media' and auth.role() = 'authenticated');
create policy "media: delete autenticados" on storage.objects for delete using (bucket_id = 'media' and auth.role() = 'authenticated');
