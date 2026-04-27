import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './CommandPalette.module.css';

const COMMANDS = [
  { id: 'new',        icon: '📄', label: 'مشروع جديد',           category: 'ملف',        action: 'newFile' },
  { id: 'save',       icon: '💾', label: 'حفظ المشروع',          category: 'ملف',        action: 'saveFile' },
  { id: 'run',        icon: '▶',  label: 'تشغيل الخوارزمية',     category: 'خوارزمية',   action: 'runAlgo' },
  { id: 'dijkstra',   icon: '🧠', label: 'اختر Dijkstra',        category: 'خوارزمية',   action: 'setAlgo:dijkstra' },
  { id: 'astar',      icon: '⚡', label: 'اختر A*',               category: 'خوارزمية',   action: 'setAlgo:astar' },
  { id: 'fleet',      icon: '🚛', label: 'إدارة الأسطول',         category: 'ميزات',      action: 'openFleet' },
  { id: 'parking',    icon: '🅿', label: 'مواقف ذكية',            category: 'ميزات',      action: 'openParking' },
  { id: 'decision',   icon: '🕐', label: 'محرك القرار',           category: 'ميزات',      action: 'openDecision' },
  { id: 'gamify',     icon: '🏆', label: 'نظام المكافآت',         category: 'ميزات',      action: 'openGamification' },
  { id: 'voice',      icon: '🎙', label: 'المساعد الصوتي',        category: 'ميزات',      action: 'openVoice' },
  { id: 'dark',       icon: '🌙', label: 'تبديل الوضع الليلي',   category: 'إعدادات',    action: 'toggleTheme' },
  { id: 'export-png', icon: '🖼', label: 'تصدير الخريطة PNG',    category: 'تصدير',      action: 'exportPng' },
  { id: 'export-json',icon: '📦', label: 'تصدير المشروع JSON',   category: 'تصدير',      action: 'exportJson' },
  { id: 'import-json', icon: '📥', label: 'استيراد مشروع JSON',    category: 'تصدير',      action: 'importJson' },
  { id: 'layers',     icon: '🗺', label: 'تبديل طبقات الخريطة',  category: 'خريطة',      action: 'openLayers' },
  { id: 'ruler',      icon: '📏', label: 'أداة القياس',           category: 'خريطة',      action: 'setTool:ruler' },
  { id: 'signals',    icon: '🚦', label: 'الإشارات الذكية',      category: 'خريطة',      action: 'toggleSignals' },
  { id: 'analysis',   icon: '📊', label: 'تحليل المدينة',        category: 'تحليل',      action: 'openAnalysis' },
  { id: 'logout',     icon: '🚪', label: 'تسجيل الخروج',         category: 'حساب',       action: 'logout' },
];

export default function CommandPalette({ open, onClose, onAction }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const [active, setActive] = useState(0);

  const filtered = query.trim()
    ? COMMANDS.filter(c =>
        c.label.includes(query) ||
        c.category.includes(query) ||
        c.action.includes(query.toLowerCase())
      )
    : COMMANDS;

  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const run = useCallback((cmd) => {
    onAction(cmd.action);
    onClose();
  }, [onAction, onClose]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') setActive(a => Math.min(a + 1, filtered.length - 1));
      if (e.key === 'ArrowUp')   setActive(a => Math.max(a - 1, 0));
      if (e.key === 'Enter' && filtered[active]) run(filtered[active]);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, active, filtered, run, onClose]);

  useEffect(() => { setActive(0); }, [query]);

  if (!open) return null;

  // Group by category
  const grouped = {};
  filtered.forEach(cmd => {
    if (!grouped[cmd.category]) grouped[cmd.category] = [];
    grouped[cmd.category].push(cmd);
  });

  let idx = 0;

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.palette} role="dialog" aria-label="لوحة الأوامر">
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>⌕</span>
          <input
            ref={inputRef}
            className={styles.searchInput}
            placeholder="ابحث عن أمر..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="بحث الأوامر"
          />
          <kbd className={styles.escKey}>Esc</kbd>
        </div>
        <div className={styles.results}>
          {Object.keys(grouped).length === 0 && (
            <div className={styles.empty}>لا توجد نتائج لـ "{query}"</div>
          )}
          {Object.entries(grouped).map(([cat, cmds]) => (
            <div key={cat} className={styles.group}>
              <div className={styles.groupLabel}>{cat}</div>
              {cmds.map(cmd => {
                const isActive = idx === active;
                const i = idx++;
                return (
                  <button
                    key={cmd.id}
                    className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
                    onClick={() => run(cmd)}
                    onMouseEnter={() => setActive(i)}
                  >
                    <span className={styles.itemIcon}>{cmd.icon}</span>
                    <span className={styles.itemLabel}>{cmd.label}</span>
                    <span className={styles.itemCat}>{cmd.category}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div className={styles.footer}>
          <span><kbd>↑↓</kbd> تنقل</span>
          <span><kbd>↵</kbd> تنفيذ</span>
          <span><kbd>Esc</kbd> إغلاق</span>
          <span className={styles.footerHint}>Ctrl+K لفتح اللوحة</span>
        </div>
      </div>
    </div>
  );
}
