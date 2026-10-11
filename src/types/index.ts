export interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  instructions: string;
  takenToday: boolean;
  lastTakenTime: string | null;
  reminderType: 'call' | 'push' | 'both';
  remainingPills: number;
  category: string;
}

export interface Session {
  id: string;
  title: string;
  type: 'chemotherapy' | 'radiation' | 'imaging' | 'consultation';
  date: string;
  time: string;
  location: string;
  doctor: string;
  status: string;
  prepNotes: string;
  alarmCallEnabled: boolean;
}

export interface LabParameter {
  name: string;
  value: string;
  range: string;
  status: 'normal' | 'low_mild' | 'high_mild' | 'alert';
}

export interface LabResult {
  id: string;
  testName: string;
  date: string;
  time: string;
  status: string;
  isNew: boolean;
  parameters: LabParameter[];
  doctorNote: string;
}

export interface VitalSigns {
  temperature: string;
  bloodPressure: string;
  pulse: string;
  weight: string;
  adherenceRate: number;
  lastReportedSideEffects: string[];
}

export interface PatientData {
  id: string;
  name: string;
  age: number;
  bloodType: string;
  nationalId: string;
  diagnosis: string;
  stage: string;
  receptors: string;
  attendingPhysician: string;
  hospital: string;
  lastEhrSync: string;
  encryptionStatus: {
    encrypted: boolean;
    algorithm: string;
    hipaaCompliant: boolean;
  };
  medications: Medication[];
  sessions: Session[];
  labResults: LabResult[];
  vitalSigns: VitalSigns;
}

export interface ChatMessage {
  id: string;
  sender: 'patient' | 'doctor';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface AiChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface IncomingCallPayload {
  id: string;
  callerName: string;
  callerNumber: string;
  title: string;
  spokenMessageArabic: string;
  timestamp: string;
}
