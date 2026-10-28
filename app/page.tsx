"use client";

import React, { useState } from "react";
import { 
  Music,
  Link2, 
  Download, 
  ArrowRight, 
  Loader2, 
  Check, 
  AlertCircle,
  Sparkles
} from "lucide-react";

interface ConvertResponse {
  task_id: string;
  filename: string;
  filesize: string;
  download_url: string;
}

export default function Home() {
  const [url, setUrl] = useState<string>("");
  const [bitrate, setBitrate] = useState<"192" | "320" | "128">("192");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ConvertResponse | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 2500);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        showToast("Tautan ditempel");
      }
    } catch {
      showToast("Izinkan akses clipboard di browser");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = url.trim();
    if (!cleanUrl) return;

    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch("/api/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: cleanUrl,
          bitrate,
          embed_thumbnail: true,
        }),
      });

      // Cek jika server backend sedang mati / offline (502, 503, 504, 530 Cloudflare)
      if (res.status === 502 || res.status === 503 || res.status === 504 || res.status === 530) {
        throw new Error("Server backend belum dinyalakan");
      }

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error("Server backend belum dinyalakan");
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || data.error || "Terjadi kesalahan saat memproses");
      }

      setResult(data);

      // Trigger native download
      const a = document.createElement("a");
      a.href = data.download_url;
      a.download = data.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setUrl("");
      showToast("Download dimulai");
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.name === "SyntaxError" || err.message.includes("JSON") || err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
          setError("Server backend belum dinyalakan");
        } else {
          setError(err.message);
        }
      } else {
        setError("Terjadi kesalahan yang tidak diketahui");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 font-sans bg-[#030305] text-zinc-100 overflow-hidden selection:bg-white/20 selection:text-white">
      
      {/* High-Definition iOS Colorful Glowing Mesh (Behind Frosted Glass) */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-violet-600/50 via-fuchsia-600/40 to-pink-500/35 blur-[100px] rounded-full pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[450px] h-[350px] bg-gradient-to-br from-cyan-500/40 to-blue-600/45 blur-[110px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[300px] bg-gradient-to-tl from-indigo-500/40 via-purple-500/30 to-rose-500/30 blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* Main Container */}
      <div className="w-full max-w-xl mx-auto flex flex-col items-center relative z-10">
        
        {/* iOS Frosted Glass App Icon Badge */}
        <div className="w-18 h-18 p-4 rounded-3xl glass-pill flex items-center justify-center mb-6 shadow-2xl transition-transform hover:scale-105 active:scale-95 duration-300">
          <Music className="w-9 h-9 text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.4)]" />
        </div>

        {/* Title & Subtitle */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
            Konversi ke MP3
          </h1>
          <p className="text-sm text-zinc-300/80 mt-2 font-normal max-w-sm mx-auto drop-shadow-sm">
            Ekstrak audio kualitas tinggi dari YouTube &amp; TikTok langsung dalam format MP3.
          </p>
        </div>

        {/* Glassmorphism Main Card */}
        <form onSubmit={handleSubmit} className="w-full">
          <div className="rounded-3xl p-4 sm:p-5 glass-panel transition-all">
            
            {/* Input Capsule with Frosted Effect */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl glass-input focus-within:border-white/40 focus-within:ring-2 focus-within:ring-white/20 transition-all">
              <Link2 className="w-4 h-4 text-white/50 flex-shrink-0" />
              <input 
                type="url" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                placeholder="Tempel link YouTube atau TikTok..." 
                className="w-full bg-transparent text-sm text-white placeholder-zinc-400/70 focus:outline-none font-normal"
              />
              <button 
                type="button" 
                onClick={handlePaste}
                className="text-xs px-3 py-1.5 rounded-xl glass-pill hover:bg-white/20 active:scale-95 text-white font-medium transition-all flex-shrink-0"
              >
                Paste
              </button>
            </div>

            {/* Bottom Controls */}
            <div className="mt-4 pt-3.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 px-1">
              
              {/* Bitrate iOS Segmented Control */}
              <div className="flex items-center gap-1 glass-input p-1 rounded-2xl">
                <span className="text-[10px] text-white/50 px-2 font-mono uppercase tracking-wider">Bitrate</span>
                {(["192", "320", "128"] as const).map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBitrate(b)}
                    className={`px-3 py-1 rounded-xl text-xs font-mono transition-all ${
                      bitrate === b
                        ? "bg-white/25 text-white shadow-md border border-white/30 font-semibold"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    {b}k
                  </button>
                ))}
              </div>

              {/* Ekstrak & Unduh Primary Button */}
              <button 
                type="submit" 
                disabled={loading}
                className={`h-10 px-5 glass-button-primary text-zinc-950 font-semibold text-xs rounded-2xl hover:opacity-95 active:scale-95 transition-all flex items-center gap-2 ${
                  loading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-950" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <span>Ekstrak &amp; Unduh</span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-950" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Processing Glass Capsule */}
        {loading && (
          <div className="w-full mt-5 rounded-2xl p-4 glass-panel flex items-center gap-3.5 animate-fade-in">
            <div className="w-9 h-9 rounded-xl glass-pill flex items-center justify-center flex-shrink-0">
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white">Mengunduh &amp; Mengonversi...</p>
              <p className="text-[11px] text-zinc-300/70 mt-0.5 font-mono">Menyisipkan ID3 tags &amp; cover album</p>
            </div>
          </div>
        )}

        {/* Error Glass Notification */}
        {error && (
          <div className="w-full mt-5 rounded-2xl p-4 glass-panel border-red-400/30 bg-red-950/20 text-red-100 flex items-start gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-xl bg-red-500/25 border border-red-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertCircle className="w-4 h-4 text-red-200" />
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <p className="text-xs font-semibold text-red-100">Gagal mengonversi</p>
              <p className="mt-1 text-red-200/90 text-xs font-normal">{error}</p>
            </div>
          </div>
        )}

        {/* Success Download Glass Card */}
        {result && (
          <div className="w-full mt-5 rounded-3xl p-5 glass-panel border-emerald-400/35 bg-emerald-950/20 flex items-center justify-between gap-4 animate-fade-in">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-emerald-500/30 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-emerald-300" />
                </div>
                <span className="text-[11px] text-emerald-300 font-mono uppercase tracking-wider font-semibold">MP3 Siap</span>
              </div>
              <p className="text-sm font-medium text-white truncate mt-1.5">{result.filename}</p>
              <p className="text-xs text-zinc-300/80 font-mono mt-0.5">{result.filesize} • {bitrate} kbps</p>
            </div>

            <a 
              href={result.download_url} 
              download={result.filename}
              className="h-10 px-4 rounded-2xl bg-emerald-400/25 hover:bg-emerald-400/35 border border-emerald-400/40 text-xs font-semibold text-emerald-100 transition-all flex items-center gap-1.5 flex-shrink-0 active:scale-95 shadow-lg shadow-emerald-950/50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh</span>
            </a>
          </div>
        )}

      </div>

      {/* Floating Dynamic Island Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full glass-toast text-white text-xs font-medium tracking-wide flex items-center gap-2 animate-fade-in z-50">
          <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
          <span>{toast}</span>
        </div>
      )}

    </div>
  );
}
