'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#070612',
          color: '#f5f5f5',
          fontFamily:
            'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          textAlign: 'center',
          padding: 24,
        }}
      >
        <div style={{ maxWidth: 480 }}>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#FF6B35',
            }}
          >
            Goodman GLS
          </p>
          <h1
            style={{
              margin: '12px 0 8px',
              fontSize: 28,
              fontWeight: 600,
              lineHeight: 1.2,
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              margin: '0 0 4px',
              fontSize: 15,
              color: '#a8a8b0',
              lineHeight: 1.5,
            }}
          >
            An unexpected error occurred. Please try again or refresh the page.
          </p>
          <p
            style={{
              margin: '0 0 24px',
              fontSize: 14,
              color: '#888892',
              lineHeight: 1.5,
            }}
          >
            예기치 않은 오류가 발생했습니다. 다시 시도해 주세요.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              background: '#FF6B35',
              color: '#070612',
              border: 'none',
              padding: '12px 24px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              borderRadius: 8,
            }}
          >
            Try again / 다시 시도
          </button>
        </div>
      </body>
    </html>
  );
}
