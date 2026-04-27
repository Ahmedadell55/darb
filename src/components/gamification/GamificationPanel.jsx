import React, { useState, useEffect } from 'react';
import styles from './GamificationPanel.module.css';
import { GAMIFICATION_BADGES, LEADERBOARD, MOCK_USER } from '../../data/mockData';

const LEVEL_COLORS = { Platinum: '#7c3aed', Gold: '#c87f0a', Silver: '#6b7280', Bronze: '#92400e' };

export default function GamificationPanel({ onClose }) {
  const [tab, setTab]               = useState('badges');
  const [badges, setBadges]         = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading]       = useState(true);

  // Try to get user from localStorage
  const storedUser = (() => { try { return JSON.parse(localStorage.getItem('darb_user')) || MOCK_USER; } catch { return MOCK_USER; } })();
  const displayUser = { ...MOCK_USER, ...storedUser };

  useEffect(() => {
    // Use mock data (gamification API not in backend spec)
    setBadges(GAMIFICATION_BADGES);
    setLeaderboard(LEADERBOARD);
    setLoading(false);
  }, []);

  const nextLevelPts = 1500;
  const progress = Math.round(((displayUser.points || 0) / nextLevelPts) * 100);

  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <div className={styles.title}>🏆 نظام المكافآت</div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* User rank card */}
        <div className={styles.rankCard}>
          <div className={styles.rankLeft}>
            <div className={styles.rankAvatar}>{displayUser.avatar || '👤'}</div>
            <div>
              <div className={styles.rankName}>{displayUser.name || displayUser.username}</div>
              <div className={styles.rankLevel} style={{ color: LEVEL_COLORS[displayUser.level] || '#c87f0a' }}>
                ✦ {displayUser.level || 'Bronze'}
              </div>
            </div>
          </div>
          <div className={styles.rankRight}>
            <div className={styles.rankPts}>{(displayUser.points || 0).toLocaleString()}</div>
            <div className={styles.rankPtsLbl}>نقطة</div>
            <div className={styles.rankPos}>المرتبة #{displayUser.rank || '—'}</div>
          </div>
        </div>
        <div className={styles.progressWrap}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${Math.min(100, progress)}%` }} />
          </div>
          <div className={styles.progressLbl}>{displayUser.points || 0} / {nextLevelPts} للمستوى التالي</div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {[{ id: 'badges', label: '🏅 الشارات' }, { id: 'leaderboard', label: '🏆 المتصدرون' }].map(t => (
            <button key={t.id} className={`${styles.tab} ${tab === t.id ? styles.tabActive : ''}`} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: 20, textAlign: 'center' }}>⏳ جارٍ التحميل...</div>
        ) : tab === 'badges' ? (
          <div className={styles.badgeGrid}>
            {badges.map(b => (
              <div key={b.id} className={`${styles.badge} ${b.earned ? styles.badgeEarned : styles.badgeLocked}`}>
                <div className={styles.badgeIcon}>{b.icon}</div>
                <div className={styles.badgeName}>{b.label}</div>
                <div className={styles.badgeDesc}>{b.desc}</div>
                <div className={styles.badgePts}>+{b.points} نقطة</div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.leaderboard}>
            {leaderboard.map((u, i) => (
              <div key={i} className={`${styles.lbRow} ${u.isMe ? styles.lbMe : ''}`}>
                <div className={styles.lbRank}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${u.rank}`}
                </div>
                <div className={styles.lbAvatar}>{u.avatar}</div>
                <div className={styles.lbName}>{u.name}</div>
                <div className={styles.lbPts}>{u.points.toLocaleString()} نقطة</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
