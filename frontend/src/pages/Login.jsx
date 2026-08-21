import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userAPI } from "../api/apiServices";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const res = await userAPI.login(email, password);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setErrorMessage(error.response?.data?.message || "We couldn't sign you in. Please check your details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f7ed] px-4 py-5 sm:px-8 sm:py-8">
      <div className="mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-emerald-950/10 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-[#164b3a] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border-[36px] border-lime-300/20" />
          <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full border-[44px] border-amber-200/10" />

          <div className="relative">
            <div className="mb-16 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lime-300 text-lg font-black text-[#164b3a]">sf</span>
              <span className="text-sm font-bold uppercase tracking-[0.22em]">Smart Farming</span>
            </div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-lime-300">Grow with clarity</p>
            <h1 className="max-w-lg text-5xl font-bold leading-[1.05] tracking-tight xl:text-6xl">Better decisions start in the field.</h1>
            <p className="mt-6 max-w-md text-base leading-7 text-emerald-100/75">Bring your crops, costs, and daily farm insights together in one calm workspace.</p>
          </div>

          <div className="relative grid max-w-md grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-2xl font-bold text-lime-300">24/7</p>
              <p className="mt-1 text-xs text-emerald-100/70">Field visibility</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-2xl font-bold text-amber-200">1 place</p>
              <p className="mt-1 text-xs text-emerald-100/70">For your farm plan</p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-10 sm:px-12 lg:px-14 xl:px-20">
          <div className="w-full max-w-md">
            <div className="mb-10 lg:hidden">
              <div className="mb-8 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-800 text-lg font-black text-lime-200">sf</span>
                <span className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-900">Smart Farming</span>
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Welcome back</p>
            </div>

            <div className="mb-8">
              <p className="mb-3 hidden text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 lg:block">Welcome back</p>
              <h2 className="text-4xl font-bold tracking-tight text-slate-900">Sign in to your farm.</h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">Pick up where you left off and keep your next harvest moving.</p>
            </div>

            {errorMessage && (
              <p className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{errorMessage}</p>
            )}

            <form className="space-y-5" onSubmit={handleLogin}>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="email">Email address</label>
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-700" htmlFor="password">Password</label>
                  <button className="text-xs font-semibold text-emerald-700 transition hover:text-emerald-900" type="button">Forgot password?</button>
                </div>
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>

              <button
                className="w-full rounded-xl bg-emerald-800 px-4 py-3.5 font-semibold text-white shadow-lg shadow-emerald-800/20 transition hover:bg-emerald-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500">New to Smart Farming? <Link className="font-semibold text-emerald-700 hover:text-emerald-900" to="/register">Create an account</Link></p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Login;