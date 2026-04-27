import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useAppState }      from './hooks/useAppState';
import { useTheme }         from './hooks/useTheme';
import ErrorBoundary        from './components/common/ErrorBoundary';
import LoadingScreen        from './components/common/LoadingScreen';
import Landing              from './components/landing/Landing';
import Navbar               from './components/layout/Navbar';
import LeftSidebar          from './components/sidebar/LeftSidebar';
import RightSidebar         from './components/sidebar/RightSidebar';
import MapCanvas            from './components/map/MapCanvas';
import CommandPalette       from './components/command/CommandPalette';
import OnboardingTour       from './components/onboarding/OnboardingTour';
import UserProfile          from './components/profile/UserProfile';
import {
  RunModal, SaveAsModal, NewFileModal,
  AnalysisModal, Toast, Ticker,
} from './components/modals/Modals';
import FleetPanel           from './components/fleet/FleetPanel';
import ParkingPanel         from './components/parking/ParkingPanel';
import GamificationPanel    from './components/gamification/GamificationPanel';
import VoiceAssistant       from './components/voice/VoiceAssistant';
import DecisionEngine       from './components/decision/DecisionEngine';
import { exportMapAsPng, exportAsJson } from './utils/exportUtils';
import MobileNav            from './components/layout/MobileNav';
import { MOCK_TRAFFIC_EVENTS } from './data/mockData';
import styles from './App.module.css';

