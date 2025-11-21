import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from '@firebase/firestore';
import { db } from '../config/firebase';
import { Patient } from '../types/models';

interface PatientStats {
  total: number;
  red: number;
  yellow: number;
  green: number;
}

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [stats, setStats] = useState<PatientStats | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'patients'),
      where('active', '==', true)
    );

    return onSnapshot(q, (snapshot) => {
      const patientData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Patient));

      setPatients(patientData);

      // Calculate stats
      const newStats = patientData.reduce((acc, patient) => {
        if (patient.riskLevel === 'red') acc.red++;
        else if (patient.riskLevel === 'yellow') acc.yellow++;
        else if (patient.riskLevel === 'green') acc.green++;
        acc.total++;
        return acc;
      }, { total: 0, red: 0, yellow: 0, green: 0 });

      setStats(newStats);
    });
  }, []);

  return { patients, stats };
}
