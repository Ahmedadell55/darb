import React from 'react';

export default function NotFound({ onGoHome }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'var(--bg, #f0ece3)',
      fontFamily: 'Tajawal, sans-serif',
      direction: 'rtl',
      gap: 16,
      padding: 24,
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 64 }}>🛣</div>
      <div style={{ fontSize: 56, fontWeight: 900, color: 'var(--green-d, #2d5a3d)', fontFamily: "'Space Mono', monospace" }}>
        404
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text, #1a1a1a)' }}>
        الصفحة غير موجودة
      </div>
      <div style={{ fontSize: 14, color: 'var(--muted, #7a7a72)', maxWidth: 320, lineHeight: 1.6 }}>
        يبدو أنك وصلت إلى طريق مسدود! دَرْب AI لم يتمكن من إيجاد هذه الصفحة.
      </div>
      <button
        onClick={onGoHome || (() => window.location.href = '/')}
        style={{
          background: 'var(--green-d, #2d5a3d)',
          color: 'white',
          border: 'none',
          borderRadius: 12,
          padding: '12px 28px',
          fontSize: 15,
          cursor: 'pointer',
          fontFamily: 'Tajawal, sans-serif',
          fontWeight: 700,
          marginTop: 8,
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={e => e.target.style.opacity = '0.88'}
        onMouseLeave={e => e.target.style.opacity = '1'}
      >
        🏠 العودة للرئيسية
      </button>
    </div>
  );
}
