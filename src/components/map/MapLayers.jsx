import React from 'react';
import styles from './MapLayers.module.css';

export const TILE_LAYERS = [
  {
    id: 'street',
    label: 'شوارع',
    icon: '🗺',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap',
  },
  {
    id: 'satellite',
    label: 'قمر صناعي',
    icon: '🛰',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '© Esri',
  },
  {
    id: 'topo',
    label: 'طبوغرافي',
    icon: '⛰',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '© OpenTopoMap',
  },
  {
    id: 'dark',
    label: 'ليلي',
    icon: '🌙',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '© CartoDB',
  },
];

export default function MapLayersPanel({ currentLayer, onSelect, onClose }) {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.title}>🗺 طبقات الخريطة</span>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>
      </div>
      <div className={styles.grid}>
        {TILE_LAYERS.map(layer => (
          <button
            key={layer.id}
            className={`${styles.layerBtn} ${currentLayer === layer.id ? styles.layerActive : ''}`}
            onClick={() => { onSelect(layer); onClose(); }}
          >
            <span className={styles.layerIcon}>{layer.icon}</span>
            <span className={styles.layerLabel}>{layer.label}</span>
            {currentLayer === layer.id && <span className={styles.checkmark}>✓</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
