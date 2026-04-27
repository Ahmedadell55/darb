import React, { useState } from 'react';
import styles from './DecisionEngine.module.css';
import { DEPARTURE_WINDOWS, ECO_ROUTES, DRIVING_ANALYTICS } from '../../data/mockData';
import { pathsAPI, analysisAPI } from '../../services/api';

function DepartureTimer({ onClose }) {
  const [selected, setSelected] = useState(2); // index of recommended
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionIcon}>🕐</span>
        <span className={styles.sectionTitle}>أفضل وقت للانطلاق</span>
      </div>
      <div className={styles.decisionBanner} style={{ background: '#eaf3ec', border: '1.5px solid #a8c9b0' }}>
        <span className={styles.decisionIcon}>🤖</span>
        <div>
          <div className={styles.decisionMain}>انتظر 45 دقيقة</div>
          <div className={styles.decisionSub}>ستوفر 12 دقيقة في رحلتك وتقلل استهلاك الوقود 23%</div>
        </div>
      </div>
      <div className={styles.windowList}>
        {DEPARTURE_WINDOWS.map((w, i) => (
          <div
            key={i}
            className={`${styles.windowCard} ${selected === i ? styles.windowSelected : ''} ${w.recommended ? styles.windowRec : ''}`}
            onClick={() => setSelected(i)}
          >
            <div className={styles.windowLeft}>
              {w.recommended && <span className={styles.recBadge}>⭐ مُوصى</span>}
              <div className={styles.windowTime}>{w.time}</div>
              <div className={styles.windowLabel} style={{ color: w.color }}>{w.label}</div>
            </div>
            <div className={styles.windowRight}>
              <div className={styles.windowTraffic} style={{ color: w.color }}>{w.trafficPct}%</div>
              {w.saving > 0 && <div className={styles.windowSaving}>وفر {w.saving} دق</div>}
            </div>
            <div className={styles.windowBar}>
              <div className={styles.windowFill} style={{ width: `${w.trafficPct}%`, background: w.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EcoRouting() {
  const [selected, setSelected] = useState('eco');
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionIcon}>🌿</span>
        <span className={styles.sectionTitle}>مقارنة المسارات البيئية</span>
      </div>
      <div className={styles.ecoGrid}>
        {ECO_ROUTES.map(r => (
          <div
            key={r.id}
            className={`${styles.ecoCard} ${selected === r.id ? styles.ecoSelected : ''} ${r.recommended ? styles.ecoRec : ''}`}
            onClick={() => setSelected(r.id)}
          >
            {r.recommended && <div className={styles.ecoRecBadge}>🌿 أفضل</div>}
            <div className={styles.ecoIcon}>{r.icon}</div>
            <div className={styles.ecoLabel}>{r.label}</div>
            <div className={styles.ecoStats}>
              <div className={styles.ecoStat}><span className={styles.ecoVal}>{r.time}</span><span className={styles.ecoUnit}>دق</span></div>
              <div className={styles.ecoStat}><span className={styles.ecoVal}>{r.dist}</span><span className={styles.ecoUnit}>كم</span></div>
              <div className={styles.ecoStat}><span className={styles.ecoVal}>{r.fuel}</span><span className={styles.ecoUnit}>لتر</span></div>
            </div>
            <div className={styles.ecoCo2}>CO₂: {r.co2} كغ</div>
            {r.toll > 0 && <div className={styles.ecoToll}>رسوم: {r.toll} ج</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function DrivingScore() {
  const d = DRIVING_ANALYTICS;
  const days = ['أح', 'إث', 'ثل', 'أر', 'خم', 'جم', 'سب'];
  const maxTrend = Math.max(...d.weeklyTrend);
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionIcon}>📊</span>
        <span className={styles.sectionTitle}>تحليل سلوك القيادة</span>
      </div>
      <div className={styles.scoreRow}>
        <div className={styles.scoreCircle}>
          <svg viewBox="0 0 80 80" width="80" height="80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="var(--border2)" strokeWidth="7"/>
            <circle cx="40" cy="40" r="34" fill="none" stroke="var(--green-d)" strokeWidth="7"
              strokeDasharray={`${(d.score/100)*213.6} 213.6`}
              strokeLinecap="round" transform="rotate(-90 40 40)"/>
          </svg>
          <div className={styles.scoreNum}>{d.score}</div>
          <div className={styles.scoreGrade}>{d.grade}</div>
        </div>
        <div className={styles.scoreStats}>
          <div className={styles.scoreStat}><span>🚗 الرحلات</span><span>{d.trips}</span></div>
          <div className={styles.scoreStat}><span>📍 إجمالي كم</span><span>{d.totalKm}</span></div>
          <div className={styles.scoreStat}><span>⚡ متوسط السرعة</span><span>{d.avgSpeed} كم/س</span></div>
          <div className={styles.scoreStat}><span>⛽ كفاءة الوقود</span><span>{d.fuelEfficiency} كم/ل</span></div>
          <div className={styles.scoreStat}><span>🛑 كبح مفاجئ</span><span style={{color:'var(--red)'}}>{d.hardBrakes} مرة</span></div>
          <div className={styles.scoreStat}><span>🔒 درجة الأمان</span><span style={{color:'var(--green-d)'}}>{d.safetyScore}%</span></div>
        </div>
      </div>
      <div className={styles.trendChart}>
        <div className={styles.trendTitle}>أداء الأسبوع</div>
        <div className={styles.trendBars}>
          {d.weeklyTrend.map((v, i) => (
            <div key={i} className={styles.trendBarWrap}>
              <div className={styles.trendBar} style={{ height: `${(v/maxTrend)*44}px`, background: v >= 80 ? 'var(--green-d)' : v >= 70 ? 'var(--amber)' : 'var(--red)' }} />
              <div className={styles.trendLabel}>{days[i]}</div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.tips}>
        {d.tips.map((t, i) => (
          <div key={i} className={styles.tip}><span>{t.icon}</span><span>{t.text}</span></div>
        ))}
      </div>
    </div>
  );
}

export default function DecisionEngine({ onClose }) {
  const [tab, setTab] = useState('departure');
  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <div className={styles.title}>🧠 محرك القرار الذكي</div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div className={styles.tabs}>
          {[
            { id: 'departure', label: '🕐 وقت الانطلاق' },
            { id: 'eco',       label: '🌿 المسار البيئي' },
            { id: 'driving',   label: '📊 سلوك القيادة' },
          ].map(t => (
            <button key={t.id} className={`${styles.tab} ${tab === t.id ? styles.tabActive : ''}`} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
        <div className={styles.body}>
          {tab === 'departure' && <DepartureTimer />}
          {tab === 'eco'       && <EcoRouting />}
          {tab === 'driving'   && <DrivingScore />}
        </div>
      </div>
    </div>
  );
}
