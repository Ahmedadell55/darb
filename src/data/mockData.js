// ─────────────────────────────────────────────
// MOCK DATA — replace with real API calls later
// ─────────────────────────────────────────────

export const MOCK_USER = {
  id: 'user-001',
  name: 'أحمد السيد',
  email: 'ahmed@example.com',
  avatar: '👤',
  plan: 'Pro',
  savedProjects: 3,
  points: 1240,
  level: 'Gold',
  rank: 47,
};

export const NODE_TYPES = [
  { id: 'house',      label: 'منزل',       icon: '🏠', color: '#3d7a52' },
  { id: 'hospital',   label: 'مستشفى',     icon: '🏥', color: '#c0392b' },
  { id: 'office',     label: 'مكتب',       icon: '🏢', color: '#2563eb' },
  { id: 'school',     label: 'مدرسة',      icon: '🏫', color: '#c87f0a' },
  { id: 'gas',        label: 'محطة وقود',  icon: '⛽', color: '#5a9e6f' },
  { id: 'mosque',     label: 'مسجد',       icon: '🕌', color: '#7c3aed' },
  { id: 'mall',       label: 'مول',        icon: '🏬', color: '#db2777' },
  { id: 'park',       label: 'حديقة',      icon: '🌳', color: '#059669' },
  { id: 'police',     label: 'شرطة',       icon: '🚔', color: '#1d4ed8' },
  { id: 'pharmacy',   label: 'صيدلية',     icon: '💊', color: '#dc2626' },
  { id: 'restaurant', label: 'مطعم',       icon: '🍽', color: '#d97706' },
  { id: 'factory',    label: 'مصنع',       icon: '🏭', color: '#6b7280' },
  { id: 'parking',    label: 'موقف',       icon: '🅿', color: '#0891b2' },
  { id: 'signal',     label: 'إشارة',      icon: '🚦', color: '#16a34a' },
];

export const DEFAULT_NODES = [
  // ── محور رئيسي وسط القاهرة ──
  { id: 'A', type: 'house',      label: 'المنزل',       x: 220, y: 320, color: '#3d7a52', lat: 30.0600, lng: 31.2200 },
  { id: 'B', type: 'hospital',   label: 'المستشفى',     x: 680, y: 320, color: '#c0392b', lat: 30.0560, lng: 31.2440 },
  { id: 'C', type: 'office',     label: 'المكتب',       x: 600, y: 140, color: '#2563eb', lat: 30.0660, lng: 31.2380 },
  { id: 'D', type: 'school',     label: 'المدرسة',      x: 300, y: 500, color: '#c87f0a', lat: 30.0500, lng: 31.2260 },
  { id: 'E', type: 'gas',        label: 'محطة وقود',    x: 680, y: 140, color: '#5a9e6f', lat: 30.0680, lng: 31.2460 },
  // ── عقد إضافية لشبكة أغنى ──
  { id: 'F', type: 'mosque',     label: 'المسجد',       x: 450, y: 230, color: '#7c3aed', lat: 30.0630, lng: 31.2320 },
  { id: 'G', type: 'mall',       label: 'المول',        x: 160, y: 160, color: '#db2777', lat: 30.0700, lng: 31.2160 },
  { id: 'H', type: 'park',       label: 'الحديقة',      x: 500, y: 430, color: '#059669', lat: 30.0520, lng: 31.2360 },
  { id: 'I', type: 'police',     label: 'الشرطة',       x: 800, y: 420, color: '#1d4ed8', lat: 30.0480, lng: 31.2520 },
  { id: 'J', type: 'pharmacy',   label: 'الصيدلية',     x: 340, y: 200, color: '#dc2626', lat: 30.0670, lng: 31.2240 },
  { id: 'K', type: 'restaurant', label: 'المطعم',       x: 750, y: 220, color: '#d97706', lat: 30.0640, lng: 31.2490 },
  { id: 'L', type: 'parking',    label: 'الموقف',       x: 130, y: 430, color: '#0891b2', lat: 30.0530, lng: 31.2130 },
];

