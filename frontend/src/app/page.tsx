import Header from "@/components/header";
import { sail } from "./layout";
import Image from "next/image";
import Link from "next/link";
import RTF from "@/components/rtf";

export default function Home() {
  return (
    <div className="h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth">
      {/* HERO */}
      <section
        id="home"
        className="snap-start min-h-screen w-full bg-gradient-to-br from-[#FFD6F3] via-[#F3B7FF] to-[#E08CFF]"
      >
        <div className="mx-auto w-full max-w-7xl px-6 min-h-screen flex flex-col">
          <Header />

          {/* IMPORTANTE: flex-1 + min-h-0 para que se adapte */}
          <main className="flex-1 min-h-0 flex flex-col lg:flex-row items-center gap-10 py-10">
            {/* LEFT */}
            <div className="w-full lg:w-1/2">
              <h1 className="text-4xl leading-tight font-semibold text-slate-900">
                De la{" "}
                <span className={`${sail.className} text-sky-500 text-5xl font-normal`}>
                  Reacción
                </span>{" "}
                a <br />
                la{" "}
                <span className="text-sky-500 text-5xl font-semibold">Anticipación.</span>
              </h1>

              <p className="mt-6 max-w-xl text-sm text-slate-800/80">
                Predice flujos de pacientes, evita el colapso y toma el control de tu
                sala de emergencias con días de antelación.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href={"auth/login"}
                  className="
              group flex items-center gap-2 px-10 py-3 rounded-full
              bg-gradient-to-r from-[#5EC7FF] to-[#168AFE]
              hover:from-[#168AFE] hover:to-[#5EC7FF]
              text-white text-sm font-semibold
              shadow-lg shadow-blue-500/30
              transition-all duration-300 cursor-pointer
            "
                >
                  Sign Up
                  <i className="bx bx-right-arrow-alt text-xl transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <a
                  href="#aboutus"
                  className="
              group flex items-center gap-2 px-10 py-3 rounded-full
              bg-white/80 backdrop-blur-sm
              text-slate-900 text-sm font-semibold
              shadow-md hover:bg-white
              transition-all duration-300 cursor-pointer
            "
                >
                  Sobre nosotros
                  <i className="bx bx-right-arrow-alt text-xl transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </div>

            {/* RIGHT (vacío para 3D) */}
            <div className="w-full h-full lg:w-1/2 flex items-center justify-center">
              <div className="h-[420px] w-full max-w-[520px] rounded-2xl overflow-hidden">
                <RTF />
              </div>
            </div>
          </main>
        </div>
      </section>

      {/* NOSOTROS */}
      <section
        id="aboutus"
        className="snap-start min-h-screen w-full bg-white scroll-mt-24"
      >
        <div className="mx-auto w-full max-w-7xl px-6 pt-20">
          {/* Card grande como la foto */}
          <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-lg p-10 flex items-center justify-between gap-10">
            <div className="max-w-xl">
              <h2 className="text-5xl font-bold text-indigo-500">Nosotros</h2>

              <p className="mt-4 text-xl font-semibold text-slate-900">
                Welcome to our site
              </p>

              <p className="mt-2 text-lg text-indigo-400">
                Impulsados por la necesidad de resolver <br />
                la crisis de saturación en emergencias
              </p>

              <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                Nuestra Misión es simple pero poderosa: Pasar de la reacción a la anticipación.
                Utilizamos modelos avanzados de Machine Learning, entrenados con datos adaptados
                a nuestra realidad, para predecir la demanda de pacientes y el tiempo de ocupación
                de camas.
              </p>
            </div>

            {/* Placeholder derecha (imagen/ilustración) */}
            <div className="hidden md:flex items-center justify-center w-[420px] h-[220px] rounded-xl bg-slate-50">
              <Image
                src={`/${1}.png`}
                alt={`Nosotros ${1}`}
                width={500}
                height={400}
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>

          {/* 3 cards de abajo */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: "Intelligent diagnosis", img: "/2.png" },
              { title: "Medical Support and Testimonials", img: "/3.png" },
              { title: "Community and Contact", img: "/4.png" },
            ].map((c) => (
              <div
                key={c.title}
                className="
        group rounded-2xl border border-slate-200 bg-white shadow-md p-8 text-center
        transition-all duration-300 hover:shadow-xl hover:-translate-y-1
      "
              >
                {/* IMAGE */}
                <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-xl mb-6">
                  <Image
                    src={c.img}
                    alt={c.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                {/* TITLE */}
                <h3 className="text-lg font-semibold text-indigo-500">{c.title}</h3>

                {/* TEXT */}
                <p className="mt-3 text-sm text-slate-500">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CONTACTO (opcional para que no quede “cortado”) */}
      <section id="contactus" className="snap-start min-h-screen w-full bg-white">
        <div className="mx-auto w-full max-w-7xl px-6 pt-20 pb-16">
          <h2 className="text-4xl font-bold text-slate-900">Contáctanos</h2>
          <p className="mt-2 text-sm text-slate-600">
            Envíanos un mensaje y te respondemos lo antes posible.
          </p>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* FORM */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-md p-8">
              <form className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-slate-700">Nombre</label>
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">Correo</label>
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">Asunto</label>
                  <input
                    type="text"
                    placeholder="Motivo del mensaje"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">Mensaje</label>
                  <textarea
                    rows={5}
                    placeholder="Escribe tu mensaje..."
                    className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition"
                  />
                </div>

                <button
                  type="button"
                  className="
              group w-full flex items-center justify-center gap-2 px-10 py-3 rounded-full
              bg-gradient-to-r from-[#5EC7FF] to-[#168AFE]
              hover:from-[#168AFE] hover:to-[#5EC7FF]
              text-white text-sm font-semibold
              shadow-lg shadow-blue-500/30
              transition-all duration-300 cursor-pointer
            "
                >
                  Enviar
                  <i className="bx bx-send text-lg transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </form>
            </div>

            {/* MAP */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">Ubicación</h3>
                <p className="text-sm text-slate-600">Punto de referencia (demo)</p>
              </div>

              {/* OpenStreetMap embed con marcador */}
              <div className="h-[420px] w-full">
                <iframe
                  title="OpenStreetMap"
                  width="100%"
                  height="100%"
                  className="border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-69.953%2C18.468%2C-69.883%2C18.518&layer=mapnik&marker=18.493%2C-69.918"
                />
              </div>

              <div className="px-6 py-4 border-t border-slate-200 text-xs text-slate-600">
                Mapa por OpenStreetMap
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
