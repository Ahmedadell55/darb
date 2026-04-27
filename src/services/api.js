// ═══════════════════════════════════════════════════
//  دَرْب AI — API Service Layer  (v4 — fully audited)
//  ✅ Smart login: JSON first → OAuth2 form fallback
//  ✅ Register: uses token from register response if present
//  ✅ All errors always return readable Arabic strings
//  ✅ Request timeout on every call (12s)
//  ✅ Parking release → POST /parking/release/{id} (restored)
//  ✅ Body only sent when explicitly provided
//  ✅ Handles array / {items} / {results} / {data} responses
// ═══════════════════════════════════════════════════

export const BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:8000';

const TIMEOUT_MS = 12000;

// ── Backend availability (cached, reset every 60s) ──────────
let _backendAvailable = null;
setInterval(() => { _backendAvailable = null; }, 60_000);

export async function isBackendAvailable() {
  if (_backendAvailable !== null) return _backendAvailable;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 3000);
    const res = await fetch(`${BASE_URL}/health`, { signal: ctrl.signal });
    clearTimeout(t);
    _backendAvailable = res.ok;
  } catch {
    _backendAvailable = false;
  }
  return _backendAvailable;
}

// ── Token storage ────────────────────────────────────────────
export function getToken() { return localStorage.getItem('darb_token'); }
export function setToken(token) {
  if (token) localStorage.setItem('darb_token', token);
  else        localStorage.removeItem('darb_token');
}

// ── Always return a readable string from ANY error shape ─────
export function extractMsg(e) {
  if (!e) return 'حدث خطأ غير معروف';
  if (typeof e === 'string' && e.trim()) return e;
  if (e instanceof Error && e.message)  return e.message;
  if (typeof e.detail  === 'string' && e.detail)  return e.detail;
  if (Array.isArray(e.detail))
    return e.detail.map(d => d.msg || d.message || String(d)).join(' — ');
  if (typeof e.message === 'string' && e.message) return e.message;
  if (typeof e.error   === 'string' && e.error)   return e.error;
  return 'حدث خطأ غير معروف';
}

// ── Core JSON request ────────────────────────────────────────
async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const ctrl  = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      signal: ctrl.signal,
      body: body !== undefined && !['GET', 'HEAD'].includes(method)
        ? JSON.stringify(body)
        : null,
    });
  } catch (e) {
    clearTimeout(timer);
    if (e.name === 'AbortError')
      throw new Error('انتهت مهلة الطلب — تحقق من الاتصال بالإنترنت');
    throw new Error('تعذّر الاتصال بالخادم');
  }
  clearTimeout(timer);

  if (res.status === 401) {
    setToken(null);
    localStorage.removeItem('darb_user');
    window.dispatchEvent(new CustomEvent('darb:logout'));
    throw new Error('انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى');
  }
  if (!res.ok) {
    let msg = `خطأ ${res.status}`;
    try { msg = extractMsg(await res.json()); } catch {}
    throw new Error(msg);
  }
  if (res.status === 204) return { success: true };
  try { return await res.json(); } catch { return { success: true }; }
}

// ── Form-encoded POST (OAuth2 standard) ─────────────────────
async function postForm(path, fields) {
  const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const ctrl  = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers,
      signal: ctrl.signal,
      body: new URLSearchParams(fields).toString(),
    });
  } catch (e) {
    clearTimeout(timer);
    if (e.name === 'AbortError')
      throw new Error('انتهت مهلة الطلب — تحقق من الاتصال بالإنترنت');
    throw new Error('تعذّر الاتصال بالخادم');
  }
  clearTimeout(timer);

  if (res.status === 401) {
    setToken(null);
    localStorage.removeItem('darb_user');
    window.dispatchEvent(new CustomEvent('darb:logout'));
    throw new Error('انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى');
  }
  if (!res.ok) {
    let msg = `خطأ ${res.status}`;
    try { msg = extractMsg(await res.json()); } catch {}
    throw new Error(msg);
  }
  try { return await res.json(); } catch { return { success: true }; }
}

const get   = (path)       => request('GET',    path);
const post  = (path, body) => request('POST',   path, body !== undefined ? body : {});
const put   = (path, body) => request('PUT',    path, body !== undefined ? body : {});
const patch = (path, body) => request('PATCH',  path, body !== undefined ? body : {});
const del   = (path)       => request('DELETE', path);

// ── Normalise list responses ─────────────────────────────────
function toArray(data) {
  if (Array.isArray(data))          return data;
  if (Array.isArray(data?.items))   return data.items;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.data))    return data.data;
  return [];
}

// ═════════════════════════════════════════════════════
//  DATA MAPPERS
// ═════════════════════════════════════════════════════

