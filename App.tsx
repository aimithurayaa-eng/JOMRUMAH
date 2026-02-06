import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Message } from './types';
import { 
  Send, 
  Bot, 
  User, 
  Loader2,
  Building2,
  MessageSquare,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  RefreshCcw,
  Zap,
  MapPin,
  Home,
  PieChart
} from 'lucide-react';

/* ===============================
   ENV – VITE + VERCEL COMPATIBLE
================================ */
const API_KEY = import.meta.env.VITE_API_KEY;

if (!API_KEY) {
  throw new Error(
    "❌ VITE_API_KEY tidak dijumpai. Sila set dalam .env atau Vercel Environment Variables."
  );
}

/* ===============================
   RAW CSV DATA (UNCHANGED)
================================ */
const RAW_CSV_DATA = `DAERAH,Negeri,Tahun,BIL UNIT NAPIC SEMASA,BIL UNIT NAPIC ALL,Tahun_2,Bil_Isi_Rumah,Bil_t_Kediaman_D,Kecukupan_NAPIC,Tahap_NAPIC,Perumahan_tidakformal_semasa
GOMBAK,SELANGOR,2024,215597,227508,2024,247800,277300,-32203,Kurang Penawaran,61703
HULU LANGAT,SELANGOR,2024,398404,422304,2024,433300,479400,-34896,Kurang Penawaran,80996
PETALING,SELANGOR,2024,545828,565381,2024,686700,752200,-140872,Kurang Penawaran,206372
W.P KUALA LUMPUR,W.P KUALA LUMPUR,2024,561102,680193,2024,647100,713500,-85998,Kurang Penawaran,152398
JOHOR BAHRU,JOHOR,2024,499136,544908,2024,522400,751400,-23264,Kurang Penawaran,252264
KOTA KINABALU,SABAH,2024,69966,86779,2024,133500,129000,-63534,Kurang Penawaran,59034
KUCHING,SARAWAK,2024,124769,136731,2024,173900,234700,-49131,Kurang Penawaran,109931`;

