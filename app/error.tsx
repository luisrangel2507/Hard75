"use client";

export default function RootError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="es">
      <body style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0A1020", fontFamily: "sans-serif" }}>
        <div style={{ textAlign: "center", padding: 24 }}>
          <p style={{ fontWeight: 600, marginBottom: 8, color: "#F2F5FA" }}>Algo salió mal</p>
          <button
            onClick={() => reset()}
            style={{
              marginTop: 8,
              padding: "10px 20px",
              borderRadius: 12,
              border: "none",
              background: "#FF5A1F",
              color: "white",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
