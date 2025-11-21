import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from '@firebase/firestore';
import { db } from '../../config/firebase';
import { CheckIn, RiskLevel, RiskTag, SwellingLevel, BleedingLevel, NumbnessLevel } from '../../types/models';

interface CheckInAnswers {
  pain: number;
  swelling: SwellingLevel;
  bleeding: BleedingLevel;
  numbness: NumbnessLevel;
  meds: boolean;
}

const initialAnswers: CheckInAnswers = {
  pain: 0,
  swelling: 'none',
  bleeding: 'none',
  numbness: 'none',
  meds: true,
};

function updateRiskLevel(current: RiskLevel, newLevel: RiskLevel): RiskLevel {
  if (current === 'red' || newLevel === 'red') return 'red';
  if (current === 'yellow' || newLevel === 'yellow') return 'yellow';
  return 'green';
}

function calculateRisk(answers: CheckInAnswers, previousAnswers?: CheckInAnswers): { level: RiskLevel; tags: RiskTag[] } {
  const tags: RiskTag[] = [];
  let riskLevel: RiskLevel = 'green';

  // Pain assessment
  if (answers.pain >= 8) {
    riskLevel = updateRiskLevel(riskLevel, 'red');
    tags.push('RISK_PAIN_SPIKE');
  } else if (previousAnswers && answers.pain >= previousAnswers.pain + 3) {
    riskLevel = updateRiskLevel(riskLevel, 'red');
    tags.push('RISK_PAIN_SPIKE');
  } else if (answers.pain >= 5 && answers.pain <= 7) {
    riskLevel = updateRiskLevel(riskLevel, 'yellow');
  }

  // Swelling assessment
  if (answers.swelling === 'severe') {
    riskLevel = updateRiskLevel(riskLevel, 'red');
    tags.push('RISK_SWELLING_WORSE');
  } else if (answers.swelling === 'moderate' && previousAnswers?.swelling === 'slight') {
    riskLevel = updateRiskLevel(riskLevel, 'yellow');
    tags.push('RISK_SWELLING_WORSE');
  }

  // Bleeding assessment
  if (answers.bleeding === 'persistent' || answers.bleeding === 'large_clots') {
    riskLevel = updateRiskLevel(riskLevel, 'red');
    tags.push('RISK_BLEEDING');
  } else if (answers.bleeding === 'spotting') {
    riskLevel = updateRiskLevel(riskLevel, 'yellow');
  }

  return { level: riskLevel, tags };
}

