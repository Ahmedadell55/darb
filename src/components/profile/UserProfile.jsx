import React, { useState } from 'react';
import { authAPI } from '../../services/api';
import styles from './UserProfile.module.css';

const PLANS = [
  { id: 'free',       label: 'مجاني',       color: '#6b7280', features: ['5 مشاريع', 'خرائط أساسية'] },
  { id: 'pro',        label: 'Pro',          color: '#2563eb', features: ['مشاريع غير محدودة', 'جميع الخوارزميات', 'تصدير PDF'] },
  { id: 'enterprise', label: 'Enterprise',   color: '#7c3aed', features: ['كل مميزات Pro', 'API مخصص', 'دعم 24/7'] },
];

export default function UserProfile({ user, onClose, onUpdate, onLogout }) {
  const [tab, setTab]           = useState('profile');
  const [name, setName]         = useState(user?.name || '');
  const [email, setEmail]       = useState(user?.email || '');
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);

  const currentPlan = PLANS.find(p => p.id === (user?.plan?.toLowerCase() || 'free')) || PLANS[0];

  const handleSave = async () => {
    setSaving(true);
    try {
      // placeholder - userAPI not in this backend
      onUpdate?.({ ...user, name, email });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error('Update failed:', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.avatar}>{user?.avatar || '👤'}</div>
            <div>
              <div className={styles.userName}>{user?.name}</div>
              <div className={styles.userPlan} style={{ color: currentPlan.color }}>
                ✦ {currentPlan.label}
              </div>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="إغلاق">✕</button>
        </div>

        <div className={styles.tabs}>
          {[
            { id: 'profile', label: '👤 الملف' },
            { id: 'plan',    label: '💎 الخطة' },
            { id: 'stats',   label: '📊 إحصائيات' },
          ].map(t => (
            <button
              key={t.id}
              className={`${styles.tab} ${tab === t.id ? styles.tabActive : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'profile' && (
          <div className={styles.body}>
            <div className={styles.avatarSection}>
              <div className={styles.avatarLarge}>{user?.avatar || '👤'}</div>
              <button className={styles.btnChangeAvatar}>تغيير الصورة</button>
              {/* [API] file upload → userAPI.updateMe({ avatar: base64 }) */}
            </div>
            <label className={styles.lbl}>الاسم الكامل</label>
            <input
              className={styles.inp}
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="اسمك الكامل"
            />
            <label className={styles.lbl}>البريد الإلكتروني</label>
            <input
              className={styles.inp}
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email"
              placeholder="بريدك الإلكتروني"
            />
            <label className={styles.lbl}>كلمة المرور الجديدة</label>
            <input
              className={styles.inp}
              type="password"
              placeholder="اتركه فارغاً للإبقاء على الحالية"
            />
            {/* [API] password change → authAPI.changePassword(old, new) */}
            <div className={styles.actions}>
              <button className={styles.btnSave} onClick={handleSave} disabled={saving}>
                {saving ? '⏳ جارٍ الحفظ...' : saved ? '✓ تم الحفظ!' : '💾 حفظ التغييرات'}
              </button>
              <button className={styles.btnLogout} onClick={onLogout}>
                🚪 تسجيل الخروج
              </button>
            </div>
          </div>
        )}

        {tab === 'plan' && (
          <div className={styles.body}>
            <div className={styles.currentPlanCard} style={{ borderColor: currentPlan.color }}>
              <div className={styles.cpLabel}>خطتك الحالية</div>
              <div className={styles.cpName} style={{ color: currentPlan.color }}>{currentPlan.label}</div>
              <div className={styles.cpFeatures}>
                {currentPlan.features.map(f => (
                  <div key={f} className={styles.cpFeature}>✓ {f}</div>
                ))}
              </div>
            </div>
            <div className={styles.plansGrid}>
              {PLANS.filter(p => p.id !== currentPlan.id).map(plan => (
                <div key={plan.id} className={styles.planCard}>
                  <div className={styles.planName} style={{ color: plan.color }}>{plan.label}</div>
                  {plan.features.map(f => <div key={f} className={styles.planFeature}>• {f}</div>)}
                  <button className={styles.btnUpgrade} style={{ background: plan.color }}>
                    ترقية إلى {plan.label}
                  </button>
                  {/* [API] → payment/subscription flow */}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'stats' && (
          <div className={styles.body}>
            <div className={styles.statsGrid}>
              <div className={styles.statBox}>
                <span className={styles.statVal}>{user?.savedProjects || 0}</span>
                <span className={styles.statLbl}>مشروع محفوظ</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statVal}>{user?.points?.toLocaleString() || 0}</span>
                <span className={styles.statLbl}>نقطة مكافأة</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statVal}>{user?.level || 'Bronze'}</span>
                <span className={styles.statLbl}>المستوى</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statVal}>#{user?.rank || '—'}</span>
                <span className={styles.statLbl}>الترتيب</span>
              </div>
            </div>
            <div className={styles.activityNote}>
              {/* [API] getMe() → user stats + activity history */}
              <div className={styles.noteIcon}>📊</div>
              <div className={styles.noteText}>الإحصائيات التفصيلية ستظهر عند ربط الـ API</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
