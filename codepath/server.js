// Local stand-in for the Vercel function in api/chat.js, used with `npm run dev`.
// Run it with `node server.js`; Vite forwards /api requests here (see vite.config.ts).
import express from 'express'
import dotenv from 'dotenv'
import chatHandler from './api/chat.js'

dotenv.config()
// Older local .env files used the VITE_ prefix for the key.
process.env.ANTHROPIC_API_KEY ??= process.env.VITE_ANTHROPIC_API_KEY

const app = express()
app.use(express.json({ limit: '200kb' }))
app.post('/api/chat', chatHandler)

app.listen(3001, () => console.log('>> PROXY RUNNING ON PORT 3001'))
