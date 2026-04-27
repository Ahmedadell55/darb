// ═══════════════════════════════════════════════════
//  Analytics Service — Stub جاهز للربط
//  [API] استبدل بـ Mixpanel أو PostHog أو Amplitude
// ═══════════════════════════════════════════════════

const ENABLED = process.env.REACT_APP_ANALYTICS_ENABLED === 'true';
const ANALYTICS_KEY = process.env.REACT_APP_ANALYTICS_KEY || '';

/**
 * Initialize analytics (call once on app start)
 * [API] mixpanel.init(ANALYTICS_KEY) || posthog.init(ANALYTICS_KEY, {...})
 */
export function initAnalytics() {
  if (!ENABLED) return;
  // [API] Initialize analytics SDK here
  console.log('[Analytics] Initialized (stub mode)');
}

/**
 * Track an event
 * [API] mixpanel.track(event, properties) || posthog.capture(event, properties)
 */
export function track(event, properties = {}) {
  if (!ENABLED) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', event, properties);
    }
    return;
  }
  // [API] Your analytics SDK call here
}

/**
 * Identify a user (after login)
 * [API] mixpanel.identify(userId) || posthog.identify(userId, { name, email })
 */
export function identify(userId, traits = {}) {
  if (!ENABLED) return;
  // [API] Your analytics SDK identify call
}

/**
 * Reset user (on logout)
 * [API] mixpanel.reset() || posthog.reset()
 */
export function reset() {
  if (!ENABLED) return;
  // [API] Your analytics SDK reset call
}

// ── Predefined Events ────────────────────────────
export const Events = {
  LOGIN:              'user_login',
  LOGOUT:             'user_logout',
  REGISTER:           'user_register',
  DEMO_START:         'demo_started',
  ALGO_RUN:           'algorithm_run',
  PROJECT_SAVE:       'project_saved',
  PROJECT_LOAD:       'project_loaded',
  NODE_ADD:           'node_added',
  EDGE_ADD:           'edge_added',
  EXPORT_PNG:         'export_png',
  EXPORT_JSON:        'export_json',
  FLEET_OPEN:         'fleet_opened',
  PARKING_OPEN:       'parking_opened',
  COMMAND_USED:       'command_palette_used',
  ONBOARDING_DONE:    'onboarding_completed',
  DARK_MODE_TOGGLE:   'dark_mode_toggled',
  MAP_LAYER_CHANGE:   'map_layer_changed',
  RULER_USED:         'ruler_tool_used',
  UPGRADE_CLICK:      'upgrade_clicked',
};
