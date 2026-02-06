import React, { useState, useRef, useEffect } from "react";
import { Message } from "./types";
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
  PieChart,
} from "lucide-react";

const RAW_CSV_DATA = `DAERAH,Negeri,Tahun,BIL UNIT NAPIC SEMASA,BIL UNIT NAPIC ALL,Tahun_2,Bil_Isi_Rumah,Bil_t_Kediaman_D,Kecukupan_NAPIC,Tahap_NAPIC,Perumahan_tidakformal_semasa
GOMBAK,SELANGOR,2024,215597,227508,2024,247800,277300,-32203,Kurang Penawaran,61703
HULU LANGAT,SELANGOR,2024,398404,422304,2024,433300,479400,-34896,Kurang Penawaran,80996
HULU SELANGOR,SELANGOR,2024,93367,99947,2024,67400,92700,25967,Lebih Penawaran,-667
KLANG,SELANGOR,2024,224583,248326,2024,291300,331300,-66717,Kurang Penawaran,106717
KUALA LANGAT,SELANGOR,2024,65810,84496,2024,95300,114800,-29490,Kurang Penawaran,48990
KUALA SELANGOR,SELANGOR,2024,70048,81442,2024,92000,104500,-21952,Kurang Penawaran,34452
PETALING,SELANGOR,2024,545828,565381,2024,686700,752200,-140872,Kurang Penawaran,206372
SABAK BERNAM,SELANGOR,2024,11133,12488,2024,29900,35700,-18767,Kurang Penawaran,24567
SEPANG,SELANGOR,2024,102931,133440,2024,129300,169700,-26369,Kurang Penawaran,66769
W.P LABUAN,W.P LABUAN,2024,14039,14608,2024,26700,24300,-12661,Kurang Penawaran,10261
W.P PUTRAJAYA,W.P PUTRAJAYA,2024,20251,24160,2024,34800,44900,-14549,Kurang Penawaran,24649
W.P KUALA LUMPUR,W.P KUALA LUMPUR,2024,561102,680193,2024,647100,713500,-85998,Kurang Penawaran,152398
BATU PAHAT,JOHOR,2024,97943,103927,2024,127600,138500,-29657,Kurang Penawaran,40557
JOHOR BAHRU,JOHOR,2024,499136,544908,2024,522400,751400,-23264,Kurang Penawaran,252264
KLUANG,JOHOR,2024,74568,81636,2024,87000,99700,-12432,Kurang Penawaran,25132
KOTA TINGGI,JOHOR,2024,31729,43222,2024,63800,79400,-32071,Kurang Penawaran,47671
KULAI,JOHOR,2024,77336,80964,2024,88700,92200,-11364,Kurang Penawaran,14864
MERSING,JOHOR,2024,7282,8516,2024,22500,23500,-15218,Kurang Penawaran,16218
MUAR,JOHOR,2024,47043,49042,2024,75300,85700,-28257,Kurang Penawaran,38657
PONTIAN,JOHOR,2024,21118,22325,2024,46200,49800,-25082,Kurang Penawaran,28682
SEGAMAT,JOHOR,2024,47301,48739,2024,55400,68500,-8099,Kurang Penawaran,21199
TANGKAK,JOHOR,2024,24965,26725,2024,41600,46600,-16635,Kurang Penawaran,21635
BARAT DAYA,PULAU PINANG,2024,91660,102840,2024,79500,105700,12160,Lebih Penawaran,14040
SEBERANG PERAI SELATAN,PULAU PINANG,2024,63566,72205,2024,62100,69200,1466,Lebih Penawaran,5634
SEBERANG PERAI TENGAH,PULAU PINANG,2024,125048,132225,2024,113800,136600,11248,Lebih Penawaran,11552
SEBERANG PERAI UTARA,PULAU PINANG,2024,93271,102816,2024,95400,108600,-2129,Kurang Penawaran,15329
TIMUR LAUT,PULAU PINANG,2024,191560,205319,2024,194200,221800,-2640,Kurang Penawaran,30240
... (kekalkan semua CSV kau di sini sampai habis) ...`;

