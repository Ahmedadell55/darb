import React, { useState, useEffect } from 'react';
import { TRAFFIC_SIGNALS } from '../../data/mockData';
// CSS module imported but signal overlay renders in SVG context via Leaflet overlay
// styles imported for potential future use
// import styles from './SignalOverlay.module.css';

const PHASE_COLORS = { green: '#059669', yellow: '#c87f0a', red: '#c0392b' };
const PHASE_CYCLE = ['green', 'yellow', 'red'];

export default function SignalOverlay({ show }) {
  const [phases, setPhases] = useState(
    Object.fromEntries(TRAFFIC_SIGNALS.map(s => [s.id, s.phase]))
  );

  useEffect(() => {
    if (!show) return;
    const interval = setInterval(() => {
      setPhases(prev => {
        const next = { ...prev };
        const randomSig = TRAFFIC_SIGNALS[Math.floor(Math.random() * TRAFFIC_SIGNALS.length)];
        const curIdx = PHASE_CYCLE.indexOf(next[randomSig.id]);
        next[randomSig.id] = PHASE_CYCLE[(curIdx + 1) % 3];
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [show]);

  if (!show) return null;

  return (
    <g>
      {TRAFFIC_SIGNALS.map(sig => {
        const phase = phases[sig.id];
        const color = PHASE_COLORS[phase];
        const isAdaptive = sig.status === 'adaptive';
        return (
          <g key={sig.id}>
            {isAdaptive && (
              <circle cx={sig.x} cy={sig.y} r="22" fill={color} opacity="0.12" />
            )}
            <rect x={sig.x - 10} y={sig.y - 22} width="20" height="38" rx="4"
              fill="#1a1a1a" stroke="#333" strokeWidth="1" />
            <circle cx={sig.x} cy={sig.y - 14} r="5"
              fill={phase === 'red' ? '#c0392b' : '#4a0000'} />
            <circle cx={sig.x} cy={sig.y - 1} r="5"
              fill={phase === 'yellow' ? '#c87f0a' : '#3a2800'} />
            <circle cx={sig.x} cy={sig.y + 12} r="5"
              fill={phase === 'green' ? '#059669' : '#003a14'} />
            <text x={sig.x} y={sig.y + 30} textAnchor="middle" fontSize="8"
              fill={isAdaptive ? '#2563eb' : '#888'} fontWeight="700" fontFamily="monospace">
              {isAdaptive ? 'ذكي' : 'ثابت'}
            </text>
          </g>
        );
      })}
    </g>
  );
}
