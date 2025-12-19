import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const base = process.env.FASTAPI_URL;
    if (!base) {
      return NextResponse.json(
        { message: "FASTAPI_URL no está configurado" },
        { status: 500 }
      );
    }

    const r = await fetch(`${base}/ingest_hospital`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await r.json().catch(() => ({}));

    if (!r.ok) {
      return NextResponse.json(
        { message: (data as any)?.detail || "Error en FastAPI" },
        { status: r.status }
      );
    }

    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json(
      { message: e?.message || "Error interno" },
      { status: 500 }
    );
  }
}