/* ===============================
   MAIN APP
================================ */
const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'Hai! Saya JOMRUMAHBOT 🤖 Saya di sini untuk membantu anda memahami trend dan kecukupan penawaran perumahan. Apa yang ingin anda ketahui hari ini?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatScrollRef.current?.scrollTo({
      top: chatScrollRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, [messages, isLoading]);

  const handleSendMessage = async (textOverride?: string) => {
    const messageToSend = textOverride || input;
    if (!messageToSend.trim() || isLoading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: messageToSend }]);
    setIsLoading(true);

    try {
      /* ===============================
         GOOGLE GENAI INIT (FIXED)
      ================================ */
      const ai = new GoogleGenAI({
        apiKey: API_KEY
      });

      const systemInstruction = `
Anda ialah **JOMRUMAHBOT**, pakar analitik perumahan Malaysia yang menggunakan data rasmi NAPIC 2024.

════════════════════════════════
PERANAN UTAMA
════════════════════════════════
1. Menganalisis status pasaran perumahan mengikut DAERAH atau NEGERI.
2. Menjawab soalan umum berkaitan trend, kekurangan, dan implikasi perumahan.
3. Semua jawapan MESTI berpandukan data CSV yang diberikan.

════════════════════════════════
PERATURAN WAJIB (TIDAK BOLEH DILANGGAR)
════════════════════════════════
1. Jawapan MESTI dalam Bahasa Malaysia.
2. JANGAN reka, anggar, atau andaikan data.
3. JANGAN guna maklumat luar selain CSV.
4. JANGAN ubah emoji, tajuk, atau susunan format.
5. JANGAN jawab dalam bentuk esei panjang.
6. Gunakan nombor dengan pemisah ribu (contoh: 215,597).
7. Jika data tidak wujud, nyatakan dengan jelas bahawa data tiada.

════════════════════════════════
LOGIK PEMILIHAN JAWAPAN
════════════════════════════════
A. Jika soalan menyebut **NAMA DAERAH atau NEGERI dalam CSV**  
→ GUNAKAN **FORMAT ANALISIS RASMI** (di bawah).

B. Jika soalan bersifat **umum** (contoh: trend perumahan, isu nasional)  
→ Berikan **ringkasan nasional** berdasarkan corak data CSV (tanpa nombor khusus daerah).

C. Jika soalan menyebut **daerah/negeri yang TIADA dalam CSV**  
→ Jawab:
"Maaf, data NAPIC 2024 bagi kawasan tersebut tidak terdapat dalam set data semasa."

════════════════════════════════
FORMAT ANALISIS RASMI (WAJIB DIGUNAKAN)
════════════════════════════════

Halo! Saya **JOMRUMAHBOT**, pakar analitik perumahan anda. Berikut adalah analisis data perumahan bagi daerah **[NAMA DAERAH]** berdasarkan data NAPIC 2024:

📍 **Status Pasaran**  
[Sama ada **Kurang Penawaran** atau **Lebih Penawaran** dan satu ayat penjelasan ringkas]

🏠 **Unit Perumahan Formal**  
* **Unit Sedia Ada (NAPIC Semasa):** [BIL UNIT NAPIC SEMASA] unit  
* **Jumlah Keseluruhan (Termasuk Perancangan/Bakal Siap):** [BIL UNIT NAPIC ALL] unit  

👨‍👩‍👧‍👦 **Isi Rumah**  
Terdapat sebanyak **[Bil_Isi_Rumah] isi rumah** pada tahun 2024.

📉 **Kekurangan / Lebihan**  
Terdapat jurang **[kekurangan / lebihan]** sebanyak **[nilai mutlak Kecukupan_NAPIC] unit** perumahan formal.

🏗️ **Rumah Tidak Formal**  
Terdapat sebanyak **[Perumahan_tidakformal_semasa] unit** perumahan tidak formal.

---
**Insight:**  
[Satu perenggan ringkas cadangan pembangunan, implikasi dasar, atau kesan kepada penduduk]

════════════════════════════════
FORMAT JAWAPAN UMUM (JIKA TIADA DAERAH SPESIFIK)
════════════════════════════════

📊 **Ringkasan Trend Perumahan Malaysia (NAPIC 2024)**  
[2–3 ayat ringkas merumuskan isu utama seperti kekurangan penawaran, tekanan permintaan, dan peranan perumahan tidak formal]

════════════════════════════════
DATA RUJUKAN RASMI (WAJIB DIGUNAKAN SAHAJA)

Data CSV:
${RAW_CSV_DATA}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: messageToSend,
        config: {
          systemInstruction,
          temperature: 0.2
        }
      });

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: response.text || "Tiada respons diterima." }
      ]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: "❌ Ralat sambungan API. Sila cuba semula." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <header className="p-4 border-b bg-white flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-indigo-600" />
          <h1 className="font-black">JOMRUMAHBOT</h1>
        </div>
        <button
          onClick={() =>
            setMessages([
              { role: 'assistant', content: 'Hai! Tanya apa-apa tentang perumahan Malaysia 😊' }
            ])
          }
          className="text-sm text-indigo-600"
        >
          Reset
        </button>
      </header>

      <main
        ref={chatScrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xl p-4 rounded-2xl ${
                m.role === 'user'
                  ? 'bg-white border'
                  : 'bg-indigo-600 text-white'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-indigo-600">
            <Loader2 className="animate-spin w-4 h-4" />
            JOMRUMAHBOT sedang berfikir...
          </div>
        )}
      </main>

      <footer className="p-4 bg-white border-t flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
          placeholder="Tanya status perumahan..."
          className="flex-1 border rounded-xl px-4 py-2"
        />
        <button
          onClick={() => handleSendMessage()}
          className="bg-indigo-600 text-white px-4 rounded-xl"
        >
          <Send className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
};

export default App;
