import { SCOPE_QUESTIONS, listAnswer } from "@/data/scopeStudioQuestions";
import type {
  ScopeAnswers,
  ScopeBlock,
  ScopeDocument,
  ScopeQuestion,
  ScopeSection,
  ScopeStudioState,
} from "@/types/scopeStudio";

export const SCOPE_ARCHETYPES = [
  {
    id: "greenfield",
    code: "GF",
    title: "New SAP implementation",
    description: "A fresh implementation: design, build, migrate and go live.",
  },
  {
    id: "brownfield",
    code: "BF",
    title: "ECC to S/4HANA conversion",
    description: "Convert an existing system, with selective redesign.",
  },
  {
    id: "rollout",
    code: "RO",
    title: "Rollout to a new entity",
    description: "Extend your group template to a country, plant or company.",
  },
  {
    id: "ams",
    code: "AM",
    title: "Support / AMS contract",
    description: "Define ongoing support, service levels and enhancements.",
  },
  {
    id: "enhance",
    code: "EN",
    title: "Enhancement or add-on",
    description: "Scope a specific interface, report, app or module extension.",
  },
  {
    id: "unsure",
    code: "?",
    title: "Discovery / help me decide",
    description: "Capture your needs and identify what requires clarification.",
  },
] as const;
export const SCOPE_SECTIONS = [
  ["background", "Company & Project Background"],
  ["objectives", "Objectives & Success Criteria"],
  ["scope", "Scope of Work"],
  ["landscape", "Landscape & Integration"],
  ["volumetrics", "Volumetrics"],
  ["compliance", "Compliance & Localisation"],
  ["timeline", "Timeline & Milestones"],
  ["commercials", "Commercial Requirements"],
  ["governance", "Governance & Team"],
  ["assumptions", "Assumptions & Open Items"],
] as const;

const EXTRA_QUESTIONS: ScopeQuestion[] = [
  {
    id: "eccVersion",
    sec: "landscape",
    type: "shorttext",
    q: "Which SAP ECC version and database are you running?",
    req: true,
    quick: true,
    archetypes: ["brownfield"],
    placeholder:
      "Version, enhancement pack, database; or what still needs confirming",
  },
  {
    id: "downtime",
    sec: "timeline",
    type: "shorttext",
    q: "What cutover downtime can the business accept?",
    req: true,
    quick: true,
    archetypes: ["brownfield"],
    placeholder: "Maximum outage and any blackout dates",
  },
  {
    id: "template",
    sec: "scope",
    type: "shorttext",
    q: "What group template is available, and what local changes are needed?",
    req: true,
    quick: true,
    archetypes: ["rollout"],
    placeholder: "Template owner, version, entities and deviations",
  },
  {
    id: "serviceWindow",
    sec: "timeline",
    type: "shorttext",
    q: "What support coverage and contract period do you need?",
    req: true,
    quick: true,
    archetypes: ["ams"],
    placeholder: "Start date, term, time zone and support hours",
  },
  {
    id: "sla",
    sec: "governance",
    type: "shorttext",
    q: "What incident volumes and service levels should the team meet?",
    req: true,
    quick: true,
    archetypes: ["ams"],
    placeholder:
      "Priority levels, response targets, resolution targets and monthly tickets",
  },
  {
    id: "acceptance",
    sec: "objectives",
    type: "shorttext",
    q: "How will you accept the completed enhancement?",
    req: true,
    quick: true,
    archetypes: ["enhance"],
    placeholder:
      "Deliverables, affected systems and measurable acceptance criteria",
  },
  {
    id: "functionalNotes",
    sec: "scope",
    type: "shorttext",
    q: "Any specific functional requirements?",
    quick: true,
    placeholder: "Business processes, reports, approvals and expected outcomes",
  },
  {
    id: "technicalNotes",
    sec: "landscape",
    type: "shorttext",
    q: "Any technical constraints or integration details?",
    quick: true,
    placeholder: "Interfaces, security, data migration and hosting constraints",
  },
  {
    id: "exclusions",
    sec: "scope",
    type: "shorttext",
    q: "What is explicitly out of scope?",
    req: true,
    quick: true,
    placeholder: "Excluded systems, processes, countries or responsibilities",
  },
];

