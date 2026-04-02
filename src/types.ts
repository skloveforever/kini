export type KinRole = 'Parental' | 'Sibling/Friend' | 'Mentor/Colleague' | 'Romantic' | 'Colleague/Peer' | 'Mentor/Guide';

export type NatureArchetype = 
  | 'Witty Maverick' 
  | 'Silent Protector' 
  | 'Nurturing Sage' 
  | 'Tough-Love Coach'
  | 'Playful Sibling'
  | 'Wise Elder'
  | 'Stoic Mentor'
  | 'Empathetic Listener';

export type BrainMode = 
  | 'Reality Checker (CBT)' 
  | 'Grounding Anchor (DBT)' 
  | 'Motivation Spark (MI)' 
  | 'The Cheerleader (PERMA)'
  | 'Positive Psychology'
  | 'Acceptance & Commitment (ACT)';

export interface KinDNA {
  archetypes: NatureArchetype[];
  brainModes: BrainMode[];
  language: 'Auto-Hinglish' | 'Hindi' | 'English';
  sharedSoul: boolean;
  gender?: string;
  age?: number;
  backgroundStory?: string;
}

export interface Kin {
  id: string;
  name: string;
  role: KinRole;
  dna: KinDNA;
  auraColor: string;
  avatar: string;
  status: 'active' | 'thinking' | 'idle';
  memoryPings?: MemoryPing[];
}

export interface MemoryPing {
  id: string;
  kinId: string;
  text: string;
  timestamp: number;
}

export interface Message {
  id: string;
  senderId: string; // 'user' or kin.id
  text: string;
  timestamp: number;
  isSomatic?: boolean;
  isSystem?: boolean;
}

export interface UserProfile {
  name: string;
  gender?: string;
  age?: number;
  city?: string;
  state?: string;
  country?: string;
  lifeStage?: string;
  emotionalState?: string;
  likes: string[];
  dislikes: string[];
  preferences: string[];
  dailyWins: number;
  goals: string[];
  personality: string;
  onboardingCompleted: boolean;
}
