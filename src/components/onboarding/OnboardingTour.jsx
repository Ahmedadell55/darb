import React, { useState, useEffect } from 'react';
import styles from './OnboardingTour.module.css';

const STEPS = [
  {
    icon: '🛣',
    title: 'مرحباً في دَرْب AI!',
    desc: 'منصة ذكاء الطرق الأولى عربياً. خلال 30 ثانية ستتعلم كل شيء.',
    highlight: null,
  },
  {
    icon: '🗺',
    title: 'الخريطة الذكية',
    desc: 'الخريطة في المنتصف. اسحب العناصر من الشريط الأيسر وأسقطها على الخريطة لإضافة عقد مرورية.',
    highlight: 'left',
  },
  {
    icon: '🔗',
    title: 'ارسم الطرق',
    desc: 'اختر أداة "رسم طريق" من شريط الأدوات العلوي ثم انقر على عقدتين لربطهما بطريق.',
    highlight: 'nav',
  },
  {
    icon: '🧠',
    title: 'شغّل الخوارزمية',
    desc: 'من اللوحة اليمنى اختر الخوارزمية (Dijkstra أو A*) وحدد نقطة البداية والنهاية ثم اضغط تشغيل.',
    highlight: 'right',
  },
  {
    icon: '⚡',
    title: 'المميزات المتقدمة',
    desc: 'من قائمة "المميزات" في أعلى الشاشة: إدارة الأسطول، مواقف ذكية، نظام مكافآت، ومساعد صوتي.',
    highlight: 'nav',
  },
  {
    icon: '⌨',
    title: 'اختصارات مفيدة',
    desc: 'Ctrl+K لفتح لوحة الأوامر · Ctrl+S للحفظ · Ctrl+N لمشروع جديد. وضع ليلي في أعلى اليمين.',
    highlight: null,
  },
  {
    icon: '🚀',
    title: 'أنت جاهز!',
    desc: 'ابدأ ببناء شبكتك المرورية الآن. يمكنك فتح هذه الجولة مجدداً من قائمة المساعدة.',
    highlight: null,
  },
];

export default function OnboardingTour({ onFinish }) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const next = () => isLast ? onFinish() : setStep(s => s + 1);
  const prev = () => setStep(s => Math.max(s - 1, 0));
  const skip = () => onFinish();

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onFinish();
      if (e.key === 'ArrowLeft') setStep(s => Math.min(s + 1, STEPS.length - 1));
      if (e.key === 'ArrowRight') setStep(s => Math.max(s - 1, 0));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onFinish]);

  return (
    <div className={styles.overlay}>
      {/* Corner highlights */}
      {current.highlight === 'left'  && <div className={styles.glowLeft}/>}
      {current.highlight === 'right' && <div className={styles.glowRight}/>}
      {current.highlight === 'nav'   && <div className={styles.glowNav}/>}

      <div className={styles.card}>
        <button className={styles.skipBtn} onClick={skip} aria-label="تخطي">✕</button>

        <div className={styles.iconWrap}>
          <span className={styles.icon}>{current.icon}</span>
        </div>

        <div className={styles.stepBadge}>الخطوة {step + 1} من {STEPS.length}</div>

        <h2 className={styles.title}>{current.title}</h2>
        <p className={styles.desc}>{current.desc}</p>

        {/* Progress dots */}
        <div className={styles.dots}>
          {STEPS.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === step ? styles.dotActive : ''} ${i < step ? styles.dotDone : ''}`}
              onClick={() => setStep(i)}
              aria-label={`الخطوة ${i + 1}`}
            />
          ))}
        </div>

        <div className={styles.actions}>
          {step > 0 && (
            <button className={styles.btnBack} onClick={prev}>← السابق</button>
          )}
          <button className={styles.btnNext} onClick={next}>
            {isLast ? '🚀 ابدأ الآن!' : 'التالي →'}
          </button>
        </div>
      </div>
    </div>
  );
}
