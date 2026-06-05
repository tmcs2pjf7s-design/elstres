'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminGuard from '@/components/AdminGuard'
import { getImpresoras, upsertImpresora, deleteImpresora, getCategorias } from '@/lib/data'
import { Impresora, Categoria, TipoImpresora, ProtocoloImpresora } from '@/lib/types'
import { testImpresora, printVentana, buildTicketHtml } from '@/lib/print'

function ModalDescargaWindows({ onClose }: { onClose: () => void }) {
  const pasos = [
    { n: 1, titulo: 'Descarga BXLPrint Agent', desc: 'Ve a bixolon.com → Support → Software → BXLPrint Agent. Descarga la versión para Windows.' },
    { n: 2, titulo: 'Instala el programa', desc: 'Ejecuta el instalador como administrador. El agente se instala como servicio de Windows y arranca solo.' },
    { n: 3, titulo: 'Conecta la impresora', desc: 'Conecta la Bixolon al mismo WiFi que el ordenador del local. Anota la IP (aparece en el menú de la impresora → Network).' },
    { n: 4, titulo: 'Añade la impresora aquí', desc: 'Vuelve a este panel, pulsa "+ Añadir impresora", elige Bixolon SRP, introduce el nombre y la IP.' },
    { n: 5, titulo: 'Test de impresión', desc: 'Pulsa "🖨 Test" en la impresora configurada. Si sale el ticket, ¡todo listo!' },
  ]

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gray-900 rounded-t-3xl p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🖥️</span>
              <div>
                <h2 className="text-lg font-black">Software de impresión Windows</h2>
                <p className="text-gray-400 text-xs">BXLPrint Agent — Bixolon</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">×</button>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">
            Para imprimir tickets automáticamente desde el navegador necesitas instalar
            <strong className="text-white"> BXLPrint Agent</strong> en el ordenador Windows del local.
            Es gratuito y tarda 2 minutos.
          </p>
        </div>

        {/* Download button */}
        <div className="p-6 border-b border-gray-100">
          <a
            href="https://www.bixolon.com/board.php?board_code=pds_software&cate=PRT&pageNum=1"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full bg-gray-900 hover:bg-gray-700 text-white px-5 py-4 rounded-2xl transition-colors group"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">⬇️</span>
              <div className="text-left">
                <p className="font-bold text-sm">Descargar BXLPrint Agent</p>
                <p className="text-gray-400 text-xs">bixolon.com · Descarga gratuita</p>
              </div>
            </div>
            <span className="text-gray-400 group-hover:text-white text-sm">↗</span>
          </a>

          <p className="text-xs text-gray-400 mt-3 text-center">
            Windows 10 / 11 · Compatible con Bixolon SRP-350, SRP-380, SRP-Q300 y otros
          </p>
        </div>

        {/* Pasos */}
        <div className="p-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Guía de instalación</p>
          <div className="space-y-4">
            {pasos.map(p => (
              <div key={p.n} className="flex gap-4">
                <div className="w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                  {p.n}
                </div>
                <div>
                  <p className="font-semibold text-sm">{p.titulo}</p>
                  <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Epson info */}
          <div className="mt-6 bg-blue-50 rounded-2xl p-4">
            <p className="text-sm font-bold text-blue-800 mb-1">¿Tienes una Epson TM?</p>
            <p className="text-xs text-blue-600 leading-relaxed">
              Las Epson TM-T20, TM-T88 y TM-m30 se conectan directamente por WiFi — no necesitas instalar nada.
              Solo conéctala a la red del local, anota su IP y añádela como <strong>Epson TM</strong>.
            </p>
          </div>

          <button onClick={onClose}
            className="w-full mt-5 bg-gray-100 text-gray-700 py-3 rounded-2xl font-semibold text-sm hover:bg-gray-200 transition-colors">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

const PROTOCOLOS: { value: ProtocoloImpresora; label: string; icon: string; desc: string; setup: string }[] = [
  {
    value: 'bixolon',
    label: 'Bixolon SRP',
    icon: '🖨️',
    desc: 'Bixolon SRP-350, SRP-380, SRP-Q300…',
    setup: 'Requiere instalar BXLPrint Agent en el ordenador del local (descarga gratuita en bixolon.com).',
  },
  {
    value: 'epson',
    label: 'Epson TM',
    icon: '🖨️',
    desc: 'Epson TM-T20, TM-T88, TM-m30…',
    setup: 'Conecta la impresora al WiFi. Introduce su IP (la encuentras en el menú de la impresora).',
  },
  {
    value: 'ventana',
    label: 'Cualquier impresora',
    icon: '🖥️',
    desc: 'Abre ventana de impresión del navegador',
    setup: 'Funciona con cualquier impresora USB o de red configurada en el ordenador.',
  },
]

const TIPOS: { value: TipoImpresora; label: string; icon: string; desc: string }[] = [
  { value: 'cocina',  label: 'Cocina',  icon: '👨‍🍳', desc: 'Imprime tickets de comida para la cocina' },
  { value: 'barra',   label: 'Barra',   icon: '🍺', desc: 'Imprime tickets de bebidas para la barra' },
  { value: 'ticket',  label: 'Ticket',  icon: '🧾', desc: 'Imprime ticket completo para el cliente' },
]

const emptyForm = (): Omit<Impresora, 'id'> => ({
  nombre: '', ip: '', puerto: 9100, tipo: 'cocina', protocolo: 'bixolon', activa: true, categorias_ids: [],
})

function ImpresorasContent() {
  const [impresoras, setImpresoras] = useState<Impresora[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [form, setForm] = useState<Omit<Impresora, 'id'> | null>(null)
  const [editando, setEditando] = useState<Impresora | null>(null)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState<string | null>(null)
  const [testResult, setTestResult] = useState<Record<string, boolean | null>>({})
  const [showDescarga, setShowDescarga] = useState(false)

  useEffect(() => {
    Promise.all([getImpresoras(), getCategorias()]).then(([imps, cats]) => {
      setImpresoras(imps)
      setCategorias(cats)
    })
  }, [])

  const abrirNuevo = () => { setForm(emptyForm()); setEditando(null) }
  const abrirEditar = (imp: Impresora) => { setEditando(imp); setForm({ ...imp }) }
  const cancelar = () => { setForm(null); setEditando(null) }

  const guardar = async () => {
    if (!form || !form.nombre || !form.ip) return
    setSaving(true)
    const data = editando ? { ...form, id: editando.id } : form
    await upsertImpresora(data as Impresora)
    const imps = await getImpresoras()
    setImpresoras(imps)
    cancelar()
    setSaving(false)
  }

  const eliminar = async (id: string) => {
    if (!confirm('¿Eliminar esta impresora?')) return
    await deleteImpresora(id)
    setImpresoras(prev => prev.filter(i => i.id !== id))
  }

  const toggleActiva = async (imp: Impresora) => {
    await upsertImpresora({ ...imp, activa: !imp.activa })
    setImpresoras(prev => prev.map(i => i.id === imp.id ? { ...i, activa: !i.activa } : i))
  }

  const handleTest = async (imp: Impresora) => {
    setTesting(imp.id)
    setTestResult(r => ({ ...r, [imp.id]: null }))
    const ok = await testImpresora(imp)
    if (!ok) {
      // Fallback: print test via browser
      printVentana(`<div style="font-family:monospace;padding:12px">
        <b>TEST - Frankfurt Els Tr3s</b><br>
        ${imp.nombre} (${imp.tipo})<br>
        IP: ${imp.ip}:${imp.puerto}<br>
        <br>Si ves esto, la impresión funciona.
      </div>`)
    }
    setTestResult(r => ({ ...r, [imp.id]: ok }))
    setTesting(null)
  }

  const toggleCategoria = (catId: string) => {
    if (!form) return
    const ids = form.categorias_ids.includes(catId)
      ? form.categorias_ids.filter(id => id !== catId)
      : [...form.categorias_ids, catId]
    setForm(f => f && ({ ...f, categorias_ids: ids }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-gray-400 text-sm font-medium">← Admin</Link>
            <span className="font-black text-lg">🖨️ Impresoras</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowDescarga(true)}
              className="flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-700 transition-colors">
              🖥️ Descargar para Windows
            </button>
            <button onClick={abrirNuevo}
              className="bg-accent text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-accent-dark transition-colors">
              + Añadir impresora
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-5 py-6">
        {/* Formulario */}
        {form && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
            <h3 className="font-bold mb-5">{editando ? 'Editar impresora' : 'Nueva impresora'}</h3>

            {/* Protocolo/Driver */}
            <div className="mb-5">
              <label className="block text-xs font-semibold mb-2 text-gray-500">Tipo de impresora</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PROTOCOLOS.map(p => (
                  <button key={p.value} type="button"
                    onClick={() => setForm(f => f && ({ ...f, protocolo: p.value, puerto: p.value === 'epson' ? 8008 : 9100 }))}
                    className={`flex flex-col gap-1 p-3 rounded-2xl border-2 transition-all text-left ${form.protocolo === p.value ? 'border-accent bg-accent/5' : 'border-gray-200'}`}>
                    <span className="text-xl">{p.icon}</span>
                    <span className="text-sm font-bold">{p.label}</span>
                    <span className="text-xs text-gray-400 leading-tight">{p.desc}</span>
                  </button>
                ))}
              </div>
              {form.protocolo && (
                <div className="mt-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-xs text-amber-800">
                  ℹ️ {PROTOCOLOS.find(p => p.value === form.protocolo)?.setup}
                </div>
              )}
            </div>

            {/* Rol */}
            <div className="mb-4">
              <label className="block text-xs font-semibold mb-2 text-gray-500">Rol de la impresora</label>
              <div className="grid grid-cols-3 gap-3">
                {TIPOS.map(t => (
                  <button key={t.value} type="button" onClick={() => setForm(f => f && ({ ...f, tipo: t.value }))}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all text-center ${form.tipo === t.value ? 'border-accent bg-accent/5' : 'border-gray-200'}`}>
                    <span className="text-2xl">{t.icon}</span>
                    <span className="text-sm font-bold">{t.label}</span>
                    <span className="text-xs text-gray-400 leading-tight">{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-500">Nombre *</label>
                <input value={form.nombre} onChange={e => setForm(f => f && ({ ...f, nombre: e.target.value }))}
                  placeholder="Ej: Bixolon Cocina"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-accent" />
              </div>
              {form.protocolo !== 'ventana' && (
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-500">
                    {form.protocolo === 'bixolon' ? 'IP de la impresora (opcional)' : 'Dirección IP *'}
                  </label>
                  <input value={form.ip} onChange={e => setForm(f => f && ({ ...f, ip: e.target.value }))}
                    placeholder="192.168.1.100"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-accent font-mono" />
                </div>
              )}
              {form.protocolo === 'epson' && (
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-500">Puerto (Epson: 8008)</label>
                  <input type="number" value={form.puerto}
                    onChange={e => setForm(f => f && ({ ...f, puerto: parseInt(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-accent font-mono" />
                </div>
              )}
            </div>

            {/* Categorías asignadas */}
            {form.tipo !== 'ticket' && (
              <div className="mb-5">
                <label className="block text-xs font-semibold mb-2 text-gray-500">
                  Categorías que imprime esta impresora
                  <span className="ml-1 font-normal text-gray-400">(vacío = todas)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {categorias.map(c => (
                    <button key={c.id} type="button" onClick={() => toggleCategoria(c.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                        form.categorias_ids.includes(c.id)
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-gray-200 text-gray-600'
                      }`}>
                      {c.icono} {c.nombre}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={guardar} disabled={saving}
                className="bg-accent text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent-dark disabled:opacity-50 transition-colors">
                {saving ? 'Guardando...' : editando ? 'Guardar cambios' : 'Añadir impresora'}
              </button>
              <button onClick={cancelar}
                className="bg-gray-100 text-gray-600 px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Lista */}
        {impresoras.length === 0 && !form ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
            <div className="text-5xl mb-3">🖨️</div>
            <p className="font-semibold text-gray-700 mb-1">Sin impresoras configuradas</p>
            <p className="text-sm text-gray-400 mb-5">Añade una impresora de red para imprimir tickets automáticamente</p>
            <button onClick={abrirNuevo}
              className="bg-accent text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent-dark transition-colors">
              + Añadir primera impresora
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {impresoras.map(imp => {
              const tipo = TIPOS.find(t => t.value === imp.tipo)
              const cats = imp.categorias_ids.length > 0
                ? categorias.filter(c => imp.categorias_ids.includes(c.id))
                : []
              const result = testResult[imp.id]
              return (
                <div key={imp.id} className={`bg-white rounded-2xl border shadow-sm p-5 ${!imp.activa ? 'opacity-50' : 'border-gray-100'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{tipo?.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold">{imp.nombre}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                            imp.tipo === 'cocina' ? 'bg-orange-100 text-orange-700' :
                            imp.tipo === 'barra' ? 'bg-blue-100 text-blue-700' :
                            'bg-green-100 text-green-700'
                          }`}>{tipo?.label}</span>
                          {result !== undefined && result !== null && (
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${result ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {result ? '✓ Conectada' : '⚠ Ventana abierta'}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 font-mono">
                          {imp.protocolo === 'ventana' ? 'Ventana del navegador' : `${imp.ip || 'USB'}:${imp.puerto}`}
                          {' · '}<span className="not-italic">{PROTOCOLOS.find(p => p.value === imp.protocolo)?.label}</span>
                        </p>
                        {cats.length > 0 && (
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {cats.map(c => (
                              <span key={c.id} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg">{c.icono} {c.nombre}</span>
                            ))}
                          </div>
                        )}
                        {cats.length === 0 && imp.tipo !== 'ticket' && (
                          <p className="text-xs text-gray-400 mt-0.5">Imprime todos los productos</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => handleTest(imp)} disabled={testing === imp.id}
                        className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-xl font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50">
                        {testing === imp.id ? '...' : '🖨 Test'}
                      </button>
                      <button onClick={() => toggleActiva(imp)}
                        className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                          imp.activa ? 'bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700' : 'bg-gray-100 text-gray-500 hover:bg-green-100 hover:text-green-700'
                        }`}>
                        {imp.activa ? 'Activa' : 'Inactiva'}
                      </button>
                      <button onClick={() => abrirEditar(imp)} className="text-xs text-gray-500 hover:text-gray-900 font-medium px-2">Editar</button>
                      <button onClick={() => eliminar(imp.id)} className="text-xs text-red-400 hover:text-red-600 font-medium px-2">Eliminar</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {showDescarga && <ModalDescargaWindows onClose={() => setShowDescarga(false)} />}
    </div>
  )
}

export default function ImpresorasPage() {
  return <AdminGuard><ImpresorasContent /></AdminGuard>
}
