import React from 'react';
import styles from './LeftSidebar.module.css';
import { NODE_TYPES, MOCK_ROAD_CONGESTION } from '../../data/mockData';

function SbSection({ title, badge, children, collapsed }) {
  if (collapsed) return null;
  return (
    <div className={styles.section}>
      <div className={styles.title}>
        <span>{title}</span>
        {badge && <span className={styles.badge}>{badge}</span>}
      </div>
      {children}
    </div>
  );
}

function CongestionBar({ name, pct, level }) {
  const colors = { high: 'var(--red)', medium: 'var(--amber)', low: 'var(--clear)' };
  return (
    <div className={styles.roadRow}>
      <div className={styles.roadHead}>
        <span className={styles.roadName}>{name}</span>
        <span className={styles.roadPct} style={{ color: colors[level] }}>{pct}%</span>
      </div>
      <div className={styles.cbar}>
        <div className={styles.cbarFill} style={{ width: `${pct}%`, background: colors[level] }}/>
      </div>
    </div>
  );
}

export default function LeftSidebar({ nodes, edges, onAddNode, activeTool, showToast, onOpenParking, onOpenDecision, collapsed, getMapCenter }) {
  const handleDragStart = (e, nodeType) => {
    e.dataTransfer.setData('nodeType', JSON.stringify(nodeType));
  };
  const handleNodeTileClick = (nodeType) => {
    // Get current map center coords for placing node
    const center = getMapCenter?.();
    if (center) {
      // Slight random offset so multiple nodes don't stack
      const latOff = (Math.random() - 0.5) * 0.003;
      const lngOff = (Math.random() - 0.5) * 0.003;
      onAddNode(nodeType, 300 + Math.random() * 200, 200 + Math.random() * 200, center.lat + latOff, center.lng + lngOff);
    } else {
      onAddNode(nodeType, 300 + Math.random() * 200, 200 + Math.random() * 200);
    }
  };

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ''} sb-scroll`}
      aria-label="اللوحة اليسرى">
      <SbSection title="إجراءات سريعة" collapsed={collapsed}>
        <div className={styles.quickBtns}>
          <button className={styles.quickBtn} onClick={onOpenDecision} aria-label="أفضل وقت للسفر">
            <span>🧠</span><span>أفضل وقت؟</span>
          </button>
          <button className={styles.quickBtn} onClick={onOpenParking} aria-label="مواقف قريبة">
            <span>🅿</span><span>مواقف قريبة</span>
          </button>
        </div>
      </SbSection>

      <SbSection title="العناصر" badge={`${NODE_TYPES.length}`} collapsed={collapsed}>
        <div className={styles.palette}>
          {NODE_TYPES.map(nt => (
            <div
              key={nt.id}
              className={styles.tile}
              draggable
              onDragStart={e => handleDragStart(e, nt)}
              onClick={() => handleNodeTileClick(nt)}
              title={`اسحب لإضافة ${nt.label}`}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && handleNodeTileClick(nt)}
              aria-label={nt.label}
            >
              <span className={styles.tileIcon}>{nt.icon}</span>
              <span className={styles.tileLabel}>{nt.label}</span>
            </div>
          ))}
        </div>
        <div className={styles.hint}>💡 اسحب عنصراً للخريطة لإضافته</div>
      </SbSection>

      <SbSection title="إحصائيات الشبكة" collapsed={collapsed}>
        <div className={styles.statsGrid}>
          <div className={styles.statBox}>
            <span className={styles.statVal} style={{ color: '#2563eb' }}>{nodes.length}</span>
            <span className={styles.statLbl}>عقدة</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statVal} style={{ color: 'var(--green-d)' }}>{edges.length}</span>
            <span className={styles.statLbl}>طريق</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statVal} style={{ color: 'var(--amber)' }}>
              {edges.filter(e => e.congestion === 'high').length}
            </span>
            <span className={styles.statLbl}>مزدحم</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statVal} style={{ color: 'var(--red)' }}>1</span>
            <span className={styles.statLbl}>مغلق</span>
          </div>
        </div>
      </SbSection>

      <SbSection title="كثافة المرور" badge="مباشر" collapsed={collapsed}>
        <div className={styles.roads}>
          {MOCK_ROAD_CONGESTION.map(r => (
            <CongestionBar key={r.name} {...r}/>
          ))}
        </div>
      </SbSection>

      <SbSection title="الطقس وتأثيره" collapsed={collapsed}>
        <div className={styles.weatherRow}>
          <span className={styles.weatherIcon}>☀️</span>
          <div>
            <div className={styles.temp}>32°C</div>
            <div className={styles.cond}>صافٍ — رياح خفيفة</div>
          </div>
          <span className={styles.weatherImpact}>تأثير معتدل</span>
        </div>
      </SbSection>

      <SbSection title="تلميحات" collapsed={collapsed}>
        <div className={styles.tips}>
          <div className={styles.tip}>🖱 اسحب عقدة لتحريكها</div>
          <div className={styles.tip}>🔗 اختر "رسم طريق" لربط العقد</div>
          <div className={styles.tip}>📏 أداة القياس لحساب المسافات</div>
          <div className={styles.tip}>⌘K لفتح لوحة الأوامر</div>
        </div>
      </SbSection>
    </aside>
  );
}
