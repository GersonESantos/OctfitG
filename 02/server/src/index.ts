import express from 'express'
import cors from 'cors'
import { getAll, getById, create as createWorkout, update as updateWorkout, remove as removeWorkout, Workout } from './db'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

app.get('/api/hello', (_req, res) => {
  res.json({ message: 'Hello from OctoFit API' })
})

// Workouts CRUD
app.get('/api/workouts', (_req, res) => {
  const rows = getAll()
  res.json(rows)
})

app.get('/api/workouts/:id', (req, res) => {
  const id = Number(req.params.id)
  if (Number.isNaN(id)) return res.status(400).json({ error: 'invalid id' })
  const w = getById(id)
  if (!w) return res.status(404).json({ error: 'not found' })
  res.json(w)
})

app.post('/api/workouts', (req, res) => {
  const body = req.body as Workout
  if (!body || !body.title) return res.status(400).json({ error: 'title is required' })
  const created = createWorkout(body)
  res.status(201).json(created)
})

app.put('/api/workouts/:id', (req, res) => {
  const id = Number(req.params.id)
  if (Number.isNaN(id)) return res.status(400).json({ error: 'invalid id' })
  const body = req.body as Workout
  if (!body || !body.title) return res.status(400).json({ error: 'title is required' })
  const updated = updateWorkout(id, body)
  if (!updated) return res.status(404).json({ error: 'not found' })
  res.json(updated)
})

app.delete('/api/workouts/:id', (req, res) => {
  const id = Number(req.params.id)
  if (Number.isNaN(id)) return res.status(400).json({ error: 'invalid id' })
  const ok = removeWorkout(id)
  if (!ok) return res.status(404).json({ error: 'not found' })
  res.status(204).send()
})

const port = process.env.PORT ? Number(process.env.PORT) : 4000
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`OctoFit server listening on http://localhost:${port}`)
})
