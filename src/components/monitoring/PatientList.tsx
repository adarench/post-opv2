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

  return (
    <div className="space-y-2">
      {sortedPatients.map(patient => (
        <PatientRow
          key={patient.id}
          patient={patient}
          onClick={() => onSelectPatient(patient)}
        />
      ))}
    </div>
  );
}
