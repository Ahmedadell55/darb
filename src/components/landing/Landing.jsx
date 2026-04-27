import React, { useState, useEffect, useRef } from 'react';
import styles from './Landing.module.css';
import { authAPI, setToken, loginAndGetUser, registerAndLogin, extractMsg } from '../../services/api';

// extractMsg is imported from api.js

// ── Demo login (no backend needed) ──────────────────
function demoLogin(onLogin) {
  const demoUser = {
    id: 'demo-001',
    name: 'مستخدم تجريبي',
    username: 'demo',
    email: 'demo@darb-ai.com',
    avatar: '🎮',
    plan: 'free',
    points: 120,
    level: 'Bronze',
    rank: 42,
  };
  setToken('demo-token-local');
  onLogin(demoUser, 'demo-token-local');
}

// ── Auth Box ─────────────────────────────────────────
function AuthBox({ onLogin }) {
  const [mode, setMode]         = useState('login');
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState('');

  const validate = () => {
    if (!email.trim()) { setError('البريد الإلكتروني مطلوب'); return false; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('بريد إلكتروني غير صحيح'); return false; }
    if (mode !== 'forgot' && password.length < 6) { setError('كلمة المرور 6 أحرف على الأقل'); return false; }
    if (mode === 'register' && !name.trim()) { setError('الاسم مطلوب'); return false; }
    return true;
  };

  const handleSubmit = async () => {
    setError('');
    if (!validate()) return;
    setLoading(true);
    try {
      if (mode === 'forgot') {
        await authAPI.forgotPassword(email);
        setSuccess('تم إرسال رابط الاستعادة على بريدك ✓');
        setLoading(false);
        return;
      }

      if (mode === 'register') {
        const { token, user } = await registerAndLogin(name, email, password);
        onLogin(user, token);
      } else {
        const { token, user } = await loginAndGetUser(email, password);
        onLogin(user, token);
      }
    } catch (e) {
      setError(extractMsg(e));
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const { url } = await authAPI.getGoogleUrl();
      if (url) window.location.href = url;
      else setError('Google OAuth غير متاح حالياً');
    } catch {
      setError('Google OAuth غير متاح حالياً');
    }
    setLoading(false);
  };

  if (mode === 'forgot') {
    return (
      <div className={styles.authBox}>
        <h3 className={styles.authTitle}>استعادة كلمة المرور</h3>
        <p className={styles.authSub}>سنرسل رابط الاستعادة على بريدك</p>
        {success
          ? <div className={styles.successMsg}>{success}</div>
          : (
            <>
              <input
                className={styles.inp}
                placeholder="البريد الإلكتروني"
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
              {error && <div className={styles.err}>{error}</div>}
              <button className={styles.btnPrimary} onClick={handleSubmit} disabled={loading}>
                {loading ? '⏳ جارٍ...' : '📧 إرسال رابط الاستعادة'}
              </button>
            </>
          )}
        <button className={styles.linkBtn} onClick={() => { setMode('login'); setSuccess(''); setError(''); }}>
          ← العودة لتسجيل الدخول
        </button>
      </div>
    );
  }

  return (
    <div className={styles.authBox}>
      <div className={styles.tabs}>
        <button
          className={styles.tab + (mode === 'login' ? ' ' + styles.tabActive : '')}
          onClick={() => { setMode('login'); setError(''); }}
        >
          تسجيل الدخول
        </button>
        <button
          className={styles.tab + (mode === 'register' ? ' ' + styles.tabActive : '')}
          onClick={() => { setMode('register'); setError(''); }}
        >
          حساب جديد
        </button>
      </div>

      {mode === 'register' && (
        <input
          className={styles.inp}
          placeholder="الاسم الكامل"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />
      )}
      <input
        className={styles.inp}
        placeholder="البريد الإلكتروني"
        value={email}
        onChange={e => setEmail(e.target.value)}
        type="email"
        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
      />
      <input
        className={styles.inp}
        placeholder="كلمة المرور"
        value={password}
        onChange={e => setPassword(e.target.value)}
        type="password"
        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
      />

      {error && <div className={styles.err}>{error}</div>}

      <button className={styles.btnPrimary} onClick={handleSubmit} disabled={loading}>
        {loading ? '⏳ جارٍ...' : mode === 'login' ? 'دخول' : 'إنشاء حساب'}
      </button>

      <button className={styles.btnGoogle} onClick={handleGoogle} disabled={loading}>
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.32-8.16 2.32-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
        متابعة بـ Google
      </button>

      {mode === 'login' && (
        <button className={styles.linkBtn} onClick={() => { setMode('forgot'); setError(''); }}>
          نسيت كلمة المرور؟
        </button>
      )}

      <div style={{ textAlign: 'center', margin: '4px 0', color: 'var(--muted)', fontSize: '12px' }}>— أو —</div>

      <button
        className={styles.linkBtn}
        style={{ width: '100%', padding: '8px', background: 'rgba(255,193,7,0.12)', borderRadius: '8px', color: '#c87f0a', fontWeight: '700' }}
        onClick={() => demoLogin(onLogin)}
        disabled={loading}
      >
        🎮 تجربة بدون تسجيل (Demo)
      </button>
    </div>
  );
}

