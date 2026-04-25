import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-6 py-24 text-center">
      <div className="text-7xl font-extrabold text-ps-blueLight">404</div>
      <h1 className="text-2xl font-bold mt-4">Page not found</h1>
      <p className="text-ps-muted mt-2">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn-primary mt-6">Go home</Link>
    </div>
  );
}
