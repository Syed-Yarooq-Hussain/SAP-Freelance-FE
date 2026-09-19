"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { Dialog } from "@mui/material";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Download,
  FileText,
  History,
  Maximize2,
  MessageSquare,
  Minimize2,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import type {
  ScopeAnswer,
  ScopeBlock,
  ScopeDocument,
  ScopeQuestion,
  ScopeSection,
} from "@/types/scopeStudio";
import {
  emptyScope,
  generateScope,
  isScopeAnswered,
  SCOPE_ARCHETYPES,
  SCOPE_SECTIONS,
  scopeCompleteness,
  scopeOptions,
  scopeQuestions,
  visibleScopeText,
} from "@/utils/scopeStudio";
import { exportScope, readLocalScopeFile } from "@/utils/scopeStudioExport";
import { importScopeDocument } from "@/services/scopeStudio";
import { useScopeStudio } from "./useScopeStudio";
import styles from "./ScopeStudio.module.css";

export default function ScopeStudio({
  projectId,
  onPendingChange,
}: {
  projectId?: string | null;
  onPendingChange?: (pending: boolean) => void;
}) {
  const { data: session } = useSession();
  if (!projectId || !session?.user?.id)
    return <div className={styles.loading}>Loading project scope…</div>;
  return (
    <ScopeStudioEditor
      key={`${session.user.id}-${projectId}`}
      projectId={projectId}
      owner={String(session.user.id)}
      onPendingChange={onPendingChange}
    />
  );
}

