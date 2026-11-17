/**
 * Utility formatting functions for TraceNest UI
 */

export function formatDuration(ms) {
  if (ms === null || ms === undefined || isNaN(ms)) return '0.00ms';
  if (ms < 0.001) return '< 1µs';
  if (ms < 1) return `${(ms * 1000).toFixed(0)}µs`;
  if (ms < 1000) return `${ms.toFixed(2)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export function formatTime(timestamp) {
  if (!timestamp) return '--:--:--.---';
  const d = new Date(timestamp);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  const ms = String(d.getMilliseconds()).padStart(3, '0');
  return `${hh}:${mm}:${ss}.${ms}`;
}

export function formatNumber(num) {
  if (typeof num !== 'number') return '0';
  return new Intl.NumberFormat('en-US').format(num);
}

export function getStatusColor(status) {
  switch (status) {
    case 'SUCCESS':
      return {
        text: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
        dot: 'bg-emerald-400'
      };
    case 'ERROR':
      return {
        text: 'text-rose-400',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/20',
        dot: 'bg-rose-400'
      };
    case 'RUNNING':
      return {
        text: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
        dot: 'bg-amber-400'
      };
    default:
      return {
        text: 'text-zinc-400',
        bg: 'bg-zinc-800',
        border: 'border-zinc-700',
        dot: 'bg-zinc-400'
      };
  }
}

export function getEventTypeBadge(type) {
  switch (type) {
    case 'START':
      return { label: 'START', bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30' };
    case 'CALL':
      return { label: 'CALL', bg: 'bg-indigo-500/15', text: 'text-indigo-400', border: 'border-indigo-500/30' };
    case 'TRACK':
      return { label: 'TRACK', bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30' };
    case 'SUCCESS':
      return { label: 'SUCCESS', bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' };
    case 'WARNING':
      return { label: 'WARN', bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30' };
    case 'ERROR':
      return { label: 'ERROR', bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/30' };
    case 'END':
      return { label: 'END', bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30' };
    default:
      return { label: type || 'EVENT', bg: 'bg-zinc-800', text: 'text-zinc-400', border: 'border-zinc-700' };
  }
}
