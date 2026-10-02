-- ============================================================
-- Amplía los roles de `usuarios` para dar de alta cuentas
-- nominales de personal (camarero, cocina), en vez de depender
-- de un único admin compartido. No siembra ningún empleado:
-- las cuentas reales se crean desde /admin/personal.
-- Idempotente (se puede re-ejecutar sin riesgo).
-- ============================================================

alter table usuarios drop constraint if exists usuarios_rol_check;

alter table usuarios add constraint usuarios_rol_check
  check (rol in ('admin', 'camarero', 'cocina', 'cliente'));

alter table usuarios add column if not exists activo boolean not null default true;
