import { useState, useEffect, useCallback } from 'react'

const API = '/api'

export function useInsumos() {
  const [insumos, setInsumos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [simbolos, setSimbolos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filtros, setFiltros] = useState({ categoria: 'todas', texto: '' })

  const fetchInsumos = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (filtros.categoria && filtros.categoria !== 'todas') params.set('categoria', filtros.categoria)
      if (filtros.texto) params.set('texto', filtros.texto)
      const res = await fetch(`${API}/insumos?${params}`)
      if (!res.ok) throw new Error(await res.text())
      setInsumos(await res.json())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [filtros])

  useEffect(() => {
    fetchInsumos()
  }, [fetchInsumos])

  useEffect(() => {
    Promise.all([
      fetch(`${API}/categorias`).then(r => r.json()),
      fetch(`${API}/simbolos`).then(r => r.json()),
    ]).then(([cats, syms]) => {
      setCategorias(cats)
      setSimbolos(syms)
    })
  }, [])

  async function crearInsumo(datos) {
    const res = await fetch(`${API}/insumos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Error al crear')
    }
    await fetchInsumos()
  }

  async function actualizarInsumo(id, datos) {
    const res = await fetch(`${API}/insumos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Error al actualizar')
    }
    await fetchInsumos()
  }

  async function eliminarInsumo(id) {
    const res = await fetch(`${API}/insumos/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Error al eliminar')
    }
    await fetchInsumos()
  }

  return {
    insumos,
    categorias,
    simbolos,
    loading,
    error,
    filtros,
    setFiltros,
    crearInsumo,
    actualizarInsumo,
    eliminarInsumo,
  }
}
