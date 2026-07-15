import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">ResumeForge AI</h1>
        <div className="flex items-center gap-4">
          <span>Welcome, {user?.name || user?.email}</span>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto space-y-6">
        <section className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700">
          <h2 className="text-xl font-semibold mb-4">Your Resumes</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">You don't have any resumes yet.</p>
          
          <button 
            onClick={() => navigate('/editor')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors"
          >
            Create New Resume
          </button>
        </section>
      </main>
    </div>
  );
}
