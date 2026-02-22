import { MockFile } from "@/data/mockFiles";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface SearchResult extends MockFile {
  relevanceScore: number;
}

export interface AIStep {
  label: string;
  duration: number;
}

export const AI_PROCESSING_STEPS: AIStep[] = [
  { label: "Scanning metadata", duration: 600 },
  { label: "Converting to embeddings", duration: 800 },
  { label: "Comparing vectors", duration: 700 },
  { label: "Ranking results", duration: 500 },
];
