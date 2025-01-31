import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from "fs"
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     https: {
//       key: fs.readFileSync('../../localhost-key.pem'),
//       cert: fs.readFileSync('../../localhost-cert.pem')
//     },
//     port: 5173 // Or whichever port you prefer
//   }
// })

export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
})