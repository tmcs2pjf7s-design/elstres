// Distribución TPV del comandero, transcrita de
// Listado/Configuracion_Completa_TPV_App-v11.xlsx.
// Solo afecta al comandero: la carta del cliente sigue usando categorías y
// productos de la BD tal cual. Cada botón apunta a un producto real de la BD
// (por nombre + categoría), de donde salen precio, disponibilidad e impresora.

import { Producto } from './types'

// ── Colores (hoja "Matriz Colores TPV" y relleno de las hojas) ──────────────
export const COLOR = {
  flauta: '#FFF2CC',
  viena: '#E2EFDA',
  plato: '#FCE4D6',
  tapaCaliente: '#F8CBAD',
  tapaFria: '#E1F5FE',
  combinado: '#E1F5FE',
  otros: '#FFFFFF',
  // Modificadores
  pan: '#E2EFDA',
  queso: '#FFF2CC',
  vegetal: '#C6EFCE',
  proteina: '#FCE4D6',
  guarnicion: '#FFF2CC',
  salsa: '#F8CBAD',
  termino: '#D9E1F2',
  sin: '#FFC7CE',
} as const

// ── Modificadores CON / SIN ──────────────────────────────────────────────────
export type CatMod = 'pan' | 'queso' | 'vegetal' | 'proteina' | 'guarnicion' | 'salsa' | 'termino'

export interface ModTpv {
  id: string
  nombre: string
  cat: CatMod
  color: string
}

const con = (id: string, cat: CatMod, nombre: string): ModTpv => ({ id, nombre, cat, color: COLOR[cat] })
const sin = (id: string, cat: CatMod, nombre: string): ModTpv => ({ id, nombre, cat, color: COLOR.sin })

export const MODS_CON: ModTpv[] = [
  con('CON-001', 'pan', 'Pan con tomate'),
  con('CON-002', 'pan', 'Rodaja pan con tomate'),
  con('CON-003', 'pan', 'Pan planchado'),
  con('CON-004', 'pan', 'Pan tostado'),
  con('CON-005', 'pan', 'Pan blanco'),
  con('CON-006', 'pan', 'Pan Sin Gluten'),
  con('CON-007', 'pan', 'Pan aparte'),
  con('CON-008', 'pan', 'Partido en dos'),
  con('CON-009', 'pan', 'Al plato'),
  con('CON-010', 'queso', 'Queso (Formatge)'),
  con('CON-011', 'vegetal', 'Lechuga (Enciam)'),
  con('CON-012', 'vegetal', 'Rodaja de tomate'),
  con('CON-013', 'vegetal', 'Cebolla (Ceba)'),
  con('CON-014', 'vegetal', 'Pimiento (Pebrot)'),
  con('CON-015', 'vegetal', 'Champiñones (Xampinyons)'),
  con('CON-016', 'vegetal', 'Oliva'),
  con('CON-017', 'vegetal', 'Ensalada (Amanida)'),
  con('CON-018', 'vegetal', 'Más limón'),
  con('CON-019', 'proteina', 'Ternera (Vedella)'),
  con('CON-020', 'proteina', 'Lomo'),
  con('CON-021', 'proteina', 'Pollo'),
  con('CON-022', 'proteina', 'Pinchos'),
  con('CON-023', 'proteina', 'Sup. Hamburguesa'),
  con('CON-024', 'proteina', 'Hamburguesa Picante'),
  con('CON-025', 'proteina', 'Hamburguesa Vegana'),
  con('CON-026', 'proteina', 'Hamburguesa Moruna'),
  con('CON-027', 'proteina', 'Bacon'),
  con('CON-028', 'proteina', 'Panceta (Cansalada)'),
  con('CON-029', 'proteina', 'Butifarra (Botifarra)'),
  con('CON-030', 'proteina', 'Salchicha País'),
  con('CON-031', 'proteina', 'Pikantwurst'),
  con('CON-032', 'proteina', 'Sup. Frankfurt'),
  con('CON-033', 'proteina', 'Jamón dulce (Pernil dolç)'),
  con('CON-034', 'proteina', 'Jamón salado (Pernil salat)'),
  con('CON-035', 'proteina', 'Anchoas'),
  con('CON-036', 'proteina', 'Huevo (Ou)'),
  con('CON-037', 'guarnicion', 'Patatas fritas (Patates fregides)'),
  con('CON-038', 'guarnicion', 'Extra BBQ'),
  con('CON-039', 'guarnicion', 'Extra alioli'),
  con('CON-040', 'guarnicion', 'Extra limón'),
  con('CON-041', 'salsa', 'Ketchup'),
  con('CON-042', 'salsa', 'Mayonesa'),
  con('CON-043', 'salsa', 'Alioli'),
  con('CON-044', 'salsa', 'Con alioli'),
  con('CON-045', 'salsa', 'Con alioli aparte'),
  con('CON-046', 'salsa', 'Salsa verde'),
  con('CON-047', 'salsa', 'Salsa romesco'),
  con('CON-048', 'salsa', 'Salsa aparte'),
  con('CON-049', 'salsa', 'Tomate del Vallès'),
  con('CON-050', 'salsa', 'Mostaza del Vallès'),
  con('CON-051', 'salsa', 'Sal'),
  con('CON-052', 'salsa', 'Viandox'),
  con('CON-053', 'termino', 'Poco hecho'),
  con('CON-054', 'termino', 'Al punto'),
  con('CON-055', 'termino', 'Muy hecho / Bien hecho'),
  con('CON-056', 'termino', 'Abierto'),
  con('CON-057', 'termino', 'Troceado'),
  con('CON-058', 'termino', 'Para llevar'),
  con('CON-059', 'termino', 'YA ESTA HECHO!!'),
]

