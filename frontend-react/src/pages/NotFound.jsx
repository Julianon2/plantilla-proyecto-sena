import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-4 py-20">
      <h1 className="font-display font-bold text-7xl tracking-tighter text-gray-300">404</h1>
      <p className="text-gray-700">Esta página no existe.</p>
      <Link to="/" className="font-semibold underline hover:text-accent transition-colors">
        Volver al inicio
      </Link>
    </div>
  )
}

export default NotFound