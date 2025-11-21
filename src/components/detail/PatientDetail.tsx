import React, { useState } from 'react';
import { Patient, CheckIn } from '../../types/models';
import { format } from 'date-fns';
import { useCheckins } from '../../hooks/useCheckins';
import { markCheckInHandled, addNoteToCheckIn, flagForVisit } from '../../utils/patientActions';

interface PatientDetailProps {
  patient: Patient;
  onClose: () => void;
}

export function PatientDetail({ patient, onClose }: PatientDetailProps) {
  const { checkins, loading } = useCheckins(patient.id);
  const [addingNote, setAddingNote] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [actionError, setActionError] = useState('');

  // Calculate days since surgery
  const daysPostOp = Math.floor(
    (Date.now() - patient.surgeryDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Risk level styling
  const riskStyles = {
    red: {
      text: 'text-risk-red',
      bg: 'bg-risk-red/5',
      border: 'border-risk-red/20',
      glow: 'shadow-glow-risk-red',
    },
    yellow: {
      text: 'text-risk-amber',
      bg: 'bg-risk-amber/5',
      border: 'border-risk-amber/20',
      glow: 'shadow-glow-risk-amber',
    },
    green: {
      text: 'text-risk-green',
      bg: 'bg-risk-green/5',
      border: 'border-risk-green/20',
      glow: '',
    },
  };

  const style = riskStyles[patient.riskLevel];

  const handleAddNote = async (checkInId: string) => {
    if (!noteText.trim()) return;
    try {
      setActionError('');
      await addNoteToCheckIn(checkInId, noteText);
      setNoteText('');
      setAddingNote(false);
    } catch (error) {
      setActionError('Failed to add note');
    }
  };

  const handleMarkHandled = async (checkInId: string) => {
    try {
      setActionError('');
      await markCheckInHandled(checkInId);
    } catch (error) {
      setActionError('Failed to mark as handled');
    }
  };

  const handleFlagForVisit = async () => {
    try {
      setActionError('');
      await flagForVisit(patient.id, !patient.needsVisit);
    } catch (error) {
      setActionError('Failed to update visit status');
    }
  };

  return (
    <aside className="h-full bg-surface border-l border-border overflow-y-auto flex flex-col">
      {/* Header Section */}
      <header className="flex-none p-4 bg-surface-dark border-b border-border">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-medium">{patient.name}</h2>
            <div className="mt-1 flex items-center space-x-3">
              <span className="text-sm text-text-secondary">{patient.surgeryType}</span>
              <span className="font-mono text-xs px-2 py-0.5 rounded-sm bg-surface border border-border">
                DAY {daysPostOp}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary p-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className={`p-2 rounded ${style.bg} ${style.border}`}>
            <div className="text-xs text-text-secondary font-mono">RISK LEVEL</div>
            <div className={`text-sm font-mono font-medium ${style.text}`}>
              {patient.riskLevel.toUpperCase()}
            </div>
          </div>
          <div className="p-2 rounded bg-surface-dark border border-border">
            <div className="text-xs text-text-secondary font-mono">SURGEON</div>
            <div className="text-sm truncate">{patient.surgeon}</div>
          </div>
          <div className="p-2 rounded bg-surface-dark border border-border">
            <div className="text-xs text-text-secondary font-mono">SURGERY</div>
            <div className="text-sm font-mono">{format(patient.surgeryDate, 'MMM d')}</div>
          </div>
        </div>
      </header>

      {/* Content Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {/* Check-in History */}
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs text-text-secondary">RECENT CHECK-INS</h3>
            <div className="font-mono text-xs text-text-secondary">
              {format(new Date(), 'HH:mm:ss')}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="font-mono text-sm text-text-secondary animate-pulse">
                LOADING DATA...
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {checkins?.map(checkin => (
                <div
                  key={checkin.id}
                  className={`p-3 rounded border ${style.border} ${style.bg}`}
                >
                  {/* Check-in Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-mono text-xs">
                      {format(checkin.timestamp, 'MMM d HH:mm')}
                    </div>
                    {!checkin.handled && (
                      <span className="font-mono text-xs text-text-secondary">UNHANDLED</span>
                    )}
                  </div>

                  {/* Vital Signs */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="p-2 rounded bg-surface-dark border border-border">
                      <div className="text-xs text-text-secondary font-mono">PAIN</div>
                      <div className="text-sm font-mono">{checkin.answers.pain}/10</div>
                    </div>
                    <div className="p-2 rounded bg-surface-dark border border-border">
                      <div className="text-xs text-text-secondary font-mono">SWELLING</div>
                      <div className="text-sm font-mono">{checkin.answers.swelling}</div>
                    </div>
                    <div className="p-2 rounded bg-surface-dark border border-border">
                      <div className="text-xs text-text-secondary font-mono">BLEEDING</div>
                      <div className="text-sm font-mono">{checkin.answers.bleeding}</div>
                    </div>
                    <div className="p-2 rounded bg-surface-dark border border-border">
                      <div className="text-xs text-text-secondary font-mono">NUMBNESS</div>
                      <div className="text-sm font-mono">{checkin.answers.numbness}</div>
                    </div>
                  </div>

                  {/* Risk Tags */}
                  {checkin.riskTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {checkin.riskTags.map(tag => (
                        <span
                          key={tag}
                          className={`inline-flex items-center px-1.5 py-0.5 rounded-sm text-xs font-mono ${style.text} ${style.bg}`}
                        >
                          {tag.replace('RISK_', '')}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Notes */}
                  {checkin.notes?.length > 0 && (
                    <div className="space-y-1 mb-3">
                      <div className="font-mono text-xs text-text-secondary">NOTES</div>
                      {checkin.notes.map((note, index) => (
                        <div
                          key={index}
                          className="text-sm text-text-secondary pl-2 border-l border-border"
                        >
                          {note}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {!checkin.handled && (
                      <button
                        onClick={() => handleMarkHandled(checkin.id)}
                        className="px-3 py-1 text-xs font-mono border border-border rounded hover:bg-surface-dark transition-colors duration-100"
                      >
                        MARK HANDLED
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setAddingNote(true);
                        setNoteText('');
                      }}
                      className="px-3 py-1 text-xs font-mono border border-border rounded hover:bg-surface-dark transition-colors duration-100"
                    >
                      ADD NOTE
                    </button>
                  </div>

                  {/* Note Input */}
                  {addingNote && (
                    <div className="mt-3 space-y-2">
                      <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Enter clinical note..."
                        className="w-full px-3 py-2 rounded bg-surface-dark border border-border text-sm font-mono"
                        rows={3}
                      />
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleAddNote(checkin.id)}
                          className="px-3 py-1 text-xs font-mono bg-brand/10 border border-brand/20 rounded text-brand hover:bg-brand/20 transition-colors duration-100"
                        >
                          SAVE NOTE
                        </button>
                        <button
                          onClick={() => {
                            setAddingNote(false);
                            setNoteText('');
                          }}
                          className="px-3 py-1 text-xs font-mono border border-border rounded hover:bg-surface-dark transition-colors duration-100"
                        >
                          CANCEL
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Bar */}
      <footer className="flex-none p-4 bg-surface-dark border-t border-border space-y-2">
        <div className="flex items-center space-x-2">
          <a
            href={`tel:${patient.phone}`}
            className="flex-1 px-4 py-2 bg-brand/10 border border-brand/20 rounded text-brand text-sm font-mono hover:bg-brand/20 transition-colors duration-100 text-center"
          >
            CALL PATIENT
          </a>
          <button
            onClick={handleFlagForVisit}
            className="flex-1 px-4 py-2 text-sm font-mono border border-border rounded hover:bg-surface-dark transition-colors duration-100"
          >
            {patient.needsVisit ? 'REMOVE VISIT FLAG' : 'FLAG FOR VISIT'}
          </button>
        </div>

        {actionError && (
          <div className="p-2 rounded bg-risk-red/5 border border-risk-red/20 text-risk-red text-xs font-mono">
            {actionError}
          </div>
        )}
      </footer>
    </aside>
  );
}