export const DEFAULT_EDGES = [
  // ── طرق أساسية ──
  { id: 'AB', from: 'A', to: 'B', weight: 5.0, congestion: 'high'   },
  { id: 'AC', from: 'A', to: 'C', weight: 4.2, congestion: 'medium' },
  { id: 'BC', from: 'B', to: 'C', weight: 2.8, congestion: 'low'    },
  { id: 'BD', from: 'B', to: 'D', weight: 3.1, congestion: 'medium' },
  { id: 'CD', from: 'C', to: 'D', weight: 4.5, congestion: 'low'    },
  { id: 'CE', from: 'C', to: 'E', weight: 1.2, congestion: 'low'    },
  { id: 'DE', from: 'D', to: 'E', weight: 6.3, congestion: 'high'   },
  { id: 'AE', from: 'A', to: 'E', weight: 7.1, congestion: 'medium' },
  // ── طرق الشبكة الموسّعة ──
  { id: 'AF', from: 'A', to: 'F', weight: 2.1, congestion: 'low'    },
  { id: 'BF', from: 'B', to: 'F', weight: 2.9, congestion: 'medium' },
  { id: 'CF', from: 'C', to: 'F', weight: 1.8, congestion: 'low'    },
  { id: 'AG', from: 'A', to: 'G', weight: 3.3, congestion: 'medium' },
  { id: 'GJ', from: 'G', to: 'J', weight: 1.4, congestion: 'low'    },
  { id: 'JC', from: 'J', to: 'C', weight: 2.2, congestion: 'low'    },
  { id: 'DH', from: 'D', to: 'H', weight: 1.9, congestion: 'low'    },
  { id: 'BH', from: 'B', to: 'H', weight: 2.4, congestion: 'medium' },
  { id: 'BI', from: 'B', to: 'I', weight: 1.6, congestion: 'low'    },
  { id: 'EK', from: 'E', to: 'K', weight: 1.1, congestion: 'low'    },
  { id: 'BK', from: 'B', to: 'K', weight: 1.8, congestion: 'medium' },
  { id: 'AL', from: 'A', to: 'L', weight: 1.5, congestion: 'low'    },
  { id: 'DL', from: 'D', to: 'L', weight: 2.7, congestion: 'high'   },
  { id: 'FH', from: 'F', to: 'H', weight: 2.0, congestion: 'medium' },
  { id: 'HI', from: 'H', to: 'I', weight: 3.2, congestion: 'medium' },
];

export const ALGORITHMS = [
  { id: 'dijkstra', name: 'Dijkstra',       badge: 'OPTIMAL',   desc: 'أفضل خوارزمية لأقصر مسار في شبكة بأوزان موجبة. مضمونة الدقة.', color: '#2d5a3d' },
  { id: 'astar',    name: 'A* Search',      badge: 'FAST',      desc: 'تستخدم heuristic ذكياً لتوجيه البحث. أسرع من Dijkstra بكثير.',  color: '#2563eb' },
  { id: 'bellman',  name: 'Bellman-Ford',   badge: 'ROBUST',    desc: 'تدعم الأوزان السالبة وتكتشف الدوائر السالبة تلقائياً.',          color: '#7c3aed' },
  { id: 'floyd',    name: 'Floyd-Warshall', badge: 'ALL-PAIRS', desc: 'تحسب أقصر مسار بين جميع أزواج العقد في ضربة واحدة.',            color: '#c87f0a' },
];

export const MOCK_TRAFFIC_EVENTS = [
  { id: 1, type: 'accident',   color: '#c0392b', text: 'حادث مروري على طريق النيل قرب تقاطع رمسيس — تأخير 18 دقيقة' },
  { id: 2, type: 'congestion', color: '#c87f0a', text: 'محور 26 يوليو — ازدحام متوسط حتى 10 صباحاً' },
  { id: 3, type: 'clear',      color: '#2d6a4f', text: 'الدائري الإقليمي سالك — وفّر 12 دقيقة بتحويل مسارك الآن' },
  { id: 4, type: 'closure',    color: '#c0392b', text: 'إغلاق مؤقت بشارع عبد الخالق ثروت حتى 11:00 ص' },
  { id: 5, type: 'info',       color: '#2563eb', text: 'دَرْب AI حسّن 3,241 مسار اليوم وفّرت 18,400 دقيقة مجتمعة' },
  { id: 6, type: 'emergency',  color: '#7c3aed', text: '🚨 موجة خضراء فعّالة للطوارئ — طريق النصر مفتوح للإسعاف' },
  { id: 7, type: 'signal',     color: '#059669', text: '🚦 إشارة ذكية تقاطع التحرير — تكيّفت مع الازدحام وقلّصت الانتظار 40%' },
];

