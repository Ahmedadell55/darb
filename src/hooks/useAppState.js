// ═══════════════════════════════════════════════════
// useAppState — إدارة الحالة الأساسية المبسطة
// تم حذف التحليل والـ panels الثقيلة
// ═══════════════════════════════════════════════════

import { useState, useCallback, useRef, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import {
  DEFAULT_NODES, DEFAULT_EDGES,
  runDijkstra, runAStar, runBellmanFord, runFloydWarshall,
} from '../data/mockData';
import {
  authAPI, projectsAPI, pathsAPI,
  setToken,
} from '../services/api';

export function useAppState() {

  // ── Auth ─────────────────────────────────────────
  const [user, setUser] = useLocalStorage('darb_user', null);
  const [page, setPage] = useState(user ? 'app' : 'landing');

  // ── Projects ─────────────────────────────────────
  const [currentFile, setCurrentFile] = useState({ name: 'مشروع جديد', saved: false, id: null });
  const [fileHistory, setFileHistory] = useLocalStorage('darb_projects', []);

  // ── Canvas ───────────────────────────────────────
  const CANVAS_VERSION = 'v3';

  const [nodes, setNodes] = useState(() => {
    try {
      const saved = localStorage.getItem('darb_canvas');
      if (saved) {
        const p = JSON.parse(saved);
        if (p.version === CANVAS_VERSION) return p.nodes || DEFAULT_NODES;
      }
    } catch {}
    return DEFAULT_NODES;
  });

  const [edges, setEdges] = useState(() => {
    try {
      const saved = localStorage.getItem('darb_canvas');
      if (saved) {
        const p = JSON.parse(saved);
        if (p.version === CANVAS_VERSION) return p.edges || DEFAULT_EDGES;
      }
    } catch {}
    return DEFAULT_EDGES;
  });

  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [activeTool, setActiveTool] = useState('move');
  const [zoom, setZoom] = useState(100);
  const [drawingEdge, setDrawingEdge] = useState(null);

  // ── Algorithms ───────────────────────────────────
  const [selectedAlgo, setSelectedAlgo] = useLocalStorage('darb_algo', 'dijkstra');
  const [algoResult, setAlgoResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  // ── UI ───────────────────────────────────────────
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);
  const toastTimer = useRef(null);

  const showToast = useCallback((msg, type = 'default') => {
    clearTimeout(toastTimer.current);
    setToast({ msg, type });
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  }, []);

  // logout تلقائي لو التوكن انتهى
  useEffect(() => {
    const handleForcedLogout = () => {
      setUser(null);
      setPage('landing');
      setAlgoResult(null);
      showToast('انتهت الجلسة — سجل دخول مرة أخرى', 'error');
    };
    window.addEventListener('darb:logout', handleForcedLogout);
    return () => window.removeEventListener('darb:logout', handleForcedLogout);
  }, [setUser, showToast]);

  const changeZoom = useCallback((delta) => {
    setZoom(z => Math.min(200, Math.max(30, z + delta)));
  }, []);

  const persistCanvas = useCallback((n, e) => {
    try {
      localStorage.setItem('darb_canvas', JSON.stringify({ version: CANVAS_VERSION, nodes: n, edges: e }));
    } catch {}
  }, []);

  // ── Files ────────────────────────────────────────
  const newFile = useCallback(() => {
    setNodes(DEFAULT_NODES);
    setEdges(DEFAULT_EDGES);
    setAlgoResult(null);
    setSelectedNode(null);
    setCurrentFile({ name: 'مشروع جديد', saved: false, id: null });
    persistCanvas(DEFAULT_NODES, DEFAULT_EDGES);
    showToast('تم إنشاء مشروع جديد');
  }, [showToast, persistCanvas]);

  const saveFile = useCallback(async (name) => {
    const savedName = name || currentFile.name;
    try {
      let result;
      if (currentFile.id) {
        result = await projectsAPI.update(currentFile.id, savedName, nodes, edges);
      } else {
        result = await projectsAPI.create(savedName, nodes, edges);
      }

      const savedId = result?.id || currentFile.id || Date.now().toString(36);
      const saved = { id: savedId, name: savedName, nodes, edges };

      setFileHistory(h => [saved, ...h.filter(p => p.id !== savedId)].slice(0, 10));
      setCurrentFile(f => ({ ...f, name: savedName, saved: true, id: savedId }));

      showToast('تم الحفظ بنجاح');
    } catch {
      showToast('تم الحفظ محلياً');
    }
  }, [currentFile, nodes, edges, showToast, setFileHistory]);

  const loadFile = useCallback((saved) => {
    setNodes(saved.nodes || DEFAULT_NODES);
    setEdges(saved.edges || DEFAULT_EDGES);
    setCurrentFile({ name: saved.name, saved: true, id: saved.id });
    persistCanvas(saved.nodes, saved.edges);
    showToast('تم تحميل المشروع');
  }, [showToast, persistCanvas]);

  const deleteProject = useCallback(async (id) => {
    try { await projectsAPI.remove(id); } catch {}
    setFileHistory(h => h.filter(p => p.id !== id));
    showToast('تم حذف المشروع');
  }, [showToast, setFileHistory]);

  // ── Nodes & Edges ───────────────────────────────
  const addNode = useCallback((type, x, y) => {
    const id = 'N' + Date.now().toString(36).slice(-4);
    const newNode = { id, type: type.id, label: type.label, x, y, color: type.color };
    setNodes(n => { const updated = [...n, newNode]; persistCanvas(updated, edges); return updated; });
    setCurrentFile(f => ({ ...f, saved: false }));
    showToast('تمت إضافة نقطة');
  }, [edges, persistCanvas, showToast]);

  const deleteNode = useCallback((nodeId) => {
    setNodes(n => n.filter(nd => nd.id !== nodeId));
    setEdges(e => e.filter(ed => ed.from !== nodeId && ed.to !== nodeId));
    setSelectedNode(null);
    setCurrentFile(f => ({ ...f, saved: false }));
    showToast('تم حذف العقدة');
  }, [showToast]);

  const addEdge = useCallback((from, to) => {
    setEdges(e => [...e, { id: from + to, from, to, weight: 1 }]);
    setCurrentFile(f => ({ ...f, saved: false }));
    showToast('تم ربط نقطتين');
  }, [showToast]);

  // ── Run Algorithm ───────────────────────────────
  const runAlgorithm = useCallback(async (startId, endId) => {
    if (!startId || !endId) return showToast('حدد البداية والنهاية');
    setIsRunning(true);
    setAlgoResult(null);

    try {
      let result;
      try {
        result = await pathsAPI.shortest(startId, endId, selectedAlgo);
      } catch {
        switch (selectedAlgo) {
          case 'astar':   result = runAStar(nodes, edges, startId, endId); break;
          case 'bellman': result = runBellmanFord(nodes, edges, startId, endId); break;
          case 'floyd':   result = runFloydWarshall(nodes, edges, startId, endId); break;
          default:        result = runDijkstra(nodes, edges, startId, endId);
        }
      }
      setAlgoResult(result);
      showToast('تم إيجاد المسار');
    } catch {
      showToast('خطأ أثناء تشغيل الخوارزمية', 'error');
    } finally {
      setIsRunning(false);
    }
  }, [nodes, edges, selectedAlgo, showToast]);

  // ── Auth ─────────────────────────────────────────
  const login = useCallback(async (userData, token) => {
    if (token) setToken(token);
    setUser(userData);
    setPage('app');
    showToast('مرحباً بك');
  }, [setUser, showToast]);

  const logout = useCallback(async () => {
    try { await authAPI.logout(); } catch {}
    setToken(null);
    setUser(null);
    setPage('landing');
    setAlgoResult(null);
    showToast('تم تسجيل الخروج');
  }, [setUser, showToast]);

  return {
    user, login, logout, page, setPage,
    currentFile, fileHistory, newFile, saveFile, loadFile, deleteProject,
    nodes, edges,
    selectedNode, setSelectedNode,
    selectedEdge, setSelectedEdge,
    activeTool, setActiveTool,
    zoom, changeZoom,
    drawingEdge, setDrawingEdge,
    addNode, deleteNode, addEdge,
    selectedAlgo, setSelectedAlgo,
    algoResult, isRunning, runAlgorithm,
    toast, showToast,
    modal, setModal,
  };
}
