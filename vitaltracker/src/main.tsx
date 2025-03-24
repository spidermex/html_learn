
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeStore } from './lib/store.ts'

// Inicializar el store con datos de ejemplo
initializeStore();

createRoot(document.getElementById("root")!).render(<App />);
