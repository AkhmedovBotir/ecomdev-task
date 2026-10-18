const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(
  /\/$/,
  '',
) ?? 'http://localhost:4000'

async function readError(response: Response): Promise<string> {
  const text = await response.text()
  if (!text) return `Request failed: ${response.status}`
  try {
    const json = JSON.parse(text) as { error?: string; message?: string }
    return json.error ?? json.message ?? text
  } catch {
    return text
  }
}

export async function apiFetch<T = void>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  if (!response.ok) {
    throw new Error(await readError(response))
  }

  if (response.status === 204) {
    return undefined as T
  }

  const text = await response.text()
  if (!text) {
    return undefined as T
  }

  return JSON.parse(text) as T
}

export { API_URL }
