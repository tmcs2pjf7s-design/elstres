-- ============================================================
-- Añade una imagen opcional a sorteos/promociones (p.ej. el flyer
-- de Instagram), para mostrarla como cabecera en /sorteos y
-- /promociones. Idempotente.
-- ============================================================

alter table contenidos add column if not exists imagen text;