function nodeToBackend(node) {
  return {
    id:    node.id,
    name:  node.label || node.name || node.id,
    type:  node.type  || 'default',
    x:     node.x     ?? 0,
    y:     node.y     ?? 0,
    lat:   node.lat   ?? null,
    lng:   node.lng   ?? null,
    color: node.color || '#3d7a52',
  };
}

function nodeToFrontend(node) {
  return {
    id:    node.id,
    label: node.name  || node.label || node.id,
    name:  node.name  || node.label || node.id,
    type:  node.type  || 'default',
    x:     node.x     ?? 0,
    y:     node.y     ?? 0,
    color: node.color || '#3d7a52',
    lat:   node.lat   ?? null,
    lng:   node.lng   ?? null,
  };
}

function edgeToBackend(edge) {
  const cMap = { low: 0.1, medium: 0.5, high: 0.9 };
  return {
    id:         edge.id,
    source:     edge.from   || edge.source,
    target:     edge.to     || edge.target,
    weight:     edge.weight || 1.0,
    congestion: typeof edge.congestion === 'number'
                  ? edge.congestion
                  : cMap[edge.congestion] ?? 0.1,
  };
}

function edgeToFrontend(edge) {
  const val   = typeof edge.congestion === 'number' ? edge.congestion : 0.1;
  const label = val >= 0.7 ? 'high' : val >= 0.4 ? 'medium' : 'low';
  return {
    id:         edge.id,
    from:       edge.source || edge.from,
    to:         edge.target || edge.to,
    source:     edge.source || edge.from,
    target:     edge.target || edge.to,
    weight:     edge.weight || 1.0,
    congestion: label,
  };
}

function algoToBackend(algo) {
  const map = {
    dijkstra: 'dijkstra',
    astar:    'astar',
    bellman:  'bellman_ford',
    floyd:    'floyd_warshall',
    bfs:      'bfs',
    ucs:      'ucs',
  };
  return map[algo] || 'dijkstra';
}

function pathResultToFrontend(result) {
  if (!result) return { path: [], distance: 0, algorithm: 'unknown', steps: 0 };
  return {
    path:        result.path              || [],
    distance:    result.total_distance_km ?? result.distance ?? 0,
    algorithm:   result.algorithm         || 'unknown',
    steps:       result.num_edges         ?? result.steps ?? 0,
    description: result.description       || '',
  };
}

// ═════════════════════════════════════════════════════
//  AUTH
//  LOGIN STRATEGY:
//   1. POST /auth/login with JSON { email, password }
//   2. If backend returns 422 → retry with OAuth2 form
//      { username: email, password } (FastAPI standard)
// ═════════════════════════════════════════════════════
export const authAPI = {

  login: async (email, password) => {
    try {
      return await post('/auth/login', { email, password });
    } catch (e) {
      // If server can't process JSON body (422), try OAuth2 form
      if (e.message && (e.message.includes('422') || e.message.includes('Unprocessable'))) {
        return await postForm('/auth/login', { username: email, password });
      }
      throw e;
    }
  },

  register: (username, email, password) =>
    post('/auth/register', { username, email, password }),

  // POST with no body — do not send {} as it can cause 422 on strict backends
  logout: () => request('POST', '/auth/logout'),

  forgotPassword: (email)       => post('/auth/forgot-password', { email }),
  resetPassword:  (new_password) => post('/auth/reset-password', { new_password }),
  getMe:          ()             => get('/auth/me'),
  getGoogleUrl:   ()             => get('/auth/google'),
};

// ── Login helper: returns { token, user } ───────────────────
export async function loginAndGetUser(email, password) {
  const res = await authAPI.login(email, password);

  const token = res.access_token || res.token;
  if (!token) throw new Error('لم يتم استلام التوكن من الخادم');
  setToken(token);

  // Try to get user from login response first
  let profile = res.user || null;

  if (!profile || !profile.id) {
    try {
      profile = await authAPI.getMe();
    } catch {
      profile = {
        id:       res.user_id || res.id || '',
        username: res.username || res.name || email.split('@')[0],
        email:    res.email || email,
      };
    }
  }

  return {
    token,
    user: {
      id:       profile.id                               || '',
      name:     profile.username || profile.name         || email.split('@')[0],
      username: profile.username || profile.name         || email.split('@')[0],
      email:    profile.email                            || email,
      avatar:   profile.avatar                          || '👤',
      plan:     profile.plan     || profile.tier         || 'free',
      points:   profile.points                          || 0,
      level:    profile.level                           || 'Bronze',
      rank:     profile.rank                            || 999,
    },
  };
}

