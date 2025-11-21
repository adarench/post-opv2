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
    <div className="min-h-screen bg-background text-text-primary p-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-medium mb-8">Daily Check-in</h1>

        {error && (
          <div className="mb-6 p-4 rounded bg-risk-red/10 text-risk-red">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pain Scale */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Pain Level (0-10)
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={answers.pain}
              onChange={(e) => setAnswers(prev => ({
                ...prev,
                pain: parseInt(e.target.value, 10)
              }))}
              className="w-full"
            />
            <div className="text-center font-mono">{answers.pain}</div>
          </div>

          {/* Swelling */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Swelling
            </label>
            <select
              value={answers.swelling}
              onChange={(e) => setAnswers(prev => ({
                ...prev,
                swelling: e.target.value as SwellingLevel
              }))}
              className="w-full bg-surface-dark rounded px-3 py-2 border border-surface"
            >
              <option value="none">None</option>
              <option value="slight">Slight</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe</option>
            </select>
          </div>

          {/* Bleeding */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Bleeding
            </label>
            <select
              value={answers.bleeding}
              onChange={(e) => setAnswers(prev => ({
                ...prev,
                bleeding: e.target.value as BleedingLevel
              }))}
              className="w-full bg-surface-dark rounded px-3 py-2 border border-surface"
            >
              <option value="none">None</option>
              <option value="spotting">Spotting</option>
              <option value="persistent">Persistent</option>
              <option value="large_clots">Large Clots</option>
            </select>
          </div>

          {/* Numbness */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Numbness
            </label>
            <select
              value={answers.numbness}
              onChange={(e) => setAnswers(prev => ({
                ...prev,
                numbness: e.target.value as NumbnessLevel
              }))}
              className="w-full bg-surface-dark rounded px-3 py-2 border border-surface"
            >
              <option value="none">None</option>
              <option value="improving">Improving</option>
              <option value="same">Same as Before</option>
              <option value="worse">Getting Worse</option>
              <option value="new_areas">New Areas</option>
            </select>
          </div>

          {/* Medications */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={answers.meds}
                onChange={(e) => setAnswers(prev => ({
                  ...prev,
                  meds: e.target.checked
                }))}
                className="rounded border-surface"
              />
              <span className="text-sm font-medium">
                I am taking my medications as prescribed
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded bg-brand hover:bg-brand/90 text-white font-medium"
          >
            Submit Check-in
          </button>
        </form>
      </div>
    </div>
  );
}
