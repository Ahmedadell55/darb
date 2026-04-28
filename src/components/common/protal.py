import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function Portal({ children }) {
  const el = useRef(document.createElement('div'));

  useEffect(() => {
    const portal = el.current;
    document.body.appendChild(portal);
    return () => document.body.removeChild(portal);
  }, []);

  return createPortal(children, el.current);
}