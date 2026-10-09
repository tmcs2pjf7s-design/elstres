-- Renombra la categoría "Bocadillos" a "Bocadillos Especiales" en la carta.
-- El comandero (lib/comanderoTpv.ts) acepta ambos nombres.
update categorias set nombre = 'Bocadillos Especiales' where nombre = 'Bocadillos';
