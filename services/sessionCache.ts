import { getSession } from "next-auth/react";

const SESSION_KEY = "clientSession";

export async function getCachedSession() {
  if (typeof window === "undefined") return null;

  // Try in-memory first
  let session = sessionCache;
  if (session) return session;

  // Try localStorage
  const stored = localStorage.getItem(SESSION_KEY);
  if (stored) {
    sessionCache = JSON.parse(stored);
    return sessionCache;
  }

  // Fetch if not cached
  session = await getSession();
  if (session) {
    sessionCache = session;
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
  return session;
}

export function clearCachedSession() {
  sessionCache = null;
  localStorage.removeItem(SESSION_KEY);
}

let sessionCache: any = null;
