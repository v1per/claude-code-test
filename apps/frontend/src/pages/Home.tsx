import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export default function Home() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Welcome to Notes App
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          A simple and elegant way to manage your notes
        </p>

        <div className="flex justify-center gap-4">
          {isAuthenticated ? (
            <Link to="/notes" className="btn-primary text-lg px-8 py-3">
              Go to My Notes
            </Link>
          ) : (
            <>
              <Link to="/signup" className="btn-primary text-lg px-8 py-3">
                Get Started
              </Link>
              <Link to="/login" className="btn-secondary text-lg px-8 py-3">
                Login
              </Link>
            </>
          )}
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="card">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">Create Notes</h3>
            <p className="text-gray-600">
              Quickly create and organize your thoughts
            </p>
          </div>

          <div className="card">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2">Secure</h3>
            <p className="text-gray-600">
              Your notes are protected with JWT authentication
            </p>
          </div>

          <div className="card">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Fast</h3>
            <p className="text-gray-600">
              Built with modern technologies for optimal performance
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
