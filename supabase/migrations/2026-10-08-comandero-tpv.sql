-- ============================================================
-- Comandero TPV (Listado/Configuracion_Completa_TPV_App-v11.xlsx)
-- Productos que el comandero necesita y que no existían en la carta.
-- Se crean con solo_comandero = true: la carta del cliente no los muestra.
-- Precio 0,00 € hasta que se fije desde Admin → Menú.
-- Idempotente: se puede ejecutar varias veces sin duplicar datos.
-- ============================================================

alter table productos add column if not exists solo_comandero boolean not null default false;

-- Bocadillos (Viena / Flauta) ─────────────────────────────────
insert into productos (categoria_id, nombre, descripcion, precio, disponible, tiempo_prep, variantes, solo_comandero)
select c.id, v.nombre, '', 0, true, 6,
  jsonb_build_array(jsonb_build_object('nombre','Viena','precio',0), jsonb_build_object('nombre','Flauta','precio',0)),
  true
from (values
  ('Bocadillos Calientes', 'Bacon'),
  ('Bocadillos Calientes', 'Sobrasada'),
  ('Bocadillos Calientes', 'Tiras de Pollo'),
  ('Bocadillos', 'Atún'),
  ('Bocadillos', 'Jamón Dulce'),
  ('Bocadillos', 'Jamón Ibérico'),
  ('Bocadillos', 'Jamón Serrano'),
  ('Bocadillos', 'Longaniza'),
  ('Bocadillos', 'Pimiento'),
  ('Bocadillos', 'Queso')
) as v(categoria, nombre)
join categorias c on c.nombre = v.categoria
where not exists (select 1 from productos p where p.nombre = v.nombre and p.categoria_id = c.id);

-- Platos, tapas y extras (precio único) ───────────────────────
insert into productos (categoria_id, nombre, descripcion, precio, disponible, tiempo_prep, variantes, solo_comandero)
select c.id, v.nombre, '', 0, true, 8, null, true
from (values
  ('Al Plato', 'Plato Frankfurt'),
  ('Al Plato', 'Plato Butifarra'),
  ('Al Plato', 'Plato Hamburguesa'),
  ('Al Plato', 'Plato Pollo'),
  ('Al Plato', 'Plato Tortilla'),
  ('Tapas Calientes', 'Media Bravas'),
  ('Tapas Frías', 'Extra BBQ'),
  ('Tapas Frías', 'Extra Limón'),
  ('Tapas Frías', 'Patatas Chip'),
  ('Tapas Frías', 'Tapa Jamón Ibérico'),
  ('Tapas Frías', 'Tapa Jamón Serrano'),
  ('Tapas Frías', 'Tapa Queso')
) as v(categoria, nombre)
join categorias c on c.nombre = v.categoria
where not exists (select 1 from productos p where p.nombre = v.nombre and p.categoria_id = c.id);
