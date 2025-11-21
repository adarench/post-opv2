import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await signIn(formData.email, formData.password);
      navigate('/');
    } catch (error) {
      setError('ACCESS DENIED: Invalid credentials');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col">
      {/* Terminal-Style Header */}
      <header className="h-14 bg-surface border-b border-border flex items-center px-4">
        <div className="font-mono text-sm tracking-tight text-text-secondary">
          POST-OP MONITORING SYSTEM v2.0
        </div>
      </header>

      {/* Login Console */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* System Status Banner */}
          <div className="mb-8 font-mono text-sm">
            <div className="flex items-center space-x-2 text-text-secondary">
              <span className="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
              <span>SYSTEM READY</span>
            </div>
          </div>

          {/* Auth Terminal */}
          <div className="bg-surface border border-border rounded-lg shadow-inner-subtle overflow-hidden">
            <div className="px-4 py-3 bg-surface-dark border-b border-border">
              <div className="font-mono text-sm text-text-secondary">STAFF AUTHENTICATION REQUIRED</div>
            </div>

            <div className="p-6 space-y-6">
              {error && (
                <div className="font-mono text-sm text-risk-red bg-risk-red/5 border border-risk-red/10 rounded px-3 py-2">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-mono text-sm text-text-secondary mb-2">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      email: e.target.value
                    }))}
                    className="w-full bg-surface-dark rounded px-3 py-2 border border-border font-mono text-sm"
                    placeholder="staff@clinic.com"
                  />
                </div>

                <div>
                  <label className="block font-mono text-sm text-text-secondary mb-2">
                    PASSWORD
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      password: e.target.value
                    }))}
                    className="w-full bg-surface-dark rounded px-3 py-2 border border-border font-mono text-sm"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 rounded bg-brand/10 border border-brand/20 text-brand font-mono text-sm hover:bg-brand/20 transition-colors duration-100 disabled:opacity-50 mt-6"
                >
                  {loading ? 'AUTHENTICATING...' : 'AUTHENTICATE'}
                </button>
              </form>
            </div>
          </div>

          {/* System Info */}
          <div className="mt-8 font-mono text-xs text-text-secondary space-y-1">
            <div>SECURE CONNECTION ESTABLISHED</div>
            <div>FIREBASE AUTH: READY</div>
            <div>EMULATORS: ACTIVE</div>
          </div>
        </div>
      </div>
    </div>
  );
}