export function emptyScope(): ScopeDocument {
  return {
    schemaVersion: 1,
    archetype: null,
    depth: "quick",
    answers: {},
    sections: [],
    hideCompany: false,
    source: null,
  };
}
export function scopeQuestions(doc: ScopeDocument) {
  const amsExcluded = [
    "deployment",
    "rollout",
    "migrationObjects",
    "historyYears",
    "masterData",
    "sites",
    "ricefw",
    "golive",
    "deadlineDriver",
    "licences",
    "ams",
  ];
  return [...SCOPE_QUESTIONS, ...EXTRA_QUESTIONS]
    .filter(
      (q) =>
        (doc.depth === "full" || q.quick) &&
        (!q.showIf || q.showIf(doc.answers)) &&
        (!q.archetypes || q.archetypes.includes(doc.archetype!)) &&
        !(doc.archetype === "ams" && amsExcluded.includes(q.id)),
    )
    .sort(
      (a, b) =>
        SCOPE_SECTIONS.findIndex((s) => s[0] === a.sec) -
        SCOPE_SECTIONS.findIndex((s) => s[0] === b.sec),
    );
}

export function scopeOptions(
  q: ScopeQuestion,
  answers: ScopeAnswers,
): { v: string; l: string; s?: string }[] {
  if (q.dynamic !== "localisation") return q.options ?? [];
  const countries = listAnswer(answers, "countries");
  const options = [
    { v: "ifrs", l: "Financial reporting requirements" },
    { v: "localTax", l: "Local tax and statutory reporting" },
    { v: "einv", l: "Electronic invoicing requirements" },
  ];
  for (const country of countries)
    options.push({
      v: `country_${country}`,
      l: `${SCOPE_QUESTIONS.find((q) => q.id === "countries")?.options?.find((o) => o.v === country)?.l ?? country}: confirm local requirements`,
    });
  return options;
}
export function isScopeAnswered(q: ScopeQuestion, answers: ScopeAnswers) {
  const value = answers[q.id];
  if (typeof value === "string") return !!value.trim() && value !== "x";
  if (Array.isArray(value))
    return value.length > 0 && value.some((v) => v !== "x");
  if (value && typeof value === "object") {
    const valid = q.fields?.every(
      (field) =>
        typeof value[field.k] === "number" &&
        Number.isFinite(value[field.k]) &&
        Number.isInteger(value[field.k]) &&
        Number(value[field.k]) >= (q.id === "entities" ? 1 : 0),
    );
    return (
      !!valid &&
      (q.type !== "sliders" ||
        Object.values(value).reduce<number>(
          (sum, n) => sum + Number(n ?? 0),
          0,
        ) === 100)
    );
  }
  return false;
}
export function scopeCompleteness(doc: ScopeDocument) {
  const required = scopeQuestions(doc).filter((q) => q.req);
  const gaps = required.filter((q) => !isScopeAnswered(q, doc.answers));
  return {
    gaps,
    total: required.length,
    done: required.length - gaps.length,
    percent: required.length
      ? Math.round(((required.length - gaps.length) * 100) / required.length)
      : 0,
  };
}
export function scopeAnswerLabel(q: ScopeQuestion, answers: ScopeAnswers) {
  const value = answers[q.id];
  const label = (v: string) =>
    scopeOptions(q, answers).find((option) => option.v === v)?.l ?? v;
  if (Array.isArray(value)) return value.map(label).join("; ");
  if (typeof value === "string")
    return q.type === "shorttext" ? value.trim() : label(value);
  if (value)
    return (
      q.fields
        ?.map(
          (field) =>
            `${field.l}: ${value[field.k] ?? "To confirm"}${q.type === "sliders" ? "%" : ""}`,
        )
        .join("; ") ?? ""
    );
  return "To confirm";
}
export function generateScope(doc: ScopeDocument): ScopeSection[] {
  const questions = scopeQuestions(doc);
  const company =
    typeof doc.answers.company === "string"
      ? doc.answers.company.trim()
      : "The Client";
  const type =
    SCOPE_ARCHETYPES.find((a) => a.id === doc.archetype)?.title ??
    "SAP project";
  return SCOPE_SECTIONS.map<ScopeSection>(([id, title]) => {
    const blocks: ScopeBlock[] = [];
    if (id === "background")
      blocks.push({
        type: "paragraph",
        text: `${company || "The Client"} is seeking proposals for: ${type}. This scope records the requirements provided for planning and quotation.`,
      });
    const rows = questions
      .filter((q) => q.sec === id && isScopeAnswered(q, doc.answers))
      .map((q) => [q.q.replace(/\?$/, ""), scopeAnswerLabel(q, doc.answers)]);
    if (rows.length)
      blocks.push({
        type: "table",
        headers: ["Requirement", "Client response"],
        rows,
      });
    if (id === "assumptions") {
      const gaps = scopeCompleteness(doc).gaps;
      blocks.push({
        type: "note",
        text: "No unprovided prices, delivery dates or service commitments have been assumed. Confirm the open items before agreeing commercial terms.",
      });
      if (gaps.length)
        blocks.push({
          type: "list",
          items: gaps.map((q) => `To confirm: ${q.q}`),
        });
      if (doc.archetype === "unsure")
        blocks.push({
          type: "note",
          text: "Project type remains to be confirmed through discovery.",
        });
      if (doc.source)
        blocks.push({
          type: "note",
          text: "An existing document was imported as a reference. Its requirements need reconciliation with the questionnaire and any manual edits.",
        });
    }
    if (!blocks.length)
      blocks.push({
        type: "note",
        text: "Details to be confirmed with the project team.",
      });
    return { id, title, blocks };
  }).concat(
    doc.source
      ? [
          {
            id: "source",
            title: "Existing Scope Reference",
            blocks: [{ type: "paragraph" as const, text: doc.source.text }],
          },
        ]
      : [],
  );
}
export function visibleScopeText(text: string, doc: ScopeDocument) {
  const company =
    typeof doc.answers.company === "string" ? doc.answers.company.trim() : "";
  if (!doc.hideCompany || !company) return text;
  return text.replace(
    new RegExp(company.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"),
    "the Client",
  );
}
export function scopeMarkdown(doc: ScopeDocument) {
  const tableCell = (s: string) => s.replace(/\|/g, "\\|").replace(/\n/g, " ");
  return visibleScopeText(
    `# ${String(doc.answers.company || "Client")} — Project Scope\n\n${doc.sections
      .map(
        (section) =>
          `## ${section.title}\n\n${section.blocks
            .map((block) => {
              if (block.type === "list")
                return block.items.map((s) => `- ${s}`).join("\n");
              if (block.type === "table")
                return [
                  block.headers,
                  block.headers.map(() => "---"),
                  ...block.rows,
                ]
                  .map((row) => `| ${row.map(tableCell).join(" | ")} |`)
                  .join("\n");
              return block.type === "note" ? `> ${block.text}` : block.text;
            })
            .join("\n\n")}`,
      )
      .join("\n\n")}`,
    doc,
  );
}

