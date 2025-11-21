import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from '@firebase/firestore';
import { db } from '../../config/firebase';
import { CheckIn } from '../../types/models';

interface CheckInFormProps {
  checkInId: string;
}

export function CheckInForm({ checkInId }: CheckInFormProps) {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({
    pain: 0,
    swelling: 'none',
    bleeding: 'none',
    numbness: 'none',
    meds: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await setDoc(doc(db, 'checkins', checkInId), {
      ...answers,
      timestamp: new Date(),
      handled: false,
      notes: [],
    } as Partial<CheckIn>);

    navigate('/thank-you');
  };

  return (
    <div className="min-h-screen bg-background text-text-primary p-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-medium mb-8">Daily Check-in</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pain Scale */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Pain Level (0-10)
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={answers.pain}
              onChange={(e) => setAnswers(prev => ({
                ...prev,
                pain: parseInt(e.target.value)
              }))}
              className="w-full"
            />
            <div className="text-center font-mono mt-1">
              {answers.pain}
            </div>
          </div>

          {/* Swelling */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Swelling
            </label>
            <select
              value={answers.swelling}
              onChange={(e) => setAnswers(prev => ({
                ...prev,
                swelling: e.target.value
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
          <div>
            <label className="block text-sm font-medium mb-2">
              Bleeding
            </label>
            <select
              value={answers.bleeding}
              onChange={(e) => setAnswers(prev => ({
                ...prev,
                bleeding: e.target.value
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
          <div>
            <label className="block text-sm font-medium mb-2">
              Numbness
            </label>
            <select
              value={answers.numbness}
              onChange={(e) => setAnswers(prev => ({
                ...prev,
                numbness: e.target.value
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
          <div>
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
