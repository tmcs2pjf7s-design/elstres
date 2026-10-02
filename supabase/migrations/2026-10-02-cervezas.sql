-- ============================================================
-- Nueva categoría "Cervezas" con los 24 productos reales de la
-- hoja "Cervezas" de Datos Poductos/ElsTr3s.xlsx (precio de barra
-- y de terraza como variantes). Se deja fuera "Tinto de verano":
-- ya existe en Bebidas como "Tinto Verano" a 5,65€, y la propia
-- hoja origen marca esa fila como dudosa ("aparece más de una vez
-- con precios distintos") — a decidir aparte, no se sobrescribe.
-- Idempotente (todas las inserciones comprueban existencia antes).
-- ============================================================

-- Desplaza las categorías siguientes un hueco (de atrás hacia adelante para
-- no pisarse entre sí). Cada UPDATE solo actúa si el orden sigue siendo el
-- original, así que re-ejecutar esta migración no vuelve a desplazarlas.
update categorias set orden = 14 where nombre = 'Suplementos' and orden = 13;
update categorias set orden = 13 where nombre = 'Postres' and orden = 12;
update categorias set orden = 12 where nombre = 'Tapas Frías' and orden = 11;
update categorias set orden = 11 where nombre = 'Bikinis' and orden = 10;
update categorias set orden = 10 where nombre = 'Ensaladas' and orden = 9;
update categorias set orden = 9 where nombre = 'Vinos y Vermut' and orden = 8;
update categorias set orden = 8 where nombre = 'Copas y Licores' and orden = 7;

insert into categorias (nombre, orden, icono)
select 'Cervezas', 7, '🍺'
where not exists (select 1 from categorias where nombre = 'Cervezas');

insert into productos (categoria_id, nombre, descripcion, precio, variantes, disponible, tiempo_prep)
select id, 'Copa Estrella', '', 2.45, '[{"nombre": "Barra", "precio": 2.45}, {"nombre": "Terraza", "precio": 2.65}]'::jsonb, true, 2
from categorias where nombre = 'Cervezas'
and not exists (select 1 from productos pr join categorias c on pr.categoria_id = c.id where c.nombre = 'Cervezas' and pr.nombre = 'Copa Estrella');

insert into productos (categoria_id, nombre, descripcion, precio, variantes, disponible, tiempo_prep)
select id, 'Jarra', '', 4.8, '[{"nombre": "Barra", "precio": 4.8}, {"nombre": "Terraza", "precio": 5.0}]'::jsonb, true, 2
from categorias where nombre = 'Cervezas'
and not exists (select 1 from productos pr join categorias c on pr.categoria_id = c.id where c.nombre = 'Cervezas' and pr.nombre = 'Jarra');

insert into productos (categoria_id, nombre, descripcion, precio, variantes, disponible, tiempo_prep)
select id, 'Zurito Estrella', '', 1.75, '[{"nombre": "Barra", "precio": 1.75}, {"nombre": "Terraza", "precio": 1.95}]'::jsonb, true, 2
from categorias where nombre = 'Cervezas'
and not exists (select 1 from productos pr join categorias c on pr.categoria_id = c.id where c.nombre = 'Cervezas' and pr.nombre = 'Zurito Estrella');

insert into productos (categoria_id, nombre, descripcion, precio, variantes, disponible, tiempo_prep)
select id, 'Copa clara', '', 2.45, '[{"nombre": "Barra", "precio": 2.45}, {"nombre": "Terraza", "precio": 2.65}]'::jsonb, true, 2
from categorias where nombre = 'Cervezas'
and not exists (select 1 from productos pr join categorias c on pr.categoria_id = c.id where c.nombre = 'Cervezas' and pr.nombre = 'Copa clara');

insert into productos (categoria_id, nombre, descripcion, precio, variantes, disponible, tiempo_prep)
select id, 'Jarra clara', '', 5.05, '[{"nombre": "Barra", "precio": 5.05}, {"nombre": "Terraza", "precio": 5.25}]'::jsonb, true, 2
from categorias where nombre = 'Cervezas'
and not exists (select 1 from productos pr join categorias c on pr.categoria_id = c.id where c.nombre = 'Cervezas' and pr.nombre = 'Jarra clara');

insert into productos (categoria_id, nombre, descripcion, precio, variantes, disponible, tiempo_prep)
select id, 'Zurito clara', '', 1.8, '[{"nombre": "Barra", "precio": 1.8}, {"nombre": "Terraza", "precio": 2.0}]'::jsonb, true, 2
from categorias where nombre = 'Cervezas'
and not exists (select 1 from productos pr join categorias c on pr.categoria_id = c.id where c.nombre = 'Cervezas' and pr.nombre = 'Zurito clara');

insert into productos (categoria_id, nombre, descripcion, precio, variantes, disponible, tiempo_prep)
select id, 'Jarra Voll-Damm', '', 5.15, '[{"nombre": "Barra", "precio": 5.15}, {"nombre": "Terraza", "precio": 5.35}]'::jsonb, true, 2
from categorias where nombre = 'Cervezas'
and not exists (select 1 from productos pr join categorias c on pr.categoria_id = c.id where c.nombre = 'Cervezas' and pr.nombre = 'Jarra Voll-Damm');

insert into productos (categoria_id, nombre, descripcion, precio, variantes, disponible, tiempo_prep)
select id, 'Voll-Damm', '', 2.75, '[{"nombre": "Barra", "precio": 2.75}, {"nombre": "Terraza", "precio": 2.95}]'::jsonb, true, 2
from categorias where nombre = 'Cervezas'
and not exists (select 1 from productos pr join categorias c on pr.categoria_id = c.id where c.nombre = 'Cervezas' and pr.nombre = 'Voll-Damm');

insert into productos (categoria_id, nombre, descripcion, precio, variantes, disponible, tiempo_prep)
select id, 'Zurito Voll-Damm', '', 1.8, '[{"nombre": "Barra", "precio": 1.8}, {"nombre": "Terraza", "precio": 2.0}]'::jsonb, true, 2
from categorias where nombre = 'Cervezas'
and not exists (select 1 from productos pr join categorias c on pr.categoria_id = c.id where c.nombre = 'Cervezas' and pr.nombre = 'Zurito Voll-Damm');

insert into productos (categoria_id, nombre, descripcion, precio, variantes, disponible, tiempo_prep)
select id, 'Zurito Turia', '', 1.75, '[{"nombre": "Barra", "precio": 1.75}, {"nombre": "Terraza", "precio": 1.95}]'::jsonb, true, 2
from categorias where nombre = 'Cervezas'
and not exists (select 1 from productos pr join categorias c on pr.categoria_id = c.id where c.nombre = 'Cervezas' and pr.nombre = 'Zurito Turia');

insert into productos (categoria_id, nombre, descripcion, precio, variantes, disponible, tiempo_prep)
select id, 'Copa Turia', '', 2.7, '[{"nombre": "Barra", "precio": 2.7}, {"nombre": "Terraza", "precio": 2.9}]'::jsonb, true, 2
from categorias where nombre = 'Cervezas'
and not exists (select 1 from productos pr join categorias c on pr.categoria_id = c.id where c.nombre = 'Cervezas' and pr.nombre = 'Copa Turia');

insert into productos (categoria_id, nombre, descripcion, precio, variantes, disponible, tiempo_prep)
select id, 'Jarra Turia', '', 5.0, '[{"nombre": "Barra", "precio": 5.0}, {"nombre": "Terraza", "precio": 5.2}]'::jsonb, true, 2
from categorias where nombre = 'Cervezas'
and not exists (select 1 from productos pr join categorias c on pr.categoria_id = c.id where c.nombre = 'Cervezas' and pr.nombre = 'Jarra Turia');

insert into productos (categoria_id, nombre, descripcion, precio, variantes, disponible, tiempo_prep)
select id, 'Free Damm azul', '', 2.55, '[{"nombre": "Barra", "precio": 2.55}, {"nombre": "Terraza", "precio": 2.75}]'::jsonb, true, 2
from categorias where nombre = 'Cervezas'
and not exists (select 1 from productos pr join categorias c on pr.categoria_id = c.id where c.nombre = 'Cervezas' and pr.nombre = 'Free Damm azul');

insert into productos (categoria_id, nombre, descripcion, precio, variantes, disponible, tiempo_prep)
select id, 'Lúpulo Tostada', '', 2.55, '[{"nombre": "Barra", "precio": 2.55}, {"nombre": "Terraza", "precio": 2.75}]'::jsonb, true, 2
from categorias where nombre = 'Cervezas'
and not exists (select 1 from productos pr join categorias c on pr.categoria_id = c.id where c.nombre = 'Cervezas' and pr.nombre = 'Lúpulo Tostada');

insert into productos (categoria_id, nombre, descripcion, precio, variantes, disponible, tiempo_prep)
select id, 'Free Damm amarilla', '', 2.55, '[{"nombre": "Barra", "precio": 2.55}, {"nombre": "Terraza", "precio": 2.75}]'::jsonb, true, 2
from categorias where nombre = 'Cervezas'
and not exists (select 1 from productos pr join categorias c on pr.categoria_id = c.id where c.nombre = 'Cervezas' and pr.nombre = 'Free Damm amarilla');

insert into productos (categoria_id, nombre, descripcion, precio, variantes, disponible, tiempo_prep)
select id, 'Coronita', '', 2.7, '[{"nombre": "Barra", "precio": 2.7}, {"nombre": "Terraza", "precio": 2.9}]'::jsonb, true, 2
from categorias where nombre = 'Cervezas'
and not exists (select 1 from productos pr join categorias c on pr.categoria_id = c.id where c.nombre = 'Cervezas' and pr.nombre = 'Coronita');

insert into productos (categoria_id, nombre, descripcion, precio, variantes, disponible, tiempo_prep)
select id, 'Daura', '', 2.7, '[{"nombre": "Barra", "precio": 2.7}, {"nombre": "Terraza", "precio": 2.9}]'::jsonb, true, 2
from categorias where nombre = 'Cervezas'
and not exists (select 1 from productos pr join categorias c on pr.categoria_id = c.id where c.nombre = 'Cervezas' and pr.nombre = 'Daura');

insert into productos (categoria_id, nombre, descripcion, precio, variantes, disponible, tiempo_prep)
select id, 'Desperados', '', 2.7, '[{"nombre": "Barra", "precio": 2.7}, {"nombre": "Terraza", "precio": 2.9}]'::jsonb, true, 2
from categorias where nombre = 'Cervezas'
and not exists (select 1 from productos pr join categorias c on pr.categoria_id = c.id where c.nombre = 'Cervezas' and pr.nombre = 'Desperados');

insert into productos (categoria_id, nombre, descripcion, precio, variantes, disponible, tiempo_prep)
select id, 'Mediana Estrella', '', 1.95, '[{"nombre": "Barra", "precio": 1.95}, {"nombre": "Terraza", "precio": 2.15}]'::jsonb, true, 2
from categorias where nombre = 'Cervezas'
and not exists (select 1 from productos pr join categorias c on pr.categoria_id = c.id where c.nombre = 'Cervezas' and pr.nombre = 'Mediana Estrella');

insert into productos (categoria_id, nombre, descripcion, precio, variantes, disponible, tiempo_prep)
select id, 'Jarra para llevar', '', 2.95, '[{"nombre": "Barra", "precio": 2.95}, {"nombre": "Terraza", "precio": 3.15}]'::jsonb, true, 2
from categorias where nombre = 'Cervezas'
and not exists (select 1 from productos pr join categorias c on pr.categoria_id = c.id where c.nombre = 'Cervezas' and pr.nombre = 'Jarra para llevar');

insert into productos (categoria_id, nombre, descripcion, precio, variantes, disponible, tiempo_prep)
select id, 'Quinto Free Damm tostada', '', 1.95, '[{"nombre": "Barra", "precio": 1.95}, {"nombre": "Terraza", "precio": 2.15}]'::jsonb, true, 2
from categorias where nombre = 'Cervezas'
and not exists (select 1 from productos pr join categorias c on pr.categoria_id = c.id where c.nombre = 'Cervezas' and pr.nombre = 'Quinto Free Damm tostada');

insert into productos (categoria_id, nombre, descripcion, precio, variantes, disponible, tiempo_prep)
select id, 'Copa para llevar', '', 1.5, '[{"nombre": "Barra", "precio": 1.5}, {"nombre": "Terraza", "precio": 1.7}]'::jsonb, true, 2
from categorias where nombre = 'Cervezas'
and not exists (select 1 from productos pr join categorias c on pr.categoria_id = c.id where c.nombre = 'Cervezas' and pr.nombre = 'Copa para llevar');

insert into productos (categoria_id, nombre, descripcion, precio, variantes, disponible, tiempo_prep)
select id, 'Sangría de cava', '', 12.5, '[{"nombre": "Barra", "precio": 12.5}, {"nombre": "Terraza", "precio": 12.7}]'::jsonb, true, 2
from categorias where nombre = 'Cervezas'
and not exists (select 1 from productos pr join categorias c on pr.categoria_id = c.id where c.nombre = 'Cervezas' and pr.nombre = 'Sangría de cava');

insert into productos (categoria_id, nombre, descripcion, precio, variantes, disponible, tiempo_prep)
select id, 'Sangría de vino', '', 9.0, '[{"nombre": "Barra", "precio": 9.0}, {"nombre": "Terraza", "precio": 9.2}]'::jsonb, true, 2
from categorias where nombre = 'Cervezas'
and not exists (select 1 from productos pr join categorias c on pr.categoria_id = c.id where c.nombre = 'Cervezas' and pr.nombre = 'Sangría de vino');
