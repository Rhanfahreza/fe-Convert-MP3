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
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 font-sans bg-[#050508] text-zinc-100 overflow-hidden selection:bg-white/20 selection:text-white">
      
      {/* iOS Ambient Glass Lighting Orbs (Background) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[380px] bg-gradient-to-tr from-indigo-600/35 via-purple-600/25 to-pink-500/20 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[420px] h-[320px] bg-blue-600/25 blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-cyan-500/15 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Main Glass Center Card */}
      <div className="w-full max-w-xl mx-auto flex flex-col items-center">
        
        {/* iOS Frosted App Icon Badge */}
        <div className="w-16 h-16 rounded-3xl bg-white/[0.08] backdrop-blur-2xl border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_12px_32px_rgba(0,0,0,0.5)] flex items-center justify-center mb-5 transition-transform hover:scale-105 duration-300">
          <Music className="w-8 h-8 text-white drop-shadow-md" />
        </div>

        {/* Title & Subtitle */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white drop-shadow-sm">
            Konversi ke MP3
          </h1>
          <p className="text-sm text-zinc-400/90 mt-2 font-normal max-w-sm mx-auto">
            Ekstrak audio berkualitas tinggi dari YouTube &amp; TikTok langsung ke jam atau HP.
          </p>
        </div>

        {/* Glassmorphism Input Form Container */}
        <form onSubmit={handleSubmit} className="w-full">
          <div className="rounded-3xl p-3 sm:p-4 backdrop-blur-2xl bg-white/[0.04] border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_24px_60px_rgba(0,0,0,0.6)] transition-all">
            
            {/* Input Capsule */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-black/40 border border-white/10 focus-within:border-white/30 focus-within:ring-2 focus-within:ring-white/10 transition-all backdrop-blur-md">
              <Link2 className="w-4 h-4 text-white/40 flex-shrink-0" />
              <input 
                type="url" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                placeholder="Tempel link YouTube atau TikTok..." 
                className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none font-normal"
              />
              <button 
                type="button" 
                onClick={handlePaste}
                className="text-xs px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 text-white/90 border border-white/10 transition-all flex-shrink-0 font-medium"
              >
                Paste
              </button>
            </div>

            {/* Bottom Controls inside Glass Card */}
            <div className="mt-3 pt-3 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 px-1">
              
              {/* Bitrate iOS Segmented Control */}
              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-2xl border border-white/10 backdrop-blur-md">
                <span className="text-[10px] text-white/40 px-2 font-mono uppercase tracking-wider">Bitrate</span>
                {(["192", "320", "128"] as const).map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBitrate(b)}
                    className={`px-3 py-1 rounded-xl text-xs font-mono transition-all ${
                      bitrate === b
                        ? "bg-white/20 text-white shadow-sm border border-white/20 font-medium"
                        : "text-white/50 hover:text-white/80"
                    }`}
                  >
                    {b}k
                  </button>
                ))}
              </div>

              {/* Ekstrak & Unduh Primary Glass Button */}
              <button 
                type="submit" 
                disabled={loading}
                className={`h-10 px-5 bg-white text-zinc-950 font-semibold text-xs rounded-2xl hover:bg-white/90 active:scale-95 transition-all shadow-lg shadow-white/10 flex items-center gap-2 ${
                  loading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <span>Ekstrak &amp; Unduh</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Processing Glass Capsule */}
        {loading && (
          <div className="w-full mt-5 rounded-2xl p-4 backdrop-blur-2xl bg-white/[0.05] border border-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_12px_30px_rgba(0,0,0,0.5)] flex items-center gap-3.5 animate-fade-in">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white">Mengunduh &amp; Mengonversi...</p>
              <p className="text-[11px] text-zinc-400 mt-0.5 font-mono">Menyisipkan ID3 tags &amp; cover album</p>
            </div>
          </div>
        )}

        {/* Error Glass Notification */}
        {error && (
          <div className="w-full mt-5 rounded-2xl p-4 backdrop-blur-2xl bg-red-500/[0.08] border border-red-500/25 text-red-200 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_12px_30px_rgba(0,0,0,0.5)] flex items-start gap-3 animate-fade-in">
            <div className="w-7 h-7 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertCircle className="w-4 h-4 text-red-300" />
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <p className="text-xs font-semibold text-red-200">Gagal mengonversi</p>
              <p className="mt-1 text-red-300/90 text-xs font-normal">{error}</p>
            </div>
          </div>
        )}

        {/* Success Download Glass Card */}
        {result && (
          <div className="w-full mt-5 rounded-3xl p-5 backdrop-blur-2xl bg-white/[0.07] border border-emerald-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_20px_45px_rgba(0,0,0,0.5)] flex items-center justify-between gap-4 animate-fade-in">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-emerald-400" />
                </div>
                <span className="text-[11px] text-emerald-300 font-mono uppercase tracking-wider">MP3 Siap</span>
              </div>
              <p className="text-sm font-medium text-white truncate mt-1.5">{result.filename}</p>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">{result.filesize} • {bitrate} kbps</p>
            </div>

            <a 
              href={result.download_url} 
              download={result.filename}
              className="h-10 px-4 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs font-medium text-emerald-200 transition-all flex items-center gap-1.5 flex-shrink-0 active:scale-95 shadow-md shadow-emerald-950/40"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh</span>
            </a>
          </div>
        )}

        {/* Subtle Footer */}
        <p className="mt-12 text-xs text-zinc-600 font-mono text-center">
          Huawei Watch Fit 4 &amp; Smartwatch Ready
        </p>

      </div>

      {/* Floating Dynamic Island Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 text-white text-xs font-medium shadow-2xl tracking-wide flex items-center gap-2 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-white/80" />
          <span>{toast}</span>
        </div>
      )}

    </div>
  );
}
