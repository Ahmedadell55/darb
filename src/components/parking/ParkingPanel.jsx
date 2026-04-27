import React, { useState, useEffect, useCallback } from 'react';
import styles from './ParkingPanel.module.css';
import { MOCK_PARKING } from '../../data/mockData';
import { parkingAPI } from '../../services/api';

const TYPE_LABEL = { covered: '🏢 مغطى', open: '🌤 مفتوح', valet: '🎩 فاليه' };

function ParkingCard({ p, selected, onSelect }) {
  const pct = Math.round((p.available / (p.total || p.capacity || 100)) * 100);
  const avColor = pct > 40 ? '#2d5a3d' : pct > 15 ? '#c87f0a' : '#c0392b';
  return (
    <div className={`${styles.card} ${selected ? styles.cardSelected : ''}`} onClick={() => onSelect(p.id)}>
      <div className={styles.cardTop}>
        <div className={styles.cardName}>{p.name}</div>
        <span className={styles.cardType}>{TYPE_LABEL[p.type] || p.type}</span>
      </div>
      <div className={styles.cardMeta}>
        <span style={{ color: avColor }} className={styles.avail}>{p.available} فراغ</span>
        <span className={styles.dist}>📍 {p.distance || '—'} كم</span>
        <span className={styles.price}>💰 {p.price} ج/ساعة</span>
      </div>
      <div className={styles.bar}>
        <div className={styles.barFill} style={{ width: `${100 - pct}%`, background: avColor }} />
      </div>
      <div className={styles.barLabel}>{pct}% متاح</div>
    </div>
  );
}

export default function ParkingPanel({ onClose }) {
  const [lots, setLots]         = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [reserving, setReserving] = useState(false);
  const [error, setError] = useState('');
  const [reservedId, setReservedId] = useState(null);

  const fetchLots = useCallback(async () => {
    setLoading(true);
    try {
      const data = await parkingAPI.getLots();
      setLots(Array.isArray(data) ? data : MOCK_PARKING);
    } catch {
      setLots(MOCK_PARKING);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLots(); }, [fetchLots]);

  // Refresh every 30s
  useEffect(() => {
    const interval = setInterval(fetchLots, 30000);
    return () => clearInterval(interval);
  }, [fetchLots]);

  const handleReserve = async (lotId) => {
    setReserving(true);
    try {
      await parkingAPI.reserve(lotId);
      setReservedId(lotId);
      // Optimistic: reduce available by 1
      setLots(prev => prev.map(l =>
        l.id === lotId ? { ...l, available: Math.max(0, l.available - 1) } : l
      ));
    } catch (e) {
      setError(e?.message || 'فشل الحجز، حاول مرة أخرى');
    } finally {
      setReserving(false);
    }
  };

  const handleRelease = async (lotId) => {
    try {
      await parkingAPI.release(lotId);
      setReservedId(null);
      setLots(prev => prev.map(l =>
        l.id === lotId ? { ...l, available: l.available + 1 } : l
      ));
    } catch {}
  };

  const sorted = [...lots].sort((a, b) => b.available - a.available);
  const sel = lots.find(p => p.id === selected);

  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <div className={styles.title}>🅿 مواقف السيارات الذكية</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className={styles.closeBtn} onClick={fetchLots} title="تحديث">🔄</button>
            <button className={styles.closeBtn} onClick={onClose}>✕</button>
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.listCol}>
            <div className={styles.hint}>📡 مباشر — يتجدد كل 30 ثانية</div>
            {loading ? (
              <div className={styles.hint}>⏳ جارٍ التحميل...</div>
            ) : sorted.map(p => (
              <ParkingCard key={p.id} p={p} selected={selected === p.id} onSelect={setSelected} />
            ))}
          </div>

          <div className={styles.detailCol}>
            {sel ? (
              <>
                <div className={styles.detailName}>{sel.name}</div>
                <div className={styles.detailType}>{TYPE_LABEL[sel.type] || sel.type}</div>
                <div className={styles.detailStats}>
                  <div className={styles.ds}><span className={styles.dsVal} style={{ color: '#2d5a3d' }}>{sel.available}</span><span className={styles.dsLbl}>مكان متاح</span></div>
                  <div className={styles.ds}><span className={styles.dsVal}>{sel.total || sel.capacity}</span><span className={styles.dsLbl}>إجمالي</span></div>
                  <div className={styles.ds}><span className={styles.dsVal}>{sel.price}</span><span className={styles.dsLbl}>ج/ساعة</span></div>
                </div>
                {reservedId === sel.id ? (
                  <>
                    <div style={{ color: '#2d5a3d', fontWeight: 700, margin: '12px 0' }}>✅ تم الحجز بنجاح</div>
                    <button className={styles.reserveBtn} style={{ background: '#c0392b' }}
                      onClick={() => handleRelease(sel.id)}>
                      إلغاء الحجز
                    </button>
                  </>
                ) : (
                  <button
                    className={styles.reserveBtn}
                    onClick={() => handleReserve(sel.id)}
                    disabled={reserving || sel.available === 0}
                  >
                    {reserving ? '⏳ جارٍ...' : sel.available === 0 ? '❌ ممتلئ' : '✅ احجز الآن'}
                  </button>
                )}
              </>
            ) : (
              <div className={styles.noSel}>اختر موقفاً لعرض التفاصيل</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
