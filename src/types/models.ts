export type RiskLevel = 'green' | 'yellow' | 'red';
export type RiskTag = 'RISK_PAIN_SPIKE' | 'RISK_BLEEDING' | 'RISK_FEVER' | 'RISK_SWELLING_WORSE';
export type CheckInStatus = 'new' | 'in_review' | 'resolved';

export interface Patient {
  id: string;
  name: string;
  phone: string;
  surgeryType: string;
  surgeon: string;
  surgeryDate: Date;
  protocolId: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  riskLevel: RiskLevel;
  riskTags: RiskTag[];
  lastCheckIn: Date;
}

export interface CheckIn {
  id: string;
  patientId: string;
  timestamp: Date;
  answers: {
    pain: number;
    swelling: 'none' | 'slight' | 'moderate' | 'severe';
    bleeding: 'none' | 'spotting' | 'persistent' | 'large_clots';
    numbness: 'none' | 'improving' | 'same' | 'worse' | 'new_areas';
    meds: boolean;
  };
  riskLevel: RiskLevel;
  riskTags: RiskTag[];
  deltaFromYesterday: {
    pain?: number;
    swelling?: string;
    bleeding?: string;
    numbness?: string;
  };
  handled: boolean;
  notes: string[];
}

export interface Protocol {
  id: string;
  name: string;
  days: number;
  questions: {
    id: string;
    text: string;
    type: 'numeric' | 'choice' | 'boolean';
    options?: string[];
  }[];
  riskRules: {
    condition: string;
    riskLevel: RiskLevel;
    riskTag?: RiskTag;
  }[];
}

export interface Staff {
  id: string;
  name: string;
  role: 'admin' | 'staff' | 'surgeon';
  email: string;
}
