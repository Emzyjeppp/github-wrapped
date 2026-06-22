import { useState, useEffect, useRef } from "react";
import StartScreen from "./components/StartScreen";
import LoadingScreen from "./components/LoadingScreen";
import { SlidesContainer } from "./components/Slides";
import { fetchGithubWrapped, getDemoData, GithubWrappedData } from "./services/githubService";

// Web Audio API Sound Synthesizer for self-contained, high-quality ambient background music
class AmbientSynth {
  private ctx: AudioContext | null = null;
  private oscillators: OscillatorNode[] = [];
  private gainNode: GainNode | null = null;
  private isPlaying = false;
  private schedulerTimer: any = null;

  constructor() {
    // Initialized lazily on first user interaction
  }

  public start() {
    if (this.isPlaying) return;
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.08, this.ctx.currentTime); // Low background volume
      this.gainNode.connect(this.ctx.destination);
      this.isPlaying = true;
      this.playLoop();
    } catch (e) {
      console.error("Web Audio API failed to load", e);
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.schedulerTimer) {
      clearTimeout(this.schedulerTimer);
    }
    this.oscillators.forEach(osc => {
      try { osc.stop(); } catch (e) {}
    });
    this.oscillators = [];
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }

  private playChord(frequencies: number[], duration: number) {
    if (!this.ctx || !this.gainNode || !this.isPlaying) return;
    
    const now = this.ctx.currentTime;
    
    // Play warm sine and triangle waves for lo-fi pads
    frequencies.forEach((freq) => {
      if (!this.ctx || !this.gainNode) return;
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      
      oscGain.gain.setValueAtTime(0, now);
      oscGain.gain.linearRampToValueAtTime(0.3, now + 1.5); // Slow attack
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration - 0.5); // Long release
      
      osc.connect(oscGain);
      oscGain.connect(this.gainNode);
      
      osc.start(now);
      osc.stop(now + duration);
      this.oscillators.push(osc);
    });
  }

  private playLoop = () => {
    if (!this.isPlaying) return;

    // Fmaj7 - G6 - Em7 - Am9 Chord Progression (warm lo-fi chill mood)
    const progressions = [
      [174.61, 220.00, 261.63, 329.63], // Fmaj7 (F3, A3, C4, E4)
      [196.00, 246.94, 293.66, 329.63], // G6 (G3, B3, D4, E4)
      [164.81, 196.00, 246.94, 293.66], // Em7 (E3, G3, B3, D4)
      [220.00, 261.63, 329.63, 392.00, 493.88] // Am9 (A3, C4, E4, G4, B4)
    ];

    let currentChord = 0;
    const chordDuration = 5; // seconds per chord

    const scheduleNext = () => {
      if (!this.isPlaying) return;
      
      this.playChord(progressions[currentChord], chordDuration);
      currentChord = (currentChord + 1) % progressions.length;
      
      this.schedulerTimer = setTimeout(scheduleNext, chordDuration * 1000 - 500);
    };

    scheduleNext();
  };
}

export default function App() {
  const [screen, setScreen] = useState<"start" | "loading" | "slides">("start");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [wrappedData, setWrappedData] = useState<GithubWrappedData | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const synthRef = useRef<AmbientSynth | null>(null);

  // Initialize synth instance
  useEffect(() => {
    synthRef.current = new AmbientSynth();
    return () => {
      synthRef.current?.stop();
    };
  }, []);

  // Handle playing music
  useEffect(() => {
    if (audioPlaying) {
      synthRef.current?.start();
    } else {
      synthRef.current?.stop();
    }
  }, [audioPlaying]);

  // Handle arrow key navigation for slides
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (screen !== "slides") return;
      if (e.key === "ArrowRight" || e.key === "Space") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [screen, activeSlide]);

  const handleSearch = async (username: string) => {
    setErrorMsg(null);
    setScreen("loading");
    
    // Auto-enable audio on first gesture
    setAudioPlaying(true);

    try {
      const data = await fetchGithubWrapped(username);
      setWrappedData(data);
      setActiveSlide(0);
      setScreen("slides");
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan!");
      setScreen("start");
    }
  };

  const handleDemo = () => {
    setErrorMsg(null);
    setScreen("loading");
    setAudioPlaying(true);

    setTimeout(() => {
      const data = getDemoData();
      setWrappedData(data);
      setActiveSlide(0);
      setScreen("slides");
    }, 2000);
  };

  const handleNext = () => {
    if (activeSlide < 5) {
      setActiveSlide((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeSlide > 0) {
      setActiveSlide((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setScreen("start");
    setWrappedData(null);
    setActiveSlide(0);
  };

  return (
    <div className="h-full w-full bg-slate-950 font-sans select-none">
      {errorMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3.5 rounded-2xl bg-red-900/80 border border-red-500/20 backdrop-blur-md text-white text-xs font-semibold shadow-lg text-center max-w-sm">
          {errorMsg}
        </div>
      )}

      {screen === "start" && (
        <StartScreen onSearch={handleSearch} onDemo={handleDemo} />
      )}

      {screen === "loading" && <LoadingScreen />}

      {screen === "slides" && wrappedData && (
        <SlidesContainer
          data={wrappedData}
          activeSlide={activeSlide}
          onPrev={handlePrev}
          onNext={handleNext}
          onRestart={handleRestart}
          audioPlaying={audioPlaying}
          toggleAudio={() => setAudioPlaying((p) => !p)}
        />
      )}
    </div>
  );
}