export const MOCK_ROAD_CONGESTION = [
  { name: 'طريق النيل',        pct: 82, level: 'high'   },
  { name: 'محور 26 يوليو',     pct: 61, level: 'medium' },
  { name: 'الدائري الإقليمي', pct: 23, level: 'low'    },
  { name: 'شارع التحرير',      pct: 75, level: 'high'   },
  { name: 'كورنيش النيل',      pct: 45, level: 'medium' },
];

export const MOCK_TRAFFIC_CHART = [
  { label: '6ص',  value: 20, level: 'low'  },
  { label: '8ص',  value: 90, level: 'high' },
  { label: '9ص',  value: 80, level: 'high' },
  { label: '11ص', value: 55, level: 'mid'  },
  { label: '1م',  value: 30, level: 'low'  },
  { label: '4م',  value: 62, level: 'mid'  },
  { label: '6م',  value: 88, level: 'high' },
  { label: '8م',  value: 50, level: 'mid'  },
  { label: '10م', value: 22, level: 'low'  },
];

export const MOCK_AI_INSIGHTS = [
  { icon: '⚠️', text: '<strong>طريق النيل</strong> ازدحام شديد (82%). تجنبه حتى 9:30 صباحاً.' },
  { icon: '✅', text: '<strong>الدائري الإقليمي</strong> سالك 77%. يوفر 8 دقائق عن الطريق المعتاد.' },
  { icon: '🔮', text: 'التنبؤ: تحسن <strong>طريق المعادي</strong> خلال 25 دقيقة بنسبة 40%.' },
  { icon: '🚧', text: 'حادث مروري عند <strong>تقاطع 26 يوليو</strong>. مسار بديل جاهز.' },
  { icon: '⛽', text: 'أقرب محطة وقود على المسار <strong>Node E</strong> — 0.4 كم انحراف فقط.' },
];

export const SAVED_PROJECTS = [
  { id: 'p1', name: 'شبكة القاهرة الكبرى',  nodes: 14, edges: 21, updated: 'منذ يومين' },
  { id: 'p2', name: 'مخطط منطقة مدينة نصر', nodes: 8,  edges: 11, updated: 'منذ أسبوع' },
  { id: 'p3', name: 'شبكة التجمع الخامس',   nodes: 6,  edges: 9,  updated: 'منذ شهر'   },
];

// ─── Fleet Management ────────────────────────────
export const MOCK_FLEET = [
  { id: 'V001', driver: 'محمد علي',    type: 'truck', status: 'moving',  speed: 62, fuel: 78, route: 'القاهرة → الجيزة',   eta: '14 دقيقة', lat: 220, lng: 320, alerts: [] },
  { id: 'V002', driver: 'سامي حسن',   type: 'van',   status: 'idle',    speed: 0,  fuel: 45, route: 'في الانتظار',          eta: '—',        lat: 400, lng: 200, alerts: ['وقود منخفض'] },
  { id: 'V003', driver: 'كريم أحمد',  type: 'car',   status: 'moving',  speed: 80, fuel: 90, route: 'مدينة نصر → التجمع', eta: '22 دقيقة', lat: 600, lng: 140, alerts: [] },
  { id: 'V004', driver: 'عمر خالد',   type: 'truck', status: 'stopped', speed: 0,  fuel: 32, route: 'متوقف — شارع التحرير', eta: '—',       lat: 300, lng: 500, alerts: ['إطار منخفض', 'وقود منخفض'] },
  { id: 'V005', driver: 'يوسف مصطفى', type: 'van',   status: 'moving',  speed: 55, fuel: 65, route: 'الإسكندرية → القاهرة', eta: '1.2 ساعة', lat: 680, lng: 320, alerts: [] },
];

export const FLEET_STATS = {
  totalVehicles: 5, activeNow: 3, totalKmToday: 847,
  fuelSaved: 23.4, avgSpeed: 65.7, deliveries: 18,
};

