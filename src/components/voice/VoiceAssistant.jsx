import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './VoiceAssistant.module.css';
import { searchAPI } from '../../services/api';

const QUICK_CMDS = [
  'أسرع طريق للمنزل',
  'كثافة المرور الآن',
  'أقرب محطة وقود',
  'موعد أفضل للسفر',
];

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition || null;

// Fallback responses when API is unavailable
const MOCK_RESPONSES = {
  'أسرع طريق':   'الطريق الأسرع الآن هو الدائري الإقليمي، يوفر لك 8 دقائق عن الطريق العادي.',
  'كثافة المرور': 'ازدحام متوسط على طريق النيل، خفيف على الدائري. التحسن متوقع بعد 30 دقيقة.',
  'محطة وقود':   'أقرب محطة وقود على بُعد 1.2 كم على يمينك — محطة توتال بشارع الثورة.',
  'موعد أفضل':   'أفضل وقت للانطلاق بعد 45 دقيقة. ستوفر 12 دقيقة وتقلل استهلاك الوقود 23%.',
};

function getMockResponse(text) {
  const key = Object.keys(MOCK_RESPONSES).find(k => text.includes(k));
  return key
    ? MOCK_RESPONSES[key]
    : 'جارٍ تحليل طلبك... أنصحك بالمسار الأخضر عبر الدائري لتوفير الوقت والوقود.';
}

export default function VoiceAssistant({ onClose }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript]   = useState('');
  const [response, setResponse]       = useState('');
  const [pulse, setPulse]             = useState(false);
  const [supported]                   = useState(!!SpeechRecognition);
  const [loading, setLoading]         = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
    };
  }, []);

  const processQuery = useCallback(async (text) => {
    if (!text.trim()) return;
    setLoading(true);
    setResponse('');
    try {
      const result = await searchAPI.query(text);
      setResponse(result?.response || result?.message || getMockResponse(text));
    } catch {
      setResponse(getMockResponse(text));
    }
    setLoading(false);
  }, []);

  const startListening = useCallback(() => {
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = 'ar-SA';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onstart = () => { setIsListening(true); setPulse(true); };
    recognition.onend   = () => { setIsListening(false); setPulse(false); };
    recognition.onerror = () => { setIsListening(false); setPulse(false); };

    recognition.onresult = (e) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join('');
      setTranscript(t);
      if (e.results[e.results.length - 1].isFinal) {
        processQuery(t);
        recognition.stop();
      }
    };

    recognition.start();
  }, [processQuery]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) recognitionRef.current.stop();
  }, []);

  const handleQuick = (cmd) => {
    setTranscript(cmd);
    processQuery(cmd);
  };

  const handleManualSubmit = () => {
    if (transcript.trim()) processQuery(transcript);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <div className={styles.title}>🎙 المساعد الذكي</div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.body}>
          {/* Mic Button */}
          <div className={styles.micWrap}>
            <button
              className={`${styles.micBtn} ${isListening ? styles.micActive : ''} ${pulse ? styles.micPulse : ''}`}
              onClick={isListening ? stopListening : startListening}
              disabled={!supported}
              aria-label={isListening ? 'إيقاف الاستماع' : 'بدء الاستماع'}
            >
              {isListening ? '⏹' : '🎙'}
            </button>
            <div className={styles.micLabel}>
              {!supported ? 'المتصفح لا يدعم التعرف على الصوت'
               : isListening ? 'أنا أستمع... تحدث الآن'
               : 'اضغط للتحدث'}
            </div>
          </div>

          {/* Manual Input */}
          <div className={styles.inputRow}>
            <input
              className={styles.textInput}
              placeholder="أو اكتب سؤالك هنا..."
              value={transcript}
              onChange={e => setTranscript(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleManualSubmit()}
            />
            <button className={styles.sendBtn} onClick={handleManualSubmit} disabled={loading}>
              {loading ? '⏳' : '➤'}
            </button>
          </div>

          {/* Quick Commands */}
          <div className={styles.quickCmds}>
            {QUICK_CMDS.map((cmd, i) => (
              <button key={i} className={styles.quickBtn} onClick={() => handleQuick(cmd)}>
                {cmd}
              </button>
            ))}
          </div>

          {/* Response */}
          {loading && <div className={styles.loading}>🤖 جارٍ التحليل...</div>}
          {response && !loading && (
            <div className={styles.response}>
              <div className={styles.responseIcon}>🤖</div>
              <div className={styles.responseText}>{response}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
