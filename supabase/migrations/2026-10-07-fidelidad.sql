-- ============================================================
-- Tarjeta de fidelidad: cada 10 sellos (cafés), 1 gratis.
-- El sello lo añade el personal escaneando el QR del código de
-- la tarjeta del cliente (o introduciéndolo a mano como respaldo).
-- Idempotente.
-- ============================================================

create table if not exists tarjetas_fidelidad (
  id uuid default gen_random_uuid() primary key,
  cliente_id uuid not null unique references usuarios(id) on delete cascade,
  codigo text not null unique,
  sellos integer not null default 0,
  premios_canjeados integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