function isDocument(value: unknown): value is ScopeDocument {
  if (!value || typeof value !== "object") return false;
  const d = value as ScopeDocument;
  if (
    d.schemaVersion !== 1 ||
    ![null, ...SCOPE_ARCHETYPES.map((a) => a.id)].includes(d.archetype) ||
    !["quick", "full"].includes(d.depth) ||
    typeof d.hideCompany !== "boolean" ||
    !d.answers ||
    typeof d.answers !== "object" ||
    Array.isArray(d.answers) ||
    !Array.isArray(d.sections)
  )
    return false;
  if (
    !Object.values(d.answers).every(
      (a) =>
        typeof a === "string" ||
        (Array.isArray(a)
          ? a.every((v) => typeof v === "string")
          : !!a &&
            typeof a === "object" &&
            Object.values(a).every(
              (n) =>
                n === null || (typeof n === "number" && Number.isFinite(n)),
            )),
    )
  )
    return false;
  if (
    d.source !== null &&
    (!d.source ||
      typeof d.source.name !== "string" ||
      typeof d.source.text !== "string")
  )
    return false;
  return (
    new Set(d.sections.map((s) => s?.id)).size === d.sections.length &&
    d.sections.every(
      (s) =>
        !!s &&
        typeof s.id === "string" &&
        typeof s.title === "string" &&
        Array.isArray(s.blocks) &&
        s.blocks.every((b) => {
          if (!b || typeof b !== "object") return false;
          if (b.type === "paragraph" || b.type === "note")
            return typeof b.text === "string";
          if (b.type === "list")
            return (
              Array.isArray(b.items) &&
              b.items.every((v) => typeof v === "string")
            );
          return (
            b.type === "table" &&
            Array.isArray(b.headers) &&
            b.headers.every((v) => typeof v === "string") &&
            Array.isArray(b.rows) &&
            b.rows.every(
              (r) =>
                Array.isArray(r) &&
                r.length === b.headers.length &&
                r.every((v) => typeof v === "string"),
            )
          );
        }),
    )
  );
}
export function validateScopeState(value: unknown): ScopeStudioState {
  const s = value as ScopeStudioState;
  if (
    !s ||
    !Number.isInteger(s.revision) ||
    s.revision < 0 ||
    !isDocument(s.document) ||
    !Array.isArray(s.versions) ||
    !s.versions.every(
      (v) =>
        v &&
        typeof v.id === "string" &&
        typeof v.savedAt === "string" &&
        isDocument(v.document),
    )
  )
    throw new Error("The saved scope document could not be read.");
  return s;
}
