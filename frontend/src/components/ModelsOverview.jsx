import React from 'react';
import { Cpu, Volume2, Mic, CheckCircle2, Shield, Radio, Sparkles } from 'lucide-react';

export default function ModelsOverview() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-stone-200">
      
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-xs font-bold text-bharat-saffron uppercase tracking-widest block mb-1">
          Sovereign AI Infrastructure
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
          The 3 Pillars of Gnani AI Powering KisanSetu
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-2">
          Engineered with sovereign Indian speech models and Indic reasoning architecture for rural Bharat
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Model 1: Prisma v3.0 */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-bharat-saffron flex items-center justify-center mb-4">
              <Mic className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">Speech to Text</span>
            <h3 className="text-xl font-bold text-stone-900 mb-2">Gnani Prisma v3.0</h3>
            <p className="text-xs text-stone-600 leading-relaxed mb-4">
              Trained on <strong>14M+ hours</strong> of telephonic audio. Streams transcriptions in under 200ms across 10+ Indian languages plus Hinglish, Tanglish, and Benglish natively.
            </p>
          </div>
          <div className="pt-4 border-t border-stone-100 space-y-1.5 text-xs text-stone-600">
            <div className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Real telephony 8kHz resilience</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sub-200ms real-time streaming</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Auto language & code-mix detection</span>
            </div>
          </div>
        </div>

        {/* Model 2: Evon v3.3 */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">Reasoning & Diagnostics</span>
            <h3 className="text-xl font-bold text-stone-900 mb-2">Gnani Evon v3.3 (30B)</h3>
            <p className="text-xs text-stone-600 leading-relaxed mb-4">
              A <strong>30B-parameter Mixture-of-Experts (MoE)</strong> model with 128K context window. Natively reasons in 11 Indian languages with deep contextual agricultural & enterprise knowledge.
            </p>
          </div>
          <div className="pt-4 border-t border-stone-100 space-y-1.5 text-xs text-stone-600">
            <div className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>128K Indic context window</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>APMC Mandi pricing & crop doctor</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Open-weight Apache 2.0 architecture</span>
            </div>
          </div>
        </div>

        {/* Model 3: Timbre v3.0 */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
              <Volume2 className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">Text to Speech</span>
            <h3 className="text-xl font-bold text-stone-900 mb-2">Gnani Timbre v3.0</h3>
            <p className="text-xs text-stone-600 leading-relaxed mb-4">
              Speaks 10+ Indic languages with authentic context-aware prosody, native pronunciation of Indian names, numerals, and <strong>lakh and crore</strong> cadence.
            </p>
          </div>
          <div className="pt-4 border-t border-stone-100 space-y-1.5 text-xs text-stone-600">
            <div className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Lakh & crore numeral cadence</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Context-aware emotion & prosody</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Streaming WebSocket & SSE audio</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
