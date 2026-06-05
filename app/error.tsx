'use client'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-8 max-w-2xl w-full">
        <h1 className="text-xl font-black text-red-600 mb-4">Error detectado</h1>
        <div className="bg-red-50 rounded-xl p-4 mb-4 font-mono text-sm text-red-800 break-all whitespace-pre-wrap">
          <strong>{error.name}: </strong>{error.message}
          {error.digest && <div className="mt-2 text-xs text-red-500">Digest: {error.digest}</div>}
        </div>
        {error.stack && (
          <details className="mb-4">
            <summary className="text-sm text-gray-500 cursor-pointer mb-2">Stack trace</summary>
            <pre className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl overflow-auto max-h-48">
              {error.stack}
            </pre>
          </details>
        )}
        <button
          onClick={reset}
          className="bg-accent text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-accent-dark transition-colors"
        >
          Reintentar
        </button>
      </div>
    </div>
  )
}
