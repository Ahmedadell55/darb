import React, { useState } from 'react';
import styles from './Navbar.module.css';

const TOOLS = [
  { id: 'move',   label: 'تحريك',    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3"/></svg> },
  { id: 'delete', label: 'حذف',      icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3,6 5,6 21,6"/><path d="M19,6l-1,14H6L5,6"/></svg> },
  { sep: true },
  { id: 'line',   label: 'رسم طريق', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="19" x2="19" y2="5"/></svg> },
  { id: 'node',   label: 'عقدة',     icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="3"/><circle cx="4" cy="4" r="2"/><circle cx="20" cy="4" r="2"/><circle cx="4" cy="20" r="2"/><circle cx="20" cy="20" r="2"/></svg> },
  { id: 'ruler',  label: 'قياس',     icon: '📏' },
  { sep: true },
  { id: 'signal', label: 'إشارات', icon: '🚦' },
  { id: 'hazard', label: 'حادث',   icon: '⚠️' },
  { id: 'block',  label: 'إغلاق',  icon: '🚧' },
];

export default function Navbar({
  activeTool, setActiveTool, zoom, changeZoom, onRun,
  currentFile, fileHistory, user,
  onNewFile, onSaveAs, onLoadFile, onDeleteProject,
  onLogout, showToast,
  onOpenFleet, onOpenParking, onOpenGamification, onOpenVoice,
  onOpenDecision, showSignals, setShowSignals,
  theme, onToggleTheme,
  onOpenCommandPalette,
  onOpenProfile,
  onExportPng, onExportJson, onImportJson,
}) {
  const [fileMenuOpen, setFileMenuOpen] = useState(false);
  const [featMenuOpen, setFeatMenuOpen] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  const closeAll = () => {
    setFileMenuOpen(false);
    setFeatMenuOpen(false);
    setExportMenuOpen(false);
  };

  return (
    <nav className={styles.nav} role="navigation" aria-label="شريط التنقل الرئيسي">
      {/* Logo */}
      <div className={styles.logo} aria-label="دَرْب AI">
        <div className={styles.logoMark}>🛣</div>
        <div>
          <div className={styles.logoText}>دَرْب<em>AI</em></div>
          <div className={styles.logoSub}>ROAD INTELLIGENCE</div>
        </div>
      </div>

      {/* File menu */}
      <div className={styles.menuGroup}>
        <div className={styles.menuWrap}>
          <button
            className={styles.menuBtn + (fileMenuOpen ? ' ' + styles.menuBtnActive : '')}
            onClick={() => { setFileMenuOpen(o => !o); setFeatMenuOpen(false); setExportMenuOpen(false); }}
            aria-expanded={fileMenuOpen}
          >
            📁 ملف
          </button>
          {fileMenuOpen && (
            <div className={styles.dropdown} onClick={closeAll} role="menu">
              <button className={styles.ddItem} role="menuitem" onClick={onNewFile}>
                <span>📄</span> جديد <kbd>Ctrl+N</kbd>
              </button>
              <button className={styles.ddItem} role="menuitem" onClick={() => onSaveAs('حفظ سريع')}>
                <span>💾</span> حفظ <kbd>Ctrl+S</kbd>
              </button>
              <button className={styles.ddItem} role="menuitem" onClick={() => onSaveAs()}>
                <span>💾</span> حفظ باسم...
              </button>
              <div className={styles.ddSep}/>
              <button className={styles.ddItem} role="menuitem" onClick={onImportJson}>
                <span>📥</span> استيراد JSON
              </button>
              {fileHistory && fileHistory.length > 0 && (
                <>
                  <div className={styles.ddSep}/>
                  <div className={styles.ddLabel}>المشاريع المحفوظة</div>
                  {fileHistory.map(p => (
                    <div key={p.id} className={styles.ddProjectRow}>
                      <button className={styles.ddItem} style={{ flex: 1 }} onClick={() => onLoadFile(p)}>
                        <span>🗂</span>
                        <span className={styles.ddProjectName}>{p.name}</span>
                        <span className={styles.ddProjectMeta}>{p.nodeCount} عقدة · {p.updatedAt}</span>
                      </button>
                      <button className={styles.ddDelete} onClick={(e) => { e.stopPropagation(); onDeleteProject(p.id); }} title="حذف" aria-label="حذف المشروع">✕</button>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        {/* Features menu */}
        <div className={styles.menuWrap}>
          <button
            className={styles.menuBtn + (featMenuOpen ? ' ' + styles.menuBtnActive : '')}
            onClick={() => { setFeatMenuOpen(o => !o); setFileMenuOpen(false); setExportMenuOpen(false); }}
            aria-expanded={featMenuOpen}
          >
            ⚡ المميزات
          </button>
          {featMenuOpen && (
            <div className={styles.dropdown} onClick={closeAll} role="menu">
              <button className={styles.ddItem} role="menuitem" onClick={onOpenDecision}><span>🧠</span> محرك القرار الذكي</button>
              <button className={styles.ddItem} role="menuitem" onClick={onOpenFleet}><span>🚛</span> إدارة الأسطول</button>
              <button className={styles.ddItem} role="menuitem" onClick={onOpenParking}><span>🅿</span> مواقف ذكية</button>
              <button className={styles.ddItem} role="menuitem" onClick={onOpenGamification}><span>🏆</span> نظام المكافآت</button>
              <button className={styles.ddItem} role="menuitem" onClick={onOpenVoice}><span>🎙</span> المساعد الصوتي</button>
              <div className={styles.ddSep}/>
              <button className={styles.ddItem} role="menuitem" onClick={() => setShowSignals(!showSignals)}>
                <span>🚦</span> {showSignals ? 'إخفاء' : 'إظهار'} الإشارات الذكية
              </button>
            </div>
          )}
        </div>

        {/* Export menu */}
        <div className={styles.menuWrap}>
          <button
            className={styles.menuBtn + (exportMenuOpen ? ' ' + styles.menuBtnActive : '')}
            onClick={() => { setExportMenuOpen(o => !o); setFeatMenuOpen(false); setFileMenuOpen(false); }}
            aria-expanded={exportMenuOpen}
          >
            📤 تصدير
          </button>
          {exportMenuOpen && (
            <div className={styles.dropdown} onClick={closeAll} role="menu">
              <button className={styles.ddItem} role="menuitem" onClick={onExportPng}><span>🖼</span> تصدير PNG</button>
              <button className={styles.ddItem} role="menuitem" onClick={onExportJson}><span>📦</span> تصدير JSON</button>
            </div>
          )}
        </div>
      </div>

      {/* Tools */}
      <div className={styles.tools} role="toolbar" aria-label="أدوات الخريطة">
        {TOOLS.map((t, i) =>
          t.sep
            ? <div key={`sep-${i}`} className={styles.sep}/>
            : (
              <button
                key={t.id}
                className={`${styles.tool} ${activeTool === t.id ? styles.toolActive : ''}`}
                onClick={() => setActiveTool(t.id)}
                title={t.label}
                aria-label={t.label}
                aria-pressed={activeTool === t.id}
              >
                {t.icon}
                <span className={styles.toolLabel}>{t.label}</span>
              </button>
            )
        )}
      </div>

      {/* Right section */}
      <div className={styles.right}>
        {/* File name */}
        <div className={styles.fileName}>
          <span className={styles.fileIco}>{currentFile?.saved ? '💾' : '📄'}</span>
          <span className={styles.fileTxt}>{currentFile?.name || 'مشروع جديد'}</span>
          {!currentFile?.saved && <span className={styles.unsaved}>●</span>}
        </div>

        {/* Command palette hint */}
        <button
          className={styles.cmdBtn}
          onClick={onOpenCommandPalette}
          title="لوحة الأوامر (Ctrl+K)"
          aria-label="فتح لوحة الأوامر"
        >
          <span>⌘</span>
          <kbd>K</kbd>
        </button>

        {/* Run button */}
        <button className={styles.btnRun} onClick={onRun} aria-label="تشغيل الخوارزمية">
          ▶ تشغيل
        </button>

        {/* Dark mode toggle */}
        <button
          className={styles.themeBtn}
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}
          aria-label={theme === 'dark' ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* User */}
        <button
          className={styles.userBtn}
          onClick={onOpenProfile}
          title={user?.name}
          aria-label="الملف الشخصي"
        >
          <span className={styles.userAvatar}>{user?.avatar || '👤'}</span>
          <span className={styles.userName}>{user?.name?.split(' ')[0]}</span>
          <span className={styles.userPlan}>{user?.plan || 'Free'}</span>
        </button>
      </div>
    </nav>
  );
}
