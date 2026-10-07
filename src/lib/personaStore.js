const KEY = 'rpp.savedPersonas'

export function listPersonas() {
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function savePersona(persona) {
  const all = listPersonas()
  const withId = { ...persona, id: persona.id || `p_${Date.now()}` }
  const idx = all.findIndex((p) => p.id === withId.id)
  if (idx >= 0) all[idx] = withId
  else all.push(withId)
  window.localStorage.setItem(KEY, JSON.stringify(all))
  return withId
}

export function deletePersona(id) {
  const all = listPersonas().filter((p) => p.id !== id)
  window.localStorage.setItem(KEY, JSON.stringify(all))
}