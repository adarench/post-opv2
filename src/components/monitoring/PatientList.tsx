import React from 'react';
import { Patient } from '../../types/models';
import { PatientRow } from './PatientRow';

interface PatientListProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
}

export function PatientList({ patients, onSelectPatient }: PatientListProps) {
  // Sort by risk level: red -> yellow -> green
  const sortedPatients = [...patients].sort((a, b) => {
    const riskOrder = { red: 0, yellow: 1, green: 2 };
    return (riskOrder[a.riskLevel] || 2) - (riskOrder[b.riskLevel] || 2);
  });

  // Group patients by risk level for visual separation
  const groupedPatients = sortedPatients.reduce((groups, patient) => {
    const group = groups[patient.riskLevel] || [];
    group.push(patient);
    groups[patient.riskLevel] = group;
    return groups;
  }, {} as Record<string, Patient[]>);

  return (
    <div className="space-y-6">
      {/* Red - Attention Required */}
      {groupedPatients.red?.length > 0 && (
        <div className="space-y-1">
          <div className="font-mono text-xs text-risk-red mb-2 flex items-center">
            <div className="w-2 h-2 rounded-full bg-risk-red mr-2 animate-pulse"></div>
            ATTENTION REQUIRED ({groupedPatients.red.length})
          </div>
          {groupedPatients.red.map(patient => (
            <PatientRow
              key={patient.id}
              patient={patient}
              onClick={() => onSelectPatient(patient)}
            />
          ))}
        </div>
      )}

      {/* Yellow - Review Recommended */}
      {groupedPatients.yellow?.length > 0 && (
        <div className="space-y-1">
          <div className="font-mono text-xs text-risk-amber mb-2 flex items-center">
            <div className="w-2 h-2 rounded-full bg-risk-amber mr-2"></div>
            REVIEW RECOMMENDED ({groupedPatients.yellow.length})
          </div>
          {groupedPatients.yellow.map(patient => (
            <PatientRow
              key={patient.id}
              patient={patient}
              onClick={() => onSelectPatient(patient)}
            />
          ))}
        </div>
      )}

      {/* Green - Stable */}
      {groupedPatients.green?.length > 0 && (
        <div className="space-y-1">
          <div className="font-mono text-xs text-risk-green mb-2 flex items-center">
            <div className="w-2 h-2 rounded-full bg-risk-green mr-2"></div>
            STABLE ({groupedPatients.green.length})
          </div>
          {groupedPatients.green.map(patient => (
            <PatientRow
              key={patient.id}
              patient={patient}
              onClick={() => onSelectPatient(patient)}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {patients.length === 0 && (
        <div className="text-center py-12">
          <div className="font-mono text-sm text-text-secondary">
            NO ACTIVE PATIENTS
          </div>
        </div>
      )}
    </div>
  );
}
