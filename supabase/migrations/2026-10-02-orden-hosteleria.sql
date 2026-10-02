-- ============================================================
-- Reordena las categorías de la carta siguiendo la lógica
-- habitual de hostelería: entrantes fríos/calientes → ensaladas →
-- bocadillos/bikinis → platos principales → postres → bebidas de
-- menos a más alcohol (refrescos → cerveza → vino → licores) →
-- suplementos siempre al final.
-- Idempotente (asignación directa de orden, no relativa).
-- ============================================================

update categorias set orden = 1  where nombre = 'Tapas Frías';
update categorias set orden = 2  where nombre = 'Tapas Calientes';
update categorias set orden = 3  where nombre = 'Ensaladas';
update categorias set orden = 4  where nombre = 'Bocadillos';
update categorias set orden = 5  where nombre = 'Bocadillos Calientes';
update categorias set orden = 6  where nombre = 'Bikinis';
update categorias set orden = 7  where nombre = 'Al Plato';
update categorias set orden = 8  where nombre = 'Platos Combinados';
update categorias set orden = 9  where nombre = 'Postres';
update categorias set orden = 10 where nombre = 'Bebidas';
update categorias set orden = 11 where nombre = 'Cervezas';
update categorias set orden = 12 where nombre = 'Vinos y Vermut';
update categorias set orden = 13 where nombre = 'Copas y Licores';
update categorias set orden = 14 where nombre = 'Suplementos';
