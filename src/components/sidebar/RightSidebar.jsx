import React from 'react';
import styles from './RightSidebar.module.css';
import { ALGORITHMS, MOCK_TRAFFIC_CHART, MOCK_AI_INSIGHTS } from '../../data/mockData';

function AlgoCard({ algo, selected, onSelect }) {
  return (
    <div
      className={`${styles.algoCard} ${selected ? styles.algoSelected : ''}`}
      onClick={() => onSelect(algo.id)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onSelect(algo.id)}
      aria-pressed={selected}
      aria-label={algo.name}
    >
      <div className={styles.algoHead}>
        <span className={styles.algoName}>{algo.name}</span>
        <span className={styles.algoBadge}>{algo.badge}</span>
      </div>
      <div className={styles.algoDesc}>{algo.desc}</div>
    </div>
  );
}

function TrafficChart({ data }) {
  const maxVal = Math.max(...data.map(d => d.value));
  const colors = { high: 'var(--red)', mid: 'var(--amber)', low: 'var(--green-l)' };
  return (
    <div className={styles.chart}>
      <div className={styles.chartTitle}>📊 توقع ازدحام الطريق الأسرع — اليوم</div>
      <div className={styles.chartBars}>
        {data.map((d, i) => (
          <div key={i} className={styles.barWrap}>
            <div
              className={styles.bar}
              style={{ height: `${(d.value / maxVal) * 50}px`, background: colors[d.level] }}
              title={`${d.label}: ${d.value}%`}
            />
            <div className={styles.barLbl}>{d.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RouteResult({ result, nodes }) {
  if (!result) return null;
  const getNode = id => nodes.find(n => n.id === id);
  const steps = result.path.slice(0, -1).map((id, i) => {
    const n = getNode(id);
    const next = getNode(result.path[i + 1]);
    return {
      from: n?.label || id,
      to: next?.label || result.path[i + 1],
      dist: (result.distance / (result.path.length - 1)).toFixed(1),
    };
  });
  return (
    <div className={styles.routeResult}>
      <div className={styles.rrHeader}>✓ أفضل مسار — {result.algo}</div>
      {steps.map((s, i) => (
        <div key={i} className={styles.rrStep}>
          <div className={styles.stepN}>{i + 1}</div>
          {s.from} → {s.to}
          <span className={styles.stepD}>{s.dist} كم</span>
        </div>
      ))}
      <div className={styles.rrTotals}>
        <div className={styles.rrTotalBox}>
          <span className={styles.rrTotalVal}>{result.distance.toFixed(1)}</span>
          <span className={styles.rrTotalLbl}>كيلومتر</span>
        </div>
        <div className={styles.rrTotalBox}>
          <span className={styles.rrTotalVal}>{Math.round(result.distance * 2.4)}</span>
          <span className={styles.rrTotalLbl}>دقيقة</span>
        </div>
        <div className={styles.rrTotalBox}>
          <span className={styles.rrTotalVal}>{(result.distance * 0.08).toFixed(2)}</span>
          <span className={styles.rrTotalLbl}>لتر وقود</span>
        </div>
        <div className={styles.rrTotalBox}>
          <span className={styles.rrTotalVal} style={{ color: 'var(--green-d)' }}>
            {Math.round(result.distance * 0.18)} كغ
          </span>
          <span className={styles.rrTotalLbl}>CO₂</span>
        </div>
      </div>
    </div>
  );
}

function CityAnalysisPanel({ analysis }) {
  if (!analysis) return <div className={styles.empty}>اضغط "تحليل الشبكة" لعرض النتائج الحية</div>;
  return (
    <div className={styles.analysisPanel}>
      <div className={styles.analysisGrid}>
        <div className={styles.analysisBox}><span className={styles.aVal}>{analysis.totalNodes}</span><span className={styles.aLbl}>عقدة</span></div>
        <div className={styles.analysisBox}><span className={styles.aVal}>{analysis.totalEdges}</span><span className={styles.aLbl}>طريق</span></div>
        <div className={styles.analysisBox}><span className={styles.aVal}>{analysis.avgDegree}</span><span className={styles.aLbl}>متوسط الدرجة</span></div>
        <div className={styles.analysisBox}><span className={styles.aVal} style={{color:'var(--red)'}}>{analysis.congested}</span><span className={styles.aLbl}>مزدحم</span></div>
        <div className={styles.analysisBox}><span className={styles.aVal}>{analysis.avgDist}</span><span className={styles.aLbl}>متوسط المسافة كم</span></div>
        <div className={styles.analysisBox}><span className={styles.aVal} style={{color: analysis.isolated > 0 ? 'var(--amber)' : 'var(--green-d)'}}>{analysis.isolated}</span><span className={styles.aLbl}>عقد معزولة</span></div>
      </div>
      {Object.keys(analysis.nodeTypes || {}).length > 0 && (
        <div className={styles.nodeTypeBreakdown}>
          <div className={styles.ntTitle}>توزيع العناصر</div>
          <div className={styles.ntGrid}>
            {Object.entries(analysis.nodeTypes).map(([type, count]) => {
              const NODE_ICONS = { house:'🏠', hospital:'🏥', office:'🏢', school:'🏫', gas:'⛽', mosque:'🕌', mall:'🏬', park:'🌳', police:'🚔', pharmacy:'💊', restaurant:'🍽', factory:'🏭', parking:'🅿', signal:'🚦' };
              return (
                <div key={type} className={styles.ntItem}>
                  <span>{NODE_ICONS[type] || '📍'}</span>
                  <span>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className={styles.suggestions}>
        <div className={styles.sugTitle}>💡 توصيات ذكية (تتحدث تلقائياً)</div>
        {analysis.suggestions.map((s, i) => (
          <div key={i} className={styles.suggestion}>
            <span className={styles.sugNum}>{i + 1}</span>{s}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RightSidebar({
  selectedAlgo, setSelectedAlgo,
  algoResult, isRunning,
  nodes, edges,
  onRunModal, rightPanel, setRightPanel,
  getCityAnalysis,
  onOpenGamification, onOpenDecision,
  collapsed,
}) {
  const [analysis, setAnalysis] = React.useState(null);
  const [startNode, setStartNode] = React.useState(nodes[0]?.id || '');
  const [endNode, setEndNode] = React.useState(nodes[1]?.id || '');
  const [priority, setPriority] = React.useState('time');

  // Auto-refresh analysis when tab is active or nodes/edges change
  React.useEffect(() => {
    if (rightPanel === 'analysis') {
      try {
        const result = getCityAnalysis();
        if (result && typeof result.then === 'function') {
          result.then(r => setAnalysis(r)).catch(() => {});
        } else {
          setAnalysis(result);
        }
      } catch {}
    }
  }, [rightPanel, nodes, edges, getCityAnalysis]);

  return (
    <aside
      className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ''} sb-scroll`}
      aria-label="اللوحة اليمنى"
    >
      <div className={styles.tabs} role="tablist">
        {[
          { id: 'algorithm', label: '🧠 خوارزمية' },
          { id: 'analysis',  label: '📊 تحليل' },
          { id: 'insights',  label: '🤖 ذكاء' },
        ].map(t => (
          <button
            key={t.id}
            className={`${styles.tab} ${rightPanel === t.id ? styles.tabActive : ''}`}
            onClick={() => setRightPanel(t.id)}
            role="tab"
            aria-selected={rightPanel === t.id}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Algorithm panel */}
      {rightPanel === 'algorithm' && (
        <>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>اختر الخوارزمية</div>
            {ALGORITHMS.map(a => (
              <AlgoCard key={a.id} algo={a} selected={selectedAlgo === a.id} onSelect={setSelectedAlgo}/>
            ))}
          </div>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>إعداد المسار</div>
            <label className={styles.lbl} htmlFor="start-node">نقطة البداية</label>
            <select id="start-node" className={styles.sel} value={startNode} onChange={e => setStartNode(e.target.value)}>
              {nodes.map(n => <option key={n.id} value={n.id}>{n.label} — {n.id}</option>)}
            </select>
            <label className={styles.lbl} htmlFor="end-node">نقطة النهاية</label>
            <select id="end-node" className={styles.sel} value={endNode} onChange={e => setEndNode(e.target.value)}>
              {nodes.map(n => <option key={n.id} value={n.id}>{n.label} — {n.id}</option>)}
            </select>
            <label className={styles.lbl} htmlFor="priority">أولوية المسار</label>
            <select id="priority" className={styles.sel} value={priority} onChange={e => setPriority(e.target.value)}>
              <option value="time">⚡ أسرع وقتاً</option>
              <option value="dist">📏 أقصر مسافة</option>
              <option value="traffic">🌿 أخف ازدحاماً</option>
              <option value="fuel">⛽ أوفر وقوداً</option>
            </select>
            <button
              className={styles.btnRun}
              onClick={() => onRunModal(startNode, endNode, priority)}
              disabled={isRunning}
              aria-busy={isRunning}
            >
              {isRunning ? '⏳ جارٍ الحساب...' : '▶ تشغيل الخوارزمية'}
            </button>
            <RouteResult result={algoResult} nodes={nodes}/>
          </div>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>توقع الازدحام</div>
            <TrafficChart data={MOCK_TRAFFIC_CHART}/>
          </div>
          <div className={styles.section}>
            <button className={styles.btnAnalyze} onClick={onOpenDecision}>
              🕐 متى أسافر؟ — محرك القرار
            </button>
          </div>
        </>
      )}

      {/* Analysis panel */}
      {rightPanel === 'analysis' && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>تحليل حي للشبكة</div>
          <button className={styles.btnAnalyze} onClick={() => {
            try {
              const r = getCityAnalysis();
              if (r && typeof r.then === 'function') r.then(setAnalysis).catch(() => {});
              else setAnalysis(r);
            } catch {}
          }}>
            🔄 تحديث التحليل
          </button>
          <CityAnalysisPanel analysis={analysis}/>
          <div style={{ marginTop: 16 }}>
            <div className={styles.sectionTitle}>اقتراح طرق جديدة</div>
            <div className={styles.newRouteCard}>
              <div className={styles.nrHead}>🔮 اقتراح AI</div>
              {nodes.length >= 2 ? (
                <>
                  <div className={styles.nrText}>
                    بناءً على تحليل الشبكة، يُقترح إضافة طريق مباشر بين{' '}
                    <strong>{nodes[0]?.label}</strong> و<strong>{nodes[nodes.length - 1]?.label}</strong>{' '}
                    لتقليل الضغط على المحاور الرئيسية بنسبة 34%.
                  </div>
                  <div className={styles.nrMeta}>
                    توفير متوقع: {Math.round(nodes.length * 1.8)} دقيقة · تكلفة: متوسطة
                  </div>
                </>
              ) : (
                <div className={styles.nrText}>أضف على الأقل عقدتين لعرض الاقتراحات</div>
              )}
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <div className={styles.sectionTitle}>أفضل توزيع للمدينة</div>
            <div className={styles.distCard}>
              <div className={styles.distRow}><span>تغطية الخدمات</span><span className={styles.distVal}>87%</span></div>
              <div className={styles.distRow}><span>تمركز الخدمات</span><span className={styles.distValWarn}>عالٍ</span></div>
              <div className={styles.distRow}><span>أقصى مسافة لمستشفى</span><span className={styles.distVal}>4.2 كم</span></div>
              <div className={styles.distRow}><span>مناطق غير مخدومة</span><span className={styles.distValWarn}>2</span></div>
            </div>
          </div>
        </div>
      )}

      {/* AI Insights panel */}
      {rightPanel === 'insights' && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>تحليل الذكاء الاصطناعي</div>
          {MOCK_AI_INSIGHTS.map((ins, i) => (
            <div key={i} className={styles.insight}>
              <span className={styles.insIcon}>{ins.icon}</span>
              <span dangerouslySetInnerHTML={{ __html: ins.text }}/>
            </div>
          ))}
          <div style={{ marginTop: 16 }}>
            <div className={styles.sectionTitle}>أفضل مسار بين مكانين</div>
            <div className={styles.bestRouteCard}>
              <div className={styles.brRoute}>🏠 المنزل → 🏥 المستشفى</div>
              <div className={styles.brResult}><span>⭐ المسار الأمثل</span><span>5.0 كم · 12 دقيقة</span></div>
              <div className={styles.brAlt}><span>🔄 مسار بديل (أقل ازدحاماً)</span><span>6.8 كم · 10 دقائق</span></div>
              <div className={styles.brAlt}><span>🌿 المسار الأخضر</span><span>6.2 كم · 0.65 لتر</span></div>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <div className={styles.sectionTitle}>نقاط المكافآت</div>
            <div className={styles.gamifyCard}>
              <div className={styles.gamifyRow}>
                <span>⭐ نقاطك اليوم</span>
                <span className={styles.gamifyVal}>+45</span>
              </div>
              <div className={styles.gamifyRow}>
                <span>🌿 وقود موفّر</span>
                <span className={styles.gamifyVal}>2.3 لتر</span>
              </div>
              <div className={styles.gamifyRow}>
                <span>⏱ وقت موفّر</span>
                <span className={styles.gamifyVal}>28 دقيقة</span>
              </div>
              <button className={styles.btnGamify} onClick={onOpenGamification}>
                🏆 عرض المتصدرين والشارات
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
