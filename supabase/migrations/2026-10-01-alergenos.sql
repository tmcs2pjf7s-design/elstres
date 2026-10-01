-- ============================================================
-- Alérgenos por producto — datos reales extraídos de la carta
-- digital original (BarManagerApp), no inventados. Los productos
-- que allí figuraban como "N/P" (no comprobado) o "—" (no
-- identificado) se dejan sin alérgenos asignados (array vacío) en
-- vez de afirmar que no contienen nada: la ausencia de badge no es
-- una garantía, solo refleja que no hay dato verificado.
-- Idempotente (UPDATE puro, se puede re-ejecutar sin riesgo).
-- ============================================================

alter table productos add column if not exists alergenos text[] default '{}';

-- Bocadillos (fríos)
update productos set alergenos = '{GLU,HUE}' where nombre = 'Madrileño';
update productos set alergenos = '{GLU,LEC}' where nombre = 'Jardinera';
update productos set alergenos = '{GLU}' where nombre = 'Al Plato';
update productos set alergenos = '{GLU,HUE,LEC}' where nombre = 'Extremeño';
update productos set alergenos = '{GLU,LEC}' where nombre = 'Gumball';
update productos set alergenos = '{GLU,HUE,LEC}' where nombre = 'Traidor';
update productos set alergenos = '{GLU,PES,LEC}' where nombre = 'Submarino';
update productos set alergenos = '{GLU,LEC}' where nombre = 'Capricho';
update productos set alergenos = '{GLU,HUE}' where nombre = 'Milanesa';
update productos set alergenos = '{GLU}' where nombre = 'Pepito';
update productos set alergenos = '{GLU,FSE}' where nombre = 'Bomba';
update productos set alergenos = '{GLU,HUE}' where nombre = 'Pimpollo';
update productos set alergenos = '{GLU,HUE,LEC}' where nombre = 'Cerdito';
update productos set alergenos = '{GLU,HUE}' where nombre = 'Apetitoso';
update productos set alergenos = '{GLU,HUE,PES}' where nombre = 'Vegetal';
update productos set alergenos = '{GLU,HUE}' where nombre = 'Muntañes';

-- Bocadillos Calientes
update productos set alergenos = '{GLU}' where nombre = 'Frankfurt' and categoria_id = (select id from categorias where nombre = 'Bocadillos Calientes');
update productos set alergenos = '{GLU}' where nombre = 'Lomo';
update productos set alergenos = '{GLU}' where nombre = 'Ternera';
update productos set alergenos = '{GLU}' where nombre = 'Pechuga de Pollo';
update productos set alergenos = '{GLU}' where nombre = 'Hamburguesa';
update productos set alergenos = '{GLU}' where nombre = 'Chistorra';
update productos set alergenos = '{GLU}' where nombre = 'Salchicha País';
update productos set alergenos = '{GLU}' where nombre = 'Malagueña';
update productos set alergenos = '{GLU}' where nombre = 'Bratwurst';
update productos set alergenos = '{GLU}' where nombre = 'Tirolesa';
update productos set alergenos = '{GLU,HUE}' where nombre = 'Pinchos' and categoria_id = (select id from categorias where nombre = 'Bocadillos Calientes');
update productos set alergenos = '{GLU,HUE}' where nombre = 'Tortilla';
update productos set alergenos = '{GLU}' where nombre = 'Butifarra';
update productos set alergenos = '{GLU}' where nombre = 'Pikantwurst';
update productos set alergenos = '{GLU}' where nombre = 'Cervela' and categoria_id = (select id from categorias where nombre = 'Bocadillos Calientes');
update productos set alergenos = '{GLU}' where nombre = 'Hamburguesa Moruna';
update productos set alergenos = '{GLU}' where nombre = 'Hamburguesa Picante';
update productos set alergenos = '{GLU}' where nombre = 'Hamburguesa Vegana';
update productos set alergenos = '{GLU}' where nombre = 'Panceta';
update productos set alergenos = '{GLU}' where nombre = 'Frankfurt Vegano';

-- Tapas Calientes
update productos set alergenos = '{GLU}' where nombre = 'Patatas Bravas';
update productos set alergenos = '{MOL}' where nombre = 'Chocos';
update productos set alergenos = '{GLU,HUE,LEC}' where nombre = 'Croquetas (6 uds)';
update productos set alergenos = '{MOL}' where nombre = 'Puntillas';
update productos set alergenos = '{GLU,HUE}' where nombre = 'Tiras de Pollo (6 uds)';

-- Platos Combinados
update productos set alergenos = '{HUE}' where nombre = 'Combinado 7';
update productos set alergenos = '{GLU,HUE,LEC,MOL}' where nombre = 'Combinado 4';
update productos set alergenos = '{GLU,HUE}' where nombre = 'Combinado 8';
update productos set alergenos = '{MOL}' where nombre = 'Combinado Especial Sepia';
update productos set alergenos = '{GLU,HUE}' where nombre = 'Combinado Infantil';

-- Tapas Frías
update productos set alergenos = '{MOL}' where nombre = 'Escopiñas';
update productos set alergenos = '{PES}' where nombre = 'Anchoas de la Escala';
update productos set alergenos = '{PES}' where nombre = 'Boquerones en Vinagre (3 uds)';

-- Postres
update productos set alergenos = '{HUE,LEC}' where nombre = 'Tarta de Queso';
update productos set alergenos = '{GLU,HUE,LEC}' where nombre = 'Tarta Brownie';
update productos set alergenos = '{GLU,HUE,LEC}' where nombre = 'Coulant au Chocolat';
