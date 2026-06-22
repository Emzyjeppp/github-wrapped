import React, { useState } from "react";
import { Github, Play, HelpCircle } from "lucide-react";

interface StartScreenProps {
  onSearch: (username: string) => void;
  onDemo: () => void;
}

export default function StartScreen({ onSearch, onDemo }: StartScreenProps) {
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSearch(username.trim());
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden bg-slate-950">
      {/* Decorative Glow Circles */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-purple-600 glow-circle"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cyan-600 glow-circle"></div>

      <div className="relative z-10 w-full max-w-md p-8 rounded-3xl glass-panel-heavy shadow-2xl flex flex-col items-center text-center border border-white/10 slide-enter">
        {/* Animated Icon Header */}
        <div className="relative mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 shadow-inner group">
          <Github className="w-14 h-14 text-gradient-purple-cyan animate-pulse group-hover:scale-110 transition-transform duration-300" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">
          GitHub <span className="text-gradient-purple-cyan">Wrapped</span>
        </h1>
        <p className="text-sm text-slate-400 mb-8 max-w-xs">
          Temukan statistik coding tahunan dan persona GitHub unikmu dengan visualisasi yang memukau.
        </p>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Masukkan username GitHub..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-5 py-4 pl-12 rounded-2xl bg-slate-900/60 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 shadow-inner"
              required
            />
            <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-semibold rounded-2xl transition-all duration-300 transform active:scale-95 shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            Mulai Wrapped Saya
          </button>
        </form>

        <div className="relative flex items-center justify-center w-full my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <span className="relative px-3 bg-slate-950/20 text-xs text-slate-500 uppercase tracking-widest font-semibold backdrop-blur-sm">
            Atau
          </span>
        </div>

        {/* Demo Button */}
        <button
          onClick={onDemo}
          className="w-full py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white font-medium rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.98]"
        >
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          Coba Akun Demo
        </button>

        {/* Footer info */}
        <p className="text-[10px] text-slate-500 mt-8">
          *Kami hanya membaca profil publik. Caching lokal diterapkan untuk mencegah rate limit API.
        </p>
      </div>
    </div>
  );
}
