import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Archived v1 (black & white glyph journal). Run on its own: npm install && npm run dev
export default defineConfig({
  plugins: [react()],
  server: { port: 5174 },
});
