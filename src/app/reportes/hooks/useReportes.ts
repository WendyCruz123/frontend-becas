'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchWithAuth } from '@/lib/fetchWithAuth'
import type { EstadoReporteFiltro, ModoEstadoReporte, Postulacion } from '../types'

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000'
const LIMIT = 10

export function useReportes(enabled: boolean) {
  const [rows, setRows] = useState<Postulacion[]>([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
const [estadoFiltro, setEstadoFiltro] = useState<EstadoReporteFiltro>('TODOS')
const [modoEstado, setModoEstado] = useState<ModoEstadoReporte>('ACTUAL')
  const [page, setPage] = useState(0)
  const [year, setYear] = useState<number | ''>('')
  const [searchEstudiante, setSearchEstudiante] = useState('')
  const [searchBeca, setSearchBeca] = useState('')

  const loadData = useCallback(async () => {
    if (!enabled) return

    setLoading(true)

    try {
      const params = new URLSearchParams()
      params.set('offset', String(page * LIMIT))
      params.set('limit', String(LIMIT))

      if (year) {
        params.set('year', String(year))
      }

      if (searchEstudiante.trim()) {
  params.set('searchEstudiante', searchEstudiante.trim())
}

if (searchBeca.trim()) {
  params.set('searchBeca', searchBeca.trim())
}

      params.set('excludeApproved', 'false')
if (estadoFiltro !== 'TODOS') {
  params.set('estado', estadoFiltro)
}

params.set('modoEstado', modoEstado)
      const res = await fetchWithAuth(`${BACKEND}/postulaciones/admin?${params.toString()}`)
      const data = await res.json()

      setRows(data.rows || [])
      setCount(data.count || 0)
    } catch (error: unknown) {
      console.error('Error cargando postulaciones:', error)
      setRows([])
      setCount(0)
    } finally {
      setLoading(false)
    }
  }, [enabled, page, year, searchEstudiante, searchBeca, estadoFiltro, modoEstado])

  useEffect(() => {
    loadData()
  }, [loadData])

  const totalPages = useMemo(() => Math.ceil(count / LIMIT), [count])

  const onChangeYear = (value: string) => {
    setPage(0)
    setYear(value ? Number(value) : '')
  }

  const onChangeSearchEstudiante = (value: string) => {
    setPage(0)
    setSearchEstudiante(value)
  }

  const onChangeSearchBeca = (value: string) => {
    setPage(0)
    setSearchBeca(value)
  }

  const onSearch = () => {
    setPage(0)
    loadData()
  }

  const goPrevPage = () => {
    setPage((prev) => Math.max(0, prev - 1))
  }

  const goNextPage = () => {
    if (page + 1 < totalPages) {
      setPage((prev) => prev + 1)
    }
  }

  return {
    rows,
    count,
    loading,
    page,
    year,
    searchEstudiante,
    searchBeca,
    totalPages,
    limit: LIMIT,

    setPage,
    onChangeYear,
    onChangeSearchEstudiante,
    onChangeSearchBeca,
    onSearch,
    goPrevPage,
    goNextPage,
    reload: loadData,
    estadoFiltro,
    setEstadoFiltro,
    modoEstado,
    setModoEstado,
  }
}