export function CheckInForm() {
  const { checkInId } = useParams();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<CheckInAnswers>(initialAnswers);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkInId) return;

    try {
      setError('');
      const checkInRef = doc(db, 'checkins', checkInId);
      const checkInDoc = await getDoc(checkInRef);
      
      if (!checkInDoc.exists()) {
        throw new Error('Invalid check-in link');
      }

      const patientId = checkInDoc.data().patientId;
      const patientRef = doc(db, 'patients', patientId);
      const patientDoc = await getDoc(patientRef);

      if (!patientDoc.exists()) {
        throw new Error('Patient not found');
      }

      // Calculate risk
      const risk = calculateRisk(answers);

      // Update check-in
      await updateDoc(checkInRef, {
        answers,
        timestamp: new Date(),
        riskLevel: risk.level,
        riskTags: risk.tags,
        handled: false,
        notes: [],
      });

      // Update patient
      await updateDoc(patientRef, {
        lastCheckIn: new Date(),
        riskLevel: risk.level,
        riskTags: risk.tags,
        updatedAt: new Date(),
      });

      navigate('/thank-you');
    } catch (err) {
      setError('Failed to submit check-in. Please try again.');
      console.error('Error submitting check-in:', err);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col">
      {/* Terminal Header */}
      <header className="h-14 bg-surface border-b border-border flex items-center px-4">
        <div className="font-mono text-sm tracking-tight text-text-secondary">
          POST-OP MONITORING SYSTEM v2.0 / PATIENT CHECK-IN
        </div>
      </header>

      {/* Check-in Console */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          {/* System Status */}
          <div className="mb-8 font-mono text-sm">
            <div className="flex items-center space-x-2 text-text-secondary">
              <span className="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
              <span>READY TO RECORD</span>
            </div>
          </div>

          {/* Check-in Terminal */}
          <div className="bg-surface border border-border rounded-lg shadow-inner-subtle overflow-hidden">
            <div className="px-4 py-3 bg-surface-dark border-b border-border">
              <div className="font-mono text-sm text-text-secondary">DAILY STATUS CHECK</div>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-6 font-mono text-sm text-risk-red bg-risk-red/5 border border-risk-red/10 rounded px-3 py-2">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Pain Scale */}
                <div className="space-y-3">
                  <label className="block font-mono text-sm text-text-secondary">
                    PAIN LEVEL
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={answers.pain}
                      onChange={(e) => setAnswers(prev => ({
                        ...prev,
                        pain: parseInt(e.target.value, 10)
                      }))}
                      className="flex-1"
                    />
                    <div className="w-12 h-12 flex items-center justify-center rounded bg-surface-dark border border-border">
                      <span className="font-mono text-xl">{answers.pain}</span>
                    </div>
                  </div>
                </div>

                {/* Vital Signs Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Swelling */}
                  <div className="space-y-2">
                    <label className="block font-mono text-sm text-text-secondary">
                      SWELLING
                    </label>
                    <select
                      value={answers.swelling}
                      onChange={(e) => setAnswers(prev => ({
                        ...prev,
                        swelling: e.target.value as SwellingLevel
                      }))}
                      className="w-full bg-surface-dark rounded px-3 py-2 border border-border font-mono text-sm"
                    >
                      <option value="none">NONE</option>
                      <option value="slight">SLIGHT</option>
                      <option value="moderate">MODERATE</option>
                      <option value="severe">SEVERE</option>
                    </select>
                  </div>

                  {/* Bleeding */}
                  <div className="space-y-2">
                    <label className="block font-mono text-sm text-text-secondary">
                      BLEEDING
                    </label>
                    <select
                      value={answers.bleeding}
                      onChange={(e) => setAnswers(prev => ({
                        ...prev,
                        bleeding: e.target.value as BleedingLevel
                      }))}
                      className="w-full bg-surface-dark rounded px-3 py-2 border border-border font-mono text-sm"
                    >
                      <option value="none">NONE</option>
                      <option value="spotting">SPOTTING</option>
                      <option value="persistent">PERSISTENT</option>
                      <option value="large_clots">LARGE CLOTS</option>
                    </select>
                  </div>

                  {/* Numbness */}
                  <div className="space-y-2">
                    <label className="block font-mono text-sm text-text-secondary">
                      NUMBNESS
                    </label>
                    <select
                      value={answers.numbness}
                      onChange={(e) => setAnswers(prev => ({
                        ...prev,
                        numbness: e.target.value as NumbnessLevel
                      }))}
                      className="w-full bg-surface-dark rounded px-3 py-2 border border-border font-mono text-sm"
                    >
                      <option value="none">NONE</option>
                      <option value="improving">IMPROVING</option>
                      <option value="same">SAME AS BEFORE</option>
                      <option value="worse">GETTING WORSE</option>
                      <option value="new_areas">NEW AREAS</option>
                    </select>
                  </div>

                  {/* Medications */}
                  <div className="space-y-2">
                    <label className="block font-mono text-sm text-text-secondary">
                      MEDICATIONS
                    </label>
                    <div className="h-[38px] flex items-center">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={answers.meds}
                          onChange={(e) => setAnswers(prev => ({
                            ...prev,
                            meds: e.target.checked
                          }))}
                          className="rounded border-border"
                        />
                        <span className="font-mono text-sm">
                          TAKING AS PRESCRIBED
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-6 py-2 bg-brand/10 border border-brand/20 rounded text-brand text-sm font-mono hover:bg-brand/20 transition-colors duration-100"
                >
                  SUBMIT CHECK-IN
                </button>
              </form>
            </div>
          </div>

          {/* System Info */}
          <div className="mt-8 font-mono text-xs text-text-secondary space-y-1">
            <div>CONNECTION: SECURE</div>
            <div>RISK ENGINE: READY</div>
            <div>ALERT SYSTEM: ACTIVE</div>
          </div>
        </div>
      </div>
    </div>
  );
}
