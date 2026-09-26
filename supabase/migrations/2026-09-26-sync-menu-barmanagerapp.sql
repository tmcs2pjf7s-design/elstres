-- ============================================================
-- Sincronización de carta con la carta digital real (BarManagerApp)
-- https://cartadigital.barmanagerapp.com/site/index/show/FRANKFURTTR3S
-- Generado 2026-09-26. Idempotente: se puede ejecutar varias veces sin duplicar datos.
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1) Subidas de precio detectadas en Bocadillos (fríos)
-- ────────────────────────────────────────────────────────────
update productos set precio = 5.75, variantes = jsonb_build_array(
  jsonb_build_object('nombre','Viena','precio',5.75), jsonb_build_object('nombre','Flauta','precio',6.85)
) where nombre = 'Madrileño' and categoria_id = (select id from categorias where nombre = 'Bocadillos');

update productos set precio = 5.75, variantes = jsonb_build_array(
  jsonb_build_object('nombre','Viena','precio',5.75), jsonb_build_object('nombre','Flauta','precio',6.85)
) where nombre = 'Jardinera' and categoria_id = (select id from categorias where nombre = 'Bocadillos');

update productos set precio = 5.75, variantes = jsonb_build_array(
  jsonb_build_object('nombre','Viena','precio',5.75), jsonb_build_object('nombre','Flauta','precio',6.75)
) where nombre = 'Gumball' and categoria_id = (select id from categorias where nombre = 'Bocadillos');

update productos set precio = 5.65, variantes = jsonb_build_array(
  jsonb_build_object('nombre','Viena','precio',5.65), jsonb_build_object('nombre','Flauta','precio',6.85)
) where nombre = 'Capricho' and categoria_id = (select id from categorias where nombre = 'Bocadillos');

update productos set precio = 5.85, variantes = jsonb_build_array(
  jsonb_build_object('nombre','Viena','precio',5.85), jsonb_build_object('nombre','Flauta','precio',6.85)
) where nombre = 'Milanesa' and categoria_id = (select id from categorias where nombre = 'Bocadillos');

-- ────────────────────────────────────────────────────────────
-- 2) Producto nuevo en Bocadillos Calientes: Tirolesa
-- ────────────────────────────────────────────────────────────
insert into productos (categoria_id, nombre, descripcion, precio, disponible, tiempo_prep, variantes)
select (select id from categorias where nombre = 'Bocadillos Calientes'), 'Tirolesa', '', 4.65, true, 6,
  jsonb_build_array(jsonb_build_object('nombre','Viena','precio',4.65), jsonb_build_object('nombre','Flauta','precio',5.10))
where not exists (
  select 1 from productos where nombre = 'Tirolesa'
    and categoria_id = (select id from categorias where nombre = 'Bocadillos Calientes')
);

-- ────────────────────────────────────────────────────────────
-- 3) Especialidad nueva en Bocadillos Calientes: Vienna
-- ────────────────────────────────────────────────────────────
insert into productos (categoria_id, nombre, descripcion, precio, disponible, tiempo_prep, variantes)
select (select id from categorias where nombre = 'Bocadillos Calientes'), 'Vienna', 'Cervela, champiñones, cebolla y queso', 6.95, true, 7,
  jsonb_build_array(jsonb_build_object('nombre','Viena','precio',6.95), jsonb_build_object('nombre','Flauta','precio',7.95))
where not exists (
  select 1 from productos where nombre = 'Vienna'
    and categoria_id = (select id from categorias where nombre = 'Bocadillos Calientes')
);

-- ────────────────────────────────────────────────────────────
-- 4) Categorías que faltaban por completo
-- ────────────────────────────────────────────────────────────
insert into categorias (nombre, orden, icono)
select 'Ensaladas', 9, '🥬' where not exists (select 1 from categorias where nombre = 'Ensaladas');

insert into categorias (nombre, orden, icono)
select 'Bikinis', 10, '🥪' where not exists (select 1 from categorias where nombre = 'Bikinis');