// ── Register then login helper ───────────────────────────────
export async function registerAndLogin(username, email, password) {
  const regRes = await authAPI.register(username, email, password);

  // If register response contains a token, use it directly
  const regToken = regRes?.access_token || regRes?.token;
  if (regToken) {
    setToken(regToken);
    let profile = regRes.user || {};
    try { profile = await authAPI.getMe(); } catch {}
    return {
      token: regToken,
      user: {
        id:       profile.id       || '',
        name:     profile.username || username,
        username: profile.username || username,
        email:    profile.email    || email,
        avatar:   '👤',
        plan:     'free',
        points:   0,
        level:    'Bronze',
        rank:     999,
      },
    };
  }

  // Register returned 200/201 with no token → login now
  return loginAndGetUser(email, password);
}

// ═════════════════════════════════════════════════════
//  PROJECTS
// ═════════════════════════════════════════════════════
export const projectsAPI = {
  list: () => get('/projects/').then(toArray),

  create: (name, nodes, edges) =>
    post('/projects/', {
      name,
      nodes: nodes.map(nodeToBackend),
      edges: edges.map(edgeToBackend),
    }),

  update: (id, name, nodes, edges) =>
    put(`/projects/${id}`, {
      name,
      nodes: nodes.map(nodeToBackend),
      edges: edges.map(edgeToBackend),
    }),

  remove: (id) => del(`/projects/${id}`),
};

// ═════════════════════════════════════════════════════
//  NODES
// ═════════════════════════════════════════════════════
export const nodesAPI = {
  list:    ()         => get('/nodes/').then(d => toArray(d).map(nodeToFrontend)),
  create:  (node)     => post('/nodes/', nodeToBackend(node)).then(nodeToFrontend),
  getById: (id)       => get(`/nodes/${id}`).then(nodeToFrontend),
  update:  (id, node) => put(`/nodes/${id}`, nodeToBackend(node)).then(nodeToFrontend),
  remove:  (id)       => del(`/nodes/${id}`),
};

// ═════════════════════════════════════════════════════
//  EDGES
// ═════════════════════════════════════════════════════
export const edgesAPI = {
  list:   () => get('/edges/').then(d => toArray(d).map(edgeToFrontend)),
  create: (edge) => post('/edges/', edgeToBackend(edge)).then(edgeToFrontend),

  updateCongestion: (id, congestion) => {
    const val = typeof congestion === 'number'
      ? congestion
      : { low: 0.1, medium: 0.5, high: 0.9 }[congestion] ?? 0.1;
    return patch(`/edges/${id}/congestion`, { congestion: val });
  },

  remove: (id) => del(`/edges/${id}`),
};

// ═════════════════════════════════════════════════════
//  PATHS
// ═════════════════════════════════════════════════════
export const pathsAPI = {
  shortest: (start, end, algorithm = 'dijkstra') =>
    post('/paths/shortest', {
      start,
      end,
      algorithm: algoToBackend(algorithm),
    }).then(pathResultToFrontend),

  best: (start, end) =>
    post('/paths/best', { start, end, algorithm: 'dijkstra' })
      .then(pathResultToFrontend),
};

// ═════════════════════════════════════════════════════
//  FLEET
// ═════════════════════════════════════════════════════
export const fleetAPI = {
  getVehicles:   ()                             => get('/fleet/vehicles'),
  getStats:      ()                             => get('/fleet/stats'),
  updateVehicle: (id, status, speed, location) =>
    patch(`/fleet/vehicles/${id}`, { status, speed, location }),
};

// ═════════════════════════════════════════════════════
//  PARKING
//  ✅ release → POST /parking/release/{lot_id} (correct)
// ═════════════════════════════════════════════════════
export const parkingAPI = {
  getLots: () =>
    get('/parking/lots').then(d => {
      const list = d?.lots ?? d;
      return Array.isArray(list) ? list : toArray(d);
    }),

  reserve: (lot_id) => post('/parking/reserve', { lot_id }),
  release: (lot_id) => post(`/parking/release/${lot_id}`, {}),
};

// ═════════════════════════════════════════════════════
//  ANALYSIS
// ═════════════════════════════════════════════════════
export const analysisAPI = {
  city:   () => get('/analysis/city'),
  simple: () => get('/analysis/simple'),
};

// ═════════════════════════════════════════════════════
//  SEARCH
// ═════════════════════════════════════════════════════
export const searchAPI = {
  query:       (text, context = null) => post('/search/query', { text, context }),
  getCommands: ()                     => get('/search/commands'),
};

// ═════════════════════════════════════════════════════
//  HEALTH
// ═════════════════════════════════════════════════════
export const checkHealth = () =>
  fetch(`${BASE_URL}/health`).then(r => r.ok).catch(() => false);
