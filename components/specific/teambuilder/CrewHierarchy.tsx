"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize2, Minus, Plus, GitBranch } from "lucide-react";
import { layoutCrew, type CrewRole } from "@/utils/crewBuilder";
import type { TeamBuilderRow } from "@/types/teamBuilder";
import styles from "./CrewWorkspace.module.css";

export default function CrewHierarchy({
  roles,
  people,
  activeRole,
  onSelect,
  onDropRole,
  onDropPerson,
  candidateMode = false,
}: {
  roles: CrewRole[];
  people: TeamBuilderRow[];
  activeRole?: string | null;
  onSelect?: (id: string) => void;
  onDropRole?: (id: string, parentId: string | null) => void;
  onDropPerson?: (personId: string, roleId: string) => void;
  candidateMode?: boolean;
}) {
  const [zoom, setZoom] = useState(1);
  const viewport = useRef<HTMLDivElement>(null);
  const pan = useRef<{
    x: number;
    y: number;
    left: number;
    top: number;
  } | null>(null);
  const { positions, width, height } = layoutCrew(roles);
  const fit = () => {
    setZoom(
      Math.max(
        0.3,
        Math.min(
          1,
          ((viewport.current?.clientWidth ?? 500) - 24) / width,
          ((viewport.current?.clientHeight ?? 500) - 24) / height,
        ),
      ),
    );
    if (viewport.current) {
      viewport.current.scrollLeft = 0;
      viewport.current.scrollTop = 0;
    }
  };
  useEffect(() => {
    fit();
    if (!viewport.current || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(fit);
    observer.observe(viewport.current);
    return () => observer.disconnect();
  }, [width, height]);
  const drop = (event: React.DragEvent, parentId: string | null) => {
    event.preventDefault();
    event.stopPropagation();
    const roleId = event.dataTransfer.getData("application/crew-role");
    const personId = event.dataTransfer.getData("application/crew-person");
    if (roleId) onDropRole?.(roleId, parentId);
    if (personId && parentId) onDropPerson?.(personId, parentId);
  };
  return (
    <div className={styles.chartShell}>
      <div
        className={styles.viewport}
        ref={viewport}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => drop(e, null)}
        onPointerDown={(e) => {
          if (
            e.pointerType !== "mouse" ||
            e.button !== 0 ||
            (e.target as HTMLElement).closest("button")
          )
            return;
          pan.current = {
            x: e.clientX,
            y: e.clientY,
            left: e.currentTarget.scrollLeft,
            top: e.currentTarget.scrollTop,
          };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (pan.current) {
            e.currentTarget.scrollLeft =
              pan.current.left - (e.clientX - pan.current.x);
            e.currentTarget.scrollTop =
              pan.current.top - (e.clientY - pan.current.y);
          }
        }}
        onPointerUp={() => {
          pan.current = null;
        }}
        onPointerCancel={() => {
          pan.current = null;
        }}
      >
        {!positions.length ? (
          <div className={styles.chartEmpty}>
            <GitBranch size={34} strokeWidth={1.4} />
            <h3>Give your team a structure</h3>
            <p>
              {candidateMode
                ? "Choose a role for a selected candidate to add them here."
                : "Add a role, then place it here."}
              <br />
              {candidateMode
                ? "Drag candidates onto their lead to connect them."
                : "Drop roles onto each other to connect them."}
            </p>
          </div>
        ) : (
          <div style={{ width: width * zoom, height: height * zoom }}>
            <div
              className={styles.stage}
              style={{ width, height, transform: `scale(${zoom})` }}
            >
              <svg
                width={width}
                height={height}
                className={styles.edges}
                aria-hidden="true"
              >
                {positions.map((p) => {
                  const parent = positions.find(
                    (n) => n.role.id === p.role.parentId,
                  );
                  if (!parent) return null;
                  const x1 = parent.x + 108,
                    y1 = parent.y + 116,
                    x2 = p.x + 108,
                    y2 = p.y;
                  return (
                    <path
                      key={p.role.id}
                      d={`M${x1},${y1} V${(y1 + y2) / 2} H${x2} V${y2}`}
                      fill="none"
                      stroke="#a6bbc2"
                      strokeWidth="1.5"
                    />
                  );
                })}
              </svg>
              {positions.map(({ role, x, y }) => (
                <button
                  type="button"
                  key={role.id}
                  className={`${styles.node} ${activeRole === role.id ? styles.active : ""} ${!role.personIds.length ? styles.vacant : ""}`}
                  style={{ left: x, top: y }}
                  draggable={!!onDropRole}
                  onDragStart={(e) => {
                    e.dataTransfer.setData("application/crew-role", role.id);
                    e.dataTransfer.effectAllowed = "move";
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => drop(e, role.id)}
                  onClick={() => onSelect?.(role.id)}
                >
                  <span className={styles.nodeLabel}>
                    {role.parentId ? "TEAM ROLE" : "PROJECT LEADERSHIP"}
                  </span>
                  <strong>{role.title}</strong>
                  <span className={styles.nodePeople}>
                    {role.personIds.length
                      ? role.personIds
                          .map(
                            (id) =>
                              people.find((p) => String(p.id) === id)?.name ||
                              `Consultant #${id}`,
                          )
                          .join(", ")
                      : "Open position"}
                  </span>
                  <span className={styles.nodeCount}>
                    {candidateMode ? "Click to edit role & reporting line" : role.personIds.length
                      ? `${role.personIds.length} assigned`
                      : "Awaiting consultant"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className={styles.zoom}>
        <button
          type="button"
          aria-label="Zoom out"
          onClick={() => setZoom((z) => Math.max(0.3, z - 0.1))}
        >
          <Minus size={15} />
        </button>
        <button type="button" onClick={fit}>
          <Maximize2 size={13} /> Fit
        </button>
        <span>{Math.round(zoom * 100)}%</span>
        <button
          type="button"
          aria-label="Zoom in"
          onClick={() => setZoom((z) => Math.min(1.6, z + 0.1))}
        >
          <Plus size={15} />
        </button>
      </div>
    </div>
  );
}
