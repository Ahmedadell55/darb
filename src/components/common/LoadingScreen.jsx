import React, { useEffect, useState } from 'react';
import styles from './LoadingScreen.module.css';

export default function LoadingScreen({ onDone }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const steps = [20, 45, 70, 90, 100];
    let i = 0;
    const iv = setInterval(() => {
      if (i < steps.length) {
        setProgress(steps[i++]);
      } else {
        clearInterval(iv);
        setTimeout(onDone, 300);
      }
    }, 200);
    return () => clearInterval(iv);
  }, [onDone]);

  return (
    <div className={styles.screen}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <span className={styles.logoMark}>🛣</span>
          <div className={styles.logoText}>
            دَرْب<em>AI</em>
          </div>
          <div className={styles.logoSub}>ROAD INTELLIGENCE</div>
        </div>
        <div className={styles.progressWrap}>
          <div className={styles.progressTrack}>
            <div className={styles.progressBar} style={{ width: `${progress}%` }}/>
          </div>
          <div className={styles.progressLabel}>{progress}%</div>
        </div>
        <div className={styles.hint}>
          {progress < 40 && 'جارٍ تحميل خوارزميات التوجيه...'}
          {progress >= 40 && progress < 80 && 'جارٍ تحضير بيانات المرور...'}
          {progress >= 80 && 'جارٍ تهيئة الخريطة الذكية...'}
        </div>
      </div>
    </div>
  );
}