function ScopeStudioEditor({
  projectId,
  owner,
  onPendingChange,
}: {
  projectId: string;
  owner: string;
  onPendingChange?: (pending: boolean) => void;
}) {
  const studio = useScopeStudio(projectId, owner);
  const doc = studio.document;
  const [view, setView] = useState<"landing" | "type" | "interview" | "review">(
    "landing",
  );
  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [message, setMessage] = useState("");
  const [working, setWorking] = useState(false);
  const [editing, setEditing] = useState<ScopeSection | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  useEffect(() => {
    if (studio.ready)
      setView(
        doc.sections.length
          ? "review"
          : doc.archetype
            ? "interview"
            : "landing",
      );
  }, [studio.ready]);
  useEffect(() => {
    onPendingChange?.(
      studio.saving ||
        working ||
        !!editing ||
        studio.localError ||
        (studio.server && studio.dirty),
    );
  }, [
    studio.saving,
    studio.localError,
    studio.server,
    studio.dirty,
    working,
    editing,
    onPendingChange,
  ]);
  const questions = useMemo(
    () => scopeQuestions(doc),
    [doc.archetype, doc.depth, doc.answers],
  );
  const currentIndex = Math.min(index, Math.max(0, questions.length - 1));
  const question = questions[currentIndex];
  const completeness = scopeCompleteness(doc);
  const generated = useMemo(
    () => generateScope(doc),
    [doc.archetype, doc.depth, doc.answers, doc.source],
  );
  const review = () => {
    studio.update({
      ...doc,
      sections: generated.map(
        (section) =>
          doc.sections.find((old) => old.id === section.id && old.edited) ??
          section,
      ),
    });
    setView("review");
    setMessage("");
  };
  const answer = (value: ScopeAnswer) => {
    const answers = { ...doc.answers, [question.id]: value };
    if (question.id === "countries") delete answers.localisation;
    studio.update({ ...doc, answers });
    setMessage("");
  };
  const jump = (id: string) => {
    const next = questions.findIndex((q) => q.id === id);
    if (next >= 0) {
      setIndex(next);
      setView("interview");
      setMessage("");
    }
  };
  const advance = (skip = false) => {
    if (
      !skip &&
      !isScopeAnswered(question, doc.answers) &&
      doc.answers[question.id] !== "x"
    ) {
      setMessage(
        "Add an answer, or choose ‘Skip for now’. Number fields must be complete; evaluation weights must total 100%.",
      );
      return;
    }
    setMessage("");
    if (currentIndex === questions.length - 1) review();
    else setIndex(currentIndex + 1);
  };
  const upload = async (file?: File) => {
    if (!file) return;
    if (fileInput.current) fileInput.current.value = "";
    if (file.size > 10 * 1024 * 1024) {
      setMessage("Choose a document smaller than 10 MB.");
      return;
    }
    if (
      doc.source &&
      !window.confirm(
        "Replace the imported reference? Your other edited sections will be kept.",
      )
    )
      return;
    setWorking(true);
    setMessage("");
    try {
      const source = studio.server
        ? await importScopeDocument(projectId, file)
        : { name: file.name, text: await readLocalScopeFile(file) };
      if (!source.text.trim())
        throw new Error("No readable text found in this document.");
      if (source.text.length > 100000)
        throw new Error(
          "This document is too long. Upload a scope excerpt of up to 100,000 characters.",
        );
      if (!mounted.current) return;
      studio.update({
        ...doc,
        source,
        sections: doc.sections.filter((s) => s.id !== "source"),
      });
      setView("type");
      setMessage(
        "Document imported. Answer the project questions to complete the structured scope.",
      );
    } catch (reason) {
      if (mounted.current)
        setMessage(reason instanceof Error ? reason.message : "Import failed.");
    } finally {
      if (mounted.current) setWorking(false);
    }
  };
  const runExport = async (format: "md" | "docx" | "xlsx" | "pdf") => {
    setExportOpen(false);
    setWorking(true);
    try {
      await exportScope(doc, format);
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : "Export failed.");
    } finally {
      setWorking(false);
    }
  };
  const saveVersion = async () => {
    if (await studio.save(true))
      setMessage(
        studio.server
          ? "Version saved to this project."
          : "Version saved in this browser.",
      );
  };
  const saveSection = () => {
    if (!editing) return;
    studio.update({
      ...doc,
      sections: doc.sections.map((s) =>
        s.id === editing.id ? { ...editing, edited: true } : s,
      ),
    });
    setEditing(null);
  };
  const regenerate = (id: string) => {
    const previous = doc.sections.find((s) => s.id === id);
    if (
      previous?.edited &&
      !window.confirm(
        "Replace this section's manual edits with the current interview answers?",
      )
    )
      return;
    const replacement = generated.find((s) => s.id === id);
    if (replacement)
      studio.update({
        ...doc,
        sections: doc.sections.map((s) => (s.id === id ? replacement : s)),
      });
  };
  const savedLabel = studio.saving
    ? "Saving…"
    : studio.server
      ? studio.dirty
        ? "Unsaved changes"
        : "Saved to project"
      : "Draft in this browser";
  const shell = (
    <div
      className={`${styles.studio} ${fullscreen ? styles.fullscreen : ""}`}
      ref={root}
    >
      <header className={styles.topbar}>
        <div className={styles.brand}>
          <span>C</span>
          <strong>Project scope</strong>
          <small>Requirements & deliverables</small>
        </div>
        <nav className={styles.steps} aria-label="Scope steps">
          {(
            [
              ["type", "01", "Type"],
              ["interview", "02", "Interview"],
              ["review", "03", "Review"],
            ] as const
          ).map(([step, n, label]) => (
            <button
              key={step}
              type="button"
              aria-current={view === step ? "step" : undefined}
              disabled={
                !studio.ready ||
                working ||
                (step === "interview" && !doc.archetype) ||
                (step === "review" && !doc.sections.length)
              }
              onClick={() => (step === "review" ? review() : setView(step))}
            >
              <span>{n}</span>
              {label}
            </button>
          ))}
        </nav>
        <button
          type="button"
          className={styles.iconButton}
          aria-label={fullscreen ? "Exit full screen" : "Expand scope studio"}
          onClick={() => setFullscreen(!fullscreen)}
        >
          {fullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
      </header>
      {studio.error && (
        <div className={styles.alert} role="alert">
          <span>{studio.error}</span>
          <button
            type="button"
            onClick={() => {
              if (
                !studio.dirty ||
                window.confirm(
                  "Reload the server copy and discard unsaved changes? Export your scope first if needed.",
                )
              )
                studio.reload();
            }}
          >
            Reload saved scope
          </button>
        </div>
      )}
      {studio.localError && (
        <div className={styles.alert} role="alert">
          Browser backup could not be saved. Export a copy to keep your work.
        </div>
      )}
      {message && (
        <div className={styles.notice} role="status">
          {message}
          <button
            type="button"
            aria-label="Dismiss notice"
            onClick={() => setMessage("")}
          >
            <X size={15} />
          </button>
        </div>
      )}
      {!studio.ready && !studio.error && (
        <p className={styles.loading}>Loading your project scope…</p>
      )}
      <input
        ref={fileInput}
        type="file"
        hidden
        accept={studio.server ? ".pdf,.docx,.txt,.md" : ".docx,.txt,.md"}
        onChange={(event) => void upload(event.target.files?.[0])}
      />
      <fieldset className={styles.content} disabled={!studio.ready || working}>
        {view === "landing" && (
          <div className={styles.hero}>
            <div className={styles.heroCopy}>
              <span className={styles.eyebrow}>
                <span className={styles.dot} /> FROM REQUIREMENTS TO A CLEAR
                SCOPE
              </span>
              <h2>
                Define what your team <em>will deliver.</em>
              </h2>
              <p>
                Answer a few questions or upload your requirements. Build a
                clear scope document, close the gaps, and share a proposal-ready
                pack.
              </p>
              <div className={styles.heroActions}>
                <button
                  type="button"
                  className={styles.primary}
                  onClick={() => setView("type")}
                >
                  <Sparkles size={16} />
                  Start guided scope
                  <ArrowRight size={16} />
                </button>
                <button
                  type="button"
                  className={styles.button}
                  onClick={() => fileInput.current?.click()}
                >
                  <Upload size={16} />
                  Upload existing document
                </button>
              </div>
              <div className={styles.heroMeta}>
                <span>
                  <Check size={14} /> Guided, step by step
                </span>
                <span>
                  <Check size={14} /> Your answers, your scope
                </span>
                <span>
                  <Check size={14} /> Word, Excel & PDF
                </span>
              </div>
              <button
                type="button"
                className={styles.textButton}
                onClick={() => {
                  studio.update({ ...doc, sections: generated });
                  setView("review");
                }}
              >
                Prefer to write it yourself? Open the editor{" "}
                <ChevronRight size={14} />
              </button>
            </div>
            <div className={styles.heroPaper} aria-hidden="true">
              <div>
                <FileText size={18} />
                <span>YOUR PROJECT SCOPE</span>
              </div>
              <h3>
                Clarity before
                <br />
                commitment.
              </h3>
              {[
                "Business objectives",
                "Functional & technical scope",
                "Integrations & data",
                "Commercials & governance",
              ].map((s, i) => (
                <p key={s}>
                  <span>0{i + 1}</span>
                  {s}
                  <CheckCircle2 size={14} />
                </p>
              ))}
              <footer>
                <span className={styles.dot} /> Built around your project
              </footer>
            </div>
          </div>
        )}
        {view === "type" && (
          <div className={styles.typePage}>
            <span className={styles.eyebrow}>01 / PROJECT TYPE</span>
            <h2>What kind of SAP project is this?</h2>
            <p className={styles.subtitle}>
              Choose the engagement. We’ll adapt the questions to the work you
              need.
            </p>
            <div className={styles.archetypes}>
              {SCOPE_ARCHETYPES.map((type) => (
                <button
                  type="button"
                  key={type.id}
                  className={`${styles.typeCard} ${doc.archetype === type.id ? styles.selected : ""}`}
                  aria-pressed={doc.archetype === type.id}
                  onClick={() => studio.update({ ...doc, archetype: type.id })}
                >
                  <span className={styles.typeCode}>{type.code}</span>
                  {doc.archetype === type.id && (
                    <Check size={17} className={styles.cardCheck} />
                  )}
                  <strong>{type.title}</strong>
                  <p>{type.description}</p>
                </button>
              ))}
            </div>
            <h3 className={styles.depthTitle}>How much detail do you want?</h3>
            <div className={styles.depths}>
              {(
                [
                  [
                    "quick",
                    "Quick scope",
                    "The essentials for an initial discussion.",
                  ],
                  [
                    "full",
                    "Full scope / RFP",
                    "Detailed requirements for comparable proposals.",
                  ],
                ] as const
              ).map(([depth, title, detail]) => (
                <button
                  type="button"
                  key={depth}
                  aria-pressed={doc.depth === depth}
                  className={`${styles.depth} ${doc.depth === depth ? styles.selected : ""}`}
                  onClick={() => studio.update({ ...doc, depth })}
                >
                  <span className={styles.radio}>
                    {doc.depth === depth && <span />}
                  </span>
                  <span>
                    <strong>{title}</strong>
                    <small>{detail}</small>
                  </span>
                </button>
              ))}
            </div>
            {doc.source && (
              <p className={styles.sourceInfo}>
                <FileText size={14} /> Reference: {doc.source.name}
              </p>
            )}
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.primary}
                disabled={!doc.archetype}
                onClick={() => {
                  setIndex(0);
                  setView("interview");
                }}
              >
                Start the interview
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                className={styles.textButton}
                onClick={() => setView("landing")}
              >
                Back
              </button>
            </div>
          </div>
        )}
        {view === "interview" && question && (
          <div className={styles.split}>
            <div className={styles.questionPanel}>
              <div className={styles.questionHead}>
                <span>
                  {SCOPE_SECTIONS.find((s) => s[0] === question.sec)?.[1]}
                </span>
                <small>
                  QUESTION {currentIndex + 1} OF {questions.length}
                </small>
              </div>
              <div className={styles.progress}>
                <span
                  style={{
                    width: `${((currentIndex + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
              <div className={styles.questionBody} key={question.id}>
                <div className={styles.assistantBadge}>
                  <MessageSquare size={16} /> Let’s define your project
                </div>
                <h2>{question.q}</h2>
                {question.hint && (
                  <p className={styles.subtitle}>{question.hint}</p>
                )}
                <QuestionInput
                  question={question}
                  document={doc}
                  onChange={answer}
                />
                {question.help && (
                  <details className={styles.help}>
                    <summary>Help me understand this</summary>
                    <p>{question.help.b}</p>
                  </details>
                )}
                <div className={styles.questionActions}>
                  <button
                    type="button"
                    className={styles.button}
                    onClick={() =>
                      currentIndex
                        ? setIndex(currentIndex - 1)
                        : setView("type")
                    }
                  >
                    <ArrowLeft size={15} />
                    Back
                  </button>
                  <button
                    type="button"
                    className={styles.textButton}
                    onClick={() => advance(true)}
                  >
                    Skip for now
                  </button>
                  <button
                    type="button"
                    className={styles.primary}
                    onClick={() => advance()}
                  >
                    {currentIndex === questions.length - 1
                      ? "Review scope"
                      : "Continue"}
                    <ArrowRight size={15} />
                  </button>
                </div>
                <button
                  type="button"
                  className={styles.textButton}
                  onClick={review}
                >
                  Review current draft
                </button>
              </div>
              <div className={styles.saved}>
                <span className={styles.dot} />
                {savedLabel}
              </div>
            </div>
            <aside className={styles.live}>
              <div className={styles.liveHead}>
                <span>LIVE DOCUMENT</span>
                <strong>{completeness.percent}% complete</strong>
              </div>
              <div className={styles.sectionPills}>
                {SCOPE_SECTIONS.map(([id, title]) => (
                  <button
                    key={id}
                    type="button"
                    className={question.sec === id ? styles.activePill : ""}
                    onClick={() => {
                      const q = questions.find((q) => q.sec === id);
                      if (q) jump(q.id);
                    }}
                  >
                    {title.split(" & ")[0]}
                  </button>
                ))}
              </div>
              <div className={styles.livePaper}>
                <h3>
                  {visibleScopeText(
                    String(doc.answers.company || "Your organisation"),
                    doc,
                  )}
                </h3>
                <span className={styles.documentMeta}>
                  PROJECT SCOPE · WORKING DRAFT
                </span>
                {generated
                  .filter(
                    (section) =>
                      section.id === question.sec ||
                      section.id === "background",
                  )
                  .map((section) => (
                    <div key={section.id} className={styles.liveSection}>
                      <h4>{section.title}</h4>
                      <SectionBlocks section={section} document={doc} />
                    </div>
                  ))}
              </div>
            </aside>
          </div>
        )}
        {view === "review" && (
          <>
            <div className={styles.reviewHead}>
              <div>
                <span className={styles.eyebrow}>03 / REVIEW & REFINE</span>
                <h2>
                  Your scope document{" "}
                  <small>
                    {studio.versions.length
                      ? `${studio.versions.length} saved versions`
                      : "Draft"}
                  </small>
                </h2>
              </div>
              <button
                type="button"
                className={styles.button}
                onClick={() => void saveVersion()}
                disabled={studio.saving || !!studio.error}
              >
                <Save size={15} />
                Save version
              </button>
            </div>
            <div className={styles.reviewGrid}>
              <nav className={styles.toc} aria-label="Scope sections">
                {doc.sections.map((section, i) => (
                  <button
                    type="button"
                    key={section.id}
                    onClick={() =>
                      root.current
                        ?.querySelector(
                          `[data-scope-section="${section.id.replace(/[^a-zA-Z0-9_-]/g, "")}"]`,
                        )
                        ?.scrollIntoView({
                          behavior: "smooth",
                          block: "nearest",
                        })
                    }
                  >
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    {section.title}
                  </button>
                ))}
                <button type="button" onClick={() => setView("interview")}>
                  <ArrowLeft size={14} />
                  Edit interview
                </button>
              </nav>
              <div className={styles.documentScroll}>
                <article className={styles.document}>
                  <h2>
                    {visibleScopeText(
                      String(doc.answers.company || "Client"),
                      doc,
                    )}
                    <br />
                    <em>Project scope</em>
                  </h2>
                  <span className={styles.documentMeta}>
                    {SCOPE_ARCHETYPES.find((a) => a.id === doc.archetype)
                      ?.title || "Scope document"}{" "}
                    ·{" "}
                    {doc.depth === "quick" ? "QUICK SCOPE" : "FULL SCOPE / RFP"}
                  </span>
                  {doc.sections.map((section, i) => (
                    <section
                      data-scope-section={section.id}
                      className={styles.docSection}
                      key={section.id}
                    >
                      <div className={styles.sectionTools}>
                        <button
                          type="button"
                          onClick={() => setEditing(structuredClone(section))}
                        >
                          <Pencil size={12} />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => regenerate(section.id)}
                        >
                          <RotateCcw size={12} />
                          Regenerate
                        </button>
                        {section.edited && <span>Edited</span>}
                      </div>
                      <h3>
                        <span>{String(i + 1).padStart(2, "0")}</span>
                        {section.title}
                      </h3>
                      <SectionBlocks section={section} document={doc} />
                    </section>
                  ))}
                </article>
              </div>
              <aside className={styles.reviewRail}>
                <div className={styles.railCard}>
                  <h4>Completeness</h4>
                  <div className={styles.score}>
                    <div
                      style={{
                        background: `conic-gradient(#087f72 ${completeness.percent}%, #dce5ed 0)`,
                      }}
                    >
                      <span>{completeness.percent}%</span>
                    </div>
                    <p>
                      {completeness.done} of {completeness.total}
                      <br />
                      required items answered
                    </p>
                  </div>
                  {completeness.gaps.slice(0, 5).map((gap) => (
                    <button
                      type="button"
                      className={styles.gap}
                      key={gap.id}
                      onClick={() => jump(gap.id)}
                    >
                      <ArrowRight size={12} />
                      {gap.q}
                    </button>
                  ))}
                  {completeness.gaps.length > 0 && (
                    <button
                      type="button"
                      className={styles.tealButton}
                      onClick={() => jump(completeness.gaps[0].id)}
                    >
                      Resolve {completeness.gaps.length} open items
                    </button>
                  )}
                  {completeness.gaps.length === 0 && (
                    <p className={styles.complete}>
                      <CheckCircle2 size={14} />
                      All required answers captured
                    </p>
                  )}
                </div>
                <div className={styles.railCard}>
                  <h4>Sharing preferences</h4>
                  <label className={styles.toggle}>
                    <input
                      type="checkbox"
                      checked={doc.hideCompany}
                      onChange={(event) =>
                        studio.update({
                          ...doc,
                          hideCompany: event.target.checked,
                        })
                      }
                    />
                    Hide company name in exports
                  </label>
                  <p>
                    Replaces the entered organisation name with “the Client”.
                    Review other identifying details before sharing.
                  </p>
                </div>
                <div className={styles.railCard}>
                  <h4>
                    <History size={14} />
                    Version history
                  </h4>
                  {!studio.versions.length && (
                    <p>Save a version to keep a snapshot you can restore.</p>
                  )}
                  {[...studio.versions].reverse().map((version, i) => (
                    <button
                      className={styles.version}
                      type="button"
                      key={version.id}
                      onClick={() => {
                        if (
                          window.confirm(
                            "Restore this version? Current changes will be replaced. Save a version first to keep them.",
                          )
                        ) {
                          studio.update(structuredClone(version.document));
                          setView("review");
                        }
                      }}
                    >
                      <b>v{studio.versions.length - i}</b>
                      <span>
                        {new Date(version.savedAt).toLocaleString()}
                        <small>Restore snapshot</small>
                      </span>
                    </button>
                  ))}
                </div>
              </aside>
            </div>
            <footer className={styles.footer}>
              <div className={styles.export}>
                <button
                  type="button"
                  className={styles.button}
                  onClick={() => setExportOpen(!exportOpen)}
                  aria-expanded={exportOpen}
                >
                  <Download size={15} />
                  Export
                </button>
                {exportOpen && (
                  <div className={styles.exportMenu}>
                    {(
                      [
                        ["docx", "Word document", ".docx"],
                        ["xlsx", "Vendor response pack", ".xlsx"],
                        ["pdf", "Print / Save as PDF", "PDF"],
                        ["md", "Markdown document", ".md"],
                      ] as const
                    ).map(([format, title, tag]) => (
                      <button
                        type="button"
                        key={format}
                        onClick={() => void runExport(format)}
                      >
                        <span>{tag}</span>
                        {title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <small>{savedLabel}</small>
              <button
                type="button"
                className={styles.textButton}
                onClick={() => fileInput.current?.click()}
              >
                <Upload size={14} />
                Import reference
              </button>
              <button
                type="button"
                className={styles.primary}
                disabled={studio.saving || !!studio.error}
                onClick={async () => {
                  if (await studio.save())
                    setMessage(
                      studio.server
                        ? "Scope saved to your project. Continue with your milestones below."
                        : "Scope saved in this browser. Continue with your milestones below.",
                    );
                }}
              >
                <Save size={15} />
                {studio.server ? "Save project scope" : "Save scope draft"}
              </button>
            </footer>
          </>
        )}
      </fieldset>
      {view !== "landing" && (
        <div className={styles.bottomHint}>
          <span>{working ? "Preparing document…" : savedLabel}</span>
          <button
            type="button"
            disabled={studio.saving || working || !studio.ready}
            onClick={() => {
              if (
                window.confirm(
                  "Start a new scope draft? Saved versions will remain available.",
                )
              ) {
                studio.update(emptyScope());
                setView("landing");
                setIndex(0);
              }
            }}
          >
            Start over
          </button>
        </div>
      )}
    </div>
  );
  return (
    <>
      {fullscreen ? (
        <Dialog
          open
          fullScreen
          onClose={() => setFullscreen(false)}
          aria-label="Scope Studio"
        >
          {shell}
        </Dialog>
      ) : (
        shell
      )}
      <Dialog
        open={!!editing}
        onClose={() => setEditing(null)}
        fullWidth
        maxWidth="md"
        aria-labelledby="scope-section-title"
      >
        <div className={`${styles.studio} ${styles.editor}`}>
          <h2 id="scope-section-title">Edit {editing?.title}</h2>
          <p>
            These edits are used in every export. Regenerating this section
            replaces them with interview answers.
          </p>
          {editing && (
            <BlockEditor
              blocks={editing.blocks}
              onChange={(blocks) => setEditing({ ...editing, blocks })}
            />
          )}
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.primary}
              onClick={saveSection}
            >
              Apply changes
            </button>
            <button
              type="button"
              className={styles.button}
              onClick={() => setEditing(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
}

function QuestionInput({
  question: q,
  document: doc,
  onChange,
}: {
  question: ScopeQuestion;
  document: ScopeDocument;
  onChange: (answer: ScopeAnswer) => void;
}) {
  const value = doc.answers[q.id];
  if (q.type === "shorttext")
    return (
      <textarea
        className={styles.answerText}
        aria-label={q.q}
        value={typeof value === "string" ? value : ""}
        placeholder={q.placeholder}
        maxLength={10000}
        rows={q.id === "company" ? 2 : 5}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  if (q.type === "single" || q.type === "multi")
    return (
      <div className={styles.options}>
        {scopeOptions(q, doc.answers).map((option) => {
          const selected =
            q.type === "multi"
              ? Array.isArray(value) && value.includes(option.v)
              : value === option.v;
          return (
            <button
              type="button"
              key={option.v}
              aria-pressed={selected}
              className={`${styles.option} ${selected ? styles.selected : ""}`}
              onClick={() => {
                if (q.type === "single") {
                  onChange(option.v);
                  return;
                }
                const current = Array.isArray(value) ? value : [];
                onChange(
                  selected
                    ? current.filter((v) => v !== option.v)
                    : option.v === "none"
                      ? ["none"]
                      : [...current.filter((v) => v !== "none"), option.v],
                );
              }}
            >
              <span
                className={q.type === "multi" ? styles.checkbox : styles.radio}
              >
                {selected && <Check size={12} />}
              </span>
              <span>
                <strong>{option.l}</strong>
                {option.s && <small>{option.s}</small>}
              </span>
            </button>
          );
        })}
      </div>
    );
  const values =
    value && typeof value === "object" && !Array.isArray(value) ? value : {};
  return (
    <div className={styles.numericFields}>
      {q.fields?.map((field) => (
        <label key={field.k}>
          <span>{field.l}</span>
          <input
            aria-label={field.l}
            type="number"
            min={q.id === "entities" ? 1 : 0}
            max={q.type === "sliders" ? 100 : 1000000000}
            step={1}
            placeholder={String(field.d)}
            value={values[field.k] ?? ""}
            onChange={(e) =>
              onChange({
                ...values,
                [field.k]:
                  e.target.value === "" ? null : Number(e.target.value),
              })
            }
          />
          {q.type === "sliders" && <span>%</span>}
        </label>
      ))}
      {q.type === "sliders" && (
        <>
          <p>
            Total:{" "}
            {Object.values(values).reduce<number>(
              (total, n) => total + Number(n || 0),
              0,
            )}{" "}
            / 100%
          </p>
          <button
            type="button"
            className={styles.button}
            onClick={() =>
              onChange(
                Object.fromEntries((q.fields ?? []).map((f) => [f.k, f.d])),
              )
            }
          >
            Use suggested weights
          </button>
        </>
      )}
    </div>
  );
}

function SectionBlocks({
  section,
  document,
}: {
  section: ScopeSection;
  document: ScopeDocument;
}) {
  const text = (s: string) => visibleScopeText(s, document);
  return (
    <>
      {section.blocks.map((block, index) =>
        block.type === "table" ? (
          <div className={styles.tableWrap} key={index}>
            <table>
              <thead>
                <tr>
                  {block.headers.map((h, i) => (
                    <th key={i}>{text(h)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j}>{text(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : block.type === "list" ? (
          <ul key={index}>
            {block.items.map((item, i) => (
              <li key={i}>{text(item)}</li>
            ))}
          </ul>
        ) : (
          <p
            key={index}
            className={block.type === "note" ? styles.documentNote : undefined}
          >
            {text(block.text)}
          </p>
        ),
      )}
    </>
  );
}

function BlockEditor({
  blocks,
  onChange,
}: {
  blocks: ScopeBlock[];
  onChange: (blocks: ScopeBlock[]) => void;
}) {
  const replace = (index: number, next: ScopeBlock) =>
    onChange(blocks.map((b, i) => (i === index ? next : b)));
  return (
    <>
      {blocks.map((block, index) => (
        <div key={index} className={styles.editBlock}>
          <div className={styles.editBlockHead}>
            <strong>{block.type}</strong>
            <button
              type="button"
              aria-label={`Remove block ${index + 1}`}
              onClick={() => onChange(blocks.filter((_, i) => i !== index))}
            >
              <X size={14} />
            </button>
          </div>
          {block.type === "table" ? (
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    {block.headers.map((header, col) => (
                      <th key={col}>
                        <input
                          aria-label={`Column ${col + 1} heading`}
                          value={header}
                          onChange={(e) =>
                            replace(index, {
                              ...block,
                              headers: block.headers.map((h, i) =>
                                i === col ? e.target.value : h,
                              ),
                            })
                          }
                        />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, ri) => (
                    <tr key={ri}>
                      {row.map((cell, ci) => (
                        <td key={ci}>
                          <textarea
                            aria-label={`Row ${ri + 1}, column ${ci + 1}`}
                            value={cell}
                            onChange={(e) =>
                              replace(index, {
                                ...block,
                                rows: block.rows.map((r, i) =>
                                  i === ri
                                    ? r.map((c, j) =>
                                        j === ci ? e.target.value : c,
                                      )
                                    : r,
                                ),
                              })
                            }
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                type="button"
                className={styles.textButton}
                onClick={() =>
                  replace(index, {
                    ...block,
                    rows: [...block.rows, block.headers.map(() => "")],
                  })
                }
              >
                <Plus size={13} />
                Add row
              </button>
            </div>
          ) : (
            <textarea
              aria-label={`Block ${index + 1} content`}
              rows={5}
              value={
                block.type === "list" ? block.items.join("\n") : block.text
              }
              onChange={(e) =>
                replace(
                  index,
                  block.type === "list"
                    ? { ...block, items: e.target.value.split("\n") }
                    : { ...block, text: e.target.value },
                )
              }
            />
          )}
        </div>
      ))}
      <button
        type="button"
        className={styles.button}
        onClick={() => onChange([...blocks, { type: "paragraph", text: "" }])}
      >
        <Plus size={14} />
        Add paragraph
      </button>
    </>
  );
}
