import React from 'react';

// Reusable skeleton loader - works with global .skeleton class from index.css
export function SkeletonBox({ width = '100%', height = 20, radius = 8, style = {} }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius: radius, ...style }}
    />
  );
}

export function SkeletonCard({ lines = 3 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 14 }}>
      <SkeletonBox height={16} width="60%" radius={6} />
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBox key={i} height={12} width={i === lines - 1 ? '75%' : '100%'} radius={6} />
      ))}
    </div>
  );
}

export function SkeletonPanel() {
  return (
    <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{
          background: 'var(--surface2)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          overflow: 'hidden',
        }}>
          <SkeletonCard lines={2} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonList({ count = 4 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 14 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <SkeletonBox width={36} height={36} radius={50} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
            <SkeletonBox height={13} width="70%" radius={6} />
            <SkeletonBox height={10} width="45%" radius={6} />
          </div>
        </div>
      ))}
    </div>
  );
}
