import dotenv from 'dotenv'

dotenv.config()

function required(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required env variable: ${name}`)
  }
  return value
}

export const env = {
  botToken: required('BOT_TOKEN'),
  apiUrl: (process.env.API_URL ?? 'http://localhost:4000').replace(/\/$/, ''),
}
