import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const FILE = path.join(DATA_DIR, 'workouts.json')

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, JSON.stringify({ nextId: 1, items: [] }, null, 2))

type Workout = {
  id?: number
  title: string
  notes?: string
  date?: string
  duration?: number
}

function readStore(): { nextId: number; items: Workout[] } {
  const raw = fs.readFileSync(FILE, 'utf8')
  return JSON.parse(raw)
}

function writeStore(store: { nextId: number; items: Workout[] }) {
  fs.writeFileSync(FILE, JSON.stringify(store, null, 2))
}

const getAll = (): Workout[] => {
  const s = readStore()
  // return in reverse order (newest first)
  return [...s.items].sort((a, b) => (b.id || 0) - (a.id || 0))
}

const getById = (id: number): Workout | undefined => {
  const s = readStore()
  return s.items.find((i) => i.id === id)
}

const create = (w: Workout): Workout => {
  const s = readStore()
  const id = s.nextId++
  const item = { id, ...w }
  s.items.push(item)
  writeStore(s)
  return item
}

const update = (id: number, w: Workout): Workout | null => {
  const s = readStore()
  const idx = s.items.findIndex((i) => i.id === id)
  if (idx === -1) return null
  const updated = { id, ...w }
  s.items[idx] = updated
  writeStore(s)
  return updated
}

const remove = (id: number): boolean => {
  const s = readStore()
  const idx = s.items.findIndex((i) => i.id === id)
  if (idx === -1) return false
  s.items.splice(idx, 1)
  writeStore(s)
  return true
}

export { Workout, getAll, getById, create, update, remove }
