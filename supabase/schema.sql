-- ============================================================
-- Frankfurt Els Tr3s · Esquema completo con datos
-- Ejecutar en Supabase → SQL Editor
-- ============================================================

-- TABLAS ─────────────────────────────────────────────────────

create table if not exists categorias (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  orden integer default 0,
  icono text default '🍽️',
  tipo text default 'normal' check (tipo in ('normal','suplemento')),
  created_at timestamptz default now()
);

create table if not exists productos (
  id uuid default gen_random_uuid() primary key,
  categoria_id uuid references categorias(id) on delete set null,
  nombre text not null,
  descripcion text default '',
  precio decimal(10,2) not null,
  imagen text,
  disponible boolean default true,
  tiempo_prep integer default 10,
  variantes jsonb default null,
  created_at timestamptz default now()
);

create table if not exists mesas (
  id uuid default gen_random_uuid() primary key,
  numero integer not null unique,
  capacidad integer default 4,
  estado text default 'libre' check (estado in ('libre','ocupada','reservada')),
  tipo text default 'mesa' check (tipo in ('mesa','barra')),
  created_at timestamptz default now()
);

create table if not exists pedidos (
  id uuid default gen_random_uuid() primary key,
  tipo text not null check (tipo in ('mesa','llevar')),
  mesa_id uuid references mesas(id) on delete set null,
  estado text default 'pendiente' check (
    estado in ('pendiente','confirmado','en_preparacion','listo','entregado','cancelado')
  ),
  total decimal(10,2) default 0,
  cliente_nombre text,
  cliente_telefono text,
  notas text,
  tipo_entrega text default 'recogida' check (tipo_entrega in ('recogida','domicilio')),
  direccion_entrega text,
  numero_orden serial,
  created_at timestamptz default now()
);

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

create table if not exists pedido_items (
  id uuid default gen_random_uuid() primary key,
  pedido_id uuid references pedidos(id) on delete cascade,
  producto_id uuid references productos(id) on delete set null,
  cantidad integer not null default 1,
  precio decimal(10,2) not null,
  notas text,
  created_at timestamptz default now()
);

-- REALTIME ───────────────────────────────────────────────────
alter publication supabase_realtime add table pedidos;
alter publication supabase_realtime add table pedido_items;

-- ============================================================
-- SEED: Categorías
-- ============================================================
insert into categorias (nombre, orden, icono) values
  ('Bocadillos',          1, '🥖'),
  ('Bocadillos Calientes',2, '🌭'),
  ('Al Plato',            3, '🍽️'),
  ('Tapas Calientes',     4, '🍟'),
  ('Platos Combinados',   5, '🥗'),
  ('Bebidas',             6, '🥤'),
  ('Copas y Licores',     7, '🍸'),
  ('Vinos y Vermut',      8, '🍷');

-- ============================================================
-- SEED: Mesas
-- ============================================================
insert into mesas (numero, capacidad) values
  (1,2),(2,2),(3,4),(4,4),(5,4),(6,4),
  (7,4),(8,4),(9,6),(10,6),(11,6),(12,6);

-- ============================================================
-- SEED: Productos — Bocadillos
-- ============================================================
with cat as (select id from categorias where nombre='Bocadillos')
insert into productos (categoria_id, nombre, descripcion, precio, disponible, tiempo_prep, variantes) select
  cat.id, nombre, descripcion, precio, true, 8,
  jsonb_build_array(
    jsonb_build_object('nombre','Viena','precio',viena),
    jsonb_build_object('nombre','Flauta','precio',flauta)
  )
from cat, (values
  ('Madrileño',    'Calamares a la romana, lechuga y mayonesa',                            5.45, 5.45, 6.55),
  ('Jardinera',    'Hamburguesa, lechuga, tomate y queso',                                 5.55, 5.55, 6.55),
  ('Extremeño',    'Hamburguesa, jamón dulce, huevo y queso',                              5.95, 5.95, 6.95),
  ('Gumball',      'Frankfurt, beicon y queso',                                            5.45, 5.45, 6.45),
  ('Traidor',      'Chistorra, panceta, huevo, queso y cebolla',                           6.90, 6.90, 7.90),
  ('Submarino',    'Escalivada, atún, anchoa y queso',                                     6.65, 6.65, 7.75),
  ('Capricho',     'Lomo, beicon y queso',                                                 5.45, 5.45, 6.65),
  ('Milanesa',     'Pollo rebozado, lechuga, mayonesa y salsa verde',                      5.55, 5.55, 6.55),
  ('Pepito',       'Ternera, jamón salado y pimiento verde',                               6.55, 6.55, 7.55),
  ('Bomba',        'Hamburguesa picante, pikantwurst, champiñones y salsa romesco',        6.95, 6.95, 7.95),
  ('Pimpollo',     'Pollo, lechuga, huevo y champiñones',                                  6.45, 6.45, 7.45),
  ('Cerdito',      'Butifarra, cebolla, queso y allioli',                                  6.85, 6.85, 7.85),
  ('Apetitoso',    'Pollo, beicon, pimiento verde y alioli',                               6.15, 6.15, 7.15),
  ('Vegetal',      'Tomate, lechuga, atún y mayonesa',                                     6.80, 6.80, 7.65),
  ('Muntañes',     'Salsicha país, cebolla, champiñones y huevo',                          5.80, 5.80, 6.80)
) as t(nombre, descripcion, precio, viena, flauta);

