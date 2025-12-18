import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="w-full max-w-5xl rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* LEFT ART */}
        <div className="relative hidden md:block p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-[#7DD3FF] via-[#8B5CF6] to-[#5B21B6]" />
          <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.55),transparent_55%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.35),transparent_60%),radial-gradient(circle_at_40%_80%,rgba(0,0,0,0.25),transparent_55%)]" />

          <div className="relative z-10 h-full flex flex-col justify-between text-white">
            <div className="text-5xl leading-none font-bold select-none">✳</div>

            <div className="pb-6">
              <p className="text-sm opacity-90 mb-2">Welcome</p>
              <h2 className="text-3xl font-semibold leading-tight">
                Create your account
                <br />
                and start improving
                <br />
                your workflow
              </h2>
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="p-8 md:p-10">
          <div className="mb-6">
            <div className="text-purple-600 text-2xl font-black leading-none">✳</div>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">Create an account</h1>
            <p className="mt-2 text-sm text-slate-500">
              Crea tu cuenta para comenzar.
            </p>
          </div>

          <form className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Your name</label>
              <input
                type="text"
                placeholder="Your name"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Your email</label>
              <input
                type="email"
                placeholder="you@email.com"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Password</label>
              <div className="mt-2 relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-11 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Toggle password visibility"
                >
                  <i className="bx bx-show text-xl" />
                </button>
              </div>
            </div>

            <button
              type="button"
              className="
                w-full rounded-xl py-3 text-sm font-semibold text-white
                bg-gradient-to-r from-[#7C3AED] to-[#4F46E5]
                shadow-lg shadow-purple-500/30
                hover:from-[#6D28D9] hover:to-[#4338CA]
                transition-all duration-300
              "
            >
              Get Started
            </button>

            <div className="flex items-center gap-3 my-2">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs text-slate-400">or continue with</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                className="rounded-xl border border-slate-200 py-2 text-sm hover:bg-slate-50 transition"
              >
                <span className="font-semibold">Be</span>
              </button>
              <button
                type="button"
                className="rounded-xl border border-slate-200 py-2 hover:bg-slate-50 transition"
                aria-label="Continue with Google"
              >
                <i className="bx bxl-google text-xl text-slate-700" />
              </button>
              <button
                type="button"
                className="rounded-xl border border-slate-200 py-2 hover:bg-slate-50 transition"
                aria-label="Continue with Facebook"
              >
                <i className="bx bxl-facebook text-xl text-slate-700" />
              </button>
            </div>
          </form>

          <p className="mt-6 text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="login" className="text-purple-600 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}