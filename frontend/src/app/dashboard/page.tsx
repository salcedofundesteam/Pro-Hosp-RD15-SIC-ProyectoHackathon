"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import Link from "next/link";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

const COLORS = {
  blue1: "#5EC7FF",
  blue2: "#168AFE",
};

type LastOutput = {
  dias_estimados?: number;
  nivel_riesgo?: number; // 0|1
  alerta_gestion?: string;
  confianza_modelo?: number; // %
  mensaje_clinico?: string;
};

type DashboardSummary = {
  last_input: Record<string, any> | null;
  last_output: LastOutput | null;
  updated_at: string | null;
};

function StatCard({
  title,
  value,
  suffix,
  icon,
  status = "ok",
}: {
  title: string;
  value: string | number;
  suffix?: string;
  icon?: string;
  status?: "ok" | "warn" | "danger";
}) {
  const statusColor =
    status === "ok"
      ? "text-emerald-400"
      : status === "warn"
      ? "text-amber-400"
      : "text-red-400";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-lg px-6 py-5 flex items-center justify-between">
      <div>
        <p className="text-sm text-white/70">{title}</p>
        <div className="mt-2 flex items-end gap-2">
          <p className="text-4xl font-bold text-white">{value}</p>
          {suffix ? <span className="text-white/70 pb-1">{suffix}</span> : null}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {icon ? (
          <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
            <i className={`${icon} text-xl text-white/80`} />
          </div>
        ) : null}
        <i className={`bx bxs-badge-check text-2xl ${statusColor}`} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary>({
    last_input: null,
    last_output: null,
    updated_at: null,
  });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // historial simple para el line chart (en memoria del front)
  const [history, setHistory] = useState<Array<{ t: string; conf: number }>>([]);

  const fetchSummary = async () => {
    try {
      setErr(null);
      const r = await fetch("/api/dashboard_summary", { cache: "no-store" });
      const data = (await r.json().catch(() => ({}))) as any;
      if (!r.ok) throw new Error(data?.message || "Error leyendo dashboard");

      const next: DashboardSummary = {
        last_input: data?.last_input ?? null,
        last_output: data?.last_output ?? null,
        updated_at: data?.updated_at ?? null,
      };

      setSummary(next);

      // guarda “confianza_modelo” en el chart si existe
      const conf = Number(next?.last_output?.confianza_modelo);
      if (!Number.isNaN(conf) && Number.isFinite(conf)) {
        const t = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        setHistory((prev) => {
          const updated = [...prev, { t, conf }];
          // limita a 12 puntos
          return updated.slice(-12);
        });
      }
    } catch (e: any) {
      setErr(e?.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    const id = setInterval(fetchSummary, 8000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const out = summary.last_output;

  // Stats reales desde last_output
  const dias = out?.dias_estimados ?? "—";
  const riesgo = out?.nivel_riesgo ?? "—";
  const confianza = out?.confianza_modelo ?? 0;

  const riesgoStatus: "ok" | "warn" | "danger" =
    riesgo === 1 ? "danger" : riesgo === 0 ? "ok" : "warn";

  // Line chart (confianza en el tiempo)
  const lineLabels = history.map((h) => h.t);
  const predictedFlow = history.map((h) => h.conf);

  const lineData = useMemo(
    () => ({
      labels: lineLabels.length ? lineLabels : ["--"],
      datasets: [
        {
          label: "Confianza del modelo (%)",
          data: predictedFlow.length ? predictedFlow : [0],
          borderColor: COLORS.blue1,
          backgroundColor: "rgba(94,199,255,0.18)",
          pointBackgroundColor: COLORS.blue2,
          pointBorderColor: "#ffffff",
          pointRadius: 3,
          tension: 0.35,
          fill: true,
        },
      ],
    }),
    [lineLabels, predictedFlow]
  );

  const lineOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(15,23,42,0.95)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(255,255,255,0.10)",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: { color: "rgba(255,255,255,0.65)" },
        grid: { color: "rgba(255,255,255,0.08)" },
      },
      y: {
        ticks: { color: "rgba(255,255,255,0.65)" },
        grid: { color: "rgba(255,255,255,0.08)" },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
  };

  // Doughnuts reales (ejemplo: riesgo 0/1 y “confianza” como anillo)
  const resourceData1 = {
    labels: ["Normal", "Bloqueo"],
    datasets: [
      {
        data: riesgo === 1 ? [0, 100] : riesgo === 0 ? [100, 0] : [50, 50],
        backgroundColor: [COLORS.blue1, "rgba(255,255,255,0.10)"],
        borderWidth: 0,
        cutout: "72%",
      },
    ],
  };

  const resourceData2 = {
    labels: ["Confianza", "Incertidumbre"],
    datasets: [
      {
        data: [Math.max(0, Math.min(100, Number(confianza) || 0)), 100 - Math.max(0, Math.min(100, Number(confianza) || 0))],
        backgroundColor: [COLORS.blue2, "rgba(255,255,255,0.10)"],
        borderWidth: 0,
        cutout: "72%",
      },
    ],
  };

  const doughnutOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
  };

  // Tabla real desde last_input + last_output
  const patientsTable = useMemo(() => {
    if (!summary.last_input || !summary.last_output) return [];
    const li = summary.last_input;

    const sevMap: Record<string, string> = {
      Severe: "ALTA",
      Moderate: "MEDIA",
      Minor: "BAJA",
    };

    const sev = sevMap[String(li?.Illness_Severity ?? "")] ?? "—";
    const riskLabel = summary.last_output?.nivel_riesgo === 1 ? "ALTO" : "BAJO";

    return [
      {
        id: "LAST",
        severidad: sev,
        diag: String(li?.Department ?? "—"),
        estancia: `${summary.last_output?.dias_estimados ?? "—"} días`,
        riesgo: riskLabel,
      },
    ];
  }, [summary.last_input, summary.last_output]);

  const badge = (text: string) => {
    const map: Record<string, string> = {
      ALTA: "bg-red-500/15 text-red-200 border-red-500/30",
      MEDIA: "bg-amber-500/15 text-amber-200 border-amber-500/30",
      BAJA: "bg-emerald-500/15 text-emerald-200 border-emerald-500/30",
      ALTO: "bg-red-500/15 text-red-200 border-red-500/30",
      MEDIO: "bg-amber-500/15 text-amber-200 border-amber-500/30",
      BAJO: "bg-emerald-500/15 text-emerald-200 border-emerald-500/30",
    };
    return map[text] ?? "bg-white/10 text-white/80 border-white/15";
  };

  const updatedText = summary.updated_at
    ? new Date(summary.updated_at).toLocaleString()
    : "Sin data aún";

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#FFD6F3] via-[#F3B7FF] to-[#E08CFF]">
      <div className="min-h-screen w-full bg-slate-950/70">
        <div className="mx-auto w-full max-w-7xl px-6 py-6">
          {/* Top bar */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
                <i className="bx bx-pulse text-2xl text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">
                  Monitor Predictivo en Tiempo Real
                </h1>
                <p className="text-xs text-white/60">Pro-Hosp • Dashboard</p>
                <p className="text-[11px] text-white/50 mt-0.5">
                  Última actualización: {updatedText}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchSummary}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition"
              >
                <i className="bx bx-refresh text-lg" />
                Refresh
              </button>

              <Link
                href="/dashboard/form"
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#5EC7FF] to-[#168AFE] hover:from-[#168AFE] hover:to-[#5EC7FF] text-white text-sm font-semibold shadow-lg shadow-blue-500/30 transition-all duration-300"
              >
                Enviar datos
                <i className="bx bx-paper-plane text-lg transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Status */}
          <div className="mt-4">
            {err ? (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 text-red-100 px-4 py-3 text-sm">
                {err}
              </div>
            ) : loading ? (
              <div className="rounded-xl border border-white/10 bg-white/5 text-white/70 px-4 py-3 text-sm">
                Cargando dashboard_summary...
              </div>
            ) : null}
          </div>

          {/* Stats (reales) */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Días Estancia Estimados"
              value={dias}
              icon="bx bx-time-five"
              status="ok"
            />
            <StatCard
              title="Riesgo de Bloqueo"
              value={riesgo === "—" ? "—" : riesgo === 1 ? "ALTO" : "BAJO"}
              icon="bx bx-error-circle"
              status={riesgoStatus}
            />
            <StatCard
              title="Confianza del Modelo"
              value={out?.confianza_modelo ?? "—"}
              suffix={out?.confianza_modelo != null ? "%" : undefined}
              icon="bx bx-line-chart"
              status={out?.confianza_modelo != null && out.confianza_modelo >= 80 ? "ok" : "warn"}
            />
          </div>

          {/* Middle grid */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Line chart */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-lg p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white/90">
                  Confianza del Modelo <span className="text-white/60">(historial en vivo)</span>
                </h2>
                <div className="flex items-center gap-2 text-white/70 text-xs">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS.blue1 }} />
                  %
                </div>
              </div>

              <div className="mt-4 h-[260px]">
                <Line data={lineData} options={lineOptions} />
              </div>

              {out?.alerta_gestion ? (
                <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-semibold text-white/80">Alerta</p>
                  <p className="text-sm text-white mt-1">{out.alerta_gestion}</p>
                  {out.mensaje_clinico ? (
                    <p className="text-xs text-white/70 mt-1">{out.mensaje_clinico}</p>
                  ) : null}
                </div>
              ) : null}
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-lg p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white/90">Última Predicción (Paciente)</h2>
                <span className="text-xs text-white/60">
                  {summary.last_input ? "Con data" : "Sin data"}
                </span>
              </div>

              <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 text-white/70">
                    <tr>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Severidad</th>
                      <th className="px-4 py-3">Departamento</th>
                      <th className="px-4 py-3">Estancia</th>
                      <th className="px-4 py-3">Riesgo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {patientsTable.length ? (
                      patientsTable.map((r) => (
                        <tr key={r.id} className="text-white/85 hover:bg-white/5 transition">
                          <td className="px-4 py-3 font-medium">{r.id}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center rounded-full border px-2 py-1 ${badge(r.severidad)}`}>
                              {r.severidad}
                            </span>
                          </td>
                          <td className="px-4 py-3">{r.diag}</td>
                          <td className="px-4 py-3">{r.estancia}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center rounded-full border px-2 py-1 ${badge(r.riesgo)}`}>
                              {r.riesgo}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="text-white/70">
                        <td className="px-4 py-4" colSpan={5}>
                          Aún no hay predicción. Ve a “Enviar datos”.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Raw JSON */}
              <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold text-white/70 mb-2">dashboard_summary (raw)</p>
                <pre className="text-[11px] text-white/80 overflow-auto">
{JSON.stringify(summary, null, 2)}
                </pre>
              </div>
            </div>
          </div>

          {/* Bottom grid */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Alerts */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-lg p-5 lg:col-span-1">
              <div className="flex items-center gap-2">
                <i className="bx bx-alarm-exclamation text-xl text-red-300" />
                <h2 className="text-sm font-semibold text-white/90">Estado del Sistema</h2>
              </div>

              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-semibold text-white/80">
                    Última actualización
                  </p>
                  <p className="mt-1 text-xs text-white/70">{updatedText}</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-semibold text-white/80">Mensaje</p>
                  <p className="mt-1 text-xs text-white/70">
                    {out?.mensaje_clinico ?? "Sin mensaje aún."}
                  </p>
                </div>
              </div>
            </div>

            {/* Resources */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-lg p-5 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white/90">Indicadores</h2>
                <div className="text-xs text-white/60">Auto-refresh cada 8s</div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 flex items-center gap-5">
                  <div className="h-[120px] w-[120px]">
                    <Doughnut data={resourceData1} options={doughnutOptions} />
                  </div>
                  <div>
                    <p className="text-xs text-white/60">Riesgo</p>
                    <p className="text-2xl font-bold text-white">
                      {riesgo === "—" ? "—" : riesgo === 1 ? "ALTO" : "BAJO"}
                    </p>
                    <p className="mt-1 text-xs text-white/70">Basado en nivel_riesgo</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 flex items-center gap-5">
                  <div className="h-[120px] w-[120px]">
                    <Doughnut data={resourceData2} options={doughnutOptions} />
                  </div>
                  <div>
                    <p className="text-xs text-white/60">Confianza</p>
                    <p className="text-2xl font-bold text-white">
                      {out?.confianza_modelo != null ? `${out.confianza_modelo}%` : "—"}
                    </p>
                    <p className="mt-1 text-xs text-white/70">Probabilidad del clasificador</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4 text-xs text-white/70">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS.blue1 }} />
                  Métrica principal
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                  Resto
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-white/50">
            Pro-Hosp • Live UI (via FastAPI dashboard_summary)
          </div>
        </div>
      </div>
    </div>
  );
}