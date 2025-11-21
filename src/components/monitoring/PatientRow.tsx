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

  const riskColors = {
    red: 'bg-risk-red/10 border-risk-red text-risk-red',
    yellow: 'bg-risk-amber/10 border-risk-amber text-risk-amber',
    green: 'bg-risk-green/10 border-risk-green text-risk-green'
  };

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded border ${
        riskColors[patient.riskLevel]
      } hover:bg-surface-dark transition-colors duration-100`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">{patient.name}</h3>
          <div className="text-sm text-text-secondary space-x-2">
            <span>{patient.surgeryType}</span>
            <span>·</span>
            <span className="font-mono">Day {daysPostOp}</span>
          </div>
        </div>

        <div className="text-right">
          <div className="font-mono text-sm">
            {formatDistanceToNow(patient.lastCheckIn, { addSuffix: true })}
          </div>
          {patient.riskTags?.map(tag => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-surface-dark ml-2"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}
