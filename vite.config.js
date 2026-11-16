import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // اسم مستودع GitHub الذي أنشأناه
  base: '/love-link/',
})
