// لایه‌ی ذخیره‌سازی محلی روی IndexedDB — بدون هیچ وابستگی به شبکه یا سرور.
// همه‌ی داده‌ها (شامل عکس‌ها به‌صورت dataURL) در مرورگر خود کاربر باقی می‌مانند.

const DB_NAME = 'mushroomFieldApp'
const DB_VERSION = 1
const TRIPS_STORE = 'trips'
const SAMPLES_STORE = 'samples'

let dbPromise = null

function openDB() {
  if (dbPromise) return dbPromise
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)

    req.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(TRIPS_STORE)) {
        const trips = db.createObjectStore(TRIPS_STORE, { keyPath: 'id' })
        trips.createIndex('date', 'date')
      }
      if (!db.objectStoreNames.contains(SAMPLES_STORE)) {
        const samples = db.createObjectStore(SAMPLES_STORE, { keyPath: 'id' })
        samples.createIndex('tripId', 'tripId')
      }
    }

    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
  return dbPromise
}

function tx(storeName, mode) {
  return openDB().then((db) => db.transaction(storeName, mode).objectStore(storeName))
}

function wrap(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export const genId = () =>
  (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`)

// ---------- برنامه‌های قارچ‌نگری (Trips) ----------

export async function getAllTrips() {
  const store = await tx(TRIPS_STORE, 'readonly')
  const all = await wrap(store.getAll())
  return all.sort((a, b) => (b.date || '').localeCompare(a.date || '') || b.createdAt - a.createdAt)
}

export async function getTrip(id) {
  const store = await tx(TRIPS_STORE, 'readonly')
  return wrap(store.get(id))
}

export async function saveTrip(trip) {
  const store = await tx(TRIPS_STORE, 'readwrite')
  await wrap(store.put(trip))
  return trip
}

export async function deleteTrip(id) {
  const samplesStore = await tx(SAMPLES_STORE, 'readwrite')
  const idx = samplesStore.index('tripId')
  const keys = await wrap(idx.getAllKeys(id))
  await Promise.all(keys.map((k) => wrap(samplesStore.delete(k))))
  const tripsStore = await tx(TRIPS_STORE, 'readwrite')
  return wrap(tripsStore.delete(id))
}

// ---------- نمونه‌های قارچ (Samples) ----------

export async function getSamplesByTrip(tripId) {
  const store = await tx(SAMPLES_STORE, 'readonly')
  const idx = store.index('tripId')
  const all = await wrap(idx.getAll(tripId))
  return all.sort((a, b) => (a.order || 0) - (b.order || 0))
}

export async function getSample(id) {
  const store = await tx(SAMPLES_STORE, 'readonly')
  return wrap(store.get(id))
}

export async function saveSample(sample) {
  const store = await tx(SAMPLES_STORE, 'readwrite')
  await wrap(store.put(sample))
  return sample
}

export async function deleteSample(id) {
  const store = await tx(SAMPLES_STORE, 'readwrite')
  return wrap(store.delete(id))
}

export async function nextSampleOrder(tripId) {
  const samples = await getSamplesByTrip(tripId)
  return samples.length ? Math.max(...samples.map((s) => s.order || 0)) + 1 : 1
}

export async function countSamples(tripId) {
  const store = await tx(SAMPLES_STORE, 'readonly')
  const idx = store.index('tripId')
  return wrap(idx.count(tripId))
}
