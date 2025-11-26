import React, { useEffect, useState } from 'react'

type Health = {
  status: string
  time: string
}

export default function App() {
  const [health, setHealth] = useState<Health | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    fetch('http://localhost:4000/api/health', { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data: Health) => setHealth(data))
      .catch((err: any) => {
        if (err.name !== 'AbortError') setError(String(err.message || err))
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [])

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
      <h1>OctoFit</h1>
      <p>Welcome — this is the OctoFit starter app.</p>
      <p>Frontend: React + Vite (TypeScript). Backend: Express (TypeScript).</p>

      <section>
        <h2>API health</h2>
        {loading && <p>Loading health...</p>}
        {error && (
          <p style={{ color: 'crimson' }}>Error fetching health: {error}</p>
        )}
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
        <p>
          Quick link: <code>/api/health</code>
        </p>
      </section>
    </div>
  )
}
