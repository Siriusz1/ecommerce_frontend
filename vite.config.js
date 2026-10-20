import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Tailwind v4 roda como plugin do Vite: não existe tailwind.config.js.
  // Os tokens (cores, fontes, espaçamentos) ficam em src/index.css, dentro de @theme.
  plugins: [react(), tailwindcss()],
})
