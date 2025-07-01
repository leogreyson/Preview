'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <h2>Something went wrong!</h2>
      <pre style={{ color: 'red' }}>{error.message}</pre>
      <button onClick={() => reset()} style={{ marginTop: 10, padding: '8px 16px' }}>
        Try again
      </button>
    </div>
  );
}
