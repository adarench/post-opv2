import React from 'react';
import { Patient, CheckIn } from '../../types/models';
import { format } from 'date-fns';
import { useCheckins } from '../../hooks/useCheckins';

interface PatientDetailProps {
  patient: Patient;
  onClose: () => void;
}

export function PatientDetail({ patient, onClose }: PatientDetailProps) {
  const { checkins, loading } = useCheckins(patient.id);

  const riskColors = {
    red: 'text-risk-red',
    yellow: 'text-risk-amber',
    green: 'text-risk-green'
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-surface border-l border-surface-dark p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-medium">{patient.name}</h2>
          <div className="text-sm text-text-secondary">
            {patient.surgeryType}
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-text-secondary hover:text-text-primary"
        >
          ✕
        </button>
      </div>

      {/* Basic Info */}
      <div className="space-y-4 mb-8">
        <div>
          <div className="text-sm text-text-secondary">Surgery Date</div>
          <div className="font-mono">
            {format(patient.surgeryDate, 'MMM d, yyyy')}
          </div>
        </div>
        <div>
          <div className="text-sm text-text-secondary">Surgeon</div>
          <div>{patient.surgeon}</div>
        </div>
        <div>
          <div className="text-sm text-text-secondary">Contact</div>
          <div>{patient.phone}</div>
        </div>
      </div>

      {/* Check-in History */}
      <div className="mb-8">
        <h3 className="text-sm font-medium mb-4">Recent Check-ins</h3>
        {loading ? (
          <div className="text-text-secondary">Loading...</div>
        ) : (
          <div className="space-y-4">
            {checkins?.map(checkin => (
              <div
                key={checkin.id}
                className="p-4 rounded bg-surface-dark"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-mono text-sm">
                    {format(checkin.timestamp, 'MMM d, h:mm a')}
                  </div>
                  <div className={riskColors[checkin.riskLevel]}>
                    {checkin.riskLevel.toUpperCase()}
                  </div>
                </div>

                {/* Answers */}
                <div className="space-y-2 text-sm">
                  <div>Pain: {checkin.answers.pain}/10</div>
                  <div>Swelling: {checkin.answers.swelling}</div>
                  <div>Bleeding: {checkin.answers.bleeding}</div>
                  <div>Numbness: {checkin.answers.numbness}</div>
                  <div>Taking Meds: {checkin.answers.meds ? 'Yes' : 'No'}</div>
                </div>

                {/* Risk Tags */}
                {checkin.riskTags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {checkin.riskTags.map(tag => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-full bg-surface"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <button className="w-full py-2 px-4 rounded bg-brand hover:bg-brand/90 text-white">
          Call Patient
        </button>
        <button className="w-full py-2 px-4 rounded border border-surface-dark hover:bg-surface-dark">
          Mark as Handled
        </button>
        <button className="w-full py-2 px-4 rounded border border-surface-dark hover:bg-surface-dark">
          Add Note
        </button>
      </div>
    </div>
  );
}
