-- ============================================================
-- Tabla genérica "contenidos" para sorteos y promociones,
-- gestionables desde /admin/contenidos sin tocar código.
-- Idempotente.
-- ============================================================

create table if not exists contenidos (
  id uuid default gen_random_uuid() primary key,
  tipo text not null check (tipo in ('sorteo', 'promocion')),
  titulo text not null,
  descripcion text not null default '',
  enlace text,
  activo boolean not null default true,
  orden integer default 0,
  created_at timestamptz default now()
);

create index if not exists contenidos_tipo_idx on contenidos (tipo, activo, orden);
