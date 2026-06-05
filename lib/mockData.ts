import { Categoria, Producto, Mesa, Pedido } from './types'

export const mockCategorias: Categoria[] = [
  { id: 'cat-1', nombre: 'Bocadillos', orden: 1, icono: '🥖' },
  { id: 'cat-2', nombre: 'Bocadillos Calientes', orden: 2, icono: '🌭' },
  { id: 'cat-3', nombre: 'Al Plato', orden: 3, icono: '🍽️' },
  { id: 'cat-4', nombre: 'Tapas Calientes', orden: 4, icono: '🍟' },
  { id: 'cat-5', nombre: 'Platos Combinados', orden: 5, icono: '🥗' },
  { id: 'cat-6', nombre: 'Bebidas', orden: 6, icono: '🥤' },
  { id: 'cat-7', nombre: 'Copas y Licores', orden: 7, icono: '🍸' },
  { id: 'cat-8', nombre: 'Vinos y Vermut', orden: 8, icono: '🍷' },
]

const vf = (v: number, f: number) => [
  { nombre: 'Viena', precio: v },
  { nombre: 'Flauta', precio: f },
]

export const mockProductos: Producto[] = [
  // ── BOCADILLOS ─────────────────────────────────────────────
  {
    id: 'p-1', categoria_id: 'cat-1', nombre: 'Madrileño',
    descripcion: 'Calamares a la romana, lechuga y mayonesa',
    precio: 5.45, disponible: true, tiempo_prep: 8,
    variantes: vf(5.45, 6.55),
  },
  {
    id: 'p-2', categoria_id: 'cat-1', nombre: 'Jardinera',
    descripcion: 'Hamburguesa, lechuga, tomate y queso',
    precio: 5.55, disponible: true, tiempo_prep: 8,
    variantes: vf(5.55, 6.55),
  },
  {
    id: 'p-3', categoria_id: 'cat-1', nombre: 'Extremeño',
    descripcion: 'Hamburguesa, jamón dulce, huevo y queso',
    precio: 5.95, disponible: true, tiempo_prep: 8,
    variantes: vf(5.95, 6.95),
  },
  {
    id: 'p-4', categoria_id: 'cat-1', nombre: 'Gumball',
    descripcion: 'Frankfurt, beicon y queso',
    precio: 5.45, disponible: true, tiempo_prep: 8,
    variantes: vf(5.45, 6.45),
  },
  {
    id: 'p-5', categoria_id: 'cat-1', nombre: 'Traidor',
    descripcion: 'Chistorra, panceta, huevo, queso y cebolla',
    precio: 6.90, disponible: true, tiempo_prep: 10,
    variantes: vf(6.90, 7.90),
  },
  {
    id: 'p-6', categoria_id: 'cat-1', nombre: 'Submarino',
    descripcion: 'Escalivada, atún, anchoa y queso',
    precio: 6.65, disponible: true, tiempo_prep: 8,
    variantes: vf(6.65, 7.75),
  },
  {
    id: 'p-7', categoria_id: 'cat-1', nombre: 'Capricho',
    descripcion: 'Lomo, beicon y queso',
    precio: 5.45, disponible: true, tiempo_prep: 8,
    variantes: vf(5.45, 6.65),
  },
  {
    id: 'p-8', categoria_id: 'cat-1', nombre: 'Milanesa',
    descripcion: 'Pollo rebozado, lechuga, mayonesa y salsa verde',
    precio: 5.55, disponible: true, tiempo_prep: 10,
    variantes: vf(5.55, 6.55),
  },
  {
    id: 'p-9', categoria_id: 'cat-1', nombre: 'Pepito',
    descripcion: 'Ternera, jamón salado y pimiento verde',
    precio: 6.55, disponible: true, tiempo_prep: 10,
    variantes: vf(6.55, 7.55),
  },
  {
    id: 'p-10', categoria_id: 'cat-1', nombre: 'Bomba',
    descripcion: 'Hamburguesa picante, pikantwurst, champiñones y salsa romesco',
    precio: 6.95, disponible: true, tiempo_prep: 10,
    variantes: vf(6.95, 7.95),
  },
  {
    id: 'p-11', categoria_id: 'cat-1', nombre: 'Pimpollo',
    descripcion: 'Pollo, lechuga, huevo y champiñones',
    precio: 6.45, disponible: true, tiempo_prep: 10,
    variantes: vf(6.45, 7.45),
  },
  {
    id: 'p-12', categoria_id: 'cat-1', nombre: 'Cerdito',
    descripcion: 'Butifarra, cebolla, queso y allioli',
    precio: 6.85, disponible: true, tiempo_prep: 10,
    variantes: vf(6.85, 7.85),
  },
  {
    id: 'p-13', categoria_id: 'cat-1', nombre: 'Apetitoso',
    descripcion: 'Pollo, beicon, pimiento verde y alioli',
    precio: 6.15, disponible: true, tiempo_prep: 8,
    variantes: vf(6.15, 7.15),
  },
  {
    id: 'p-14', categoria_id: 'cat-1', nombre: 'Vegetal',
    descripcion: 'Tomate, lechuga, atún y mayonesa',
    precio: 6.80, disponible: true, tiempo_prep: 8,
    variantes: vf(6.80, 7.65),
  },
  {
    id: 'p-15', categoria_id: 'cat-1', nombre: 'Muntañes',
    descripcion: 'Salsicha país, cebolla, champiñones y huevo',
    precio: 5.80, disponible: true, tiempo_prep: 10,
    variantes: vf(5.80, 6.80),
  },

  // ── BOCADILLOS CALIENTES ────────────────────────────────────
  {
    id: 'p-20', categoria_id: 'cat-2', nombre: 'Frankfurt',
    descripcion: '', precio: 3.75, disponible: true, tiempo_prep: 5,
    variantes: vf(3.75, 4.75),
  },
  {
    id: 'p-21', categoria_id: 'cat-2', nombre: 'Lomo',
    descripcion: '', precio: 4.10, disponible: true, tiempo_prep: 6,
    variantes: vf(4.10, 5.35),
  },
  {
    id: 'p-22', categoria_id: 'cat-2', nombre: 'Ternera',
    descripcion: '', precio: 4.25, disponible: true, tiempo_prep: 8,
    variantes: vf(4.25, 5.25),
  },
  {
    id: 'p-23', categoria_id: 'cat-2', nombre: 'Pechuga de Pollo',
    descripcion: '', precio: 4.30, disponible: true, tiempo_prep: 8,
    variantes: vf(4.30, 5.35),
  },
  {
    id: 'p-24', categoria_id: 'cat-2', nombre: 'Hamburguesa',
    descripcion: '', precio: 4.45, disponible: true, tiempo_prep: 8,
    variantes: vf(4.45, 5.10),
  },
  {
    id: 'p-25', categoria_id: 'cat-2', nombre: 'Chistorra',
    descripcion: '', precio: 4.15, disponible: true, tiempo_prep: 6,
    variantes: vf(4.15, 5.75),
  },
  {
    id: 'p-26', categoria_id: 'cat-2', nombre: 'Salchicha País',
    descripcion: '', precio: 3.95, disponible: true, tiempo_prep: 6,
    variantes: vf(3.95, 5.25),
  },
  {
    id: 'p-27', categoria_id: 'cat-2', nombre: 'Malagueña',
    descripcion: '', precio: 4.45, disponible: true, tiempo_prep: 6,
    variantes: vf(4.45, 4.85),
  },
  {
    id: 'p-28', categoria_id: 'cat-2', nombre: 'Bratwurst',
    descripcion: '', precio: 4.45, disponible: true, tiempo_prep: 6,
    variantes: vf(4.45, 5.15),
  },
  {
    id: 'p-29', categoria_id: 'cat-2', nombre: 'Pinchos',
    descripcion: '', precio: 5.55, disponible: true, tiempo_prep: 8,
    variantes: vf(5.55, 6.55),
  },
  {
    id: 'p-30', categoria_id: 'cat-2', nombre: 'Tortilla',
    descripcion: '', precio: 4.05, disponible: true, tiempo_prep: 5,
    variantes: vf(4.05, 5.05),
  },
  {
    id: 'p-31', categoria_id: 'cat-2', nombre: 'Butifarra',
    descripcion: '', precio: 4.90, disponible: true, tiempo_prep: 6,
    variantes: vf(4.90, 5.95),
  },
  {
    id: 'p-32', categoria_id: 'cat-2', nombre: 'Pikantwurst',
    descripcion: '', precio: 4.55, disponible: true, tiempo_prep: 6,
    variantes: vf(4.55, 5.60),
  },
  {
    id: 'p-33', categoria_id: 'cat-2', nombre: 'Cervela',
    descripcion: '', precio: 4.65, disponible: true, tiempo_prep: 6,
    variantes: vf(4.65, 5.15),
  },
  {
    id: 'p-34', categoria_id: 'cat-2', nombre: 'Hamburguesa Moruna',
    descripcion: '', precio: 4.65, disponible: true, tiempo_prep: 8,
    variantes: vf(4.65, 5.65),
  },
  {
    id: 'p-35', categoria_id: 'cat-2', nombre: 'Hamburguesa Picante',
    descripcion: '', precio: 4.65, disponible: true, tiempo_prep: 8,
    variantes: vf(4.65, 5.65),
  },
  {
    id: 'p-36', categoria_id: 'cat-2', nombre: 'Hamburguesa Vegana',
    descripcion: '🌱 Vegana', precio: 4.65, disponible: true, tiempo_prep: 8,
    variantes: vf(4.65, 5.65),
  },
  {
    id: 'p-37', categoria_id: 'cat-2', nombre: 'Panceta',
    descripcion: '', precio: 4.55, disponible: true, tiempo_prep: 6,
    variantes: vf(4.55, 5.35),
  },
  {
    id: 'p-38', categoria_id: 'cat-2', nombre: 'Frankfurt Vegano',
    descripcion: '🌱 Vegano', precio: 4.65, disponible: true, tiempo_prep: 6,
    variantes: vf(4.65, 5.65),
  },

  // ── AL PLATO ────────────────────────────────────────────────
  {
    id: 'p-40', categoria_id: 'cat-3', nombre: 'Al Plato',
    descripcion: 'Hamburguesa o Frankfurt',
    precio: 3.15, disponible: true, tiempo_prep: 5,
  },

  // ── TAPAS CALIENTES ─────────────────────────────────────────
  {
    id: 'p-50', categoria_id: 'cat-4', nombre: 'Patatas Bravas',
    descripcion: '', precio: 6.70, disponible: true, tiempo_prep: 8,
  },
  {
    id: 'p-51', categoria_id: 'cat-4', nombre: 'Patatas Fritas',
    descripcion: '', precio: 3.80, disponible: true, tiempo_prep: 8,
  },
  {
    id: 'p-52', categoria_id: 'cat-4', nombre: 'Chocos',
    descripcion: '', precio: 11.50, disponible: true, tiempo_prep: 12,
  },
  {
    id: 'p-53', categoria_id: 'cat-4', nombre: 'Pinchos',
    descripcion: '', precio: 9.70, disponible: true, tiempo_prep: 8,
  },
  {
    id: 'p-54', categoria_id: 'cat-4', nombre: 'Alitas de Pollo (4 uds)',
    descripcion: '', precio: 7.95, disponible: true, tiempo_prep: 12,
  },
  {
    id: 'p-55', categoria_id: 'cat-4', nombre: 'Alcachofa Chips',
    descripcion: '⭐ Solo temporada', precio: 9.70, disponible: true, tiempo_prep: 10,
  },
  {
    id: 'p-56', categoria_id: 'cat-4', nombre: 'Croquetas (6 uds)',
    descripcion: '', precio: 7.70, disponible: true, tiempo_prep: 8,
  },
  {
    id: 'p-57', categoria_id: 'cat-4', nombre: 'Puntillas',
    descripcion: '', precio: 11.50, disponible: true, tiempo_prep: 12,
  },
  {
    id: 'p-58', categoria_id: 'cat-4', nombre: 'Tiras de Pollo (6 uds)',
    descripcion: '', precio: 8.35, disponible: true, tiempo_prep: 10,
  },
  {
    id: 'p-59', categoria_id: 'cat-4', nombre: 'Berenjena Frita',
    descripcion: '', precio: 7.95, disponible: true, tiempo_prep: 10,
  },

  // ── PLATOS COMBINADOS ───────────────────────────────────────
  {
    id: 'p-70', categoria_id: 'cat-5', nombre: 'Combinado 1',
    descripcion: 'Ensalada, bravas y butifarra · 🕐 12h–16h',
    precio: 12.50, disponible: true, tiempo_prep: 12,
  },
  {
    id: 'p-71', categoria_id: 'cat-5', nombre: 'Combinado 2',
    descripcion: 'Ensalada, pollo y patatas fritas · 🕐 12h–16h',
    precio: 12.50, disponible: true, tiempo_prep: 12,
  },
  {
    id: 'p-72', categoria_id: 'cat-5', nombre: 'Combinado 7',
    descripcion: 'Pinchos, huevo y bravas · 🕐 12h–16h',
    precio: 12.95, disponible: true, tiempo_prep: 12,
  },
  {
    id: 'p-73', categoria_id: 'cat-5', nombre: 'Combinado 4',
    descripcion: 'Calamares a la romana, croquetas y bravas · 🕐 12h–16h',
    precio: 12.95, disponible: true, tiempo_prep: 14,
  },
  {
    id: 'p-74', categoria_id: 'cat-5', nombre: 'Combinado 8',
    descripcion: 'Tiras de pollo, patatas fritas y huevo · 🕐 12h–16h',
    precio: 12.75, disponible: true, tiempo_prep: 12,
  },
  {
    id: 'p-75', categoria_id: 'cat-5', nombre: 'Combinado Especial Entrecot',
    descripcion: 'Entrecot con guarnición a elegir: bravas, fritas o ensalada · 🕐 12h–16h',
    precio: 16.95, disponible: true, tiempo_prep: 18,
  },
  {
    id: 'p-76', categoria_id: 'cat-5', nombre: 'Combinado Especial Sepia',
    descripcion: 'Sepia con guarnición a elegir: fritas, bravas o ensalada · 🕐 12h–16h',
    precio: 14.95, disponible: true, tiempo_prep: 15,
  },
  {
    id: 'p-77', categoria_id: 'cat-5', nombre: 'Combinado Infantil',
    descripcion: 'Patatas fritas, huevo y Frankfurt / Lomo / Hamburguesa · 🕐 12h–16h',
    precio: 11.50, disponible: true, tiempo_prep: 12,
  },

  // ── BEBIDAS ─────────────────────────────────────────────────
  {
    id: 'p-80', categoria_id: 'cat-6', nombre: 'Coca Cola',
    descripcion: '', precio: 2.35, disponible: true, tiempo_prep: 1,
  },
  {
    id: 'p-81', categoria_id: 'cat-6', nombre: 'Coca Cola 0',
    descripcion: '', precio: 2.35, disponible: true, tiempo_prep: 1,
  },
  {
    id: 'p-82', categoria_id: 'cat-6', nombre: 'Fanta Naranja',
    descripcion: '', precio: 2.35, disponible: true, tiempo_prep: 1,
  },
  {
    id: 'p-83', categoria_id: 'cat-6', nombre: 'Fanta Limón',
    descripcion: '', precio: 2.35, disponible: true, tiempo_prep: 1,
  },
  {
    id: 'p-84', categoria_id: 'cat-6', nombre: 'Aquarius Naranja',
    descripcion: '', precio: 2.35, disponible: true, tiempo_prep: 1,
  },
  {
    id: 'p-85', categoria_id: 'cat-6', nombre: 'Aquarius Limón',
    descripcion: '', precio: 2.35, disponible: true, tiempo_prep: 1,
  },
  {
    id: 'p-86', categoria_id: 'cat-6', nombre: 'Trina Naranja',
    descripcion: '', precio: 2.35, disponible: true, tiempo_prep: 1,
  },
  {
    id: 'p-87', categoria_id: 'cat-6', nombre: 'Nestea',
    descripcion: '', precio: 2.35, disponible: true, tiempo_prep: 1,
  },
  {
    id: 'p-88', categoria_id: 'cat-6', nombre: 'Tónica',
    descripcion: '', precio: 2.35, disponible: true, tiempo_prep: 1,
  },
  {
    id: 'p-89', categoria_id: 'cat-6', nombre: 'Beter Kas',
    descripcion: '', precio: 2.35, disponible: true, tiempo_prep: 1,
  },
  {
    id: 'p-90', categoria_id: 'cat-6', nombre: 'Vichy Catalán',
    descripcion: '', precio: 2.35, disponible: true, tiempo_prep: 1,
  },
  {
    id: 'p-91', categoria_id: 'cat-6', nombre: 'Zumo Naranja Natural',
    descripcion: 'Exprimido al momento', precio: 3.15, disponible: true, tiempo_prep: 3,
  },
  {
    id: 'p-92', categoria_id: 'cat-6', nombre: 'Zumo Naranja',
    descripcion: '', precio: 2.35, disponible: true, tiempo_prep: 1,
  },
  {
    id: 'p-93', categoria_id: 'cat-6', nombre: 'Zumo Melocotón',
    descripcion: '', precio: 2.35, disponible: true, tiempo_prep: 1,
  },
  {
    id: 'p-94', categoria_id: 'cat-6', nombre: 'Zumo Piña',
    descripcion: '', precio: 2.35, disponible: true, tiempo_prep: 1,
  },
  {
    id: 'p-95', categoria_id: 'cat-6', nombre: 'Agua 1/2',
    descripcion: '', precio: 2.55, disponible: true, tiempo_prep: 1,
  },
  {
    id: 'p-96', categoria_id: 'cat-6', nombre: 'Agua 1/4',
    descripcion: '', precio: 1.45, disponible: true, tiempo_prep: 1,
  },
  {
    id: 'p-97', categoria_id: 'cat-6', nombre: 'Tinto Verano',
    descripcion: '', precio: 5.65, disponible: true, tiempo_prep: 2,
  },

  // ── COPAS Y LICORES ─────────────────────────────────────────
  {
    id: 'p-100', categoria_id: 'cat-7', nombre: 'Gin Tonic Puerto de India',
    descripcion: '', precio: 7.50, disponible: true, tiempo_prep: 3,
  },
  {
    id: 'p-101', categoria_id: 'cat-7', nombre: 'Gin Tonic Bombay',
    descripcion: '', precio: 8.50, disponible: true, tiempo_prep: 3,
  },
  {
    id: 'p-102', categoria_id: 'cat-7', nombre: 'Gin Tonic Beefeater',
    descripcion: '', precio: 7.50, disponible: true, tiempo_prep: 3,
  },
  {
    id: 'p-103', categoria_id: 'cat-7', nombre: 'Gin Tonic Seagrams',
    descripcion: '', precio: 7.50, disponible: true, tiempo_prep: 3,
  },
  {
    id: 'p-104', categoria_id: 'cat-7', nombre: 'Tubo Baileys',
    descripcion: '', precio: 6.50, disponible: true, tiempo_prep: 2,
  },
  {
    id: 'p-105', categoria_id: 'cat-7', nombre: 'Tubo Crema Orujo',
    descripcion: '', precio: 6.00, disponible: true, tiempo_prep: 2,
  },
  {
    id: 'p-106', categoria_id: 'cat-7', nombre: 'Tubo Orujo de Hierba',
    descripcion: '', precio: 6.00, disponible: true, tiempo_prep: 2,
  },
  {
    id: 'p-107', categoria_id: 'cat-7', nombre: 'Tubo Limoncello',
    descripcion: '', precio: 5.50, disponible: true, tiempo_prep: 2,
  },
  {
    id: 'p-108', categoria_id: 'cat-7', nombre: 'Tubo Marie Brizard',
    descripcion: '', precio: 3.75, disponible: true, tiempo_prep: 2,
  },
  {
    id: 'p-109', categoria_id: 'cat-7', nombre: 'Tubo Pacharán',
    descripcion: '', precio: 3.75, disponible: true, tiempo_prep: 2,
  },
  {
    id: 'p-110', categoria_id: 'cat-7', nombre: 'Chupito Limoncello',
    descripcion: '', precio: 2.50, disponible: true, tiempo_prep: 1,
  },
  {
    id: 'p-111', categoria_id: 'cat-7', nombre: 'Chupito Orujo',
    descripcion: '', precio: 2.50, disponible: true, tiempo_prep: 1,
  },
  {
    id: 'p-112', categoria_id: 'cat-7', nombre: 'Chupito Crema',
    descripcion: '', precio: 2.70, disponible: true, tiempo_prep: 1,
  },

  // ── VINOS Y VERMUT ──────────────────────────────────────────
  {
    id: 'p-120', categoria_id: 'cat-8', nombre: 'Copa Vino Blanco',
    descripcion: '', precio: 3.05, disponible: true, tiempo_prep: 1,
  },
  {
    id: 'p-121', categoria_id: 'cat-8', nombre: 'Copa Vino Tinto',
    descripcion: '', precio: 3.05, disponible: true, tiempo_prep: 1,
  },
  {
    id: 'p-122', categoria_id: 'cat-8', nombre: 'Copa Vino Rosado',
    descripcion: '', precio: 3.05, disponible: true, tiempo_prep: 1,
  },
  {
    id: 'p-123', categoria_id: 'cat-8', nombre: 'Martini Blanco',
    descripcion: '', precio: 3.95, disponible: true, tiempo_prep: 1,
  },
  {
    id: 'p-124', categoria_id: 'cat-8', nombre: 'Martini Negro',
    descripcion: '', precio: 3.95, disponible: true, tiempo_prep: 1,
  },
  {
    id: 'p-125', categoria_id: 'cat-8', nombre: 'Vermut Casero',
    descripcion: '', precio: 3.95, disponible: true, tiempo_prep: 1,
  },
]

