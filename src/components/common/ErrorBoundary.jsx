import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
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
        }}>
          <div style={{ fontSize: 52 }}>⚠️</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text, #1a1a1a)' }}>
            حدث خطأ غير متوقع
          </div>
          <div style={{
            color: 'var(--muted, #7a7a72)',
            fontSize: 14,
            background: 'var(--surface2, #ede9e0)',
            padding: '10px 20px',
            borderRadius: 10,
            maxWidth: 400,
            textAlign: 'center',
            lineHeight: 1.6,
          }}>
            {this.state.error?.message || 'خطأ غير معروف'}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              style={{
                background: 'var(--surface, white)',
                color: 'var(--text, #1a1a1a)',
                border: '1.5px solid var(--border2, #ddd)',
                borderRadius: 10,
                padding: '10px 24px',
                fontSize: 14,
                cursor: 'pointer',
                fontFamily: 'Tajawal, sans-serif',
                fontWeight: 600,
              }}
            >
              🔄 إعادة المحاولة
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: 'var(--green-d, #2d5a3d)',
                color: 'white',
                border: 'none',
                borderRadius: 10,
                padding: '10px 24px',
                fontSize: 14,
                cursor: 'pointer',
                fontFamily: 'Tajawal, sans-serif',
                fontWeight: 700,
              }}
            >
              🏠 تحميل الصفحة
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
