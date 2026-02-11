export default function Dashboard() {
  return (
    <div>
      <h3 className="mb-3">Dashboard</h3>

      <div className="row g-3">
        <div className="col-12 col-lg-6">
          <div className="card-dark p-3">
            <div className="fw-semibold mb-2">Noticias</div>
            <div style={{ color: "var(--muted)" }}>
              Aquí van cards tipo intranet (como tu referencia).
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card-dark p-3">
            <div className="fw-semibold mb-2">Accesos rápidos</div>
            <div style={{ color: "var(--muted)" }}>
              Botones / métricas del sistema de acreditación.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
