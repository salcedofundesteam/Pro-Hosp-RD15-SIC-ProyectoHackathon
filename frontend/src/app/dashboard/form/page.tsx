"use client";

import React, { useState } from "react";
import Link from "next/link";

const INPUT =
  "mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#5EC7FF] focus:ring-2 focus:ring-[#5EC7FF]/30 transition";

const LABEL = "text-sm font-medium text-white/80";

export default function PredictFormPage() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [form, setForm] = useState({
    Hospital_type: 1,
    Hospital_city: 1,
    Hospital_region: 1,
    Available_Extra_Rooms_in_Hospital: 6,
    Bed_Grade: 2.0,
    Patient_Visitors: 1,
    City_Code_Patient: 3,
    Admission_Deposit: 2500,
    Department: "radiotherapy",
    Ward_Type: "R",
    Ward_Facility: "A",
    Type_of_Admission: "Urgent",
    Illness_Severity: "Minor",
    Age: "21-30",
  });

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // campos numéricos
    const numeric = new Set([
      "Hospital_type",
      "Hospital_city",
      "Hospital_region",
      "Available_Extra_Rooms_in_Hospital",
      "Bed_Grade",
      "Patient_Visitors",
      "City_Code_Patient",
      "Admission_Deposit",
    ]);

    setForm((prev) => ({
      ...prev,
      [name]: numeric.has(name) ? Number(value) : value,
    }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Error" }));
        throw new Error(err.message || "Error enviando datos");
      }

      const data = await res.json();
      setMsg({ type: "ok", text: `Enviado ✅ Respuesta: ${JSON.stringify(data)}` });
    } catch (err: any) {
      setMsg({ type: "err", text: err.message || "Error desconocido" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#FFD6F3] via-[#F3B7FF] to-[#E08CFF]">
      <div className="min-h-screen w-full bg-slate-950/70">
        <div className="mx-auto w-full max-w-5xl px-6 py-8">
          {/* top */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-white">Enviar datos al modelo</h1>
              <p className="text-sm text-white/60">
                Completa los campos y envía el JSON (luego conectas tu backend).
              </p>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition"
            >
              <i className="bx bx-arrow-back text-lg" />
              Volver
            </Link>
          </div>

          {/* card */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-lg p-6">
            {msg && (
              <div
                className={`mb-5 rounded-xl border px-4 py-3 text-sm ${
                  msg.type === "ok"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-100"
                    : "border-red-500/30 bg-red-500/10 text-red-100"
                }`}
              >
                {msg.text}
              </div>
            )}

            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* NUMBERS */}
              <div>
                <label className={LABEL}>Hospital_type</label>
                <input name="Hospital_type" type="number" value={form.Hospital_type} onChange={onChange} className={INPUT} />
              </div>

              <div>
                <label className={LABEL}>Hospital_city</label>
                <input name="Hospital_city" type="number" value={form.Hospital_city} onChange={onChange} className={INPUT} />
              </div>

              <div>
                <label className={LABEL}>Hospital_region</label>
                <input name="Hospital_region" type="number" value={form.Hospital_region} onChange={onChange} className={INPUT} />
              </div>

              <div>
                <label className={LABEL}>Available_Extra_Rooms_in_Hospital</label>
                <input name="Available_Extra_Rooms_in_Hospital" type="number" value={form.Available_Extra_Rooms_in_Hospital} onChange={onChange} className={INPUT} />
              </div>

              <div>
                <label className={LABEL}>Bed_Grade</label>
                <input name="Bed_Grade" type="number" step="0.1" value={form.Bed_Grade} onChange={onChange} className={INPUT} />
              </div>

              <div>
                <label className={LABEL}>Patient_Visitors</label>
                <input name="Patient_Visitors" type="number" value={form.Patient_Visitors} onChange={onChange} className={INPUT} />
              </div>

              <div>
                <label className={LABEL}>City_Code_Patient</label>
                <input name="City_Code_Patient" type="number" value={form.City_Code_Patient} onChange={onChange} className={INPUT} />
              </div>

              <div>
                <label className={LABEL}>Admission_Deposit</label>
                <input name="Admission_Deposit" type="number" value={form.Admission_Deposit} onChange={onChange} className={INPUT} />
              </div>

              {/* SELECTS */}
              <div>
                <label className={LABEL}>Department</label>
                <select name="Department" value={form.Department} onChange={onChange} className={INPUT}>
                  <option className="text-black" value="radiotherapy">radiotherapy</option>
                  <option className="text-black" value="gynecology">gynecology</option>
                  <option className="text-black" value="anesthesia">anesthesia</option>
                  <option className="text-black" value="surgery">surgery</option>
                  <option className="text-black" value="cardiology">cardiology</option>
                </select>
              </div>

              <div>
                <label className={LABEL}>Ward_Type</label>
                <select name="Ward_Type" value={form.Ward_Type} onChange={onChange} className={INPUT}>
                  <option className="text-black" value="R">R</option>
                  <option className="text-black" value="S">S</option>
                  <option className="text-black" value="Q">Q</option>
                </select>
              </div>

              <div>
                <label className={LABEL}>Ward_Facility</label>
                <select name="Ward_Facility" value={form.Ward_Facility} onChange={onChange} className={INPUT}>
                  <option className="text-black" value="A">A</option>
                  <option className="text-black" value="B">B</option>
                  <option className="text-black" value="C">C</option>
                </select>
              </div>

              <div>
                <label className={LABEL}>Type_of_Admission</label>
                <select name="Type_of_Admission" value={form.Type_of_Admission} onChange={onChange} className={INPUT}>
                  <option className="text-black" value="Urgent">Urgent</option>
                  <option className="text-black" value="Trauma">Trauma</option>
                  <option className="text-black" value="Elective">Elective</option>
                </select>
              </div>

              <div>
                <label className={LABEL}>Illness_Severity</label>
                <select name="Illness_Severity" value={form.Illness_Severity} onChange={onChange} className={INPUT}>
                  <option className="text-black" value="Minor">Minor</option>
                  <option className="text-black" value="Moderate">Moderate</option>
                  <option className="text-black" value="Severe">Severe</option>
                </select>
              </div>

              <div>
                <label className={LABEL}>Age</label>
                <select name="Age" value={form.Age} onChange={onChange} className={INPUT}>
                  <option className="text-black" value="0-10">0-10</option>
                  <option className="text-black" value="11-20">11-20</option>
                  <option className="text-black" value="21-30">21-30</option>
                  <option className="text-black" value="31-40">31-40</option>
                  <option className="text-black" value="41-50">41-50</option>
                  <option className="text-black" value="51-60">51-60</option>
                  <option className="text-black" value="61-70">61-70</option>
                  <option className="text-black" value="71-80">71-80</option>
                  <option className="text-black" value="81-90">81-90</option>
                  <option className="text-black" value="91-100">91-100</option>
                </select>
              </div>

              {/* actions */}
              <div className="md:col-span-2 mt-2 flex flex-col sm:flex-row gap-3">
                <button
                  disabled={loading}
                  type="submit"
                  className="
                    group inline-flex items-center justify-center gap-2 px-10 py-3 rounded-full
                    bg-gradient-to-r from-[#5EC7FF] to-[#168AFE]
                    hover:from-[#168AFE] hover:to-[#5EC7FF]
                    text-white text-sm font-semibold
                    shadow-lg shadow-blue-500/30
                    transition-all duration-300 disabled:opacity-60
                  "
                >
                  {loading ? "Enviando..." : "Enviar"}
                  <i className="bx bx-right-arrow-alt text-xl transition-transform duration-300 group-hover:translate-x-1" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      Hospital_type: 1,
                      Hospital_city: 1,
                      Hospital_region: 1,
                      Available_Extra_Rooms_in_Hospital: 6,
                      Bed_Grade: 2.0,
                      Patient_Visitors: 1,
                      City_Code_Patient: 3,
                      Admission_Deposit: 2500,
                      Department: "radiotherapy",
                      Ward_Type: "R",
                      Ward_Facility: "A",
                      Type_of_Admission: "Urgent",
                      Illness_Severity: "Minor",
                      Age: "21-30",
                    })
                  }
                  className="
                    inline-flex items-center justify-center gap-2 px-10 py-3 rounded-full
                    border border-white/15 bg-white/5 text-white/80 text-sm font-semibold
                    hover:bg-white/10 transition
                  "
                >
                  Reset
                  <i className="bx bx-refresh text-lg" />
                </button>
              </div>

              {/* preview */}
              <div className="md:col-span-2 mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold text-white/70 mb-2">Preview JSON</p>
                <pre className="text-xs text-white/80 overflow-auto">
{JSON.stringify(form, null, 2)}
                </pre>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}