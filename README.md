# feConvert-MP3 (Next.js 14 + TypeScript)

Frontend modern untuk Audio Converter (YouTube & TikTok to MP3) berbasis **Next.js 14 (App Router)** dan **TypeScript**.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Minimalist True Dark Theme)
- **Icons**: Lucide React
- **Package Manager**: Bun

## Menjalankan Frontend

Jalankan script start:
```bash
./start.sh
```
Atau manual:
```bash
bun run dev
```

Frontend aktif di:
- **Laptop**: [http://localhost:3000](http://localhost:3000)
- **HP (1 Wi-Fi)**: `http://192.168.1.35:3000`

Semua request `/api/*` otomatis diteruskan (rewritten) ke backend Go Fiber di port `8000`.
