import { RiskLevel, RiskTag } from '../types';

interface CheckInAnswers {
  pain: number;
  swelling: 'none' | 'slight' | 'moderate' | 'severe';
  bleeding: 'none' | 'spotting' | 'persistent' | 'large_clots';
  numbness: 'none' | 'improving' | 'same' | 'worse' | 'new_areas';
  meds: boolean;
}

interface RiskAssessment {
  level: RiskLevel;
  tags: RiskTag[];
  deltas: {
    pain?: number;
    swelling?: string;
    bleeding?: string;
    numbness?: string;
  };
}

export function computeRisk(
  answers: CheckInAnswers,
  previousAnswers?: CheckInAnswers
): RiskAssessment {
  const tags: RiskTag[] = [];
  let highestRisk: RiskLevel = 'green';

  // Pain assessment
  if (answers.pain >= 8) {
    highestRisk = 'red';
    tags.push('RISK_PAIN_SPIKE');
  } else if (
    previousAnswers &&
    answers.pain >= previousAnswers.pain + 3
  ) {
    highestRisk = 'red';
    tags.push('RISK_PAIN_SPIKE');
  } else if (answers.pain >= 5 && answers.pain <= 7) {
    if (highestRisk !== 'red') highestRisk = 'yellow';
  }

  // Swelling assessment
  if (answers.swelling === 'severe') {
    highestRisk = 'red';
    tags.push('RISK_SWELLING_WORSE');
  } else if (
    answers.swelling === 'moderate' &&
    previousAnswers?.swelling === 'slight'
  ) {
    if (highestRisk !== 'red') highestRisk = 'yellow';
    tags.push('RISK_SWELLING_WORSE');
  }

  // Bleeding assessment
  if (
    answers.bleeding === 'persistent' ||
    answers.bleeding === 'large_clots'
  ) {
    highestRisk = 'red';
    tags.push('RISK_BLEEDING');
  } else if (answers.bleeding === 'spotting') {
    if (highestRisk !== 'red') highestRisk = 'yellow';
  }

  // Numbness assessment
  if (
    answers.numbness === 'new_areas' ||
    answers.numbness === 'worse'
  ) {
    if (highestRisk !== 'red') highestRisk = 'yellow';
  }

  // Calculate deltas
  const deltas: RiskAssessment['deltas'] = {};
  if (previousAnswers) {
    deltas.pain = answers.pain - previousAnswers.pain;
    if (answers.swelling !== previousAnswers.swelling) {
      deltas.swelling = answers.swelling;
    }
    if (answers.bleeding !== previousAnswers.bleeding) {
      deltas.bleeding = answers.bleeding;
    }
    if (answers.numbness !== previousAnswers.numbness) {
      deltas.numbness = answers.numbness;
    }
  }

  return {
    level: highestRisk,
    tags,
    deltas,
  };
}
