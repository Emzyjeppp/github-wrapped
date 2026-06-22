import { useRef, useState } from "react";
import { GithubWrappedData } from "../services/githubService";
import { Star, GitFork, Award, RefreshCw, ChevronLeft, ChevronRight, Volume2, VolumeX, Moon, Sun, Sunset, Sunrise, Flame, Code, Download } from "lucide-react";
import { toPng } from "html-to-image";

interface SlideProps {
  data: GithubWrappedData;
}

export function WelcomeSlide({ data }: SlideProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 slide-enter">
      {/* Avatar Container with glowing rings */}
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 blur-md scale-105 animate-pulse"></div>
        <img
          src={data.avatarUrl}
          alt={data.name}
          className="relative w-36 h-36 rounded-full border-4 border-slate-900 object-cover shadow-2xl"
        />
        <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-600 to-cyan-500 text-white p-2 rounded-full shadow-lg border border-slate-900">
          <Award className="w-5 h-5" />
        </div>
      </div>

      <p className="text-sm font-semibold tracking-widest text-cyan-400 uppercase mb-2">
        Mempersembahkan
      </p>
      <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-white">
        GitHub Wrapped
      </h2>
      
      <div className="glass-panel px-6 py-3 rounded-full mb-6 inline-flex items-center gap-2">
        <span className="text-slate-300">untuk</span>
        <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
          @{data.username}
        </span>
      </div>

      <p className="text-slate-400 max-w-sm text-sm sm:text-base leading-relaxed px-4">
        "{data.bio}"
      </p>

      <p className="text-xs text-slate-500 mt-8">
        Bergabung sejak {data.createdAt}
      </p>
    </div>
  );
}