// ─── Smart Parking ───────────────────────────────
export const MOCK_PARKING = [
  { id: 'P001', name: 'موقف الأوبرا',      total: 200, available: 45,  distance: 0.3, price: 10, type: 'covered', lat: 380, lng: 260 },
  { id: 'P002', name: 'موقف التحرير',      total: 150, available: 12,  distance: 0.6, price: 5,  type: 'open',    lat: 460, lng: 300 },
  { id: 'P003', name: 'موقف ميدان رمسيس', total: 300, available: 120, distance: 1.2, price: 8,  type: 'covered', lat: 540, lng: 200 },
  { id: 'P004', name: 'موقف النيل',        total: 80,  available: 3,   distance: 0.9, price: 15, type: 'valet',   lat: 300, lng: 380 },
  { id: 'P005', name: 'موقف الجامعة',      total: 500, available: 230, distance: 2.1, price: 3,  type: 'open',    lat: 620, lng: 420 },
];

// ─── Gamification ────────────────────────────────
export const GAMIFICATION_BADGES = [
  { id: 'early_bird', icon: '🌅', label: 'الطائر المبكر',  desc: 'سافر 10 مرات قبل ساعة الذروة',       earned: true,  points: 100 },
  { id: 'eco_hero',   icon: '🌿', label: 'بطل البيئة',     desc: 'وفّر 50 لتر وقود بالمسارات الخضراء', earned: true,  points: 200 },
  { id: 'route_pro',  icon: '🗺', label: 'خبير المسارات',  desc: 'احسب 100 مسار ناجح',                  earned: true,  points: 150 },
  { id: 'crowd_king', icon: '👑', label: 'ملك الازدحام',   desc: 'تجنب الذروة 30 يوماً متتالية',       earned: false, points: 300 },
  { id: 'fleet_boss', icon: '🚛', label: 'قائد الأسطول',   desc: 'أدر 10 مركبات بكفاءة عالية',         earned: false, points: 250 },
  { id: 'speed_pro',  icon: '⚡', label: 'سريع البرق',     desc: 'أكمل 50 رحلة في الوقت المحدد',       earned: false, points: 175 },
];

export const LEADERBOARD = [
  { rank: 1,  name: 'هشام الدربي', points: 4200, badge: '🥇', level: 'Platinum' },
  { rank: 2,  name: 'ليلى أحمد',  points: 3850, badge: '🥈', level: 'Platinum' },
  { rank: 3,  name: 'طارق محمود', points: 3600, badge: '🥉', level: 'Gold'     },
  { rank: 4,  name: 'نورا سالم',  points: 2980, badge: '🏅', level: 'Gold'     },
  { rank: 47, name: 'أحمد السيد', points: 1240, badge: '⭐', level: 'Gold', isMe: true },
];

// ─── Eco Routing ─────────────────────────────────
export const ECO_ROUTES = [
  { id: 'fastest', label: 'الأسرع', icon: '⚡', time: 12, dist: 5.0, fuel: 0.85, co2: 2.0,  toll: 0, congestion: 'high',   recommended: false },
  { id: 'eco',     label: 'الأخضر', icon: '🌿', time: 15, dist: 6.2, fuel: 0.65, co2: 1.5,  toll: 0, congestion: 'low',    recommended: true  },
  { id: 'short',   label: 'الأقصر', icon: '📏', time: 14, dist: 4.5, fuel: 0.75, co2: 1.75, toll: 5, congestion: 'medium', recommended: false },
];

// ─── Driving Analytics ───────────────────────────
export const DRIVING_ANALYTICS = {
  score: 84, grade: 'B+', trips: 47, totalKm: 623,
  avgSpeed: 58, hardBrakes: 3, sharpTurns: 2, idleTime: 12,
  fuelEfficiency: 14.2, safetyScore: 91,
  weeklyTrend: [72, 78, 75, 82, 80, 84, 84],
  tips: [
    { icon: '🛑', text: 'قلل الكبح المفاجئ للحصول على نقاط إضافية' },
    { icon: '⚡', text: 'تسارع تدريجي يوفر 15% من استهلاك الوقود' },
    { icon: '🌡', text: 'قلل الانتظار المحرك — 12 دقيقة هذا الأسبوع' },
  ],
};