export const MODS_SIN: ModTpv[] = [
  sin('SIN-001', 'pan', 'Sin Pan con tomate'),
  sin('SIN-002', 'pan', 'Sin Pan'),
  sin('SIN-003', 'queso', 'Sin Queso (Sin Formatge)'),
  sin('SIN-004', 'vegetal', 'Sin Lechuga (Sin Enciam)'),
  sin('SIN-005', 'vegetal', 'Sin Rodaja de tomate'),
  sin('SIN-006', 'vegetal', 'Sin Cebolla (Sin Ceba)'),
  sin('SIN-007', 'vegetal', 'Sin Pimiento (Sin Pebrot)'),
  sin('SIN-008', 'vegetal', 'Sin Champiñones (Sin Xampinyons)'),
  sin('SIN-009', 'vegetal', 'Sin Oliva'),
  sin('SIN-010', 'proteina', 'Sin Ternera (Sin Vedella)'),
  sin('SIN-011', 'proteina', 'Sin Lomo'),
  sin('SIN-012', 'proteina', 'Sin Pollo'),
  sin('SIN-013', 'proteina', 'Sin Tiras de pollo'),
  sin('SIN-014', 'proteina', 'Sin Pinchos'),
  sin('SIN-015', 'proteina', 'Sin Hamburguesa'),
  sin('SIN-016', 'proteina', 'Sin Bacon'),
  sin('SIN-017', 'proteina', 'Sin Panceta (Sin Cansalada)'),
  sin('SIN-018', 'proteina', 'Sin Butifarra (Sin Botifarra)'),
  sin('SIN-019', 'proteina', 'Sin Salchicha País'),
  sin('SIN-020', 'proteina', 'Sin Jamón dulce (Sin Pernil dolç)'),
  sin('SIN-021', 'proteina', 'Sin Jamón salado (Sin Pernil salat)'),
  sin('SIN-022', 'proteina', 'Sin Anchoas'),
  sin('SIN-023', 'proteina', 'Sin Huevo (Sin Ou)'),
  sin('SIN-024', 'salsa', 'Sin Mayonesa'),
  sin('SIN-025', 'salsa', 'Sin Alioli'),
  sin('SIN-026', 'salsa', 'Sin Salsa verde'),
  sin('SIN-027', 'salsa', 'Sin Salsa romesco'),
  sin('SIN-028', 'salsa', 'Sin Salsa'),
  sin('SIN-029', 'salsa', 'Sin Sal'),
]

