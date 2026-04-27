import React, { useState, useEffect, useCallback } from 'react';
import styles from './FleetPanel.module.css';
import { MOCK_FLEET, FLEET_STATS } from '../../data/mockData';
import { SkeletonList } from '../common/Skeleton';
import { fleetAPI } from '../../services/api';

const STATUS_META = {
  moving:  { label: 'يتحرك',  color: '#2d5a3d', bg: 'var(--green-bg)' },
  idle:    { label: 'خامل',   color: '#c87f0a', bg: 'var(--amber-bg)' },
  stopped: { label: 'متوقف',  color: '#c0392b', bg: 'var(--red-bg)'   },
};
const TYPE_ICON = { truck: '🚛', van: '🚐', car: '🚗' };

function VehicleCard({ v, selected, onSelect }) {
  const sm = STATUS_META[v.status] || STATUS_META.idle;
  return (
    <div
      className={`${styles.vCard} ${selected ? styles.vCardSelected : ''}`}
      onClick={() => onSelect(v.id)}
      role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onSelect(v.id)}
      aria-selected={selected}
    >
      <div className={styles.vTop}>
        <span className={styles.vIcon}>{TYPE_ICON[v.type] || '🚗'}</span>
        <div className={styles.vInfo}>
          <div className={styles.vId}>{v.id}</div>
          <div className={styles.vDriver}>{v.driver}</div>
        </div>
        <span className={styles.vStatus} style={{ color: sm.color, background: sm.bg }}>{sm.label}</span>
      </div>
      <div className={styles.vRoute}>{v.route}</div>
      <div className={styles.vMeta}>
        <span>🏎 {v.speed} كم/س</span>
        <span>⛽ {v.fuel}%</span>
        <span>⏱ {v.eta}</span>
      </div>
      {v.alerts && v.alerts.length > 0 && (
        <div className={styles.vAlerts}>
          {v.alerts.map((a, i) => (
            <span key={i} className={styles.vAlert}>⚠ {a}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function FuelBar({ pct }) {
  const color = pct > 60 ? '#2d5a3d' : pct > 30 ? '#c87f0a' : '#c0392b';
  return (
    <div className={styles.fuelBar}>
      <div className={styles.fuelFill} style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

export default function FleetPanel({ onClose }) {
  const [fleet, setFleet]       = useState([]);
  const [stats, setStats]       = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [vehicles, fleetStats] = await Promise.all([
        fleetAPI.getVehicles(),
        fleetAPI.getStats(),
      ]);
      setFleet(Array.isArray(vehicles) ? vehicles : MOCK_FLEET);
      setStats(fleetStats || FLEET_STATS);
    } catch (e) {
      // Fallback to mock data
      setFleet(MOCK_FLEET);
      setStats(FLEET_STATS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Auto-refresh every 30s
  useEffect(() => {
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const sel = fleet.find(v => v.id === selected);
  const currentStats = stats || FLEET_STATS;

  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <div className={styles.title}>🚛 إدارة الأسطول</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className={styles.closeBtn} onClick={fetchData} title="تحديث" aria-label="تحديث">🔄</button>
            <button className={styles.closeBtn} onClick={onClose} aria-label="إغلاق">✕</button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className={styles.statsBar}>
          {[
            { icon: '🟢', label: 'نشط',    val: currentStats.active   },
            { icon: '🟡', label: 'خامل',   val: currentStats.idle     },
            { icon: '🔴', label: 'تنبيه',  val: currentStats.alert    },
            { icon: '📡', label: 'تغطية',  val: (currentStats.coverage || 0) + '%' },
          ].map((s, i) => (
            <div key={i} className={styles.statBox}>
              <span className={styles.statIcon}>{s.icon}</span>
              <span className={styles.statVal}>{s.val}</span>
              <span className={styles.statLbl}>{s.label}</span>
            </div>
          ))}
        </div>

        <div className={styles.body}>
          <div className={styles.listCol}>
            {loading ? (
              <SkeletonList count={4} />
            ) : fleet.length === 0 ? (
              <div className={styles.empty}>لا توجد مركبات مسجلة</div>
            ) : (
              fleet.map(v => (
                <VehicleCard key={v.id} v={v} selected={selected === v.id} onSelect={setSelected} />
              ))
            )}
          </div>

          <div className={styles.detailCol}>
            {sel ? (
              <>
                <div className={styles.detailId}>{sel.id}</div>
                <div className={styles.detailDriver}>👤 {sel.driver}</div>
                <div className={styles.detailRoute}>{sel.route}</div>
                <div className={styles.detailMeta}>
                  <div className={styles.dm}><span className={styles.dmVal}>{sel.speed}</span><span className={styles.dmLbl}>كم/س</span></div>
                  <div className={styles.dm}><span className={styles.dmVal}>{sel.eta}</span><span className={styles.dmLbl}>ETA</span></div>
                </div>
                <div className={styles.fuelLabel}>⛽ الوقود: {sel.fuel}%</div>
                <FuelBar pct={sel.fuel} />
                {sel.alerts && sel.alerts.length > 0 && (
                  <div className={styles.alertsSection}>
                    <div className={styles.alertsTitle}>⚠️ تنبيهات</div>
                    {sel.alerts.map((a, i) => <div key={i} className={styles.alertItem}>{a}</div>)}
                  </div>
                )}
              </>
            ) : (
              <div className={styles.noSel}>اختر مركبة لعرض التفاصيل</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
