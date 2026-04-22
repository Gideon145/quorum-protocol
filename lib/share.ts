import type { QuorumReport } from "./types";

export function encodeReport(report: QuorumReport): string {
  const json = JSON.stringify(report);
  const encoded = btoa(encodeURIComponent(json));
  return encoded;
}

export function decodeReport(encoded: string): QuorumReport | null {
  try {
    const json = decodeURIComponent(atob(encoded));
    return JSON.parse(json) as QuorumReport;
  } catch {
    return null;
  }
}

export function getShareUrl(report: QuorumReport): string {
  if (typeof window === "undefined") return "";
  const encoded = encodeReport(report);
  return `${window.location.origin}/report/${encoded}`;
}
