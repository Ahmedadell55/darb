import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useAppState }      from './hooks/useAppState';
import { useTheme }         from './hooks/useTheme';
import ErrorBoundary        from './components/common/ErrorBoundary';
import LoadingScreen        from './components/common/LoadingScreen';
import Landing              from './components/landing/Landing';
import Navbar               from './components/layout/Navbar';
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
import Portal               from './components/common/Portal';
import { MOCK_TRAFFIC_EVENTS, NODE_TYPES, ALGORITHMS } from './data/mockData';
import styles from './App.module.css';

function track(event, props = {}) {
  if (process.env.NODE_ENV === 'development') console.log('[Analytics]', event, props);
}

function BottomSidebar({
  nodes, edges,
  onAddNode, getMapCenter,
  selectedAlgo, setSelectedAlgo,
  algoResult, isRunning, onRunModal,
}) {
  const [startNode, setStartNode] = React.useState(nodes[0]?.id || '');
  const [endNode, setEndNode]     = React.useState(nodes[1]?.id || '');
  const [priority, setPriority]   = React.useState('time');
  const [activeTab, setActiveTab] = React.useState('nodes'); // 'nodes' | 'algo'

  const handleDragStart = (e, nodeType) => {
    e.dataTransfer.setData('nodeType', JSON.stringify(nodeType));
  };

  const handleNodeClick = (nodeType) => {
    const center = getMapCenter?.();
    if (center) {
      const latOff = (Math.random() - 0.5) * 0.003;
      const lngOff = (Math.random() - 0.5) * 0.003;
      onAddNode(nodeType, 300 + Math.random() * 200, 200 + Math.random() * 200, center.lat + latOff, center.lng + lngOff);
    } else {
      onAddNode(nodeType, 300 + Math.random() * 200, 200 + Math.random() * 200);
    }
  };

  return (
    <div className={styles.bottomSidebar}>
      {/* Tabs */}
      <div className={styles.bottomTabs}>
        <button
          className={`${styles.bottomTab} ${activeTab === 'nodes' ? styles.bottomTabActive : ''}`}
          onClick={() => setActiveTab('nodes')}
        >
          🗺 العناصر
        </button>
        <button
          className={`${styles.bottomTab} ${activeTab === 'algo' ? styles.bottomTabActive : ''}`}
          onClick={() => setActiveTab('algo')}
        >
          🧠 الخوارزمية
        </button>
      </div>

      {/* Nodes tab */}
      {activeTab === 'nodes' && (
        <div className={styles.bottomContent}>
          <div className={styles.nodesPalette}>
            {NODE_TYPES.map(nt => (
              <div
                key={nt.id}
                className={styles.nodeTile}
                draggable
                onDragStart={e => handleDragStart(e, nt)}
                onClick={() => handleNodeClick(nt)}
                title={`اسحب لإضافة ${nt.label}`}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && handleNodeClick(nt)}
              >
                <span className={styles.nodeTileIcon}>{nt.icon}</span>
                <span className={styles.nodeTileLabel}>{nt.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Algo tab */}
      {activeTab === 'algo' && (
        <div className={styles.bottomContent}>
          {/* Algo cards */}
          <div className={styles.algoRow}>
            {ALGORITHMS.map(a => (
              <div
                key={a.id}
                className={`${styles.algoCard} ${selectedAlgo === a.id ? styles.algoSelected : ''}`}
                onClick={() => setSelectedAlgo(a.id)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setSelectedAlgo(a.id)}
              >
                <span className={styles.algoName}>{a.name}</span>
                <span className={styles.algoBadge}>{a.badge}</span>
              </div>
            ))}
          </div>

          {/* Path config */}
          <div className={styles.pathConfig}>
            <select className={styles.pathSel} value={startNode} onChange={e => setStartNode(e.target.value)}>
              {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
            </select>
            <span className={styles.arrow}>←</span>
            <select className={styles.pathSel} value={endNode} onChange={e => setEndNode(e.target.value)}>
              {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
            </select>
            <select className={styles.pathSel} value={priority} onChange={e => setPriority(e.target.value)}>
              <option value="time">⚡ أسرع</option>
              <option value="dist">📏 أقصر</option>
              <option value="traffic">🌿 أخف</option>
              <option value="fuel">⛽ أوفر</option>
            </select>
            <button
              className={styles.btnRun}
              onClick={() => onRunModal(startNode, endNode, priority)}
              disabled={isRunning}
            >
              {isRunning ? '⏳' : '▶ تشغيل'}
            </button>
          </div>

          {/* Result */}
          {algoResult && (
            <div className={styles.algoResult}>
              ✓ {algoResult.algo} — {algoResult.distance.toFixed(1)} كم · {Math.round(algoResult.distance * 2.4)} دقيقة
            </div>
          )}
        </div>
      )}
    </div>
  );
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

  const [loading, setLoading]               = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem('darb_onboarding_done'));
  const [cmdOpen, setCmdOpen]               = useState(false);
  const [showProfile, setShowProfile]       = useState(false);
  const [showFleet, setShowFleet]           = useState(false);
  const [showParking, setShowParking]       = useState(false);
  const [showGamification, setShowGamification] = useState(false);
  const [showVoice, setShowVoice]           = useState(false);
  const [showDecision, setShowDecision]     = useState(false);
  const [showSignals, setShowSignals]       = useState(false);
  const [showLayersPanel, setShowLayersPanel] = useState(false);
  const [modalData, setModalData]           = useState(null);
  const [mobileActive, setMobileActive]     = useState('map');

  const mapContainerRef = useRef(null);
  const leafletMapRef   = useRef(null);
  const fileInputRef    = useRef(null);

  const openRunModal  = useCallback(() => setModal('run'),     [setModal]);
  const openNewFile   = useCallback(() => setModal('newFile'), [setModal]);
  const closeModal    = useCallback(() => { setModal(null); setModalData(null); }, [setModal]);
  const openSaveAs    = useCallback((name) => { setModalData({ name }); setModal('saveAs'); }, [setModal]);
  const openAnalysis  = useCallback(async () => {
    const analysis = await getCityAnalysis(); setModalData(analysis);
    setModal('analysis'); track('city_analysis');
  }, [getCityAnalysis, setModal]);

  const finishOnboarding = useCallback(() => {
    localStorage.setItem('darb_onboarding_done', '1');
    setShowOnboarding(false);
    showToast('🚀 أنت جاهز! استخدم Ctrl+K للوصول السريع');
  }, [showToast]);

  const handleMapRef = useCallback((ref) => { mapContainerRef.current = ref?.current; }, []);
  const handleLeafletMapRef = useCallback((mapInstance) => { leafletMapRef.current = mapInstance; }, []);
  const getMapCenter = useCallback(() => {
    if (!leafletMapRef.current) return null;
    const c = leafletMapRef.current.getCenter();
    return { lat: c.lat, lng: c.lng };
  }, []);

  const handleImportClick = useCallback(() => { fileInputRef.current?.click(); }, []);
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
  }, [openNewFile, openSaveAs, openRunModal, setSelectedAlgo, toggleTheme,
      handleExportPng, handleExportJson, handleImportClick, setActiveTool, openAnalysis, logout]);

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

  React.useEffect(() => {
    if (page === 'landing') document.body.classList.add('page-landing');
    else document.body.classList.remove('page-landing');
    return () => document.body.classList.remove('page-landing');
  }, [page]);

  if (loading) return <LoadingScreen onDone={() => setLoading(false)} />;
  if (page === 'landing') return <Landing onLogin={login} theme={theme} onToggleTheme={toggleTheme} />;

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
        onOpenFleet={()        => setShowFleet(true)}
        onOpenParking={()      => setShowParking(true)}
        onOpenGamification={() => setShowGamification(true)}
        onOpenVoice={()        => setShowVoice(true)}
        onOpenDecision={()     => setShowDecision(true)}
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

      {/* Map takes full space */}
      <div className={styles.main}>
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
      </div>

      {/* Bottom Sidebar */}
      <BottomSidebar
        nodes={nodes}
        edges={edges}
        onAddNode={addNode}
        getMapCenter={getMapCenter}
        selectedAlgo={selectedAlgo}
        setSelectedAlgo={setSelectedAlgo}
        algoResult={algoResult}
        isRunning={isRunning}
        onRunModal={runAlgorithm}
      />

      <Ticker events={MOCK_TRAFFIC_EVENTS} />

      <Portal>
        {modal === 'run'      && <RunModal      nodes={nodes} onRun={runAlgorithm} onClose={closeModal} />}
        {modal === 'saveAs'   && <SaveAsModal   currentName={modalData?.name || currentFile.name} onSave={saveFile} onClose={closeModal} />}
        {modal === 'newFile'  && <NewFileModal  onConfirm={newFile} onClose={closeModal} />}
        {modal === 'analysis' && <AnalysisModal analysis={modalData} nodes={nodes} edges={edges} onClose={closeModal} />}

        {showFleet        && <ErrorBoundary><FleetPanel        onClose={() => setShowFleet(false)} /></ErrorBoundary>}
        {showParking      && <ErrorBoundary><ParkingPanel      onClose={() => setShowParking(false)} /></ErrorBoundary>}
        {showGamification && <ErrorBoundary><GamificationPanel onClose={() => setShowGamification(false)} /></ErrorBoundary>}
        {showVoice        && <ErrorBoundary><VoiceAssistant    onClose={() => setShowVoice(false)} /></ErrorBoundary>}
        {showDecision     && <ErrorBoundary><DecisionEngine    onClose={() => setShowDecision(false)} /></ErrorBoundary>}
      </Portal>

      <input ref={fileInputRef} type="file" accept=".json"
        style={{ display: 'none' }} onChange={handleFileChange} aria-hidden="true" />

      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} onAction={handleCommand} />

      {showProfile && (
        <ErrorBoundary>
          <UserProfile user={user} onClose={() => setShowProfile(false)}
            onUpdate={() => showToast('✓ تم تحديث الملف الشخصي')} onLogout={logout} />
        </ErrorBoundary>
      )}

      {showOnboarding && !loading && <OnboardingTour onFinish={finishOnboarding} />}

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
  return <ErrorBoundary><AppShell /></ErrorBoundary>;
}
