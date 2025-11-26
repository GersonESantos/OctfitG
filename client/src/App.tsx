import React, { useEffect, useState } from 'react'

type Health = {
  status: string
  time: string
}

type Workout = {
  id?: number
  title: string
  notes?: string
  date?: string
  duration?: number
}

const API = (import.meta as any)?.env?.VITE_API_BASE || 'http://localhost:4000'

export default function App() {
  const [health, setHealth] = useState<Health | null>(null)
  const [loadingHealth, setLoadingHealth] = useState(true)
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loadingWorkouts, setLoadingWorkouts] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<Workout>({ title: '' })
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    const ctl = new AbortController()
    setLoadingHealth(true)
    fetch(`${API}/api/health`, { signal: ctl.signal })
      .then((r) => r.json())
      .then((d: Health) => setHealth(d))
      .catch((e) => {
        if (e.name !== 'AbortError') setError(String(e.message || e))
      })
      .finally(() => setLoadingHealth(false))
    return () => ctl.abort()
  }, [])

  useEffect(() => {
    loadWorkouts()
  }, [])

  function loadWorkouts() {
    setLoadingWorkouts(true)
    fetch(`${API}/api/workouts`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((data: Workout[]) => setWorkouts(data))
      .catch((e) => setError(String(e.message || e)))
      .finally(() => setLoadingWorkouts(false))
  }

  function resetForm() {
    setForm({ title: '' })
    setEditingId(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      if (!form.title) return alert('Title is required')
      if (editingId == null) {
        const res = await fetch(`${API}/api/workouts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
      } else {
        const res = await fetch(`${API}/api/workouts/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
      }
      resetForm()
      loadWorkouts()
    } catch (err: any) {
      setError(String(err.message || err))
    }
  }

  async function handleDelete(id?: number) {
    if (!id) return
    if (!confirm('Deletar este treino?')) return
    try {
      const res = await fetch(`${API}/api/workouts/${id}`, { method: 'DELETE' })
      if (!res.ok && res.status !== 204) throw new Error(`HTTP ${res.status}`)
      loadWorkouts()
    } catch (err: any) {
      setError(String(err.message || err))
    }
  }

  function startEdit(w: Workout) {
    setEditingId(w.id || null)
    setForm({ title: w.title, notes: w.notes, date: w.date, duration: w.duration })
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
      <h1>OctoFit</h1>

      <section>
        <h2>API health</h2>
        {loadingHealth && <p>Loading health...</p>}
        {error && <p style={{ color: 'crimson' }}>Error: {error}</p>}
        {health && (
          <div>
            <p>
              <strong>Status:</strong> {health.status}
            </p>
            <p>
              <strong>Time (server):</strong> {health.time}
            </p>
          </div>
        )}
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Workouts</h2>
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ flex: 1 }}>
            <h3>{editingId ? 'Editar treino' : 'Novo treino'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 8 }}>
                <label>
                  Título<br />
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                    style={{ width: '100%' }}
                  />
                </label>
              </div>
              <div style={{ marginBottom: 8 }}>
                <label>
                  Notas<br />
                  <input
                    value={form.notes || ''}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </label>
              </div>
              <div style={{ marginBottom: 8 }}>
                <label>
                  Data<br />
                  <input
                    type="date"
                    value={form.date || ''}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </label>
              </div>
              <div style={{ marginBottom: 8 }}>
                <label>
                  Duração (min)<br />
                  <input
                    type="number"
                    value={form.duration ?? ''}
                    onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
                    style={{ width: 120 }}
                  />
                </label>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="submit">{editingId ? 'Salvar' : 'Criar'}</button>
                <button type="button" onClick={resetForm}>Limpar</button>
              </div>
            </form>
          </div>

          <div style={{ flex: 2 }}>
            <h3>Lista</h3>
            {loadingWorkouts && <p>Carregando...</p>}
            {!loadingWorkouts && workouts.length === 0 && <p>Nenhum treino.</p>}
            <ul>
              {workouts.map((w) => (
                <li key={w.id} style={{ marginBottom: 8 }}>
                  <strong>{w.title}</strong> {w.date && <em>({w.date})</em>}<br />
                  {w.notes && <span>{w.notes}<br /></span>}
                  {w.duration != null && <span>Duração: {w.duration} min<br /></span>}
                  <div style={{ marginTop: 4 }}>
                    <button onClick={() => startEdit(w)}>Editar</button>{' '}
                    <button onClick={() => handleDelete(w.id)}>Deletar</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
