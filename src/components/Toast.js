import { useEffect, useRef, useState } from 'react';

/** Small glass notice used by the 3D keyboard actions. */
export default function Toast() {
  const [msg, setMsg] = useState(null);
  const [id, setId] = useState(0);
  const timer = useRef();

  useEffect(() => {
    const on = (e) => {
      setMsg(e.detail);
      setId((n) => n + 1);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setMsg(null), 2800);
    };
    window.addEventListener('toast', on);
    return () => {
      window.removeEventListener('toast', on);
      clearTimeout(timer.current);
    };
  }, []);

  return (
    <div className="toast-wrap" role="status" aria-live="polite">
      {msg && (
        <p key={id} className="toast glass-pill">
          {msg}
        </p>
      )}
    </div>
  );
}