const renderAssistantContent = (content: string) => {
  return content.split("\n").map((line, i) => {
    if (line.trim().startsWith("|")) {
      return (
        <div
          key={i}
          className="my-3 overflow-x-auto rounded-xl border border-white/20 bg-white/10 shadow-inner"
        >
          <div className="min-w-full font-mono text-[11px] md:text-xs whitespace-pre p-3 text-white leading-relaxed">
            {line}
          </div>
        </div>
      );
    }

    const parts = line.split(/(\*\*.*?\*\*)/g);
    return (
      <p
        key={i}
        className="mb-3 text-[14px] md:text-[15px] leading-relaxed text-indigo-50 font-medium"
      >
        {parts.map((part, j) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <span
              key={j}
              className="text-white font-black bg-white/20 px-1 rounded-sm"
            >
              {part.slice(2, -2)}
            </span>
          ) : (
            part
          )
        )}
      </p>
    );
  });
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hai! Saya JOMRUMAHBOT 🤖 Saya di sini untuk membantu anda memahami trend dan kecukupan penawaran perumahan. Apa yang ingin anda ketahui hari ini?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  const renderContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      if (line.trim().startsWith("|")) {
        return (
          <div
            key={i}
            className="my-4 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 shadow-sm transition-all hover:shadow-md"
          >
            <div className="min-w-full font-mono text-[11px] md:text-xs whitespace-pre p-4 text-slate-700 leading-relaxed tracking-tight">
              {line}
            </div>
          </div>
        );
      }

      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p
          key={i}
          className="mb-3 text-[14px] md:text-[15px] leading-relaxed text-slate-700 font-medium"
        >
          {parts.map((part, j) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <span
                key={j}
                className="text-indigo-700 font-black bg-indigo-50 px-1 rounded-sm"
              >
                {part.slice(2, -2)}
              </span>
            ) : (
              part
            )
          )}
        </p>
      );
    });
  };

  const handleSendMessage = async (textOverride?: string) => {
    const messageToSend = (textOverride || input).trim();
    if (!messageToSend || isLoading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: messageToSend }]);
    setIsLoading(true);

    try {
      const systemInstruction = `Anda ialah JOMRUMAHBOT, pakar analitik perumahan Malaysia yang pintar dan mesra pengguna.

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

Data CSV Anda:
${RAW_CSV_DATA}`;

      const r = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageToSend,
          systemInstruction,
        }),
      });

      const data = await r.json();

      if (!r.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              data?.error ||
              "Maaf, sistem JOMRUMAHBOT sedang sibuk. Sila cuba sebentar lagi.",
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              data?.text ||
              "Maaf, sistem JOMRUMAHBOT sedang sibuk. Sila cuba sebentar lagi.",
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Ralat sambungan dikesan. Sila pastikan sambungan internet anda stabil.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Condition to strictly show buttons ONLY after assistant's first reply (welcome message is index 0)
  const shouldShowQuickActions = !isLoading && messages.length >= 3;

  return (
    <div className="flex flex-col h-screen bg-white font-sans text-slate-900 overflow-hidden">
      {/* Background Layer */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(#6366f1_0.5px,transparent_0.5px)] [background-size:20px_20px]"></div>
      </div>

      {/* Modern Header */}
      <header className="relative bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4 flex justify-between items-center z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-200">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-slate-900 leading-tight">
              JOMRUMAHBOT
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Live Data Intelligence
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setMessages([
                {
                  role: "assistant",
                  content:
                    "Hai! Saya JOMRUMAHBOT 🤖 Saya di sini untuk membantu anda memahami trend dan kecukupan penawaran perumahan. Apa yang ingin anda ketahui hari ini?",
                },
              ]);
            }}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
            title="Sembang Baru"
          >
            <RefreshCcw className="w-5 h-5" />
          </button>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full">
            <Zap className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-[10px] font-bold text-indigo-700 uppercase">
              Premium Access
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-slate-50/30">
        <div
          ref={chatScrollRef}
          className="flex-1 overflow-y-auto custom-scrollbar px-4 md:px-12 py-10 space-y-10 pb-4"
        >
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              } animate-in slide-in-from-bottom-2 duration-300`}
            >
              <div
                className={`flex gap-4 max-w-[95%] md:max-w-[80%] ${
                  m.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border ${
                    m.role === "user"
                      ? "bg-slate-900 border-slate-800 text-white"
                      : "bg-white border-slate-200 text-indigo-600"
                  }`}
                >
                  {m.role === "user" ? (
                    <User className="w-5 h-5" />
                  ) : (
                    <Bot className="w-5 h-5" />
                  )}
                </div>

                {/* Content Bubble */}
                <div
                  className={`relative px-5 py-4 rounded-3xl shadow-sm border transition-all ${
                    m.role === "user"
                      ? "bg-white text-slate-800 border-slate-200 rounded-tr-none"
                      : "bg-indigo-600 text-white border-transparent rounded-tl-none shadow-indigo-100"
                  }`}
                >
                  <div
                    className={`${
                      m.role === "assistant" ? "text-white" : "text-slate-800"
                    }`}
                  >
                    {m.role === "assistant"
                      ? renderAssistantContent(m.content)
                      : renderContent(m.content)}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start animate-in fade-in duration-300">
              <div className="flex gap-4 items-center bg-white/80 border border-slate-100 p-4 rounded-3xl shadow-sm ml-14">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                </div>
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions Bar */}
        <div
          className={`px-6 md:px-10 transition-all duration-500 ease-in-out ${
            shouldShowQuickActions
              ? "max-h-64 opacity-100 py-4"
              : "max-h-0 opacity-0 py-0 overflow-hidden"
          }`}
        >
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Tindakan Seterusnya
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                {
                  label: "Analisis Petaling",
                  query: "Berapa status perumahan di Petaling?",
                  icon: <MapPin className="w-3.5 h-3.5" />,
                  color: "indigo",
                },
                {
                  label: "Status KL",
                  query: "Bagaimana status perumahan di W.P Kuala Lumpur?",
                  icon: <Building2 className="w-3.5 h-3.5" />,
                  color: "violet",
                },
                {
                  label: "Analisis Johor",
                  query: "Berikan analisis perumahan untuk Johor Bahru.",
                  icon: <Home className="w-3.5 h-3.5" />,
                  color: "blue",
                },
                {
                  label: "Rumah Tidak Formal",
                  query:
                    "Daerah mana yang mempunyai jumlah perumahan tidak formal tertinggi?",
                  icon: <AlertTriangle className="w-3.5 h-3.5" />,
                  color: "orange",
                },
                {
                  label: "Defisit Kritikal",
                  query:
                    "Senaraikan 5 daerah dengan kekurangan perumahan paling kritikal.",
                  icon: <TrendingUp className="w-3.5 h-3.5" />,
                  color: "rose",
                },
                {
                  label: "Lebihan Penawaran",
                  query:
                    "Apakah daerah yang mempunyai lebihan penawaran perumahan?",
                  icon: <PieChart className="w-3.5 h-3.5" />,
                  color: "emerald",
                },
                {
                  label: "KL vs Selangor",
                  query:
                    "Bandingkan kecukupan perumahan antara Kuala Lumpur dan Selangor.",
                  icon: <ArrowRight className="w-3.5 h-3.5" />,
                  color: "slate",
                },
                {
                  label: "Trend Sabah",
                  query: "Bagaimana status perumahan di Kota Kinabalu, Sabah?",
                  icon: <MapPin className="w-3.5 h-3.5" />,
                  color: "indigo",
                },
              ].map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(action.query)}
                  className="flex items-center gap-2 px-3 py-2.5 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl transition-all shadow-sm active:scale-95 group text-left"
                >
                  <div
                    className={`p-1.5 rounded-lg bg-${action.color}-50 text-${action.color}-600 group-hover:scale-110 transition-transform`}
                  >
                    {action.icon}
                  </div>
                  <span className="text-[12px] font-bold text-slate-600 truncate">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Interaction Area */}
        <div className="p-6 md:p-10 bg-gradient-to-t from-white via-white/95 to-transparent relative z-10 border-t border-slate-100">
          <div className="max-w-4xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-[30px] blur opacity-10 group-focus-within:opacity-30 transition-opacity"></div>
              <div className="relative flex items-center gap-3 bg-white p-2 md:p-3 rounded-[28px] border border-slate-200 shadow-xl shadow-slate-200/50">
                <div className="hidden sm:flex w-12 h-12 rounded-full bg-slate-50 items-center justify-center text-slate-400">
                  <MessageSquare className="w-6 h-6" />
                </div>

                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Tanya JOMRUMAHBOT... (cth: Status perumahan di Gombak?)"
                  className="flex-1 bg-transparent border-none outline-none py-3 px-2 text-[15px] font-medium text-slate-700 placeholder:text-slate-400"
                  disabled={isLoading}
                />

                <button
                  onClick={() => handleSendMessage()}
                  disabled={isLoading || !input.trim()}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg ${
                    isLoading || !input.trim()
                      ? "bg-slate-100 text-slate-300"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 active:scale-90 hover:scale-105"
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>

            <p className="text-center mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
              <Sparkles className="w-3 h-3 text-indigo-400" /> Powered by
              JOMRUMAH Intelligence • Versi 2.0.2
            </p>
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }

        .bg-indigo-50 { background-color: #eef2ff; } .text-indigo-600 { color: #4f46e5; }
        .bg-violet-50 { background-color: #f5f3ff; } .text-violet-600 { color: #7c3aed; }
        .bg-blue-50 { background-color: #eff6ff; } .text-blue-600 { color: #2563eb; }
        .bg-orange-50 { background-color: #fff7ed; } .text-orange-600 { color: #ea580c; }
        .bg-rose-50 { background-color: #fff1f2; } .text-rose-600 { color: #e11d48; }
        .bg-emerald-50 { background-color: #ecfdf5; } .text-emerald-600 { color: #059669; }
        .bg-slate-50 { background-color: #f8fafc; } .text-slate-600 { color: #475569; }
      `}</style>
    </div>
  );
};

export default App;
