import React from 'react';
import { Sparkles, Mic, Award, TrendingUp, Radio, Languages, CheckCircle2 } from 'lucide-react';

export default function HeroSection({ onStartVoice, onOpenNoiseLab }) {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 bg-gradient-to-b from-amber-50/60 via-stone-50 to-stone-100 border-b border-stone-200">
      
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-72 bg-gradient-to-r from-orange-200/40 via-amber-200/30 to-emerald-200/30 blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Agriculture Intelligence Portal Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2.5 bg-white border border-stone-300 shadow-sm rounded-full py-1.5 px-4 text-xs sm:text-sm font-medium text-stone-800">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
            </span>
            <span className="font-semibold text-stone-800">Sovereign Bharat Agriculture Intelligence Desk</span>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">
              Live Indic Voice
            </span>
          </div>
        </div>

        {/* Hero Title */}
        <div className="text-center max-w-4xl mx-auto mb-8">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-tight">
            Sovereign Voice Intelligence <br />
            <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-700 bg-clip-text text-transparent">
              Built for Bharat's Farmers & Mandis
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Speak in <strong>Hindi, Kannada, Telugu, Tamil, Marathi, Bengali or Hinglish</strong>. Real-time APMC Mandi rates, crop disease diagnosis, government welfare schemes, and 8kHz rural telephony noise filtering.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10">
          <button
            onClick={onStartVoice}
            className="flex items-center gap-2.5 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold px-6 py-3.5 rounded-xl text-sm sm:text-base shadow-lg shadow-orange-500/30 transition transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Mic className="w-5 h-5 text-white" />
            <span className="text-white font-bold">Launch Voice Assistant</span>
          </button>
          
          <button
            onClick={onOpenNoiseLab}
            className="flex items-center gap-2 bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 px-5 py-3.5 rounded-xl font-semibold text-sm sm:text-base shadow-sm transition hover:border-stone-400"
          >
            <Radio className="w-5 h-5 text-emerald-600" />
            <span>Telephony Noise Lab (8kHz)</span>
          </button>
        </div>

        {/* Target Challenge Awards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur border border-stone-200 p-3.5 rounded-xl text-center shadow-xs">
            <span className="text-xs font-semibold text-stone-500 block uppercase tracking-wider mb-1">Target Award 01</span>
            <div className="font-bold text-sm sm:text-base text-stone-900">Main Character</div>
            <p className="text-xs text-stone-500 mt-0.5">Indic Regional Speech</p>
          </div>
          <div className="bg-white/80 backdrop-blur border border-stone-200 p-3.5 rounded-xl text-center shadow-xs">
            <span className="text-xs font-semibold text-stone-500 block uppercase tracking-wider mb-1">Target Award 02</span>
            <div className="font-bold text-sm sm:text-base text-stone-900">Mixed Vibes</div>
            <p className="text-xs text-stone-500 mt-0.5">Hinglish Code-Mixing</p>
          </div>
          <div className="bg-white/80 backdrop-blur border border-stone-200 p-3.5 rounded-xl text-center shadow-xs">
            <span className="text-xs font-semibold text-stone-500 block uppercase tracking-wider mb-1">Target Award 03</span>
            <div className="font-bold text-sm sm:text-base text-stone-900">Real Deal</div>
            <p className="text-xs text-stone-500 mt-0.5">Farmer & APMC Mandi</p>
          </div>
          <div className="bg-white/80 backdrop-blur border border-stone-200 p-3.5 rounded-xl text-center shadow-xs">
            <span className="text-xs font-semibold text-stone-500 block uppercase tracking-wider mb-1">Target Award 04</span>
            <div className="font-bold text-sm sm:text-base text-stone-900">Noise Canceller</div>
            <p className="text-xs text-stone-500 mt-0.5">8kHz Telephony Audio</p>
          </div>
        </div>

      </div>
    </section>
  );
}
