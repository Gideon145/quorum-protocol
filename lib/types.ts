export interface Persona {
  id: number;
  name: string;
  age: number;
  occupation: string;
  income: string;
  background: string;
  techLiteracy: "low" | "medium" | "high";
  wouldUse: boolean;
  wouldPay: boolean;
  suggestedPrice: string;
  mainObjection: string;
  killerFeature: string;
  quote: string;
  sentiment: "positive" | "neutral" | "negative";
}

export interface QuorumReport {
  idea: string;
  pmfScore: number;
  verdict: "Strong Fit" | "Niche Viable" | "Needs Pivoting" | "Don't Build";
  personas: Persona[];
  topObjections: string[];
  topFeatureRequests: string[];
  willingToPay: { percentage: number; averagePrice: string };
  targetSegment: string;
  pivotSuggestion: string;
  summary: string;
}

export interface ReinterviewResponse {
  answer: string;
  relevantPersonas: number[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  relevantPersonas?: number[];
}

export interface PersonaChatMessage {
  role: "user" | "assistant";
  content: string;
}
