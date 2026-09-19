export type ScopeAnswer = string | string[] | Record<string, number | null>;
export type ScopeAnswers = Record<string, ScopeAnswer | undefined>;
export type ScopeArchetype =
  "greenfield" | "brownfield" | "rollout" | "ams" | "enhance" | "unsure";
export type ScopeDepth = "quick" | "full";
export type ScopeBlock =
  | { type: "paragraph" | "note"; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] };
export interface ScopeSection {
  id: string;
  title: string;
  blocks: ScopeBlock[];
  edited?: boolean;
}
export interface ScopeDocument {
  schemaVersion: 1;
  archetype: ScopeArchetype | null;
  depth: ScopeDepth;
  answers: ScopeAnswers;
  sections: ScopeSection[];
  hideCompany: boolean;
  source: { name: string; text: string } | null;
}
export interface ScopeVersion {
  id: string;
  savedAt: string;
  document: ScopeDocument;
}
export interface ScopeStudioState {
  revision: number;
  document: ScopeDocument;
  versions: ScopeVersion[];
}
export interface SaveScopeStudio {
  revision: number;
  document: ScopeDocument;
  checkpoint: boolean;
}
export interface ScopeQuestion {
  id: string;
  sec: string;
  type: "shorttext" | "single" | "multi" | "numbers" | "sliders";
  q: string;
  hint?: string;
  placeholder?: string;
  req?: boolean;
  quick?: boolean;
  options?: { v: string; l: string; s?: string }[];
  fields?: { k: string; l: string; d: number }[];
  showIf?: (answers: ScopeAnswers) => boolean;
  archetypes?: ScopeArchetype[];
  dynamic?: string;
  help?: { t: string; b: string; r?: string };
}