export const mockMesas: Mesa[] = Array.from({ length: 12 }, (_, i) => ({
  id: `mesa-${i + 1}`,
  numero: i + 1,
  capacidad: i < 4 ? 2 : i < 10 ? 4 : 6,
  estado: i === 2 ? 'ocupada' : i === 5 ? 'reservada' : i === 8 ? 'ocupada' : 'libre',
  tipo: 'mesa' as const,
}))

export const mockPedidos: Pedido[] = [
  {
    id: 'ped-1',
    tipo: 'mesa',
    mesa_id: 'mesa-3',
    mesa: { id: 'mesa-3', numero: 3, capacidad: 4, estado: 'ocupada' },
    estado: 'en_preparacion',
    total: 12.40,
    numero_orden: 1,
    created_at: new Date(Date.now() - 10 * 60000).toISOString(),
    items: [
      { id: 'i-1', pedido_id: 'ped-1', producto_id: 'p-1', cantidad: 1, precio: 5.45, producto: mockProductos[0] },
      { id: 'i-2', pedido_id: 'ped-1', producto_id: 'p-10', cantidad: 1, precio: 6.95, producto: mockProductos[9] },
    ],
  },
  {
    id: 'ped-2',
    tipo: 'llevar',
    estado: 'pendiente',
    total: 9.20,
    numero_orden: 2,
    cliente_nombre: 'Ana García',
    cliente_telefono: '600 123 456',
    created_at: new Date(Date.now() - 2 * 60000).toISOString(),
    items: [
      { id: 'i-3', pedido_id: 'ped-2', producto_id: 'p-20', cantidad: 2, precio: 3.75, producto: mockProductos[15] },
      { id: 'i-4', pedido_id: 'ped-2', producto_id: 'p-50', cantidad: 1, precio: 6.70, producto: mockProductos[40] },
    ],
  },
]
