import React from 'react';
import styles from './MobileNav.module.css';

const NAV_ITEMS = [
  { id: 'map',      icon: '🗺',  label: 'الخريطة' },
  { id: 'algo',     icon: '🧠',  label: 'خوارزمية' },
  { id: 'features', icon: '⚡',  label: 'المميزات' },
  { id: 'profile',  icon: '👤',  label: 'الملف' },
];

export default function MobileNav({ active, onChange, onOpenProfile, onOpenFleet, onOpenDecision }) {
  const handleTap = (id) => {
    if (id === 'profile') { onOpenProfile?.(); return; }
    if (id === 'features') {
      // Show a quick panel chooser - for now open fleet
      onOpenFleet?.();
      return;
    }
    onChange?.(id);
  };

  return (
    <nav className={styles.mobileNav} role="navigation" aria-label="التنقل السفلي">
      {NAV_ITEMS.map(item => (
        <button
          key={item.id}
          className={`${styles.navItem} ${active === item.id ? styles.navItemActive : ''}`}
          onClick={() => handleTap(item.id)}
          aria-label={item.label}
          aria-current={active === item.id ? 'page' : undefined}
        >
          <span className={styles.navIcon}>{item.icon}</span>
          <span className={styles.navLabel}>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