insert into categorias (nombre, orden, icono)
select 'Tapas Frías', 11, '🧊' where not exists (select 1 from categorias where nombre = 'Tapas Frías');

insert into categorias (nombre, orden, icono)
select 'Postres', 12, '🍰' where not exists (select 1 from categorias where nombre = 'Postres');

-- ────────────────────────────────────────────────────────────
-- 5) Productos — Ensaladas
-- ────────────────────────────────────────────────────────────
with cat as (select id from categorias where nombre = 'Ensaladas')
insert into productos (categoria_id, nombre, descripcion, precio, disponible, tiempo_prep)
select cat.id, t.nombre, t.descripcion, t.precio, true, 8
from cat, (values
  ('Ensalada de Queso de Cabra', 'Lechuga, frutos secos, tomate, queso brie y aceitunas', 7.50),
  ('Ensalada Verde',             'Lechuga, tomate, zanahoria, maíz dulce, aceitunas y atún', 6.00),
  ('Ensalada Los Tr3s',          'Lechuga, tomate cherry, tiras de pollo rebozado, queso y salsa rosa', 7.95)
) as t(nombre, descripcion, precio)
where not exists (
  select 1 from productos p where p.categoria_id = cat.id and p.nombre = t.nombre
);

-- ────────────────────────────────────────────────────────────
-- 6) Productos — Bikinis
-- ────────────────────────────────────────────────────────────
with cat as (select id from categorias where nombre = 'Bikinis')
insert into productos (categoria_id, nombre, descripcion, precio, disponible, tiempo_prep)
select cat.id, t.nombre, t.descripcion, t.precio, true, 6
from cat, (values
  ('Bikini 1', 'Jamón dulce y queso', 3.10),
  ('Bikini 2', 'Jamón país y queso',  3.35),
  ('Bikini 3', 'Sobrasada y queso',   3.35)
) as t(nombre, descripcion, precio)
where not exists (
  select 1 from productos p where p.categoria_id = cat.id and p.nombre = t.nombre
);

-- ────────────────────────────────────────────────────────────
-- 7) Productos — Tapas Frías
-- Nota: "Escopiñas" se vende a precio de mercado (variable) en la carta
-- original. Se inserta como NO disponible hasta que se fije un precio
-- real en el panel admin — evita venderlo a 0€ por error.
-- ────────────────────────────────────────────────────────────
with cat as (select id from categorias where nombre = 'Tapas Frías')
insert into productos (categoria_id, nombre, descripcion, precio, disponible, tiempo_prep)
select cat.id, t.nombre, t.descripcion, t.precio, t.disponible, 5
from cat, (values
  ('Longaniza',                     '',                                   5.50, true),
  ('Escopiñas',                     'Precio según mercado — fijar precio real en el panel admin antes de activar', 0.00, false),
  ('Anchoas de la Escala',          '',                                   7.25, true),
  ('Boquerones en Vinagre (3 uds)', '',                                   7.25, true)
) as t(nombre, descripcion, precio, disponible)
where not exists (
  select 1 from productos p where p.categoria_id = cat.id and p.nombre = t.nombre
);

-- ────────────────────────────────────────────────────────────
-- 8) Productos — Postres
-- ────────────────────────────────────────────────────────────
with cat as (select id from categorias where nombre = 'Postres')
insert into productos (categoria_id, nombre, descripcion, precio, disponible, tiempo_prep)
select cat.id, t.nombre, t.descripcion, t.precio, true, 3
from cat, (values
  ('Tarta del Día',        '', 3.85),
  ('Tarta de Queso',       '', 4.75),
  ('Tarta Brownie',        '', 3.75),
  ('Coulant au Chocolat',  '', 3.55)
) as t(nombre, descripcion, precio)
where not exists (
  select 1 from productos p where p.categoria_id = cat.id and p.nombre = t.nombre
);
