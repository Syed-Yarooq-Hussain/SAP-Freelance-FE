"use client";

import { consultantLabel } from "@/utils/consultantIdentity";

import { useEffect, useState } from "react";
import { useConsultantLevels } from "@/actions/common/useConsultantLevels";
import type { TeamBuilderRow } from "@/types/teamBuilder";
import { canParent, removeRole, type CrewRole } from "@/utils/crewBuilder";
import {
  ArrowRight,
  Check,
  GripVertical,
  Plus,
  Search,
  Trash2,
  Users,
  X,
  Undo2,
  Redo2,
  Download,
} from "lucide-react";
import CrewHierarchy from "./CrewHierarchy";
import styles from "./CrewWorkspace.module.css";

interface Props {
  persistenceLabel?: string;
  rows: TeamBuilderRow[];
  visibleRows: TeamBuilderRow[];
  selectedIds: string[];
  onSelect: (ids: string[]) => void;
  roles: CrewRole[];
  onRolesChange: (roles: CrewRole[]) => void;
  onHoursChange: (
    id: string | number,
    hours: number,
    available: number,
  ) => void;
  search: string;
  onSearch: (value: string) => void;
  onProfile: (row: TeamBuilderRow) => void;
  onSchedule: (row: TeamBuilderRow) => void;
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

export default function CrewWorkspace(props: Props) {
  const { rows, visibleRows, selectedIds, onSelect, roles, onRolesChange } =
    props;
  const {
    mutate: fetchLevels,
    data: levels,
    isPending: loadingLevels,
    isError: levelsError,
  } = useConsultantLevels();
  const [newRole, setNewRole] = useState("");
  const [activePerson, setActivePerson] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<string | null>(null);
  const [history, setHistory] = useState<CrewRole[][]>([]);
  const [future, setFuture] = useState<CrewRole[][]>([]);
  const [message, setMessage] = useState(
    "Select a consultant, then assign them to a role. You can also drag and drop.",
  );
  const [showSelected, setShowSelected] = useState(false);
  useEffect(() => {
    fetchLevels();
  }, [fetchLevels]);

  const commit = (next: CrewRole[]) => {
    setHistory((previous) => [...previous.slice(-29), roles]);
    setFuture([]);
    onRolesChange(next);
  };
  const assign = (personId: string, roleId: string) => {
    const person = rows.find((row) => String(row.id) === personId);
    if (!person || person.avail <= 0) {
      setMessage("This consultant has no available hours.");
      return;
    }
    if (!selectedIds.includes(personId)) onSelect([...selectedIds, personId]);
    commit(
      roles.map((r) =>
        r.id === roleId
          ? { ...r, personIds: [...new Set([...r.personIds, personId])] }
          : r,
      ),
    );
    setActiveRole(roleId);
    setMessage(
      `${consultantLabel(personId)} assigned. Set their requested hours in the talent pool.`,
    );
  };
  const place = (id: string, parentId: string | null) => {
    if (!canParent(roles, id, parentId)) {
      setMessage(
        "A role cannot report to itself or to one of its own team members.",
      );
      return;
    }
    commit(
      roles.map((role) =>
        role.id === id ? { ...role, placed: true, parentId } : role,
      ),
    );
    setMessage("Team hierarchy updated.");
  };
  const togglePerson = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelect(selectedIds.filter((personId) => personId !== id));
      commit(
        roles.map((role) => ({
          ...role,
          personIds: role.personIds.filter((personId) => personId !== id),
        })),
      );
      if (activePerson === id) setActivePerson(null);
    } else {
      onSelect([...selectedIds, id]);
      setActivePerson(id);
    }
  };
  const exportTeam = () => {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            roles: roles.map((role) => ({
              ...role,
              personIds: role.personIds.map(consultantLabel),
            })),
            consultants: rows
              .filter((r) => selectedIds.includes(String(r.id)))
              .map((r) => ({
                id: consultantLabel(r.id),
                name: consultantLabel(r.id),
                requestedHours: r.request,
                modules: [r.coremodules, r.othersmodules],
              })),
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "team-structure.json";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const selectedRole = roles.find((r) => r.id === activeRole);
  const pool = showSelected
    ? rows.filter((r) => selectedIds.includes(String(r.id)))
    : visibleRows;
  return (
    <div className={styles.workspace}>
      <header className={styles.toolbar}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>
            <Users size={19} />
          </span>
          <strong>Crew Builder</strong>
          <span className={styles.tag}>TEAM WORKSPACE</span>
        </div>
        <div className={styles.counters}>
          <span>
            Open roles <b>{roles.filter((r) => !r.personIds.length).length}</b>
          </span>
          <span>
            Placed{" "}
            <b>
              {roles.filter((r) => r.placed).length}/{roles.length}
            </b>
          </span>
          <span>
            Consultants <b>{selectedIds.length}</b>
          </span>
        </div>
        <div className={styles.tools}>
          <button
            type="button"
            aria-label="Undo role change"
            disabled={!history.length}
            onClick={() => {
              const previous = history[history.length - 1];
              setHistory(history.slice(0, -1));
              setFuture([roles, ...future]);
              onRolesChange(
                previous.map((r) => ({
                  ...r,
                  personIds: r.personIds.filter((id) =>
                    selectedIds.includes(id),
                  ),
                })),
              );
            }}
          >
            <Undo2 size={15} />
          </button>
          <button
            type="button"
            aria-label="Redo role change"
            disabled={!future.length}
            onClick={() => {
              setHistory([...history, roles]);
              onRolesChange(
                future[0].map((r) => ({
                  ...r,
                  personIds: r.personIds.filter((id) =>
                    selectedIds.includes(id),
                  ),
                })),
              );
              setFuture(future.slice(1));
            }}
          >
            <Redo2 size={15} />
          </button>
          <button type="button" onClick={exportTeam}>
            <Download size={14} /> Export
          </button>
        </div>
      </header>
      <div className={styles.columns}>
        <section
          className={`${styles.column} ${styles.pool}`}
          aria-label="Talent pool"
        >
          <div className={styles.columnHeading}>
            <span>
              <b>01</b> TALENT POOL
            </span>
            <small>{pool.length} shown</small>
          </div>
          <div className={styles.search}>
            <Search size={15} />
            <input
              aria-label="Search consultants"
              placeholder="Search consultant ID or module"
              value={props.search}
              onChange={(e) => {
                props.onSearch(e.target.value);
                setShowSelected(false);
              }}
            />
          </div>
          <div className={styles.tabs}>
            <button
              type="button"
              aria-pressed={!showSelected}
              onClick={() => setShowSelected(false)}
            >
              All consultants
            </button>
            <button
              type="button"
              aria-pressed={showSelected}
              onClick={() => setShowSelected(true)}
            >
              Selected <b>{selectedIds.length}</b>
            </button>
          </div>
          <div className={styles.scroll}>
            {props.loading && !pool.length ? (
              <p className={styles.empty}>Loading consultants…</p>
            ) : (
              !pool.length && (
                <p className={styles.empty}>
                  {showSelected
                    ? "Your selected consultants will appear here."
                    : "No consultants found. Try adjusting your filters."}
                </p>
              )
            )}
            {pool.map((person) => {
              const id = String(person.id),
                selected = selectedIds.includes(id);
              const modules = [
                ...new Set(
                  `${person.coremodules},${person.othersmodules}`
                    .split(/[,;|]/)
                    .map((m) => m.trim())
                    .filter((m) => m && m !== "N/A"),
                ),
              ];
              return (
                <article
                  key={id}
                  className={`${styles.person} ${activePerson === id ? styles.active : ""}`}
                  draggable={person.avail > 0}
                  onDragStart={(e) => {
                    e.dataTransfer.setData("application/crew-person", id);
                    e.dataTransfer.effectAllowed = "copy";
                    setActivePerson(id);
                  }}
                >
                  <div className={styles.personTop}>
                    <button
                      type="button"
                      className={styles.avatar}
                      aria-label={`Select ${consultantLabel(person.id)} for assignment`}
                      onClick={() => setActivePerson(id)}
                    >
                      <Users size={18} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className={styles.personName}
                      onClick={() => setActivePerson(id)}
                    >
                      <strong>{consultantLabel(person.id)}</strong>
                      <small>
                        {person.experience}
                        {person.country ? ` · ${person.country}` : ""}
                      </small>
                    </button>
                    <button
                      type="button"
                      className={`${styles.selectButton} ${selected ? styles.checked : ""}`}
                      aria-label={`${selected ? "Remove" : "Shortlist"} ${consultantLabel(person.id)}`}
                      aria-pressed={selected}
                      disabled={!selected && person.avail <= 0}
                      onClick={() => togglePerson(id)}
                    >
                      {selected ? <Check size={14} /> : <Plus size={14} />}
                    </button>
                  </div>
                  <div className={styles.modules}>
                    {modules.map((m, i) => (
                      <span
                        key={m}
                        style={{
                          color: ["#216685", "#32744c", "#805f27", "#755199"][
                            i % 4
                          ],
                        }}
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                  <div className={styles.personMeta}>
                    <span
                      className={
                        person.avail > 0 ? styles.available : styles.unavailable
                      }
                    >
                      ●{" "}
                      {person.avail > 0
                        ? `${person.avail}h/week available`
                        : "Unavailable"}
                    </span>
                    <strong>{person.rate}</strong>
                  </div>
                  {selected && (
                    <label className={styles.hours}>
                      Requested hours / week
                      <input
                        aria-label={`Requested hours for ${consultantLabel(person.id)}`}
                        type="number"
                        min="1"
                        max={person.avail}
                        step="1"
                        value={person.request || ""}
                        placeholder="0"
                        onChange={(e) =>
                          props.onHoursChange(
                            person.id,
                            Number(e.target.value),
                            person.avail,
                          )
                        }
                      />
                    </label>
                  )}
                  {selected &&
                    (!Number.isInteger(person.request) ||
                      person.request <= 0 ||
                      person.request > person.avail) && (
                      <span className={styles.error}>
                        Enter 1–{person.avail} whole hours to continue.
                      </span>
                    )}
                  <div className={styles.personLinks}>
                    <button
                      type="button"
                      onClick={() => props.onProfile(person)}
                    >
                      View profile
                    </button>
                    <button
                      type="button"
                      onClick={() => props.onSchedule(person)}
                    >
                      Schedule
                    </button>
                    <span>
                      {roles.filter((r) => r.personIds.includes(id)).length ||
                        "No"}{" "}
                      roles
                    </span>
                  </div>
                </article>
              );
            })}
            {!showSelected && props.hasMore && (
              <button
                className={styles.loadMore}
                type="button"
                disabled={props.loading}
                onClick={props.onLoadMore}
              >
                {props.loading ? "Loading…" : "Load more consultants"}
              </button>
            )}
          </div>
        </section>
        <section
          className={`${styles.column} ${styles.board}`}
          aria-label="Role board"
        >
          <div className={styles.columnHeading}>
            <span>
              <b>02</b> ROLE BOARD
            </span>
            <small>{roles.length} positions</small>
          </div>
          <div className={styles.addRole}>
            <select
              aria-label="Role to add"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              disabled={loadingLevels}
            >
              <option value="">
                {loadingLevels ? "Loading roles…" : "Choose a role…"}
              </option>
              {(levels?.data ?? []).map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            <button
              type="button"
              aria-label="Add role"
              disabled={!newRole}
              onClick={() => {
                const id = crypto.randomUUID();
                commit([
                  ...roles,
                  {
                    id,
                    title: newRole,
                    personIds: [],
                    parentId: null,
                    placed: false,
                  },
                ]);
                setActiveRole(id);
                setNewRole("");
              }}
            >
              <Plus size={17} />
            </button>
          </div>
          {levelsError && (
            <p className={styles.error}>
              Roles could not load.{" "}
              <button type="button" onClick={() => fetchLevels()}>
                Retry
              </button>
            </p>
          )}
          <div className={styles.scroll}>
            {!roles.length && (
              <div className={styles.empty}>
                <Users size={25} />
                <h3>Start with your roles</h3>
                <p>
                  Choose a role above to create a position. Add as many
                  positions as your project needs.
                </p>
              </div>
            )}
            {roles.map((role) => (
              <article
                key={role.id}
                className={`${styles.role} ${!role.personIds.length ? styles.vacant : ""} ${activeRole === role.id ? styles.active : ""}`}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("application/crew-role", role.id);
                  e.dataTransfer.effectAllowed = "move";
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const id = e.dataTransfer.getData("application/crew-person");
                  if (id) assign(id, role.id);
                }}
              >
                <div className={styles.roleTop}>
                  <GripVertical size={14} />
                  <button
                    type="button"
                    className={styles.roleTitle}
                    onClick={() => setActiveRole(role.id)}
                  >
                    {role.title}
                  </button>
                  <span
                    className={
                      role.personIds.length
                        ? styles.filledPill
                        : styles.openPill
                    }
                  >
                    {role.personIds.length ? "STAFFED" : "OPEN"}
                  </span>
                  <button
                    type="button"
                    aria-label={`Delete ${role.title} position`}
                    onClick={() => commit(removeRole(roles, role.id))}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className={styles.assignments}>
                  {role.personIds.map((id) => (
                    <span key={id}>
                      {consultantLabel(id)}
                      <button
                        type="button"
                        aria-label={`Unassign ${consultantLabel(id)} from ${role.title}`}
                        onClick={() =>
                          commit(
                            roles.map((r) =>
                              r.id === role.id
                                ? {
                                    ...r,
                                    personIds: r.personIds.filter(
                                      (p) => p !== id,
                                    ),
                                  }
                                : r,
                            ),
                          )
                        }
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  className={styles.assignButton}
                  disabled={!activePerson}
                  onClick={() => activePerson && assign(activePerson, role.id)}
                >
                  <Plus size={13} />
                  {activePerson
                    ? `Assign ${consultantLabel(activePerson)}`
                    : "Select or drop a consultant"}
                </button>
                <button
                  type="button"
                  className={styles.placeButton}
                  onClick={() => {
                    if (!role.placed) place(role.id, null);
                    setActiveRole(role.id);
                  }}
                >
                  {role.placed ? "Edit reporting line" : "Place in hierarchy"}
                  <ArrowRight size={13} />
                </button>
              </article>
            ))}
          </div>
        </section>
        <section
          className={`${styles.column} ${styles.chart}`}
          aria-label="Project hierarchy"
        >
          <div className={styles.columnHeading}>
            <span>
              <b>03</b> PROJECT HIERARCHY
            </span>
            <small>Drag to connect</small>
          </div>
          <CrewHierarchy
            roles={roles}
            people={rows}
            activeRole={activeRole}
            onSelect={setActiveRole}
            onDropRole={place}
            onDropPerson={assign}
          />
          {selectedRole && (
            <div className={styles.inspector}>
              <strong>{selectedRole.title}</strong>
              <label>
                Reports to
                <select
                  aria-label={`Reporting parent for ${selectedRole.title}`}
                  value={selectedRole.parentId ?? ""}
                  onChange={(e) =>
                    place(selectedRole.id, e.target.value || null)
                  }
                >
                  <option value="">Project root</option>
                  {roles
                    .filter(
                      (r) =>
                        r.placed && canParent(roles, selectedRole.id, r.id),
                    )
                    .map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.title}
                      </option>
                    ))}
                </select>
              </label>
              {selectedRole.placed && (
                <button
                  type="button"
                  onClick={() =>
                    commit(
                      roles.map((role) =>
                        role.id === selectedRole.id
                          ? { ...role, placed: false, parentId: null }
                          : role.parentId === selectedRole.id
                            ? { ...role, parentId: selectedRole.parentId }
                            : role,
                      ),
                    )
                  }
                >
                  Remove from chart
                </button>
              )}
              {!selectedRole.placed && (
                <button
                  type="button"
                  onClick={() => place(selectedRole.id, null)}
                >
                  Place at root
                </button>
              )}
              <button
                type="button"
                aria-label="Close role details"
                onClick={() => setActiveRole(null)}
              >
                <X size={15} />
              </button>
            </div>
          )}
        </section>
      </div>
      <footer className={styles.status}>
        <span role="status">{message}</span>
        <span>
          {props.persistenceLabel ?? "Hierarchy draft · this browser"}
        </span>
      </footer>
    </div>
  );
}
