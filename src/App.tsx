import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { PatientList } from './components/monitoring/PatientList';
import { PatientDetail } from './components/detail/PatientDetail';
import { CheckInForm } from './components/checkin/CheckInForm';
import { usePatients } from './hooks/usePatients';
import { Patient } from './types/models';

function ConsoleView() {
  const { patients } = usePatients();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  return (
    <AppLayout>
      <div className="relative">
        <PatientList
          patients={patients}
          onSelectPatient={setSelectedPatient}
        />
        {selectedPatient && (
          <PatientDetail
            patient={selectedPatient}
            onClose={() => setSelectedPatient(null)}
          />
        )}
      </div>
    </AppLayout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ConsoleView />} />
        <Route path="/checkin/:checkInId" element={<CheckInForm />} />
        <Route path="/thank-you" element={
          <div className="min-h-screen bg-background text-text-primary flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-medium mb-4">Thank You</h1>
              <p className="text-text-secondary">
                Your check-in has been recorded. We'll review it shortly.
              </p>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
