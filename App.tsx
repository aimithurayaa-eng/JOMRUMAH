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
Tugas utama: Memberi insight mendalam berdasarkan data NAPIC 2024.

Gaya Maklum Balas (UX Rules):
1. Mulakan dengan ringkasan pendek (1-2 ayat).
2. Jika pengguna bertanya tentang status atau maklumat daerah/negeri tertentu, JANGAN gunakan format perenggan biasa. Anda WAJIB menggunakan struktur jawapan ini secara eksklusif:

📍 Status Pasaran
Pasaran perumahan berada dalam keadaan [Sebutkan Status: Kurang/Lebih Penawaran].

🏠 Unit Perumahan Formal
Terdapat [Bilangan] unit perumahan formal tersedia. (Rujuk: BIL UNIT NAPIC ALL)

👨‍👩‍👧‍👦 Isi Rumah
Bilangan isi rumah direkodkan sebanyak [Bilangan]. (Rujuk: Bil_Isi_Rumah)

📉 Kekurangan Unit
Dianggarkan [kekurangan/kelebihan] sebanyak [Bilangan] unit perumahan. (Rujuk: Kecukupan_NAPIC)

🏗️ Rumah Tidak Formal
Sekitar [Bilangan] unit rumah tidak formal dianggarkan wujud. (Rujuk: Perumahan_tidakformal_semasa)

3. Selepas struktur di atas, berikan huraian ringkas atau cadangan pembangunan.
4. Gunakan Bahasa Malaysia yang profesional tetapi mudah difahami.

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
