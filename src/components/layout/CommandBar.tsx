import React from 'react';
import { usePatients } from '../../hooks/usePatients';

export function CommandBar() {
  const { stats } = usePatients();

  return (
    <div className="bg-surface border-b border-surface-dark">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          {/* System Status */}
          <div className="text-sm font-mono">
            {stats ? (
              <span>
                {stats.total} active patients · 
                <span className="text-risk-red">{stats.red} Red</span> · 
                <span className="text-risk-amber">{stats.yellow} Yellow</span> · 
                <span className="text-risk-green">{stats.green} Green</span>
              </span>
            ) : (
              'Loading...'
            )}
          </div>

          {/* View Selector */}
          <nav className="flex space-x-4">
            <button className="px-3 py-1 rounded text-sm hover:bg-surface-dark">Today</button>
            <button className="px-3 py-1 rounded text-sm hover:bg-surface-dark">Last 3 Days</button>
            <button className="px-3 py-1 rounded text-sm hover:bg-surface-dark">All Active</button>
          </nav>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <select className="bg-surface-dark text-sm rounded px-2 py-1 border border-surface">
            <option>All Surgeons</option>
          </select>
          <select className="bg-surface-dark text-sm rounded px-2 py-1 border border-surface">
            <option>All Procedures</option>
          </select>
          <select className="bg-surface-dark text-sm rounded px-2 py-1 border border-surface">
            <option>All Risk Levels</option>
            <option value="red">Red Only</option>
            <option value="yellow">Yellow & Red</option>
          </select>
        </div>
      </div>
    </div>
  );
}
