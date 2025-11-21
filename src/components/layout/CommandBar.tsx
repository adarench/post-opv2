import React from 'react';
import { usePatients } from '../../hooks/usePatients';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function CommandBar() {
  const { stats } = usePatients();
  const navigate = useNavigate();
  const { logOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await logOut();
      navigate('/login');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <header className="bg-surface border-b border-border bg-surface-gradient shadow-inner-subtle">
      <div className="h-14 px-4 flex items-center justify-between">
        {/* System Status - Command Console Style */}
        <div className="flex items-center space-x-8">
          <div className="font-mono text-sm tracking-tight">
            {stats ? (
              <div className="flex items-center space-x-4">
                <span className="text-text-secondary">SYSTEM STATUS:</span>
                <div className="space-x-3">
                  <span>{stats.total} ACTIVE</span>
                  <span className="text-risk-red font-medium">{stats.red} RED</span>
                  <span className="text-risk-amber font-medium">{stats.yellow} AMBER</span>
                  <span className="text-risk-green font-medium">{stats.green} STABLE</span>
                </div>
              </div>
            ) : (
              <span className="text-text-secondary">INITIALIZING...</span>
            )}
          </div>

          {/* View Controls - Terminal Style */}
          <nav className="flex">
            <button className="px-4 py-1 text-sm font-mono border-r border-border hover:bg-surface-dark transition-colors duration-100 text-brand">TODAY</button>
            <button className="px-4 py-1 text-sm font-mono border-r border-border hover:bg-surface-dark transition-colors duration-100 text-text-secondary">3D</button>
            <button className="px-4 py-1 text-sm font-mono hover:bg-surface-dark transition-colors duration-100 text-text-secondary">ALL</button>
          </nav>
        </div>

        {/* Command Controls */}
        <div className="flex items-center space-x-2">
          {/* Filters - Glass Console Style */}
          <div className="flex items-center bg-surface-dark rounded border border-border shadow-inner-subtle px-1">
            <select className="bg-transparent text-sm py-1 px-2 border-r border-border">
              <option>ALL SURGEONS</option>
            </select>
            <select className="bg-transparent text-sm py-1 px-2 border-r border-border">
              <option>ALL PROCEDURES</option>
            </select>
            <select className="bg-transparent text-sm py-1 px-2">
              <option>ALL RISK LEVELS</option>
              <option value="red" className="text-risk-red">RED ONLY</option>
              <option value="yellow" className="text-risk-amber">AMBER & RED</option>
            </select>
          </div>

          {/* Action Controls */}
          <div className="flex items-center space-x-2 pl-2">
            <button
              onClick={() => navigate('/enroll')}
              className="px-4 py-1.5 bg-brand/10 border border-brand/20 rounded text-brand text-sm font-mono hover:bg-brand/20 transition-colors duration-100"
            >
              + NEW PATIENT
            </button>
            <button
              onClick={handleSignOut}
              className="px-4 py-1.5 text-text-secondary text-sm font-mono hover:bg-surface-dark transition-colors duration-100 rounded"
            >
              SIGN OUT
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