export function LanguagesSlide({ data }: SlideProps) {
  return (
    <div className="flex flex-col justify-center h-full p-6 sm:p-10 slide-enter">
      <p className="text-sm font-semibold tracking-widest text-purple-400 uppercase mb-2 text-center sm:text-left">
        Bahasa Favorit
      </p>
      <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-8 text-center sm:text-left text-white">
        Kerajaan Bahasamu 👑
      </h2>

      <div className="space-y-6 max-w-md mx-auto sm:mx-0">
        {data.languages.map((lang, index) => (
          <div key={lang.name} className="space-y-2">
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="flex items-center gap-2 text-slate-200">
                <span
                  className="w-3.5 h-3.5 rounded-full inline-block border border-white/10"
                  style={{ backgroundColor: lang.color }}
                ></span>
                {lang.name}
              </span>
              <span className="text-slate-400">{lang.percentage}%</span>
            </div>
            
            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
              {/* Animated Progress Bar */}
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${lang.percentage}%`,
                  backgroundColor: lang.color,
                  boxShadow: `0 0 12px ${lang.color}40`,
                  transitionDelay: `${index * 150}ms`
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-500 mt-10 text-center sm:text-left">
        *Berdasarkan persentase total jumlah repositori publik yang menggunakan bahasa tersebut.
      </p>
    </div>
  );
}

export function ActivitySlide({ data }: SlideProps) {
  const times = [
    { label: "Pagi", hours: "05:00 - 12:00", value: data.activityHours.morning, icon: Sunrise, color: "text-amber-400", bgGlow: "bg-amber-400/10" },
    { label: "Siang", hours: "12:00 - 17:00", value: data.activityHours.afternoon, icon: Sun, color: "text-sky-400", bgGlow: "bg-sky-400/10" },
    { label: "Sore", hours: "17:00 - 21:00", value: data.activityHours.evening, icon: Sunset, color: "text-orange-500", bgGlow: "bg-orange-500/10" },
    { label: "Malam", hours: "21:00 - 05:00", value: data.activityHours.night, icon: Moon, color: "text-indigo-400", bgGlow: "bg-indigo-400/10" },
  ];

  // Find peak activity time
  const peakTime = [...times].sort((a, b) => b.value - a.value)[0];

  return (
    <div className="flex flex-col justify-center h-full p-6 sm:p-10 slide-enter">
      <p className="text-sm font-semibold tracking-widest text-cyan-400 uppercase mb-2 text-center sm:text-left">
        Pola Produktivitas
      </p>
      <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-center sm:text-left text-white">
        Waktu Menulis Kodemu ⏰
      </h2>
      
      <p className="text-slate-400 text-sm sm:text-base mb-8 text-center sm:text-left">
        Aktivitas coding-mu paling produktif di waktu <span className={`font-bold ${peakTime.color}`}>{peakTime.label}</span> ({peakTime.value}%).
      </p>

      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto sm:mx-0">
        {times.map((t) => {
          const Icon = t.icon;
          return (
            <div key={t.label} className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col items-center text-center relative overflow-hidden group hover:border-white/10 transition-colors">
              <div className={`absolute top-0 right-0 w-16 h-16 rounded-full -mr-4 -mt-4 blur-xl opacity-50 ${t.bgGlow}`}></div>
              <Icon className={`w-8 h-8 ${t.color} mb-3 relative`} />
              <h3 className="text-slate-200 font-semibold text-sm relative">{t.label}</h3>
              <p className="text-[10px] text-slate-500 mb-2 relative">{t.hours}</p>
              <p className={`text-2xl font-bold ${t.color} relative`}>{t.value}%</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function StatsSlide({ data }: SlideProps) {
  const statCards = [
    { label: "Bintang Didapat", value: data.stats.totalStars, icon: Star, color: "text-amber-400" },
    { label: "Total Fork Repo", value: data.stats.totalForks, icon: GitFork, color: "text-cyan-400" },
    { label: "Repositori Publik", value: data.publicRepos, icon: Code, color: "text-purple-400" },
    { label: "Estimasi Commits", value: data.stats.estimatedCommits, icon: Flame, color: "text-rose-500" },
  ];

  return (
    <div className="flex flex-col justify-center h-full p-6 sm:p-10 slide-enter">
      <p className="text-sm font-semibold tracking-widest text-purple-400 uppercase mb-2 text-center sm:text-left">
        Pencapaian Coding
      </p>
      <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-8 text-center sm:text-left text-white">
        Angka & Kontribusimu 📊
      </h2>

      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto sm:mx-0">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col justify-between h-32 hover:border-white/10 transition-colors">
              <div className="flex justify-between items-start">
                <span className="text-xs text-slate-400 leading-snug">{card.label}</span>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold text-white">
                {card.value.toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function PersonaSlide({ data }: SlideProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 slide-enter">
      <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-2">
        Hasil Analisis Kepribadian
      </p>
      
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-8 text-white">
        Coding Persona Anda 🔮
      </h2>

      {/* Persona Badge and Card */}
      <div className={`relative w-full max-w-sm p-8 rounded-3xl bg-gradient-to-br ${data.persona.colorClass} border border-white/20 shadow-2xl overflow-hidden`}>
        {/* Glow effect */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="px-5 py-2.5 rounded-full bg-slate-950/70 border border-white/10 text-white font-bold text-sm tracking-wide shadow-md mb-6 uppercase">
            {data.persona.badge}
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4">
            {data.persona.title}
          </h3>

          <p className="text-white/90 text-sm sm:text-base leading-relaxed px-2 font-medium">
            {data.persona.description}
          </p>
        </div>
      </div>

      <p className="text-[11px] text-slate-500 mt-10 max-w-xs">
        *Persona ini didasarkan pada perbandingan bahasa pemrograman, rasio kontribusi, dan waktu aktif coding.
      </p>
    </div>
  );
}

interface SummarySlideProps extends SlideProps {
  onRestart: () => void;
}

export function SummarySlide({ data, onRestart }: SummarySlideProps) {
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);

    try {
      // Delay slightly to ensure fonts and assets are rendered fully
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        backgroundColor: "#030712", // dark theme background
        pixelRatio: 3, // Render at 3x scale for crispness
        style: {
          borderRadius: "24px",
        },
      });

      const link = document.createElement("a");
      link.download = `${data.username}-github-wrapped.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Gagal mendownload kartu wrapped:", error);
    } finally {
      setDownloading(false);
    }
  };

  // Get dynamic URL to display in poster footer
  const displayUrl = typeof window !== "undefined"
    ? `${window.location.host}${window.location.pathname}`.replace(/\/$/, "")
    : "github-wrapped.web.app";

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 sm:p-6 slide-enter overflow-y-auto">
      {/* Wrapped Poster Container */}
      <div
        ref={cardRef}
        id="wrapped-summary-card"
        className="w-full max-w-xs p-6 rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-950/90 to-slate-950 border border-white/10 shadow-2xl relative overflow-hidden flex flex-col gap-5 text-left mb-6"
      >
        {/* Background glow lines */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-cyan-500/10 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-purple-500/10 blur-2xl"></div>

        {/* Poster Header */}
        <div className="flex justify-between items-center border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
              <img src={data.avatarUrl} alt={data.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white line-clamp-1">@{data.username}</h4>
              <p className="text-[9px] text-slate-400">My 2026 Code</p>
            </div>
          </div>
          <span className="text-[9px] px-2 py-1 rounded bg-white/5 border border-white/10 font-bold uppercase tracking-wider text-cyan-400">
            GITHUB WRAPPED
          </span>
        </div>

        {/* Persona Highlight */}
        <div className="space-y-1">
          <span className="text-[8px] uppercase tracking-widest text-slate-400 font-semibold">Gaya Coding</span>
          <h3 className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            {data.persona.title}
          </h3>
        </div>

        {/* Top Languages */}
        <div className="space-y-1.5">
          <span className="text-[8px] uppercase tracking-widest text-slate-400 font-semibold">Bahasa Utama</span>
          <div className="flex flex-wrap gap-1.5">
            {data.languages.slice(0, 3).map((lang) => (
              <span
                key={lang.name}
                className="text-[10px] px-2.5 py-1 rounded-full border border-white/5 text-slate-200 font-medium"
                style={{ backgroundColor: `${lang.color}15`, borderColor: `${lang.color}30` }}
              >
                {lang.name} ({lang.percentage}%)
              </span>
            ))}
          </div>
        </div>

        {/* Grid Stats */}
        <div className="grid grid-cols-2 gap-3.5 border-t border-white/5 pt-4">
          <div>
            <span className="text-[8px] uppercase tracking-widest text-slate-400 font-semibold block mb-0.5">Total Bintang</span>
            <span className="text-base font-black text-white flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              {data.stats.totalStars.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-[8px] uppercase tracking-widest text-slate-400 font-semibold block mb-0.5">Estimasi Commits</span>
            <span className="text-base font-black text-white flex items-center gap-1">
              <Flame className="w-4 h-4 text-rose-500 fill-rose-500" />
              {data.stats.estimatedCommits.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-[8px] uppercase tracking-widest text-slate-400 font-semibold block mb-0.5">Repo Baru</span>
            <span className="text-base font-black text-white">
              {data.publicRepos}
            </span>
          </div>
          <div>
            <span className="text-[8px] uppercase tracking-widest text-slate-400 font-semibold block mb-0.5">Waktu Puncak</span>
            <span className="text-base font-black text-white capitalize">
              {Object.entries(data.activityHours).sort((a, b) => b[1] - a[1])[0][0]}
            </span>
          </div>
        </div>

        {/* Footer Brand */}
        <p className="text-[8px] text-slate-500 text-center border-t border-white/5 pt-3">
          Temukan milikmu di {displayUrl}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col w-full max-w-xs gap-3">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white font-semibold rounded-2xl transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          {downloading ? "Membuat Gambar..." : "Download Poster"}
        </button>

        <button
          onClick={onRestart}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold rounded-2xl transition-all duration-300 transform active:scale-95 shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Coba Username Lain
        </button>
      </div>
    </div>
  );
}

interface SlidesContainerProps {
  data: GithubWrappedData;
  activeSlide: number;
  onPrev: () => void;
  onNext: () => void;
  onRestart: () => void;
  audioPlaying: boolean;
  toggleAudio: () => void;
}

export function SlidesContainer({
  data,
  activeSlide,
  onPrev,
  onNext,
  onRestart,
  audioPlaying,
  toggleAudio,
}: SlidesContainerProps) {
  const slidesCount = 6;

  const renderSlide = () => {
    switch (activeSlide) {
      case 0:
        return <WelcomeSlide data={data} />;
      case 1:
        return <LanguagesSlide data={data} />;
      case 2:
        return <ActivitySlide data={data} />;
      case 3:
        return <StatsSlide data={data} />;
      case 4:
        return <PersonaSlide data={data} />;
      case 5:
        return <SummarySlide data={data} onRestart={onRestart} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between p-4 bg-slate-950 text-white overflow-hidden select-none">
      {/* Dynamic Background Glow circles based on active slide */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[100px] opacity-20 pointer-events-none transition-all duration-1000 bg-purple-700"></div>

      {/* Header controls */}
      <div className="relative z-20 w-full max-w-lg flex justify-between items-center pt-2 px-2">
        <button
          onClick={onRestart}
          className="text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          &larr; Keluar
        </button>

        {/* Audio Toggle Button */}
        <button
          onClick={toggleAudio}
          className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all duration-300 cursor-pointer"
          title={audioPlaying ? "Mute Background Music" : "Play Background Music"}
        >
          {audioPlaying ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>
      </div>

      {/* Progress Bars (Instagram Stories style) */}
      <div className="relative z-20 w-full max-w-md flex gap-1.5 px-4 mt-4">
        {Array.from({ length: slidesCount }).map((_, idx) => (
          <div key={idx} className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                idx < activeSlide
                  ? "bg-purple-500"
                  : idx === activeSlide
                  ? "bg-cyan-400"
                  : "bg-transparent"
              }`}
            ></div>
          </div>
        ))}
      </div>

      {/* Slide Display Area */}
      <div className="relative z-10 w-full max-w-md flex-1 flex flex-col justify-center my-6">
        <div className="glass-panel-heavy rounded-3xl border border-white/10 shadow-2xl overflow-hidden min-h-[480px] flex flex-col justify-between relative">
          <div className="flex-1 flex flex-col justify-center">
            {renderSlide()}
          </div>
        </div>
      </div>

      {/* Bottom navigation buttons */}
      <div className="relative z-20 w-full max-w-md flex justify-between items-center pb-6 px-4">
        <button
          onClick={onPrev}
          disabled={activeSlide === 0}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
            activeSlide === 0
              ? "opacity-30 cursor-not-allowed text-slate-600"
              : "bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 cursor-pointer"
          }`}
        >
          <ChevronLeft className="w-4 h-4" /> Kemuji
        </button>

        <span className="text-xs text-slate-500 font-medium">
          Slide {activeSlide + 1} dari {slidesCount}
        </span>

        {activeSlide < slidesCount - 1 ? (
          <button
            onClick={onNext}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white shadow-lg cursor-pointer"
          >
            Lanjut <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="w-[84px]"></div> /* Placeholder for layout alignment */
        )}
      </div>
    </div>
  );
}
