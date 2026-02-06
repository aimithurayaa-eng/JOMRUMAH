
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
BAGAN DATUK,PERAK,2024,5810,6126,2024,21200,18700,-15390,Kurang Penawaran,12890
BATANG PADANG,PERAK,2024,18607,26466,2024,67400,102800,-48793,Kurang Penawaran,84193
HILIR PERAK,PERAK,2024,25464,31251,2024,31200,40500,-5736,Kurang Penawaran,15036
HULU PERAK,PERAK,2024,7998,9077,2024,26800,33600,-18802,Kurang Penawaran,25602
KAMPAR,PERAK,2024,31722,36978,2024,31100,46600,622,Lebih Penawaran,14878
KERIAN,PERAK,2024,20330,22603,2024,42400,54200,-22070,Kurang Penawaran,33870
KINTA,PERAK,2024,255064,287659,2024,274300,315200,-19236,Kurang Penawaran,60136
KUALA KANGSAR,PERAK,2024,26442,29497,2024,55200,60600,-28758,Kurang Penawaran,34158
LARUT MATANG,PERAK,2024,56994,60962,2024,71500,89000,-14506,Kurang Penawaran,32006
MANJUNG,PERAK,2024,64948,77691,2024,67400,102800,-2452,Kurang Penawaran,37852
MUALIM,PERAK,2024,13020,14278,2024,24100,23100,-11080,Kurang Penawaran,10080
PERAK TENGAH,PERAK,2024,13557,17672,2024,32600,39800,-19043,Kurang Penawaran,26243
SELAMA,PERAK,2024,2870,3057,2024,9600,12000,-6730,Kurang Penawaran,9130
JELEBU,NEGERI SEMBILAN,2024,6762,7077,2024,11600,13800,-4838,Kurang Penawaran,7038
JEMPOL,NEGERI SEMBILAN,2024,15367,17797,2024,34500,38500,-19133,Kurang Penawaran,23133
KUALA PILAH,NEGERI SEMBILAN,2024,9611,11084,2024,19800,25000,-10189,Kurang Penawaran,15389
PORT DICKSON,NEGERI SEMBILAN,2024,37466,42935,2024,35900,55200,1566,Kurang Penawaran,17734
REMBAU,NEGERI SEMBILAN,2024,8113,9952,2024,13600,16800,-5487,Kurang Penawaran,8687
SEREMBAN,NEGERI SEMBILAN,2024,215607,247098,2024,214800,252100,807,Lebih Penawaran,36493
TAMPIN,NEGERI SEMBILAN,2024,18283,20962,2024,23000,28000,-4717,Kurang Penawaran,9717
ALOR GAJAH,MELAKA,2024,45970,58183,2024,81800,81400,-35830,Kurang Penawaran,35430
JASIN,MELAKA,2024,29572,48272,2024,42600,58300,-13028,Kurang Penawaran,28728
MELAKA TENGAH,MELAKA,2024,147927,165112,2024,179100,220400,-31173,Kurang Penawaran,72473
BALING,KEDAH,2024,10495,12183,2024,40400,45100,-29905,Kurang Penawaran,34605
BANDAR BAHARU,KEDAH,2024,2521,2793,2024,11800,13300,-9279,Kurang Penawaran,10779
KOTA SETAR,KEDAH,2024,70485,75937,2024,99900,117200,-29415,Kurang Penawaran,46715
KUALA MUDA,KEDAH,2024,137957,146489,2024,143700,180600,-5743,Kurang Penawaran,42643
KUBANG PASU,KEDAH,2024,33733,38124,2024,63600,72900,-29867,Kurang Penawaran,39167
KULIM,KEDAH,2024,72279,82160,2024,88400,101700,-16121,Kurang Penawaran,29421
LANGKAWI,KEDAH,2024,8958,10674,2024,27700,36100,-18742,Kurang Penawaran,27142
PADANG TERAP,KEDAH,2024,2341,2421,2024,16700,19300,-14359,Kurang Penawaran,16959
PENDANG,KEDAH,2024,5335,6119,2024,25200,32100,-19865,Kurang Penawaran,26765
POKOK SENA,KEDAH,2024,4732,5808,2024,12600,15500,-7868,Kurang Penawaran,10768
SIK,KEDAH,2024,1970,2030,2024,18200,20100,-16230,Kurang Penawaran,18130
YAN,KEDAH,2024,5886,6121,2024,17800,18200,-11914,Kurang Penawaran,12314
BENTONG,PAHANG,2024,20360,21152,2024,30900,41500,-10540,Kurang Penawaran,21140
BERA,PAHANG,2024,13906,14284,2024,25500,27700,-11594,Kurang Penawaran,13794
CAMERON HIGHLANDS,PAHANG,2024,9271,12496,2024,10600,18900,-1329,Kurang Penawaran,9629
JERANTUT,PAHANG,2024,13604,16043,2024,23700,29000,-10096,Kurang Penawaran,15396
KUANTAN,PAHANG,2024,137754,164619,2024,169200,173300,-31446,Kurang Penawaran,35546
LIPIS,PAHANG,2024,9372,11615,2024,22800,25600,-13428,Kurang Penawaran,16228
MARAN,PAHANG,2024,19380,22787,2024,26000,31900,-6620,Kurang Penawaran,12520
PEKAN,PAHANG,2024,16749,18646,2024,37100,37200,-20351,Kurang Penawaran,20451
RAUB,PAHANG,2024,18717,20188,2024,24200,26900,-5483,Kurang Penawaran,8183
ROMPIN,PAHANG,2024,17292,20873,2024,28800,36700,-11508,Kurang Penawaran,19408
TEMERLOH,PAHANG,2024,33738,36795,2024,43800,56000,-10062,Kurang Penawaran,22262
BESUT,TERENGGANU ,2024,9558,11061,2024,43100,49200,-33542,Kurang Penawaran,39642
DUNGUN,TERENGGANU ,2024,12299,13679,2024,46600,49100,-34301,Kurang Penawaran,36801
HULU TERENGGANU,TERENGGANU ,2024,3918,5759,2024,18900,24100,-14982,Kurang Penawaran,20182
KEMAMAN,TERENGGANU ,2024,24021,28823,2024,64000,69400,-39979,Kurang Penawaran,45379
KUALA NERUS,TERENGGANU ,2024,18133,19678,2024,35100,37700,-16967,Kurang Penawaran,19567
KUALA TERENGGANU,TERENGGANU ,2024,36328,40145,2024,59200,62300,-22872,Kurang Penawaran,25972
MARANG,TERENGGANU ,2024,13775,18026,2024,32800,40200,-19025,Kurang Penawaran,26425
SETIU,TERENGGANU ,2024,1344,2326,2024,15700,17800,-14356,Kurang Penawaran,16456
BACHOK,KELANTAN,2024,4916,5547,2024,34600,41900,-29684,Kurang Penawaran,36984
GUA MUSANG,KELANTAN,2024,5988,6037,2024,21300,28300,-15312,Kurang Penawaran,22312
JELI,KELANTAN,2024,2251,2661,2024,13200,12500,-10949,Kurang Penawaran,10249
KOTA BHARU,KELANTAN,2024,36541,42087,2024,124200,146300,-87659,Kurang Penawaran,109759
KUALA KRAI,KELANTAN,2024,6644,7403,2024,24700,30900,-18056,Kurang Penawaran,24256
MACHANG,KELANTAN,2024,7927,9063,2024,23900,28600,-15973,Kurang Penawaran,20673
PASIR MAS,KELANTAN,2024,9075,10736,2024,48500,60800,-39425,Kurang Penawaran,51725
PASIR PUTEH,KELANTAN,2024,4419,6118,2024,27900,36800,-23481,Kurang Penawaran,32381
TANAH MERAH,KELANTAN,2024,8223,9347,2024,32700,38200,-24477,Kurang Penawaran,29977
TUMPAT,KELANTAN,2024,7691,8441,2024,37200,46700,-29509,Kurang Penawaran,39009
KANGAR,PERLIS,2024,27978,31148,2024,94900,78600,-66922,Kurang Penawaran,50622
BEAUFORT,SABAH,2024,3096,3565,2024,19000,20200,-15904,Kurang Penawaran,17104
BELURAN,SABAH,2024,808,1002,2024,20900,24700,-20092,Kurang Penawaran,23892
KENINGAU,SABAH,2024,6595,8982,2024,37100,40600,-30505,Kurang Penawaran,34005
KINABATANGAN,SABAH,2024,437,623,2024,34100,34700,-33663,Kurang Penawaran,34263
KOTA BELUD,SABAH,2024,1304,1304,2024,21700,22500,-20396,Kurang Penawaran,21196
KOTA KINABALU,SABAH,2024,69966,86779,2024,133500,129000,-63534,Kurang Penawaran,59034
KOTA MARUDU,SABAH,2024,1943,2389,2024,17000,20000,-15057,Kurang Penawaran,18057
KOTA PENYU,SABAH,2024,40,40,2024,5800,6700,-5760,Kurang Penawaran,6660
KUDAT,SABAH,2024,2904,2974,2024,19700,21700,-16796,Kurang Penawaran,18796
KUNAK,SABAH,2024,1284,1308,2024,12500,14200,-11216,Kurang Penawaran,12916
LAHAD DATU,SABAH,2024,10923,11053,2024,51300,51300,-40377,Kurang Penawaran,40377
NABAWAN,SABAH,2024,60,60,2024,5800,6600,-5740,Kurang Penawaran,6540
PAPAR,SABAH,2024,14298,18976,2024,36500,41100,-22202,Kurang Penawaran,26802
PENAMPANG,SABAH,2024,30944,33611,2024,48500,50200,-17556,Kurang Penawaran,19256
PITAS,SABAH,2024,118,558,2024,9200,10800,-9082,Kurang Penawaran,10682
PUTATAN,SABAH,2024,7846,8708,2024,18300,19400,-10454,Kurang Penawaran,11554
RANAU,SABAH,2024,965,1054,2024,17100,19000,-16135,Kurang Penawaran,18035
SANDAKAN,SABAH,2024,41780,43761,2024,101400,107000,-59620,Kurang Penawaran,65220
SEMPORNA,SABAH,2024,3048,3131,2024,33900,37000,-30852,Kurang Penawaran,33952
SIPITANG,SABAH,2024,327,480,2024,9000,9700,-8673,Kurang Penawaran,9373
TAMBUNAN,SABAH,2024,31,275,2024,7700,7900,-7669,Kurang Penawaran,7869
TAWAU,SABAH,2024,30494,31148,2024,90600,96000,-60106,Kurang Penawaran,65506
TENOM,SABAH,2024,1082,1082,2024,11400,13100,-10318,Kurang Penawaran,12018
TONGOD,SABAH,2024,0,0,2024,11100,11900,-11100,Kurang Penawaran,11900
TUARAN,SABAH,2024,15397,15397,2024,33600,38600,-18203,Kurang Penawaran,23203
BETONG,SARAWAK,2024,2998,3231,2024,20300,28600,-17302,Kurang Penawaran,25602
BINTULU,SARAWAK,2024,22487,24181,2024,63300,70800,-40813,Kurang Penawaran,48313
KAPIT,SARAWAK,2024,1161,1357,2024,20700,30000,-19539,Kurang Penawaran,28839
KUCHING,SARAWAK,2024,124769,136731,2024,173900,234700,-49131,Kurang Penawaran,109931
LIMBANG,SARAWAK,2024,3776,3838,2024,20900,26600,-17124,Kurang Penawaran,22824
MIRI,SARAWAK,2024,47539,49151,2024,92500,126400,-44961,Kurang Penawaran,78861
MUKAH,SARAWAK,2024,2156,2580,2024,34100,42100,-31944,Kurang Penawaran,39944
SAMARAHAN,SARAWAK,2024,31249,35605,2024,70200,77000,-38951,Kurang Penawaran,45751
SARIKEI,SARAWAK,2024,8268,8890,2024,23900,37800,-15632,Kurang Penawaran,29532
SERIAN,SARAWAK,2024,5043,5922,2024,29600,43700,-24557,Kurang Penawaran,38657
SIBU,SARAWAK,2024,40959,42481,2024,87500,119800,-46541,Kurang Penawaran,78841
SRI AMAN,SARAWAK,2024,5905,6022,2024,19500,28400,-13595,Kurang Penawaran,22495`;

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
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (textOverride?: string) => {
    const messageToSend = textOverride || input;
    if (!messageToSend.trim() || isLoading) return;
    
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: messageToSend }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const systemInstruction = `Anda ialah JOMRUMAHBOT, pakar analitik perumahan Malaysia yang pintar dan mesra pengguna.
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

