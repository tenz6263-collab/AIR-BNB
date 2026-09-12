import { useCallback, useEffect, useRef, useState } from 'react';

/** Shows a message for `duration` ms; a new message resets the timer. */
export function useToast(duration = 2000) {
  const [message, setMessage] = useState(null);
  const timer = useRef(null);

  const show = useCallback(
    (text) => {
      clearTimeout(timer.current);
      setMessage(text);
      timer.current = setTimeout(() => setMessage(null), duration);
    },
    [duration],
  );

  useEffect(() => () => clearTimeout(timer.current), []);

  return { message, show };
}