export const CAT_MOD_LABEL: Record<CatMod, string> = {
  pan: 'Panes y servicio',
  queso: 'Quesos',
  vegetal: 'Vegetales',
  proteina: 'Proteínas y charcutería',
  guarnicion: 'Guarniciones y extras',
  salsa: 'Salsas y condimentos',
  termino: 'Término y servicio',
}

// ── Pop-ups de modificadores ("Pop-Up Modificadores Asignado") ─────────────
// Cada entrada es una categoría completa o el id de un modificador suelto.
export type GrupoMods = 'bocadillo' | 'plato' | 'tapaCaliente' | 'tapaFria' | 'combinado'

const GRUPOS: Record<GrupoMods, { con: (CatMod | string)[]; sin: (CatMod | string)[] }> = {
  // Grupo Suplementos & Modificadores (CON / SIN)
  bocadillo: {
    con: ['pan', 'queso', 'vegetal', 'proteina', 'guarnicion', 'salsa', 'termino'],
    sin: ['pan', 'queso', 'vegetal', 'proteina', 'salsa'],
  },
  // Grupo Suplementos Plato (Patatas, Ensalada, Huevo, Tomate, Pan)
  plato: {
    con: ['CON-037', 'CON-017', 'CON-036', 'CON-012', 'CON-001', 'CON-002', 'CON-004', 'CON-005', 'CON-006', 'salsa', 'termino'],
    sin: ['SIN-023', 'SIN-005', 'SIN-001', 'SIN-002', 'salsa'],
  },
  // Grupo Modificadores & Suplementos Tapas Calientes
  tapaCaliente: {
    con: ['guarnicion', 'CON-018', 'salsa', 'termino'],
    sin: ['salsa'],
  },
  // Grupo Modificadores & Extras Tapas Frías
  tapaFria: {
    con: ['pan', 'CON-018', 'guarnicion', 'salsa', 'CON-058'],
    sin: ['salsa'],
  },
  // Grupo Acompañamientos & Guarniciones
  combinado: {
    con: ['pan', 'vegetal', 'CON-036', 'guarnicion', 'salsa', 'termino'],
    sin: ['pan', 'vegetal', 'SIN-023', 'salsa'],
  },
}

function resolver(lista: ModTpv[], claves: (CatMod | string)[]): ModTpv[] {
  return lista.filter(m => claves.some(k => k === m.id || k === m.cat))
}

export function modsDeGrupo(grupo: GrupoMods): { con: ModTpv[]; sin: ModTpv[] } {
  const g = GRUPOS[grupo]
  return { con: resolver(MODS_CON, g.con), sin: resolver(MODS_SIN, g.sin) }
}

// ── Categorías y botones TPV ─────────────────────────────────────────────────
export type Formato = 'Flauta' | 'Viena'

export interface BotonTpv {
  label: string
  categoriaBD: string
  productoBD: string
  formato?: Formato
  // Si el botón no sigue el color / pop-up de su categoría (p. ej. "Plato X")
  color?: string
  grupo?: GrupoMods
}

export interface CategoriaTpv {
  id: string
  nombre: string
  icono: string
  color: string
  grupo: GrupoMods
  botones: BotonTpv[]
  // Categorías de la BD cuyos productos no listados en el Excel se muestran
  // al final como "Otros de la carta", para no perder ninguno.
  otrosDe: string[]
}

// Un bocadillo genera dos botones, Flauta y Viena, como en el Excel.
const boc = (categoriaBD: string, label: string, productoBD = label): BotonTpv[] =>
  (['Flauta', 'Viena'] as const).map(formato => ({ label, categoriaBD, productoBD, formato }))

const uno = (categoriaBD: string, label: string, productoBD = label): BotonTpv =>
  ({ label, categoriaBD, productoBD })