-- ============================================================
-- SEED: Productos — Bocadillos Calientes
-- ============================================================
with cat as (select id from categorias where nombre='Bocadillos Calientes')
insert into productos (categoria_id, nombre, descripcion, precio, disponible, tiempo_prep, variantes) select
  cat.id, nombre, descripcion, precio, true, 6,
  jsonb_build_array(
    jsonb_build_object('nombre','Viena','precio',viena),
    jsonb_build_object('nombre','Flauta','precio',flauta)
  )
from cat, (values
  ('Frankfurt',            '',          3.75, 3.75, 4.75),
  ('Lomo',                 '',          4.10, 4.10, 5.35),
  ('Ternera',              '',          4.25, 4.25, 5.25),
  ('Pechuga de Pollo',     '',          4.30, 4.30, 5.35),
  ('Hamburguesa',          '',          4.45, 4.45, 5.10),
  ('Chistorra',            '',          4.15, 4.15, 5.75),
  ('Salchicha País',       '',          3.95, 3.95, 5.25),
  ('Malagueña',            '',          4.45, 4.45, 4.85),
  ('Bratwurst',            '',          4.45, 4.45, 5.15),
  ('Pinchos',              '',          5.55, 5.55, 6.55),
  ('Tortilla',             '',          4.05, 4.05, 5.05),
  ('Butifarra',            '',          4.90, 4.90, 5.95),
  ('Pikantwurst',          '',          4.55, 4.55, 5.60),
  ('Cervela',              '',          4.65, 4.65, 5.15),
  ('Hamburguesa Moruna',   '',          4.65, 4.65, 5.65),
  ('Hamburguesa Picante',  '',          4.65, 4.65, 5.65),
  ('Hamburguesa Vegana',   '🌱 Vegana', 4.65, 4.65, 5.65),
  ('Panceta',              '',          4.55, 4.55, 5.35),
  ('Frankfurt Vegano',     '🌱 Vegano', 4.65, 4.65, 5.65)
) as t(nombre, descripcion, precio, viena, flauta);

-- ============================================================
-- SEED: Productos — Al Plato
-- ============================================================
with cat as (select id from categorias where nombre='Al Plato')
insert into productos (categoria_id, nombre, descripcion, precio, disponible, tiempo_prep)
select cat.id, 'Al Plato', 'Hamburguesa o Frankfurt', 3.15, true, 5 from cat;

-- ============================================================
-- SEED: Productos — Tapas Calientes
-- ============================================================
with cat as (select id from categorias where nombre='Tapas Calientes')
insert into productos (categoria_id, nombre, descripcion, precio, disponible, tiempo_prep) select
  cat.id, nombre, descripcion, precio, true, tiempo
from cat, (values
  ('Patatas Bravas',       '',                    6.70, 8),
  ('Patatas Fritas',       '',                    3.80, 8),
  ('Chocos',               '',                   11.50,12),
  ('Pinchos',              '',                    9.70, 8),
  ('Alitas de Pollo (4 uds)','',                  7.95,12),
  ('Alcachofa Chips',      '⭐ Solo temporada',   9.70,10),
  ('Croquetas (6 uds)',    '',                    7.70, 8),
  ('Puntillas',            '',                   11.50,12),
  ('Tiras de Pollo (6 uds)','',                   8.35,10),
  ('Berenjena Frita',      '',                    7.95,10)
) as t(nombre, descripcion, precio, tiempo);

-- ============================================================
-- SEED: Productos — Platos Combinados
-- ============================================================
with cat as (select id from categorias where nombre='Platos Combinados')
insert into productos (categoria_id, nombre, descripcion, precio, disponible, tiempo_prep) select
  cat.id, nombre, descripcion, precio, true, 12