// ── Stats Counter ─────────────────────────────────────
function Counter({ end, suffix = '', label }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      let start = 0;
      const step = end / 60;
      const interval = setInterval(() => {
        start += step;
        if (start >= end) { setCount(end); clearInterval(interval); }
        else setCount(Math.floor(start));
      }, 16);
    });
    const el = ref.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [end]);
  return (
    <div ref={ref} className={styles.statBox}>
      <div className={styles.statVal}>{count.toLocaleString()}{suffix}</div>
      <div className={styles.statLbl}>{label}</div>
    </div>
  );
}

// ── Landing Main ───────────────────────────────────────
export default function Landing({ onLogin, theme, onToggleTheme }) {
  const [showAuth, setShowAuth] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setHeroVisible(true), 100); return () => clearTimeout(t); }, []);

  // Close auth modal on Escape key
  useEffect(() => {
    if (!showAuth) return;
    const handler = (e) => { if (e.key === 'Escape') setShowAuth(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showAuth]);

  const features = [
    { icon: '🧠', title: '4 خوارزميات ذكية', desc: 'Dijkstra · A* · Bellman-Ford · Floyd-Warshall — اختر الأنسب لمشروعك' },
    { icon: '📍', title: 'خريطة تفاعلية', desc: 'أضف عقداً وطرقاً مباشرة على الخريطة مع حساب المسافة الحقيقية تلقائياً' },
    { icon: '🚛', title: 'إدارة الأسطول', desc: 'تتبع مركباتك في الوقت الفعلي وتحسين مساراتها' },
    { icon: '🅿', title: 'مواقف ذكية', desc: 'ابحث عن أقرب موقف متاح واحجز مكانك في ثوانٍ' },
    { icon: '🤖', title: 'مساعد صوتي', desc: 'اسأل بالعربية واحصل على توصيات المرور فوراً' },
    { icon: '🏆', title: 'نظام مكافآت', desc: 'اكسب نقاطاً واصعد في المتصدرين مع كل رحلة موفرة' },
  ];

  const plans = [
    { name: 'مجاني', price: '0', period: 'للأبد', color: '#6b7280', features: ['5 مشاريع', 'خوارزميتان', 'خريطة أساسية', 'تصدير JSON'] },
    { name: 'Pro', price: '49', period: '/شهر', color: 'var(--green-d)', badge: '⭐ الأشهر', features: ['مشاريع غير محدودة', '4 خوارزميات', 'إدارة أسطول', 'مساعد صوتي', 'تحليل المدينة', 'أولوية الدعم'] },
    { name: 'Enterprise', price: '199', period: '/شهر', color: '#7c3aed', features: ['كل مميزات Pro', 'API مخصص', 'SLA 99.9%', 'تدريب الفريق', 'لوحة تحكم مخصصة'] },
  ];

  const testimonials = [
    { name: 'أحمد الشمري', role: 'مدير لوجستي', text: 'وفّرنا 30% من تكاليف الوقود في أول شهر!', avatar: '👨‍💼' },
    { name: 'سارة المنصور', role: 'مهندسة بنية تحتية', text: 'أداة لا غنى عنها لتحليل شبكات الطرق.', avatar: '👩‍💻' },
    { name: 'فيصل الدوسري', role: 'محلل نقل ذكي', text: 'الخوارزميات دقيقة والواجهة رائعة.', avatar: '👨‍🔬' },
  ];

  return (
    <div className={styles.landing}>
      {/* Navbar */}
      <nav className={styles.nav} role="navigation" aria-label="التنقل الرئيسي">
        <div className={styles.navBrand}>
          <span className={styles.navLogo}>🛣</span>
          <span className={styles.navName}>دَرْب AI</span>
        </div>
        <div className={styles.navLinks}>
          <a href="#features" className={styles.navLink}>المميزات</a>
          <a href="#pricing" className={styles.navLink}>الأسعار</a>
          <button className={styles.themeBtn} onClick={onToggleTheme} title="تبديل الوضع" aria-label="تبديل الوضع">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button className={styles.navCta} onClick={() => setShowAuth(true)}>ابدأ مجاناً</button>
        </div>
      </nav>

      {/* Hero */}
      <section className={`${styles.hero} ${heroVisible ? styles.heroVisible : ''}`} aria-labelledby="hero-title">
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>🚀 منصة الطرق الذكية</div>
          <h1 id="hero-title" className={styles.heroTitle}>
            حلّل شبكات الطرق
            <span className={styles.heroAccent}>بذكاء اصطناعي حقيقي</span>
          </h1>
          <p className={styles.heroSub}>
            أضف عقداً، ارسم طرقاً، وشاهد الخوارزمية تجد المسار الأمثل في الوقت الفعلي.
            دعم كامل للخرائط العربية وتحليل حركة المرور.
          </p>
          <div className={styles.heroBtns}>
            <button className={styles.btnHeroPrimary} onClick={() => setShowAuth(true)}>🚀 ابدأ مجاناً</button>
            <a href="#features" className={styles.btnHeroSecondary}>استكشف المميزات ↓</a>
          </div>
        </div>
        <div className={styles.heroVisual} aria-hidden="true">
          <div className={styles.heroMap}>
            <div className={styles.mapNode} style={{ top: '20%', left: '30%' }}>🏙</div>
            <div className={styles.mapNode} style={{ top: '50%', left: '60%' }}>🏢</div>
            <div className={styles.mapNode} style={{ top: '70%', left: '25%' }}>🏥</div>
            <div className={styles.mapNode} style={{ top: '35%', left: '70%' }}>🏫</div>
            <svg className={styles.mapLines} viewBox="0 0 300 200" aria-hidden="true">
              <line x1="90" y1="40" x2="180" y2="100" stroke="var(--green-d)" strokeWidth="2" strokeDasharray="5,3" opacity="0.6"/>
              <line x1="180" y1="100" x2="75" y2="140" stroke="var(--green-d)" strokeWidth="2" strokeDasharray="5,3" opacity="0.6"/>
              <line x1="90" y1="40" x2="210" y2="70" stroke="var(--green-l)" strokeWidth="3" opacity="0.8"/>
              <line x1="210" y1="70" x2="180" y2="100" stroke="var(--green-l)" strokeWidth="3" opacity="0.8"/>
            </svg>
            <div className={styles.mapPulse}/>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={styles.stats} aria-label="إحصائيات المنصة">
        <Counter end={1200} suffix="+" label="مدينة محللة" />
        <Counter end={98}   suffix="%" label="دقة الخوارزميات" />
        <Counter end={30}   suffix="%" label="توفير في الوقود" />
        <Counter end={5000} suffix="+" label="مستخدم نشط" />
      </section>

      {/* Features */}
      <section id="features" className={styles.features} aria-labelledby="features-title">
        <div className={styles.sectionHead}>
          <h2 id="features-title" className={styles.sectionTitle}>كل ما تحتاجه لتحليل الطرق</h2>
          <p className={styles.sectionSub}>منصة متكاملة تجمع الخوارزميات والخرائط وإدارة الأسطول في مكان واحد</p>
        </div>
        <div className={styles.featGrid}>
          {features.map((f, i) => (
            <div key={i} className={styles.featCard}>
              <div className={styles.featIcon} aria-hidden="true">{f.icon}</div>
              <div className={styles.featTitle}>{f.title}</div>
              <div className={styles.featDesc}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className={styles.pricing} aria-labelledby="pricing-title">
        <div className={styles.sectionHead}>
          <h2 id="pricing-title" className={styles.sectionTitle}>اختر خطتك</h2>
          <p className={styles.sectionSub}>ابدأ مجاناً وطوّر حين تحتاج</p>
        </div>
        <div className={styles.plansGrid}>
          {plans.map((p, i) => (
            <div key={i} className={`${styles.planCard} ${p.badge ? styles.planFeatured : ''}`}>
              {p.badge && <div className={styles.planBadge}>{p.badge}</div>}
              <div className={styles.planName} style={{ color: p.color }}>{p.name}</div>
              <div className={styles.planPrice}>
                <span className={styles.planCurrency}>$</span>
                <span className={styles.planAmount}>{p.price}</span>
                <span className={styles.planPeriod}>{p.period}</span>
              </div>
              <ul className={styles.planFeatures}>
                {p.features.map((f, j) => (
                  <li key={j} className={styles.planFeature}>✓ {f}</li>
                ))}
              </ul>
              <button
                className={styles.planBtn}
                style={{ background: p.color }}
                onClick={() => setShowAuth(true)}
              >
                ابدأ الآن
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className={styles.testimonials} aria-labelledby="testimonials-title">
        <div className={styles.sectionHead}>
          <h2 id="testimonials-title" className={styles.sectionTitle}>ماذا يقول مستخدمونا</h2>
        </div>
        <div className={styles.testimGrid}>
          {testimonials.map((t, i) => (
            <div key={i} className={styles.testimCard}>
              <div className={styles.testimAvatar} aria-hidden="true">{t.avatar}</div>
              <div className={styles.testimText}>"{t.text}"</div>
              <div className={styles.testimName}>{t.name}</div>
              <div className={styles.testimRole}>{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>جاهز لتحسين طرقك؟</h2>
        <p className={styles.ctaSub}>انضم لآلاف المستخدمين الذين يوفرون الوقت والوقود يومياً</p>
        <button className={styles.ctaBtn} onClick={() => setShowAuth(true)}>
          🚀 ابدأ مجاناً — لا يلزم بطاقة
        </button>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerBrand}>🛣 دَرْب AI</div>
        <div className={styles.footerLinks}>
          <a href="#features">المميزات</a>
          <a href="#pricing">الأسعار</a>
          <span>© 2025 دَرْب AI</span>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuth && (
        <div
          className={styles.authOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="تسجيل الدخول"
          onClick={e => e.target === e.currentTarget && setShowAuth(false)}
        >
          <div className={styles.authModal}>
            <button className={styles.authClose} onClick={() => setShowAuth(false)} aria-label="إغلاق">✕</button>
            <div className={styles.authLogo}>🛣 دَرْب AI</div>
            <AuthBox onLogin={(user, token) => { onLogin(user, token); setShowAuth(false); }} />
          </div>
        </div>
      )}
    </div>
  );
}