// ─── Departure Windows ───────────────────────────
export const DEPARTURE_WINDOWS = [
  { time: 'الآن',          trafficPct: 82, label: 'ازدحام شديد',  color: '#c0392b', recommended: false, saving: 0  },
  { time: 'بعد 20 دقيقة',  trafficPct: 68, label: 'ازدحام متوسط', color: '#c87f0a', recommended: false, saving: 5  },
  { time: 'بعد 45 دقيقة',  trafficPct: 35, label: 'حركة جيدة',    color: '#2d5a3d', recommended: true,  saving: 12 },
  { time: 'بعد 1.5 ساعة',  trafficPct: 20, label: 'طريق سالك',    color: '#059669', recommended: false, saving: 18 },
];

// ─── Traffic Signals ─────────────────────────────
export const TRAFFIC_SIGNALS = [
  { id: 'S1', x: 380, y: 250, status: 'adaptive', phase: 'green',  waitTime: 0,  queueLen: 2  },
  { id: 'S2', x: 480, y: 340, status: 'adaptive', phase: 'red',    waitTime: 42, queueLen: 14 },
  { id: 'S3', x: 560, y: 220, status: 'fixed',    phase: 'yellow', waitTime: 8,  queueLen: 5  },
  { id: 'S4', x: 320, y: 420, status: 'adaptive', phase: 'green',  waitTime: 0,  queueLen: 1  },
];

// ─── Algorithm: Dijkstra ─────────────────────────
export function runDijkstra(nodes, edges, startId, endId) {
  const graph = {};
  nodes.forEach(n => { graph[n.id] = []; });
  edges.forEach(e => {
    graph[e.from].push({ to: e.to, weight: e.weight });
    graph[e.to].push({ to: e.from, weight: e.weight });
  });
  const dist = {}, prev = {};
  const visited = new Set();
  nodes.forEach(n => { dist[n.id] = Infinity; prev[n.id] = null; });
  dist[startId] = 0;
  const queue = [...nodes.map(n => n.id)];
  while (queue.length) {
    queue.sort((a, b) => dist[a] - dist[b]);
    const u = queue.shift();
    if (u === endId) break;
    visited.add(u);
    (graph[u] || []).forEach(({ to, weight }) => {
      if (visited.has(to)) return;
      const alt = dist[u] + weight;
      if (alt < dist[to]) { dist[to] = alt; prev[to] = u; }
    });
  }
  const path = [];
  let cur = endId;
  while (cur) { path.unshift(cur); cur = prev[cur]; }
  return { path, distance: dist[endId] };
}

// ─── Algorithm: A* ───────────────────────────────
export function runAStar(nodes, edges, startId, endId) {
  const nodeMap = {};
  nodes.forEach(n => { nodeMap[n.id] = n; });
  const graph = {};
  nodes.forEach(n => { graph[n.id] = []; });
  edges.forEach(e => {
    graph[e.from].push({ to: e.to, weight: e.weight });
    graph[e.to].push({ to: e.from, weight: e.weight });
  });
  const h = (a, b) => {
    const na = nodeMap[a], nb = nodeMap[b];
    return (!na || !nb) ? 0 : Math.hypot(na.x - nb.x, na.y - nb.y) / 100;
  };
  const gScore = {}, fScore = {}, prev = {};
  nodes.forEach(n => { gScore[n.id] = Infinity; fScore[n.id] = Infinity; prev[n.id] = null; });
  gScore[startId] = 0;
  fScore[startId] = h(startId, endId);
  const open = new Set([startId]);
  while (open.size) {
    let u = [...open].sort((a, b) => fScore[a] - fScore[b])[0];
    if (u === endId) break;
    open.delete(u);
    (graph[u] || []).forEach(({ to, weight }) => {
      const g = gScore[u] + weight;
      if (g < gScore[to]) {
        prev[to] = u; gScore[to] = g; fScore[to] = g + h(to, endId); open.add(to);
      }
    });
  }
  const path = [];
  let cur = endId;
  while (cur) { path.unshift(cur); cur = prev[cur]; }
  return { path, distance: gScore[endId] };
}

