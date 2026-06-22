import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const LOADING_STEPS = [
  "Menghubungkan ke GitHub API...",
  "Mengunduh repositori publik...",
  "Menganalisis bahasa pemrograman favorit...",
  "Menghitung jumlah bintang & forks...",
  "Memindai aktivitas commit malam hari...",
  "Menyusun coding persona unikmu...",
  "Menyiapkan slide Wrapped bergaya premium..."
];

export default function LoadingScreen() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-slate-950 p-6 overflow-hidden">
      {/* Background glow circle */}
      <div className="absolute w-96 h-96 rounded-full bg-purple-900/40 glow-circle"></div>

      <div className="relative z-10 flex flex-col items-center max-w-sm text-center">
        {/* Glowing loader icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-md scale-110"></div>
          <Loader2 className="w-16 h-16 text-purple-400 animate-spin relative" />
        </div>

        {/* Dynamic status messages */}
        <div className="h-12 flex items-center justify-center">
          <p className="text-lg font-medium text-slate-200 transition-all duration-300 slide-enter">
            {LOADING_STEPS[stepIndex]}
          </p>
        </div>

        {/* Progress bar indication */}
        <div className="w-48 h-1.5 bg-white/5 rounded-full overflow-hidden mt-6 border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-500 ease-out"
            style={{ width: `${((stepIndex + 1) / LOADING_STEPS.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