function track(event, props = {}) {
  if (process.env.NODE_ENV === 'development') console.log('[Analytics]', event, props);
}

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
    selectedAlgo, setSelectedAlgo,
    algoResult, isRunning, runAlgorithm,
    getCityAnalysis,
    toast, showToast,
    modal, setModal,
    rightPanel, setRightPanel,
  } = useAppState();

  const { theme, toggleTheme } = useTheme();

  // ── UI state ──
  const [loading, setLoading]               = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem('darb_onboarding_done'));
  const [cmdOpen, setCmdOpen]               = useState(false);
  const [showProfile, setShowProfile]       = useState(false);
  const [showLayersPanel, setShowLayersPanel] = useState(false);
  const [leftCollapsed, setLeftCollapsed]   = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [showFleet, setShowFleet]           = useState(false);
  const [showParking, setShowParking]       = useState(false);
  const [showGamification, setShowGamification] = useState(false);
  const [showVoice, setShowVoice]           = useState(false);
  const [showDecision, setShowDecision]     = useState(false);
  const [showSignals, setShowSignals]       = useState(false);
  const [modalData, setModalData]           = useState(null);
  const [mobileActive, setMobileActive]     = useState('map');

  const mapContainerRef = useRef(null);
  const leafletMapRef   = useRef(null);   // holds the actual Leaflet map instance
  const fileInputRef    = useRef(null);

  // ── Modal helpers — stable with useCallback ──
  const openRunModal  = useCallback(() => setModal('run'),     [setModal]);
  const openNewFile   = useCallback(() => setModal('newFile'), [setModal]);
  const closeModal    = useCallback(() => { setModal(null); setModalData(null); }, [setModal]);

  const openSaveAs = useCallback((name) => {
    setModalData({ name });
    setModal('saveAs');
  }, [setModal]);

  const openAnalysis = useCallback(async () => {
    const analysis = await getCityAnalysis(); setModalData(analysis);
    setModal('analysis');
    track('city_analysis');
  }, [getCityAnalysis, setModal]);

  // ── Onboarding ──
  const finishOnboarding = useCallback(() => {
    localStorage.setItem('darb_onboarding_done', '1');
    setShowOnboarding(false);
    showToast('🚀 أنت جاهز! استخدم Ctrl+K للوصول السريع');
    track('onboarding_complete');
  }, [showToast]);

  // ── Map ref ──
  const handleMapRef = useCallback((ref) => {
    mapContainerRef.current = ref?.current;
  }, []);

  const handleLeafletMapRef = useCallback((mapInstance) => {
    leafletMapRef.current = mapInstance;
  }, []);

  const getMapCenter = useCallback(() => {
    if (!leafletMapRef.current) return null;
    const c = leafletMapRef.current.getCenter();
    return { lat: c.lat, lng: c.lng };
  }, []);

  // ── Import JSON ──
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

  // ── Export helpers ──
  const handleExportPng = useCallback(() => {
    exportMapAsPng(mapContainerRef, `${currentFile?.name || 'darb'}.png`);
    showToast('🖼 جارٍ تصدير الخريطة...');
  }, [currentFile, showToast]);

  const handleExportJson = useCallback(() => {
    exportAsJson(nodes, edges, currentFile?.name);
    showToast('📦 تم تصدير JSON');
  }, [nodes, edges, currentFile, showToast]);

  // ── Command palette actions ──
  const handleCommand = useCallback((action) => {
    track('command_used', { action });
    const handlers = {
      newFile:            openNewFile,
      saveFile:           () => openSaveAs('حفظ سريع'),
      runAlgo:            openRunModal,
      'setAlgo:dijkstra': () => setSelectedAlgo('dijkstra'),
      'setAlgo:astar':    () => setSelectedAlgo('astar'),
      openFleet:          () => setShowFleet(true),
      openParking:        () => setShowParking(true),
      openDecision:       () => setShowDecision(true),
      openGamification:   () => setShowGamification(true),
      openVoice:          () => setShowVoice(true),
      toggleTheme,
      exportPng:          handleExportPng,
      exportJson:         handleExportJson,
      importJson:         handleImportClick,
      openLayers:         () => setShowLayersPanel(p => !p),
      'setTool:ruler':    () => setActiveTool('ruler'),
      toggleSignals:      () => setShowSignals(p => !p),
      openAnalysis,
      logout,
    };
    handlers[action]?.();
  }, [
    openNewFile, openSaveAs, openRunModal,
    setSelectedAlgo, toggleTheme,
    handleExportPng, handleExportJson, handleImportClick,
    setActiveTool, openAnalysis, logout,
  ]);

  // ── Google OAuth callback handler ──
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isGoogleCallback = params.get('token') === 'google';
    const hash = window.location.hash;
    if (isGoogleCallback || hash.includes('access_token')) {
      const hashParams = new URLSearchParams(hash.replace('#', ''));
      const accessToken = hashParams.get('access_token');
      if (accessToken) {
        window.history.replaceState({}, '', window.location.pathname);
        import('./services/api').then(({ setToken, authAPI }) => {
          setToken(accessToken);
          authAPI.getMe().then(userData => {
            login(userData, accessToken);
          }).catch(() => {});
        });
      }
    }
  }, [login]);

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setCmdOpen(true); return; }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); openSaveAs('حفظ سريع'); return; }
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') { e.preventDefault(); openNewFile(); return; }
      if (e.key === 'Escape') setShowLayersPanel(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [openSaveAs, openNewFile]);

  // ── Body class for landing scroll ──
  React.useEffect(() => {
    if (page === 'landing') {
      document.body.classList.add('page-landing');
    } else {
      document.body.classList.remove('page-landing');
    }
    return () => document.body.classList.remove('page-landing');
  }, [page]);

  // ── Loading splash ──
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
        onRun={openRunModal}
        currentFile={currentFile}
        fileHistory={fileHistory}
        user={user}
        onNewFile={openNewFile}
        onSaveAs={openSaveAs}
        onLoadFile={loadFile}
        onDeleteProject={deleteProject}
        onLogout={logout}
        showToast={showToast}
        onOpenFleet={()          => setShowFleet(true)}
        onOpenParking={()        => setShowParking(true)}
        onOpenGamification={()   => setShowGamification(true)}
        onOpenVoice={()          => setShowVoice(true)}
        onOpenDecision={()       => setShowDecision(true)}
        showSignals={showSignals}
        setShowSignals={setShowSignals}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenCommandPalette={() => setCmdOpen(true)}
        onOpenProfile={() => setShowProfile(true)}
        onExportPng={handleExportPng}
        onExportJson={handleExportJson}
        onImportJson={handleImportClick}
      />

      <div className={styles.main}>
        <div className={`${styles.sidebarWrap} ${leftCollapsed ? styles.sidebarWrapCollapsed : ''}`}>
          <LeftSidebar
            nodes={nodes}
            edges={edges}
            onAddNode={addNode}
            activeTool={activeTool}
            showToast={showToast}
            onOpenParking={() => setShowParking(true)}
            onOpenDecision={() => setShowDecision(true)}
            collapsed={leftCollapsed}
            getMapCenter={getMapCenter}
          />
          <button
            className={`${styles.collapseBtn} ${styles.collapseBtnLeft}`}
            onClick={() => setLeftCollapsed(c => !c)}
            title={leftCollapsed ? 'فتح اللوحة اليسرى' : 'إغلاق اللوحة اليسرى'}
            aria-label={leftCollapsed ? 'فتح' : 'إغلاق'}
          >
            {leftCollapsed ? '‹' : '›'}
          </button>
        </div>

        <MapCanvas
          nodes={nodes}
          edges={edges}
          activeTool={activeTool}
          zoom={zoom}
          selectedNode={selectedNode}
          setSelectedNode={setSelectedNode}
          selectedEdge={selectedEdge}
          setSelectedEdge={setSelectedEdge}
          algoResult={algoResult}
          isRunning={isRunning}
          onMoveNode={moveNode}
          onAddNode={addNode}
          onDeleteNode={deleteNode}
          onDeleteEdge={deleteEdge}
          onAddEdge={addEdge}
          onUpdateNode={updateNode}
          onUpdateEdge={updateEdge}
          showToast={showToast}
          showSignals={showSignals}
          theme={theme}
          showLayersPanel={showLayersPanel}
          setShowLayersPanel={setShowLayersPanel}
          onMapRef={handleMapRef}
          onLeafletMapRef={handleLeafletMapRef}
        />

        <div className={`${styles.sidebarWrap} ${rightCollapsed ? styles.sidebarWrapCollapsed : ''}`}>
          <button
            className={`${styles.collapseBtn} ${styles.collapseBtnRight}`}
            onClick={() => setRightCollapsed(c => !c)}
            title={rightCollapsed ? 'فتح اللوحة اليمنى' : 'إغلاق اللوحة اليمنى'}
            aria-label={rightCollapsed ? 'فتح' : 'إغلاق'}
          >
            {rightCollapsed ? '›' : '‹'}
          </button>
          <RightSidebar
            selectedAlgo={selectedAlgo}
            setSelectedAlgo={setSelectedAlgo}
            algoResult={algoResult}
            isRunning={isRunning}
            nodes={nodes}
            edges={edges}
            onRunModal={runAlgorithm}
            rightPanel={rightPanel}
            setRightPanel={setRightPanel}
            getCityAnalysis={getCityAnalysis}
            onOpenGamification={() => setShowGamification(true)}
            onOpenDecision={() => setShowDecision(true)}
            collapsed={rightCollapsed}
          />
        </div>
      </div>

      <Ticker events={MOCK_TRAFFIC_EVENTS} />

      {modal === 'run'      && <RunModal      nodes={nodes} onRun={runAlgorithm} onClose={closeModal} />}
      {modal === 'saveAs'   && <SaveAsModal   currentName={modalData?.name || currentFile.name} onSave={saveFile} onClose={closeModal} />}
      {modal === 'newFile'  && <NewFileModal  onConfirm={newFile} onClose={closeModal} />}
      {modal === 'analysis' && <AnalysisModal analysis={modalData} nodes={nodes} edges={edges} onClose={closeModal} />}

      {showFleet        && <ErrorBoundary><FleetPanel        onClose={() => setShowFleet(false)} /></ErrorBoundary>}
      {showParking      && <ErrorBoundary><ParkingPanel      onClose={() => setShowParking(false)} /></ErrorBoundary>}
      {showGamification && <ErrorBoundary><GamificationPanel onClose={() => setShowGamification(false)} /></ErrorBoundary>}
      {showVoice        && <ErrorBoundary><VoiceAssistant    onClose={() => setShowVoice(false)} /></ErrorBoundary>}
      {showDecision     && <ErrorBoundary><DecisionEngine    onClose={() => setShowDecision(false)} /></ErrorBoundary>}

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        aria-hidden="true"
      />

      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} onAction={handleCommand} />

      {showProfile && (
        <ErrorBoundary>
          <UserProfile
            user={user}
            onClose={() => setShowProfile(false)}
            onUpdate={() => showToast('✓ تم تحديث الملف الشخصي')}
            onLogout={logout}
          />
        </ErrorBoundary>
      )}

      {showOnboarding && !loading && (
        <OnboardingTour onFinish={finishOnboarding} />
      )}

      <Toast toast={toast} />

      <MobileNav
        active={mobileActive}
        onChange={setMobileActive}
        onOpenProfile={() => setShowProfile(true)}
        onOpenFleet={() => setShowFleet(true)}
        onOpenDecision={() => setShowDecision(true)}
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
