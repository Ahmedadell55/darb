import React, { useState } from 'react';
import styles from './Modals.module.css';

// ── Run Algorithm Modal ──────────────────────
export function RunModal({ nodes, onRun, onClose }) {
  const [start, setStart] = useState(nodes[0]?.id || '');
  const [end, setEnd] = useState(nodes[1]?.id || '');
  const [priority, setPriority] = useState('time');

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalTitle}>🛣 تشغيل خوارزمية <em>دَرْب</em></div>
        <div className={styles.modalSub}>حدد نقطتي البداية والنهاية لحساب أفضل مسار بالذكاء الاصطناعي</div>

        <label className={styles.lbl}>نقطة البداية</label>
        <select className={styles.sel} value={start} onChange={e => setStart(e.target.value)}>
          {nodes.map(n => <option key={n.id} value={n.id}>{n.label} — {n.id}</option>)}
        </select>

        <label className={styles.lbl}>نقطة النهاية</label>
        <select className={styles.sel} value={end} onChange={e => setEnd(e.target.value)}>
          {nodes.map(n => <option key={n.id} value={n.id}>{n.label} — {n.id}</option>)}
        </select>

        <label className={styles.lbl}>أولوية المسار</label>
        <select className={styles.sel} value={priority} onChange={e => setPriority(e.target.value)}>
          <option value="time">⚡ الأسرع وقتاً</option>
          <option value="dist">📏 أقصر مسافة</option>
          <option value="traffic">🌿 أخف ازدحاماً</option>
        </select>

        <div className={styles.actions}>
          <button className={styles.btnCancel} onClick={onClose}>إلغاء</button>
          <button className={styles.btnOk} onClick={() => { onRun(start, end, priority); onClose(); }}>
            ▶ تشغيل الآن
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Save As Modal ────────────────────────────
export function SaveAsModal({ currentName, onSave, onClose }) {
  const [name, setName] = useState(currentName || 'مشروع جديد');
  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalTitle}>💾 حفظ المشروع</div>
        <div className={styles.modalSub}>أدخل اسماً للمشروع قبل الحفظ</div>
        <label className={styles.lbl}>اسم المشروع</label>
        <input
          className={styles.inp}
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="مشروع جديد"
          autoFocus
          onKeyDown={e => e.key === 'Enter' && (onSave(name), onClose())}
        />
        <div className={styles.actions}>
          <button className={styles.btnCancel} onClick={onClose}>إلغاء</button>
          <button className={styles.btnOk} onClick={() => { onSave(name); onClose(); }}>
            💾 حفظ
          </button>
        </div>
      </div>
    </div>
  );
}

// ── New File Confirm Modal ───────────────────
export function NewFileModal({ onConfirm, onClose }) {
  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalTitle}>📄 مشروع جديد</div>
        <div className={styles.modalSub}>
          هل تريد إنشاء مشروع جديد؟ سيتم مسح التغييرات غير المحفوظة.
        </div>
        <div className={styles.actions}>
          <button className={styles.btnCancel} onClick={onClose}>إلغاء</button>
          <button className={styles.btnOk} onClick={() => { onConfirm(); onClose(); }}>
            ✓ إنشاء مشروع جديد
          </button>
        </div>
      </div>
    </div>
  );
}

// ── City Analysis Modal ──────────────────────
export function AnalysisModal({ analysis, nodes, edges, onClose }) {
  if (!analysis) return null;
  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`${styles.modal} ${styles.modalWide}`}>
        <button className={styles.closeX} onClick={onClose}>✕</button>
        <div className={styles.modalTitle}>📊 تحليل شامل للمدينة</div>
        <div className={styles.modalSub}>نتائج تحليل شبكة الطرق الحالية بالذكاء الاصطناعي</div>

        <div className={styles.analysisGrid}>
          <div className={styles.analysisStat}>
            <span className={styles.asVal} style={{ color: '#2563eb' }}>{analysis.totalNodes}</span>
            <span className={styles.asLbl}>عقدة</span>
          </div>
          <div className={styles.analysisStat}>
            <span className={styles.asVal} style={{ color: 'var(--green-d)' }}>{analysis.totalEdges}</span>
            <span className={styles.asLbl}>طريق</span>
          </div>
          <div className={styles.analysisStat}>
            <span className={styles.asVal} style={{ color: 'var(--amber)' }}>{analysis.avgDegree}</span>
            <span className={styles.asLbl}>متوسط الدرجة</span>
          </div>
          <div className={styles.analysisStat}>
            <span className={styles.asVal} style={{ color: 'var(--red)' }}>{analysis.congested}</span>
            <span className={styles.asLbl}>طريق مزدحم</span>
          </div>
        </div>

        <div className={styles.analysisSection}>
          <div className={styles.analysisSectionTitle}>💡 مقترحات تحسين الشبكة</div>
          {analysis.suggestions.map((s, i) => (
            <div key={i} className={styles.suggestion}>
              <span className={styles.sugN}>{i + 1}</span>
              {s}
            </div>
          ))}
        </div>

        <div className={styles.analysisSection}>
          <div className={styles.analysisSectionTitle}>🗺 توزيع العقد</div>
          <div className={styles.nodeList}>
            {nodes.map(n => (
              <div key={n.id} className={styles.nodeItem}>
                <span style={{ color: n.color }}>●</span>
                <span className={styles.nodeItemName}>{n.label}</span>
                <span className={styles.nodeItemMeta}>
                  {edges.filter(e => e.from === n.id || e.to === n.id).length} طرق متصلة
                </span>
              </div>
            ))}
          </div>
        </div>

        <button className={styles.btnOk} style={{ width: '100%', marginTop: 8 }} onClick={onClose}>
          إغلاق
        </button>
      </div>
    </div>
  );
}

// ── Toast ────────────────────────────────────
export function Toast({ toast }) {
  if (!toast) return null;
  const colors = {
    default: 'var(--black)',
    success: 'var(--green-d)',
    error: 'var(--red)',
    info: '#2563eb',
  };
  return (
    <div className={styles.toast} style={{ background: colors[toast.type] || colors.default }}>
      {toast.msg}
    </div>
  );
}

// ── Ticker ───────────────────────────────────
export function Ticker({ events }) {
  return (
    <div className={styles.ticker}>
      <div className={styles.tickerLabel}>🔴 مباشر</div>
      <div className={styles.tickerContent}>
        {[...events, ...events].map((ev, i) => (
          <div key={i} className={styles.tickerItem}>
            <div className={styles.dot} style={{ background: ev.color }}/>
            {ev.text}
          </div>
        ))}
      </div>
    </div>
  );
}
