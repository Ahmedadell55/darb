// ═══════════════════════════════════════════════════
//  Export Utilities
// ═══════════════════════════════════════════════════

/**
 * Export map as PNG using Leaflet's container
 * [API] عند ربط API حقيقي: يمكن استخدام server-side rendering للخرائط
 */
export function exportMapAsPng(mapContainerRef, filename = 'darb-ai-map.png') {
  const container = mapContainerRef?.current;
  if (!container) return;

  // Use html2canvas if available, otherwise show message
  if (window.html2canvas) {
    window.html2canvas(container, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#f0ece3',
    }).then(canvas => {
      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }).catch(() => {
      fallbackPngExport(container, filename);
    });
  } else {
    fallbackPngExport(container, filename);
  }
}

function fallbackPngExport(container, filename) {
  // Fallback: export the canvas element if Leaflet canvas renderer
  const canvas = container.querySelector('canvas');
  if (canvas) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
    return true;
  }
  return false;
}

/**
 * Export project as JSON
 */
export function exportAsJson(nodes, edges, projectName = 'darb-project') {
  const data = {
    version: '3.0',
    name: projectName,
    exportedAt: new Date().toISOString(),
    meta: {
      nodeCount: nodes.length,
      edgeCount: edges.length,
      platform: 'دَرْب AI v3',
    },
    nodes,
    edges,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `${projectName.replace(/\s+/g, '-')}.json`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Import project from JSON file
 */
export function importFromJson(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data.nodes || !data.edges) throw new Error('ملف JSON غير صالح');
        resolve({ nodes: data.nodes, edges: data.edges, name: data.name });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}