export const CATEGORIAS_TPV: CategoriaTpv[] = [
  {
    id: 'tpv-boc-esp', nombre: 'Bocadillos especiales', icono: '🥖', color: COLOR.flauta, grupo: 'bocadillo',
    otrosDe: ['Bocadillos'],
    botones: [
      ...boc('Bocadillos', 'Apetitoso'),
      ...boc('Bocadillos', 'Bomba'),
      ...boc('Bocadillos', 'Capricho'),
      ...boc('Bocadillos', 'Madrileño'),
      ...boc('Bocadillos', 'Milanesa'),
      ...boc('Bocadillos', 'Muntanyes', 'Muntañes'),
      ...boc('Bocadillos', 'Porquet', 'Cerdito'),
      ...boc('Bocadillos', 'Submarino'),
      ...boc('Bocadillos', 'Traidor'),
      ...boc('Bocadillos', 'Vegetal'),
    ],
  },
  {
    id: 'tpv-boc-cal', nombre: 'Bocadillos calientes', icono: '🌭', color: COLOR.flauta, grupo: 'bocadillo',
    otrosDe: ['Bocadillos Calientes', 'Al Plato'],
    botones: [
      ...[
        uno('Al Plato', 'Plato Frankfurt'),
        uno('Al Plato', 'Plato butifarra', 'Plato Butifarra'),
        uno('Al Plato', 'Plato hamburguesa', 'Plato Hamburguesa'),
        uno('Al Plato', 'Plato pollo', 'Plato Pollo'),
        uno('Al Plato', 'Plato tortilla', 'Plato Tortilla'),
      ].map(b => ({ ...b, color: COLOR.plato, grupo: 'plato' as const })),
      ...boc('Bocadillos Calientes', 'Bacon'),
      ...boc('Bocadillos Calientes', 'Butifarra'),
      ...boc('Bocadillos Calientes', 'Chistorra'),
      ...boc('Bocadillos Calientes', 'Frankfurt'),
      ...boc('Bocadillos Calientes', 'Frankfurt vegano', 'Frankfurt Vegano'),
      ...boc('Bocadillos Calientes', 'Hamburguesa'),
      ...boc('Bocadillos Calientes', 'Hamburguesa moruna', 'Hamburguesa Moruna'),
      ...boc('Bocadillos Calientes', 'Hamburguesa picante', 'Hamburguesa Picante'),
      ...boc('Bocadillos Calientes', 'Hamburguesa vegana', 'Hamburguesa Vegana'),
      ...boc('Bocadillos Calientes', 'Lomo'),
      ...boc('Bocadillos Calientes', 'Malagueña'),
      ...boc('Bocadillos Calientes', 'Panceta'),
      ...boc('Bocadillos Calientes', 'Pikantwurst'),
      ...boc('Bocadillos Calientes', 'Pinchos'),
      ...boc('Bocadillos Calientes', 'Pollo', 'Pechuga de Pollo'),
      ...boc('Bocadillos Calientes', 'Salchicha', 'Salchicha País'),
      ...boc('Bocadillos Calientes', 'Sobrasada'),
      ...boc('Bocadillos Calientes', 'Ternera'),
      ...boc('Bocadillos Calientes', 'Tiras de pollo', 'Tiras de Pollo'),
      ...boc('Bocadillos Calientes', 'Tirolesa'),
      ...boc('Bocadillos Calientes', 'Tortilla'),
    ],
  },
  {
    id: 'tpv-boc-fri', nombre: 'Bocadillos fríos', icono: '🥪', color: COLOR.viena, grupo: 'bocadillo',
    otrosDe: [],
    botones: [
      ...boc('Bocadillos', 'Atún'),
      ...boc('Bocadillos', 'Jamón dulce', 'Jamón Dulce'),
      ...boc('Bocadillos', 'Jamón ibérico', 'Jamón Ibérico'),
      ...boc('Bocadillos', 'Jamón serrano', 'Jamón Serrano'),
      ...boc('Bocadillos', 'Longaniza'),
      ...boc('Bocadillos', 'Pimiento'),
      ...boc('Bocadillos', 'Queso'),
    ],
  },
  {
    id: 'tpv-tap-cal', nombre: 'Tapas calientes', icono: '🍟', color: COLOR.tapaCaliente, grupo: 'tapaCaliente',
    otrosDe: ['Tapas Calientes'],
    botones: [
      uno('Tapas Calientes', 'Alcachofas', 'Alcachofa Chips'),
      uno('Tapas Calientes', 'Alitas de pollo', 'Alitas de Pollo (4 uds)'),
      uno('Tapas Calientes', 'Berenjena frita', 'Berenjena Frita'),
      uno('Tapas Calientes', 'Croquetas', 'Croquetas (6 uds)'),
      uno('Tapas Calientes', 'Media bravas', 'Media Bravas'),
      uno('Tapas Calientes', 'Patatas bravas', 'Patatas Bravas'),
      uno('Tapas Calientes', 'Patatas fritas', 'Patatas Fritas'),
      uno('Tapas Calientes', 'Pinchos'),
      uno('Tapas Calientes', 'Puntillas'),
      uno('Tapas Calientes', 'Tiras de pollo', 'Tiras de Pollo (6 uds)'),
      uno('Tapas Calientes', 'Xocos', 'Chocos'),
    ],
  },
  {
    id: 'tpv-tap-fri', nombre: 'Tapas frías', icono: '🫒', color: COLOR.tapaFria, grupo: 'tapaFria',
    otrosDe: ['Tapas Frías'],
    botones: [
      uno('Tapas Frías', 'Anchoas', 'Anchoas de la Escala'),
      uno('Tapas Frías', 'Berberechos (escopinyes)', 'Escopiñas'),
      uno('Tapas Frías', 'Extra BBQ'),
      uno('Suplementos', 'Extra alioli', 'Alioli'),
      uno('Tapas Frías', 'Extra limón', 'Extra Limón'),
      uno('Suplementos', 'Pan'),
      uno('Suplementos', 'Pan con tomate'),
      uno('Suplementos', 'Pan sin gluten'),
      uno('Tapas Frías', 'Patatas chip', 'Patatas Chip'),
      uno('Tapas Frías', 'Tapa jamón ibérico', 'Tapa Jamón Ibérico'),
      uno('Tapas Frías', 'Tapa jamón serrano', 'Tapa Jamón Serrano'),
      uno('Tapas Frías', 'Tapa queso', 'Tapa Queso'),
    ],
  },
  {
    id: 'tpv-combinados', nombre: 'Platos combinados', icono: '🥗', color: COLOR.combinado, grupo: 'combinado',
    otrosDe: ['Platos Combinados'],
    botones: [
      uno('Platos Combinados', 'Combinado 1'),
      uno('Platos Combinados', 'Combinado 2'),
      uno('Platos Combinados', 'Combinado 4'),
      uno('Platos Combinados', 'Combinado 7'),
      uno('Platos Combinados', 'Combinado 8'),
      uno('Platos Combinados', 'Especial entrecot', 'Combinado Especial Entrecot'),
      uno('Platos Combinados', 'Especial sepia', 'Combinado Especial Sepia'),
    ],
  },
]

// Categorías de la BD que ya quedan cubiertas por las pestañas TPV.
export const CATEGORIAS_BD_CUBIERTAS = new Set(CATEGORIAS_TPV.flatMap(c => [
  ...c.otrosDe,
  ...c.botones.map(b => b.categoriaBD).filter(n => n !== 'Suplementos'),
]))

export function colorBoton(b: { formato?: Formato; color?: string }, colorCategoria: string): string {
  if (b.color) return b.color
  if (b.formato === 'Flauta') return COLOR.flauta
  if (b.formato === 'Viena') return COLOR.viena
  return colorCategoria
}

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase()

export const claveProducto = (categoria: string, nombre: string) => `${norm(categoria)}|${norm(nombre)}`

// Índice categoría+nombre → producto para resolver los botones contra la BD.
export function indexarProductos(productos: Producto[], nombreCategoria: (id: string) => string | undefined) {
  const idx = new Map<string, Producto>()
  for (const p of productos) {
    const cat = (p as any).categoria_nombre ?? nombreCategoria(p.categoria_id)
    if (cat) idx.set(claveProducto(cat, p.nombre), p)
  }
  return idx
}