// ─── City Analysis ────────────────────────────────
export function analyzeCity(nodes, edges) {
  const congestedEdges = edges.filter(e => e.congestion === 'high');
  const isolatedNodes  = nodes.filter(n => !edges.some(e => e.from === n.id || e.to === n.id));
  const totalDist      = edges.reduce((s, e) => s + e.weight, 0);
  const avgDist        = edges.length ? (totalDist / edges.length).toFixed(1) : 0;
  const nodeTypes      = {};
  nodes.forEach(n => { nodeTypes[n.type] = (nodeTypes[n.type] || 0) + 1; });
  const hospitals = nodeTypes['hospital'] || 0;
  const schools   = nodeTypes['school']   || 0;

  const suggestions = [];
  if (congestedEdges.length > 0) {
    const e = congestedEdges[0];
    const fromNode = nodes.find(n => n.id === e.from);
    const toNode   = nodes.find(n => n.id === e.to);
    suggestions.push(`تخفيف الازدحام بين ${fromNode?.label || e.from} و${toNode?.label || e.to} بمسار بديل`);
  }
  if (isolatedNodes.length > 0) {
    suggestions.push(`ربط العقدة المعزولة: ${isolatedNodes[0].label} بأقرب طريق`);
  }
  if (hospitals === 0 && nodes.length > 2) {
    suggestions.push('لا توجد مستشفيات في الشبكة — يُنصح بإضافة مرفق طبي');
  }
  if (edges.length > 0 && nodes.length > 0) {
    const density = (edges.length / nodes.length).toFixed(1);
    if (parseFloat(density) < 1.5) {
      suggestions.push('كثافة الطرق منخفضة — أضف روابط بين العقد لتحسين الوصولية');
    }
  }
  if (suggestions.length === 0) {
    suggestions.push('الشبكة متوازنة — لا توصيات عاجلة');
  }

  return {
    totalNodes:  nodes.length,
    totalEdges:  edges.length,
    avgDegree:   nodes.length ? (edges.length * 2 / nodes.length).toFixed(1) : '0',
    congested:   congestedEdges.length,
    avgDist,
    isolated:    isolatedNodes.length,
    suggestions,
    nodeTypes,
  };
}

// ─── Algorithm: Bellman-Ford ──────────────────────
export function runBellmanFord(nodes, edges, startId, endId) {
  const dist = {}, prev = {};
  nodes.forEach(n => { dist[n.id] = Infinity; prev[n.id] = null; });
  dist[startId] = 0;

  // Relax edges |V|-1 times
  for (let i = 0; i < nodes.length - 1; i++) {
    edges.forEach(e => {
      // Forward
      if (dist[e.from] + e.weight < dist[e.to]) {
        dist[e.to] = dist[e.from] + e.weight;
        prev[e.to] = e.from;
      }
      // Backward (undirected)
      if (dist[e.to] + e.weight < dist[e.from]) {
        dist[e.from] = dist[e.to] + e.weight;
        prev[e.from] = e.to;
      }
    });
  }

  // Reconstruct path
  const path = [];
  let cur = endId;
  const visited = new Set();
  while (cur && !visited.has(cur)) {
    visited.add(cur);
    path.unshift(cur);
    cur = prev[cur];
  }
  return { path, distance: dist[endId] };
}

// ─── Algorithm: Floyd-Warshall ────────────────────
export function runFloydWarshall(nodes, edges, startId, endId) {
  const ids = nodes.map(n => n.id);
  const n = ids.length;
  const idx = {};
  ids.forEach((id, i) => { idx[id] = i; });

  // Init distance matrix
  const dist = Array.from({ length: n }, () => Array(n).fill(Infinity));
  const next = Array.from({ length: n }, () => Array(n).fill(null));

  ids.forEach((id, i) => { dist[i][i] = 0; });

  edges.forEach(e => {
    const u = idx[e.from], v = idx[e.to];
    if (u === undefined || v === undefined) return;
    dist[u][v] = Math.min(dist[u][v], e.weight);
    dist[v][u] = Math.min(dist[v][u], e.weight);
    next[u][v] = v;
    next[v][u] = u;
  });

  // Floyd-Warshall
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
          next[i][j] = next[i][k];
        }
      }
    }
  }

  // Reconstruct path
  const si = idx[startId], ei = idx[endId];
  if (si === undefined || ei === undefined || dist[si][ei] === Infinity) {
    return { path: [startId, endId], distance: Infinity };
  }

  const path = [startId];
  let cur = si;
  const maxSteps = n + 1;
  let steps = 0;
  while (cur !== ei && steps < maxSteps) {
    cur = next[cur][ei];
    if (cur === null) break;
    path.push(ids[cur]);
    steps++;
  }

  return { path, distance: dist[si][ei] };
}
