// see https://github.com/vercel/ms/blob/a18d9dec9df050a2ed561f7af41ec0f2713e9d80/src/index.ts#L157

const s = 1000;
const m = s * 60;
const h = m * 60;
const d = h * 24;

export function formatDuration(ms: number): string {
  const msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return `${(ms / d).toFixed(1)}d`;
  }
  if (msAbs >= h) {
    return `${(ms / h).toFixed(1)}h`;
  }
  if (msAbs >= m) {
    return `${(ms / m).toFixed(1)}m`;
  }
  if (msAbs >= s) {
    return `${(ms / s).toFixed(1)}s`;
  }
  return `${ms}ms`;
}