Data CSV Anda:
${RAW_CSV_DATA}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: messageToSend,
        config: { systemInstruction, temperature: 0.2 }
      });
      
      setMessages(prev => [...prev, { role: 'assistant', content: response.text || "Maaf, sistem JOMRUMAHBOT sedang sibuk. Sila cuba sebentar lagi." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Ralat sambungan dikesan. Sila pastikan sambungan internet anda stabil." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.trim().startsWith('|')) {
        return (
          <div key={i} className="my-4 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 shadow-sm transition-all hover:shadow-md">
            <div className="min-w-full font-mono text-[11px] md:text-xs whitespace-pre p-4 text-slate-700 leading-relaxed tracking-tight">
              {line}
            </div>
          </div>
        );
      }
      
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={i} className="mb-3 text-[14px] md:text-[15px] leading-relaxed text-slate-700 font-medium">
          {parts.map((part, j) => (part.startsWith('**') && part.endsWith('**')) 
            ? <span key={j} className="text-indigo-700 font-black bg-indigo-50 px-1 rounded-sm">{part.slice(2, -2)}</span> 
            : part)}
        </p>
      );
    });
  };

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
            <h1 className="text-lg font-black tracking-tight text-slate-900 leading-tight">JOMRUMAHBOT</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Live Data Intelligence
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              setMessages([{ role: 'assistant', content: 'Hai! Saya JOMRUMAHBOT 🤖 Sila tanya apa-apa tentang data perumahan.' }]);
            }} 
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
            title="Sembang Baru"
          >
            <RefreshCcw className="w-5 h-5" />
          </button>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full">
            <Zap className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-[10px] font-bold text-indigo-700 uppercase">Premium Access</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-slate-50/30">
        <div 
          ref={chatScrollRef} 
          className="flex-1 overflow-y-auto custom-scrollbar px-4 md:px-12 py-10 space-y-10"
        >
          {messages.map((m, idx) => (
            <div 
              key={idx} 
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
            >
              <div className={`flex gap-4 max-w-[95%] md:max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border ${
                  m.role === 'user' 
                  ? 'bg-slate-900 border-slate-800 text-white' 
                  : 'bg-white border-slate-200 text-indigo-600'
                }`}>
                  {m.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>

                {/* Content Bubble */}
                <div className={`relative px-5 py-4 rounded-3xl shadow-sm border transition-all ${
                  m.role === 'user' 
                  ? 'bg-white text-slate-800 border-slate-200 rounded-tr-none' 
                  : 'bg-indigo-600 text-white border-transparent rounded-tl-none shadow-indigo-100'
                }`}>
                  <div className={`${m.role === 'assistant' ? 'text-white' : 'text-slate-800'}`}>
                    {m.role === 'assistant' 
                      ? renderAssistantContent(m.content)
                      : renderContent(m.content)
                    }
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Quick Actions - Inside the scroll area, specifically after the last bot response */}
          {!isLoading && messages.length > 1 && messages[messages.length - 1].role === 'assistant' && (
            <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-700 [animation-delay:200ms]">
               <div className="ml-14 max-w-4xl">
                  <div className="flex items-center gap-2 mb-3">
                     <Sparkles className="w-4 h-4 text-indigo-500" />
                     <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Tindakan Seterusnya</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                     {[
                       { label: "Analisis Petaling", query: "Berapa status perumahan di Petaling?", icon: <MapPin className="w-3.5 h-3.5" />, color: "indigo" },
                       { label: "Status KL", query: "Bagaimana status perumahan di W.P Kuala Lumpur?", icon: <Building2 className="w-3.5 h-3.5" />, color: "violet" },
                       { label: "Analisis Johor", query: "Berikan analisis perumahan untuk Johor Bahru.", icon: <Home className="w-3.5 h-3.5" />, color: "blue" },
                       { label: "Rumah Setinggan", query: "Daerah mana yang mempunyai jumlah perumahan tidak formal tertinggi?", icon: <AlertTriangle className="w-3.5 h-3.5" />, color: "orange" },
                       { label: "Defisit Kritikal", query: "Senaraikan 5 daerah dengan kekurangan perumahan paling kritikal.", icon: <TrendingUp className="w-3.5 h-3.5" />, color: "rose" },
                       { label: "Kecukupan Data", query: "Apakah daerah yang mempunyai lebihan penawaran perumahan?", icon: <PieChart className="w-3.5 h-3.5" />, color: "emerald" },
                       { label: "KL vs Selangor", query: "Bandingkan kecukupan perumahan antara Kuala Lumpur dan Selangor.", icon: <ArrowRight className="w-3.5 h-3.5" />, color: "slate" },
                       { label: "Trend Sabah", query: "Bagaimana status perumahan di Kota Kinabalu, Sabah?", icon: <MapPin className="w-3.5 h-3.5" />, color: "indigo" }
                     ].map((action, i) => (
                       <button 
                         key={i}
                         onClick={() => handleSendMessage(action.query)}
                         className="flex items-center gap-2 px-3 py-2.5 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl transition-all shadow-sm active:scale-95 group text-left"
                       >
                         <div className={`p-1.5 rounded-lg bg-${action.color}-50 text-${action.color}-600 group-hover:scale-110 transition-transform`}>
                           {action.icon}
                         </div>
                         <span className="text-[12px] font-bold text-slate-600 truncate">{action.label}</span>
                       </button>
                     ))}
                  </div>
               </div>
            </div>
          )}

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

        {/* Interaction Area */}
        <div className="p-6 md:p-10 bg-gradient-to-t from-white via-white/95 to-transparent relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Premium Input Field */}
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
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Tanya JOMRUMAHBOT... (cth: Status perumahan di Gombak?)"
                  className="flex-1 bg-transparent border-none outline-none py-3 px-2 text-[15px] font-medium text-slate-700 placeholder:text-slate-400"
                  disabled={isLoading}
                />
                <button 
                  onClick={() => handleSendMessage()}
                  disabled={isLoading || !input.trim()}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg ${
                    isLoading || !input.trim()
                    ? 'bg-slate-100 text-slate-300'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 active:scale-90 hover:scale-105'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <p className="text-center mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
              <Sparkles className="w-3 h-3 text-indigo-400" /> Powered by JOMRUMAH Intelligence • Versi 2.0.1
            </p>
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        
        /* Inline helper colors for dynamic icons */
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

// Custom Assistant Content Renderer for Indigo Bubbles
const renderAssistantContent = (content: string) => {
  return content.split('\n').map((line, i) => {
    if (line.trim().startsWith('|')) {
      return (
        <div key={i} className="my-3 overflow-x-auto rounded-xl border border-white/20 bg-white/10 shadow-inner">
          <div className="min-w-full font-mono text-[11px] md:text-xs whitespace-pre p-3 text-white leading-relaxed">
            {line}
          </div>
        </div>
      );
    }
    
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return (
      <p key={i} className="mb-3 text-[14px] md:text-[15px] leading-relaxed text-indigo-50 font-medium">
        {parts.map((part, j) => (part.startsWith('**') && part.endsWith('**')) 
          ? <span key={j} className="text-white font-black bg-white/20 px-1 rounded-sm">{part.slice(2, -2)}</span> 
          : part)}
      </p>
    );
  });
};

export default App;
