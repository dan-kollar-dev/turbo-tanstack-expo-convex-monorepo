import { Link, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({ component: HomePage });

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
          tanstack-expo-convex-monorepo
        </h1>
        <Link
          to="/tasks"
          className="inline-block px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors"
        >
          Go to Tasks
        </Link>
      </div>
    </div>
  );
}
