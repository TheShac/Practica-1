import { useEffect, useState } from "react";
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { getDashboardCorreos, getDashboardNotificaciones } from "@/features/admin/services/dashboard.service.js";

const TIPO_LABEL = {
  verificacion: "Verificación",
  recuperacion: "Recuperación",
  notificacion: "Notificación",
  bienvenida: "Bienvenida",
  cambio_correo: "Cambio de correo",
};

const ESTADO_ENVIO_INFO = {
  pendiente:   { texto: "Pendiente",   clase: "bg-secondary" },
  procesando:  { texto: "Enviando...", clase: "bg-info text-dark" },
  completado:  { texto: "Enviado",     clase: "bg-success" },
  con_errores: { texto: "Con errores", clase: "bg-danger" },
};

function StatCard({ label, value, sub, warn }) {
  return (
    <div className="panel-card" style={{ flex: 1, minWidth: 160 }}>
      <div style={{ color: "var(--muted)", fontSize: 13 }}>{label}</div>
      <div
        className="fw-bold"
        style={{ fontSize: 28, color: warn ? "#dc3545" : "#daa136" }}
      >
        {value}
      </div>
      {sub && <div style={{ color: "var(--muted)", fontSize: 12 }}>{sub}</div>}
    </div>
  );
}

function DashboardCorreos() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setData(await getDashboardCorreos());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div style={{ color: "var(--muted)" }}>Cargando...</div>;
  if (!data) return <div style={{ color: "var(--muted)" }}>No se pudo cargar el dashboard de correos.</div>;

  const cuotaDiariaCerca = data.hoy.usados / data.hoy.limite >= 0.8;
  const cuotaMensualCerca = data.mes.usados / data.mes.limite >= 0.8;

  const porTipoData = data.porTipo.map((t) => ({
    tipo: TIPO_LABEL[t.tipo] || t.tipo,
    total: t.total,
  }));

  const porDiaData = data.porDia.map((d) => ({
    dia: new Date(d.dia).toLocaleDateString("es-CL", { day: "2-digit", month: "2-digit" }),
    total: d.total,
  }));

  return (
    <>
      <div className="d-flex gap-3 flex-wrap mb-4">
        <StatCard
          label="Correos enviados hoy"
          value={`${data.hoy.usados} / ${data.hoy.limite}`}
          warn={cuotaDiariaCerca}
          sub={cuotaDiariaCerca ? "Cerca del límite diario" : null}
        />
        <StatCard
          label="Correos enviados este mes"
          value={`${data.mes.usados} / ${data.mes.limite}`}
          warn={cuotaMensualCerca}
          sub={cuotaMensualCerca ? "Cerca del límite mensual" : null}
        />
        <StatCard label="Correos fallidos" value={data.fallidos} warn={data.fallidos > 0} />
        <StatCard label="Correos pendientes" value={data.pendientes} />
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-8">
          <div className="panel-card">
            <div className="mb-2" style={{ color: "var(--muted)" }}>Enviados por día (últimos 30 días)</div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={porDiaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="dia" stroke="var(--muted)" fontSize={12} />
                <YAxis stroke="var(--muted)" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)" }} />
                <Line type="monotone" dataKey="total" stroke="#daa136" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="panel-card">
            <div className="mb-2" style={{ color: "var(--muted)" }}>Por tipo</div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={porTipoData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" stroke="var(--muted)" fontSize={12} allowDecimals={false} />
                <YAxis type="category" dataKey="tipo" stroke="var(--muted)" fontSize={12} width={100} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)" }} />
                <Bar dataKey="total" fill="#daa136" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="panel-card">
        <div className="mb-2" style={{ color: "var(--muted)" }}>Historial reciente</div>
        <div className="table-responsive" style={{ maxHeight: 320, overflowY: "auto" }}>
          <table className="table table-dark table-dark-custom align-middle">
            <thead>
              <tr>
                <th>Correo</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {data.historial.map((h) => (
                <tr key={h.logs_id}>
                  <td>{h.correo}</td>
                  <td>{TIPO_LABEL[h.tipo] || h.tipo}</td>
                  <td>
                    {h.estado === "enviado" ? (
                      <span className="badge bg-success">Enviado</span>
                    ) : (
                      <span className="badge bg-danger" title={h.error || ""}>Error</span>
                    )}
                  </td>
                  <td style={{ color: "var(--muted)" }}>
                    {new Date(h.creado_en).toLocaleString("es-CL")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function DashboardNotificaciones() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setData(await getDashboardNotificaciones());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div style={{ color: "var(--muted)" }}>Cargando...</div>;
  if (!data) return <div style={{ color: "var(--muted)" }}>No se pudo cargar el dashboard de notificaciones.</div>;

  return (
    <>
      <div className="d-flex gap-3 flex-wrap mb-4">
        <StatCard label="Total de notificaciones" value={data.total} />
        <StatCard label="Enviadas hoy" value={data.hoy} />
        <StatCard label="Solo web" value={data.soloWeb} />
        <StatCard label="Web + correo" value={data.conCorreo} />
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-5">
          <div className="panel-card">
            <div className="mb-2" style={{ color: "var(--muted)" }}>Por remitente</div>
            <table className="table table-dark table-dark-custom align-middle">
              <thead>
                <tr>
                  <th>Remitente</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {data.porRemitente.map((r) => (
                  <tr key={r.remitente}>
                    <td>{r.remitente}</td>
                    <td>{r.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-12 col-lg-7">
          <div className="panel-card">
            <div className="mb-2" style={{ color: "var(--muted)" }}>Últimas notificaciones</div>
            <div className="table-responsive" style={{ maxHeight: 320, overflowY: "auto" }}>
              <table className="table table-dark table-dark-custom align-middle">
                <thead>
                  <tr>
                    <th>Asunto</th>
                    <th>Creada por</th>
                    <th>Usuarios</th>
                    <th>Correo</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recientes.map((n) => {
                    const info = ESTADO_ENVIO_INFO[n.estado_envio] || ESTADO_ENVIO_INFO.pendiente;
                    return (
                      <tr key={n.notificacion_id}>
                        <td>{n.asunto}</td>
                        <td>{n.remitente}</td>
                        <td>{n.es_global ? "Todos" : "Específicos"}</td>
                        <td>
                          {n.enviar_correo ? (
                            <span className={`badge ${info.clase}`}>
                              {info.texto} ({n.cantidad_enviados}/{n.cantidad_destinatarios})
                            </span>
                          ) : (
                            <span style={{ color: "var(--muted)" }}>—</span>
                          )}
                        </td>
                        <td style={{ color: "var(--muted)" }}>
                          {new Date(n.creado_en).toLocaleDateString("es-CL")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function AdminDashboard() {
  const [tab, setTab] = useState("correos");

  return (
    <div>
      <h3 className="mb-3 perfil-title">Dashboard Admin</h3>

      <div className="d-flex gap-2 mb-4">
        <button
          className={`btn btn-sm ${tab === "correos" ? "btn-primary" : "btn-outline-secondary"}`}
          onClick={() => setTab("correos")}
        >
          <i className="bi bi-envelope me-2" />
          Correos
        </button>
        <button
          className={`btn btn-sm ${tab === "notificaciones" ? "btn-primary" : "btn-outline-secondary"}`}
          onClick={() => setTab("notificaciones")}
        >
          <i className="bi bi-bell me-2" />
          Notificaciones
        </button>
      </div>

      {tab === "correos" ? <DashboardCorreos /> : <DashboardNotificaciones />}
    </div>
  );
}