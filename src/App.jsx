import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useAppState } from './hooks/useAppState';
import { useTheme } from './hooks/useTheme';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingScreen from './components/common/LoadingScreen';
import Landing from './components/landing/Landing';
import Navbar from './components/layout/Navbar';
import CommandPalette from './components/command/CommandPalette';
import OnboardingTour from './components/onboarding/OnboardingTour';
import UserProfile from './components/profile/UserProfile';
import { RunModal, SaveAsModal, NewFileModal, Toast } from './components/modals/Modals';
import { exportMapAsPng, exportAsJson } from './utils/exportUtils';
import MobileNav from './components/layout/MobileNav';
import styles from './App.module.css';

function AppShell() {
  const {
    user, login, logout, page,
    currentFile, fileHistory, newFile, saveFile, loadFile, deleteProject,
    importFromJson,
    nodes, edges,
    selectedNode, setSelectedNode,
    selectedEdge, setSelectedEdge,
    activeTool, setActiveTool,
    zoom, changeZoom,
    addNode, deleteNode, moveNode, updateNode,
    addEdge, deleteEdge, updateEdge,
    toast, showToast,
    modal, setModal,
  } = useAppState();

  const { theme, toggleTheme } = useTheme();

  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem('darb_onboarding_done'));
  const [cmdOpen, setCmdOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [mobileActive, setMobileActive] = useState('map');

  const fileInputRef = useRef(null);

  const openRunModal = useCallback(() => setModal('run'), [setModal]);
  const openNewFile = useCallback(() => setModal('newFile'), [setModal]);
  const closeModal = useCallback(() => { setModal(null); setModalData(null); }, [setModal]);

  const openSaveAs = useCallback((name) => {
    setModalData({ name });
    setModal('saveAs');
  }, [setModal]);


  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => importFromJson(ev.target.result);
    reader.readAsText(file);
    e.target.value = '';
  }, [importFromJson]);

  const handleExportPng = useCallback(() => {
    exportMapAsPng(mapContainerRef, `${currentFile?.name || 'darb'}.png`);
    showToast('🖼 جارٍ تصدير الخريطة...');
  }, [currentFile, showToast]);

  const handleExportJson = useCallback(() => {
    exportAsJson(nodes, edges, currentFile?.name);
    showToast('📦 تم تصدير JSON');
  }, [nodes, edges, currentFile, showToast]);

  const handleCommand = useCallback((action) => {
    const handlers = {
      newFile: openNewFile,
      saveFile: () => openSaveAs('حفظ سريع'),
      toggleTheme,
      exportPng: handleExportPng,
      exportJson: handleExportJson,
      importJson: handleImportClick,
      logout,
    };
    handlers[action]?.();
  }, [openNewFile, openSaveAs, toggleTheme, handleExportPng, handleExportJson, handleImportClick, logout]);

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setCmdOpen(true); return; }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); openSaveAs('حفظ سريع'); return; }
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') { e.preventDefault(); openNewFile(); return; }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [openSaveAs, openNewFile]);

  if (loading) return <LoadingScreen onDone={() => setLoading(false)} />;

  if (page === 'landing') {
    return <Landing onLogin={login} theme={theme} onToggleTheme={toggleTheme} />;
  }

  return (
    <div className={styles.appRoot}>
      <Navbar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        zoom={zoom}
        changeZoom={changeZoom}
        currentFile={currentFile}
        fileHistory={fileHistory}
        user={user}
        onNewFile={openNewFile}
        onSaveAs={openSaveAs}
        onLoadFile={loadFile}
        onDeleteProject={deleteProject}
        onLogout={logout}
        showToast={showToast}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenCommandPalette={() => setCmdOpen(true)}
        onOpenProfile={() => setShowProfile(true)}
        onExportPng={handleExportPng}
        onExportJson={handleExportJson}
        onImportJson={handleImportClick}
      />

      <div className={styles.main}>
       
        <div className={styles.bottomSidebar}>
          <div>
            <button onClick={() => addNode(getMapCenter())}>➕ Add Node</button>
          </div>
          <div>
            <button onClick={handleExportPng}>Export PNG</button>
            <button onClick={handleExportJson}>Export JSON</button>
          </div>
        </div>
      </div>

      {modal === 'run' && <RunModal nodes={nodes} onClose={closeModal} />}
      {modal === 'saveAs' && <SaveAsModal currentName={modalData?.name || currentFile.name} onSave={saveFile} onClose={closeModal} />}
      {modal === 'newFile' && <NewFileModal onConfirm={newFile} onClose={closeModal} />}

      <input ref={fileInputRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleFileChange} />

      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} onAction={handleCommand} />

      {showProfile && (
        <ErrorBoundary>
          <UserProfile user={user} onClose={() => setShowProfile(false)} onLogout={logout} />
        </ErrorBoundary>
      )}

      {showOnboarding && !loading && <OnboardingTour onFinish={() => setShowOnboarding(false)} />}

      <Toast toast={toast} />

      <MobileNav
        active={mobileActive}
        onChange={setMobileActive}
        onOpenProfile={() => setShowProfile(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppShell />
    </ErrorBoundary>
  );
}
