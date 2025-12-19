"use client";

import React from "react";
import Header from "@/components/header"; // si quieres reutilizar tu header
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
  pinkBg: "#FFD6F3",
  purpleBg: "#F3B7FF",
  violetBg: "#E08CFF",
  panel: "rgba(255,255,255,0.06)",
  panelBorder: "rgba(255,255,255,0.10)",
};

function StatCard({
  title,
  value,
  suffix,
  icon,
  status = "ok", // ok | warn | danger
}: {
  title: string;
  value: string | number;
  suffix?: string;
  icon?: string; // boxicons class
  status?: "ok" | "warn" | "danger";
}) {
  const statusColor =
    status === "ok"
      ? "text-emerald-400"
      : status === "warn"
        ? "text-amber-400"
        : "text-red-400";

  return (
    <div
      className="
        rounded-2xl border border-white/10 bg-white/5
        backdrop-blur-md shadow-lg
        px-6 py-5 flex items-center justify-between
      "
    >
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
  // --- Mock data (cámbiala luego) ---
  const lineLabels = ["06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"];
  const predictedFlow = [20, 55, 38, 62, 45, 90, 70, 85, 110];

  const lineData = {
    labels: lineLabels,
    datasets: [
      {
        label: "Pacientes (predicción)",
        data: predictedFlow,
        borderColor: COLORS.blue1,
        backgroundColor: "rgba(94,199,255,0.18)",
        pointBackgroundColor: COLORS.blue2,
        pointBorderColor: "#ffffff",
        pointRadius: 3,
        tension: 0.35,
        fill: true,
      },
    ],
  };

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
      },
    },
  };

  const resourceData1 = {
    labels: ["Disponible", "Ocupado"],
    datasets: [
      {
        data: [70, 30],
        backgroundColor: [COLORS.blue1, "rgba(255,255,255,0.10)"],
        borderWidth: 0,
        cutout: "72%",
      },
    ],
  };

  const resourceData2 = {
    labels: ["Disponible", "Ocupado"],
    datasets: [
      {
        data: [90, 10],
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

  const patientsTable = [
    { id: "P-8729", severidad: "ALTA", diag: "Neumonía", estancia: "5 días", riesgo: "MEDIO" },
    { id: "P-8730", severidad: "MEDIA", diag: "Crisis asmática", estancia: "2 días", riesgo: "BAJO" },
    { id: "P-8731", severidad: "BAJA", diag: "Fractura", estancia: "1 día", riesgo: "BAJO" },
    { id: "P-8732", severidad: "ALTA", diag: "Infarto", estancia: "7 días", riesgo: "ALTO" },
  ];

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

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#FFD6F3] via-[#F3B7FF] to-[#E08CFF]">
      {/* overlay oscuro para look dashboard */}
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
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-white/60">Jueves, 18 de Abril 2024</p>
              <p className="text-sm font-semibold text-white">10:30 AM</p>
            </div>
            <Link
              href="/dashboard/form"
              className="
      group inline-flex items-center gap-2 px-5 py-2.5 rounded-full
      bg-gradient-to-r from-[#5EC7FF] to-[#168AFE]
      hover:from-[#168AFE] hover:to-[#5EC7FF]
      text-white text-sm font-semibold
      shadow-lg shadow-blue-500/30
      transition-all duration-300
    "
            >
              Enviar datos
              <i className="bx bx-paper-plane text-lg transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Pacientes Estimados HOY"
              value="150"
              icon="bx bx-user"
              status="ok"
            />
            <StatCard
              title="Ocupación UCI Actual"
              value="85"
              suffix="%"
              icon="bx bx-plus-medical"
              status="danger"
            />
            <StatCard
              title="Camas Disponibles 24H"
              value="45"
              icon="bx bx-bed"
              status="ok"
            />
          </div>

          {/* Middle grid */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Line chart */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-lg p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white/90">
                  Flujo de Pacientes Anticipado <span className="text-white/60">(Próximas 24H)</span>
                </h2>
                <div className="flex items-center gap-2 text-white/70 text-xs">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS.blue1 }} />
                  Predicción
                </div>
              </div>

              <div className="mt-4 h-[260px]">
                <Line data={lineData} options={lineOptions} />
              </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-lg p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white/90">Predicciones a Nivel Paciente</h2>
                <button className="text-xs text-white/70 hover:text-white transition">
                  Ver todo <i className="bx bx-chevron-right" />
                </button>
              </div>

              <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 text-white/70">
                    <tr>
                      <th className="px-4 py-3">ID Paciente</th>
                      <th className="px-4 py-3">Severidad</th>
                      <th className="px-4 py-3">Diagnóstico</th>
                      <th className="px-4 py-3">Días Estancia</th>
                      <th className="px-4 py-3">Riesgo Bloqueo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {patientsTable.map((r) => (
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
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Bottom grid */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Alerts */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-lg p-5 lg:col-span-1">
              <div className="flex items-center gap-2">
                <i className="bx bx-alarm-exclamation text-xl text-red-300" />
                <h2 className="text-sm font-semibold text-white/90">Alertas del Sistema</h2>
              </div>

              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-semibold text-red-200">
                    URGENTE: Pico de demanda estimado (14:00 - 18:00)
                  </p>
                  <p className="mt-1 text-xs text-white/70">
                    Recomendación: reforzar turno B y habilitar camas de contingencia.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-semibold text-amber-200">
                    AVISO: Insumos críticos en descenso
                  </p>
                  <p className="mt-1 text-xs text-white/70">
                    Recomendación: revisar stock de sueros y material de curación.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-semibold text-emerald-200">
                    OK: Personal disponible estable
                  </p>
                  <p className="mt-1 text-xs text-white/70">
                    Sin acciones sugeridas por el sistema.
                  </p>
                </div>
              </div>
            </div>

            {/* Resources */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-lg p-5 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white/90">Disponibilidad de Recursos</h2>
                <div className="text-xs text-white/60">Actualizado hace 2 min</div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Doughnut 1 */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 flex items-center gap-5">
                  <div className="h-[120px] w-[120px]">
                    <Doughnut data={resourceData1} options={doughnutOptions} />
                  </div>
                  <div>
                    <p className="text-xs text-white/60">Personal</p>
                    <p className="text-2xl font-bold text-white">70%</p>
                    <p className="mt-1 text-xs text-white/70">
                      Turno disponible • Nivel estable
                    </p>
                  </div>
                </div>

                {/* Doughnut 2 */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 flex items-center gap-5">
                  <div className="h-[120px] w-[120px]">
                    <Doughnut data={resourceData2} options={doughnutOptions} />
                  </div>
                  <div>
                    <p className="text-xs text-white/60">Insumos</p>
                    <p className="text-2xl font-bold text-white">90%</p>
                    <p className="mt-1 text-xs text-white/70">
                      Stock alto • Sin riesgo inmediato
                    </p>
                  </div>
                </div>
              </div>

              {/* mini legend */}
              <div className="mt-4 flex items-center gap-4 text-xs text-white/70">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS.blue1 }} />
                  Disponible
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                  Ocupado
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-white/50">
            Pro-Hosp • Demo UI • Data simulada
          </div>
        </div>
      </div>
    </div>
  );
}