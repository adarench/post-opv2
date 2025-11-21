import React from 'react';
import { Patient } from '../../types/models';
import { formatDistanceToNow } from 'date-fns';

interface PatientRowProps {
  patient: Patient;
  onClick: () => void;
}

export function PatientRow({ patient, onClick }: PatientRowProps) {
  const daysPostOp = Math.floor(
    (Date.now() - patient.surgeryDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Risk level styling
  const riskStyles = {
    red: {
      bg: 'bg-risk-red/5 hover:bg-risk-red/10',
      border: 'border-risk-red/20',
      text: 'text-risk-red',
      glow: 'shadow-glow-risk-red',
      dot: 'bg-risk-red',
    },
    yellow: {
      bg: 'bg-risk-amber/5 hover:bg-risk-amber/10',
      border: 'border-risk-amber/20',
      text: 'text-risk-amber',
      glow: 'shadow-glow-risk-amber',
      dot: 'bg-risk-amber',
    },
    green: {
      bg: 'bg-risk-green/5 hover:bg-risk-green/10',
      border: 'border-risk-green/20',
      text: 'text-risk-green',
      glow: '',
      dot: 'bg-risk-green',
    },
  };

  const style = riskStyles[patient.riskLevel];

  return (
    <button
      onClick={onClick}
      className={`group w-full text-left px-4 py-3 rounded border ${style.bg} ${style.border} ${style.glow} transition-all duration-100`}
    >
      {/* Main Signal Line */}
      <div className="flex items-center space-x-4">
        {/* Risk Indicator */}
        <div className="flex-none">
          <div className={`w-2 h-2 rounded-full ${style.dot} ${patient.riskLevel === 'red' ? 'animate-pulse' : ''}`} />
        </div>

        {/* Patient Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline space-x-3">
            <h3 className="font-medium truncate">{patient.name}</h3>
            <div className="flex-none font-mono text-xs text-text-secondary">
              DAY {daysPostOp}
            </div>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <span className="text-text-secondary truncate">{patient.surgeryType}</span>
            {patient.riskTags?.length > 0 && (
              <div className="flex items-center space-x-2">
                {patient.riskTags.map(tag => (
                  <span
                    key={tag}
                    className={`inline-flex items-center px-1.5 py-0.5 rounded-sm text-xs font-mono ${style.text} ${style.bg}`}
                  >
                    {tag.replace('RISK_', '')}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Metrics & Timestamps */}
        <div className="flex-none text-right">
          <div className="font-mono text-xs text-text-secondary">
            {formatDistanceToNow(patient.lastCheckIn, { addSuffix: true }).toUpperCase()}
          </div>
          {/* Microtrends could go here */}
        </div>
      </div>
    </button>
  );
}
