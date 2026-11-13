import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Production builds are served from https://veronicaloza.github.io/SkinCare/,
// so assets need that prefix. The dev server keeps serving from the root.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/SkinCare/' : '/',
  plugins: [react()],
  server: { port: 5173 },
}));
