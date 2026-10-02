-- ============================================================
-- Las cervezas se muestran con un único precio (el de barra) en
-- vez de dos variantes Barra/Terraza — el recargo de terraza
-- (+0,20€ en los 24 productos, confirmado en el Excel origen) se
-- indica aparte en letra pequeña al pie de la página, no por
-- producto. Idempotente (UPDATE puro).
-- ============================================================

update productos p
set variantes = null
from categorias c
where p.categoria_id = c.id
  and c.nombre = 'Cervezas';
