import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from '@firebase/firestore';
import { db } from '../../config/firebase';
import { Patient } from '../../types/models';

export function EnrollmentForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    surgeryType: '',
    surgeon: '',
    surgeryDate: '',
    protocolId: 'default',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'active' | 'riskLevel' | 'riskTags' | 'lastCheckIn' | 'needsVisit'> = {
        name: formData.name,
        phone: formData.phone,
        surgeryType: formData.surgeryType,
        surgeon: formData.surgeon,
        surgeryDate: new Date(formData.surgeryDate),
        protocolId: formData.protocolId,
      };

      await addDoc(collection(db, 'patients'), {
        ...patient,
        active: true,
        riskLevel: 'green',
        riskTags: [],
        needsVisit: false,
        lastCheckIn: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      navigate('/');
    } catch (error) {
      setError('Failed to enroll patient. Please try again.');
      console.error('Error adding patient:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col">
      {/* Terminal Header */}
      <header className="h-14 bg-surface border-b border-border flex items-center px-4">
        <div className="font-mono text-sm tracking-tight text-text-secondary">
          POST-OP MONITORING SYSTEM v2.0 / PATIENT ENROLLMENT
        </div>
      </header>

      {/* Enrollment Console */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          {/* System Status */}
          <div className="mb-8 font-mono text-sm">
            <div className="flex items-center space-x-2 text-text-secondary">
              <span className="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
              <span>READY TO ENROLL</span>
            </div>
          </div>

          {/* Enrollment Terminal */}
          <div className="bg-surface border border-border rounded-lg shadow-inner-subtle overflow-hidden">
            <div className="px-4 py-3 bg-surface-dark border-b border-border">
              <div className="font-mono text-sm text-text-secondary">NEW PATIENT ENROLLMENT</div>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-6 font-mono text-sm text-risk-red bg-risk-red/5 border border-risk-red/10 rounded px-3 py-2">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block font-mono text-sm text-text-secondary mb-2">
                    PATIENT NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      name: e.target.value
                    }))}
                    className="w-full bg-surface-dark rounded px-3 py-2 border border-border font-mono text-sm"
                    placeholder="Enter full name"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block font-mono text-sm text-text-secondary mb-2">
                    CONTACT NUMBER
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      phone: e.target.value
                    }))}
                    className="w-full bg-surface-dark rounded px-3 py-2 border border-border font-mono text-sm"
                    placeholder="+1 (555) 555-5555"
                  />
                </div>

                {/* Surgery Type */}
                <div>
                  <label className="block font-mono text-sm text-text-secondary mb-2">
                    PROCEDURE TYPE
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.surgeryType}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      surgeryType: e.target.value
                    }))}
                    className="w-full bg-surface-dark rounded px-3 py-2 border border-border font-mono text-sm"
                    placeholder="e.g., Wisdom Tooth Extraction"
                  />
                </div>

                {/* Surgeon */}
                <div>
                  <label className="block font-mono text-sm text-text-secondary mb-2">
                    SURGEON
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.surgeon}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      surgeon: e.target.value
                    }))}
                    className="w-full bg-surface-dark rounded px-3 py-2 border border-border font-mono text-sm"
                    placeholder="Dr. Name"
                  />
                </div>

                {/* Surgery Date */}
                <div>
                  <label className="block font-mono text-sm text-text-secondary mb-2">
                    SURGERY DATE
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.surgeryDate}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      surgeryDate: e.target.value
                    }))}
                    className="w-full bg-surface-dark rounded px-3 py-2 border border-border font-mono text-sm"
                  />
                </div>

                {/* Protocol */}
                <div>
                  <label className="block font-mono text-sm text-text-secondary mb-2">
                    MONITORING PROTOCOL
                  </label>
                  <select
                    required
                    value={formData.protocolId}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      protocolId: e.target.value
                    }))}
                    className="w-full bg-surface-dark rounded px-3 py-2 border border-border font-mono text-sm"
                  >
                    <option value="default">STANDARD PROTOCOL (7 DAYS)</option>
                    <option value="extended">EXTENDED PROTOCOL (14 DAYS)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full mt-6 py-2 bg-brand/10 border border-brand/20 rounded text-brand text-sm font-mono hover:bg-brand/20 transition-colors duration-100"
                >
                  ENROLL PATIENT
                </button>
              </form>
            </div>
          </div>

          {/* System Info */}
          <div className="mt-8 font-mono text-xs text-text-secondary space-y-1">
            <div>MONITORING SYSTEM: ACTIVE</div>
            <div>SMS NOTIFICATIONS: READY</div>
            <div>PROTOCOL ENGINE: ONLINE</div>
          </div>
        </div>
      </div>
    </div>
  );
}
