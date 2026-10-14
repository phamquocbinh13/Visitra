export interface PersonPhoto {
  id: string;
  url: string;
  angleLabel: string; // e.g. "FRONT", "LEFT-30°", "RIGHT-30°"
  vectorExtracted: boolean;
}

export interface Person {
  id: string;
  name: string;
  identifier: string; // e.g., "SV001", "EMP-042"
  department: string;
  clearance: string;
  photos: PersonPhoto[];
  registeredVectorsCount: number;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export type RecognitionStatus = 'AUTHORIZED' | 'DENIED' | 'PROCESSING' | 'UNKNOWN' | 'ERROR';

export interface RecognitionResult {
  matched: boolean;
  person?: Person;
  similarity: number; // 0..100 percentage
  status: RecognitionStatus;
  timestamp: string;
  terminal?: string;
  latencyMs?: number;
}

export interface RecognitionEvent {
  id: string;
  time: string;
  name: string;
  identifier: string;
  score: string;
  status: RecognitionStatus;
  terminal: string;
  latency: string;
}

export type RecognitionState =
  | 'idle'
  | 'camera_initializing'
  | 'camera_ready'
  | 'face_detected'
  | 'processing'
  | 'matched'
  | 'unknown'
  | 'error';

export interface SolutionCapability {
  title: string;
  description: string;
  icon: string;
  badge?: string;
}

export interface SolutionWorkflowStep {
  stepNumber: string;
  title: string;
  subtitle: string;
  description: string;
  triggerLabel: string;
  icon: string;
}

export interface SolutionTechSpec {
  label: string;
  value: string;
}

export interface Solution {
  id: string;
  slug: string;
  pillar: string; // e.g. "PILLAR // 01 • ACCESS & SECURITY"
  title: string;
  subtitle: string;
  category: 'access' | 'attendance' | 'smart-building' | 'events';
  categoryLabel: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  badgeText: string;
  latencyText: string;
  throughputText: string;
  accuracyText: string;
  capabilities: SolutionCapability[];
  workflow: SolutionWorkflowStep[];
  techSpecs: SolutionTechSpec[];
  relatedSlugs: string[];
}

export interface ContactRequest {
  fullName: string;
  organization: string;
  email: string;
  phone?: string;
  solutionOfInterest: string;
  message: string;
}