from cat, (values
  ('Combinado 1',           'Ensalada, bravas y butifarra · 🕐 12h–16h',                                         12.50),
  ('Combinado 2',           'Ensalada, pollo y patatas fritas · 🕐 12h–16h',                                     12.50),
  ('Combinado 7',           'Pinchos, huevo y bravas · 🕐 12h–16h',                                             12.95),
  ('Combinado 4',           'Calamares a la romana, croquetas y bravas · 🕐 12h–16h',                           12.95),
  ('Combinado 8',           'Tiras de pollo, patatas fritas y huevo · 🕐 12h–16h',                              12.75),
  ('Combinado Especial Entrecot','Entrecot con guarnición a elegir: bravas, fritas o ensalada · 🕐 12h–16h',    16.95),
  ('Combinado Especial Sepia',  'Sepia con guarnición a elegir: fritas, bravas o ensalada · 🕐 12h–16h',        14.95),
  ('Combinado Infantil',    'Patatas fritas, huevo y Frankfurt / Lomo / Hamburguesa · 🕐 12h–16h',              11.50)
) as t(nombre, descripcion, precio);

-- ============================================================
-- SEED: Productos — Bebidas
-- ============================================================
with cat as (select id from categorias where nombre='Bebidas')
insert into productos (categoria_id, nombre, descripcion, precio, disponible, tiempo_prep) select
  cat.id, nombre, descripcion, precio, true, 1
from cat, (values
  ('Coca Cola',            '', 2.35),
  ('Coca Cola 0',          '', 2.35),
  ('Fanta Naranja',        '', 2.35),
  ('Fanta Limón',          '', 2.35),
  ('Aquarius Naranja',     '', 2.35),
  ('Aquarius Limón',       '', 2.35),
  ('Trina Naranja',        '', 2.35),
  ('Nestea',               '', 2.35),
  ('Tónica',               '', 2.35),
  ('Beter Kas',            '', 2.35),
  ('Vichy Catalán',        '', 2.35),
  ('Zumo Naranja Natural', 'Exprimido al momento', 3.15),
  ('Zumo Naranja',         '', 2.35),
  ('Zumo Melocotón',       '', 2.35),
  ('Zumo Piña',            '', 2.35),
  ('Agua 1/2',             '', 2.55),
  ('Agua 1/4',             '', 1.45),
  ('Tinto Verano',         '', 5.65)
) as t(nombre, descripcion, precio);

-- ============================================================
-- SEED: Productos — Copas y Licores
-- ============================================================
with cat as (select id from categorias where nombre='Copas y Licores')
insert into productos (categoria_id, nombre, descripcion, precio, disponible, tiempo_prep) select
  cat.id, nombre, descripcion, precio, true, 2
from cat, (values
  ('Gin Tonic Puerto de India', '', 7.50),
  ('Gin Tonic Bombay',          '', 8.50),
  ('Gin Tonic Beefeater',       '', 7.50),
  ('Gin Tonic Seagrams',        '', 7.50),
  ('Tubo Baileys',              '', 6.50),
  ('Tubo Crema Orujo',          '', 6.00),
  ('Tubo Orujo de Hierba',      '', 6.00),
  ('Tubo Limoncello',           '', 5.50),
  ('Tubo Marie Brizard',        '', 3.75),
  ('Tubo Pacharán',             '', 3.75),
  ('Chupito Limoncello',        '', 2.50),
  ('Chupito Orujo',             '', 2.50),
  ('Chupito Crema',             '', 2.70)
) as t(nombre, descripcion, precio);

-- ============================================================
-- SEED: Productos — Vinos y Vermut
-- ============================================================
with cat as (select id from categorias where nombre='Vinos y Vermut')
insert into productos (categoria_id, nombre, descripcion, precio, disponible, tiempo_prep) select
  cat.id, nombre, descripcion, precio, true, 1
from cat, (values
  ('Copa Vino Blanco',  '', 3.05),
  ('Copa Vino Tinto',   '', 3.05),
  ('Copa Vino Rosado',  '', 3.05),
  ('Martini Blanco',    '', 3.95),
  ('Martini Negro',     '', 3.95),
  ('Vermut Casero',     '', 3.95)
) as t(nombre, descripcion, precio);

-- ============================================================
-- SEED: Categoría de suplementos (extras para bocadillos) + productos
-- ============================================================
insert into categorias (nombre, orden, icono, tipo) values
  ('Suplementos', 13, '➕', 'suplemento');

with cat as (select id from categorias where nombre='Suplementos')
insert into productos (categoria_id, nombre, descripcion, precio, disponible, tiempo_prep) select
  cat.id, nombre, '', precio, true, 2
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
) as t(nombre, precio);
