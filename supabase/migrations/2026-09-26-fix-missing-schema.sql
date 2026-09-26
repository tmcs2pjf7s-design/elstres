-- ============================================================
-- Corrige columnas y tablas que el código usa mas nunca estuvieron
-- en supabase/schema.sql (schema.sql quedó desactualizado respecto
-- a lo que de verdad corre en producción). Idempotente.
-- ============================================================

-- categorias.tipo — usado para distinguir suplementos del menú normal
alter table categorias add column if not exists tipo text default 'normal'
  check (tipo in ('normal','suplemento'));

-- mesas.tipo — mesa vs barra
alter table mesas add column if not exists tipo text default 'mesa'
  check (tipo in ('mesa','barra'));

-- pedidos: entrega a domicilio vs recogida (usado en /llevar)
alter table pedidos add column if not exists tipo_entrega text default 'recogida'
  check (tipo_entrega in ('recogida','domicilio'));
alter table pedidos add column if not exists direccion_entrega text;

-- usuarios — cuentas de clientes y de administrador
create table if not exists usuarios (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  email text not null unique,
  telefono text,
  password_hash text not null,
  salt text not null,
  rol text not null default 'cliente' check (rol in ('admin','cliente')),
  created_at timestamptz default now()
);

-- impresoras — gestión de impresoras de cocina/barra/tickets
create table if not exists impresoras (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  ip text not null,
  puerto integer default 9100,
  tipo text not null check (tipo in ('cocina','barra','ticket')),
  protocolo text not null default 'ventana' check (protocolo in ('bixolon','epson','ventana')),
  activa boolean default true,
  categorias_ids uuid[] default '{}',
  created_at timestamptz default now()
);

-- ────────────────────────────────────────────────────────────
-- Suplementos: extras para bocadillos (queso, cebolla, etc.)
-- Detectados en la carta real pero nunca cargados en la BD.
-- ────────────────────────────────────────────────────────────
insert into categorias (nombre, orden, icono, tipo)
select 'Suplementos', 13, '➕', 'suplemento'
where not exists (select 1 from categorias where nombre = 'Suplementos');

with cat as (select id from categorias where nombre = 'Suplementos')
insert into productos (categoria_id, nombre, descripcion, precio, disponible, tiempo_prep)
select cat.id, t.nombre, '', t.precio, true, 2
from cat, (values
  ('Queso',            1.10),
  ('Cebolla',          0.90),
  ('Pimiento',         1.10),
  ('Champiñones',      1.10),
  ('Huevo',            1.00),
  ('Alioli',           1.10),
  ('Pan',              1.25),
  ('Pan sin gluten',   1.25),
  ('Pan con tomate',   1.70)
) as t(nombre, precio)
where not exists (
  select 1 from productos p where p.categoria_id = cat.id and p.nombre = t.nombre
);
