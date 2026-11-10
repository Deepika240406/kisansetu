import React from 'react';
import { ShieldCheck, FileCheck, PhoneCall, HeartHandshake, ArrowRight, Volume2 } from 'lucide-react';

const SCHEMES = [
  {
    code: "pm_kisan",
    name: "PM-KISAN Samman Nidhi",
    benefit: "₹6,000 per year in 3 direct DBT installments of ₹2,000.",
    eligibility: "All landholding farmer families across India with cultivable land.",
    helpline: "155261 / 1800-115-526",
    voicePrompt: "प्रधानमंत्री किसान सम्मान निधि योजना के बारे में विस्तार से बताएं और किस्त का स्टेटस कैसे चेक करें?"
  },
  {
    code: "pmfby",
    name: "Pradhan Mantri Fasal Bima (PMFBY)",
    benefit: "Comprehensive insurance against drought, floods, pests and unseasonal rain.",
    eligibility: "Farmers growing notified crops in notified districts.",
    helpline: "1800-180-1551",
    voicePrompt: "प्रधानमंत्री फसल बीमा योजना के तहत क्लेम कैसे करें और कितना प्रीमियम देना होता है?"
  },
  {
    code: "kcc",
    name: "Kisan Credit Card (KCC)",
    benefit: "Subsidized farm credit up to ₹3,00,000 at 4% effective interest rate.",
    eligibility: "Owner cultivators, tenant farmers, and Self Help Groups.",
    helpline: "1800-11-22-11",
    voicePrompt: "किसान क्रेडिट कार्ड योजना से ₹3 लाख का लोन 4% ब्याज पर कैसे प्राप्त करें?"
  },
  {
    code: "soil_health",
    name: "Soil Health Card (मृदा स्वास्थ्य)",
    benefit: "Free 12-parameter soil nutrient lab testing every 2 years.",
    eligibility: "All farmers in notified Gram Panchayats.",
    helpline: "Kisan Call Center: 1800-180-1551",
    voicePrompt: "मृदा स्वास्थ्य कार्ड से मिट्टी की जांच कैसे करवाएं और खाद का खर्च कैसे बचाएं?"
  }
];

export default function SchemeNavigator({ onAskSchemeVoice }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-stone-200">
      <div className="flex items-center gap-2 mb-2">
        <span className="p-1.5 rounded-lg bg-orange-100 text-orange-600">
          <ShieldCheck className="w-5 h-5" />
        </span>
        <h2 className="text-2xl font-bold text-stone-900">
          Government Welfare Schemes & MSP Support
        </h2>
      </div>
      <p className="text-xs text-stone-500 mb-6">
        Voice-enabled assistance for national agricultural schemes and direct bank transfers • <strong>Click any scheme card to hear full voice explanation</strong>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {SCHEMES.map((scheme, idx) => (
          <div 
            key={idx} 
            onClick={() => onAskSchemeVoice && onAskSchemeVoice(scheme)}
            className="bg-white rounded-2xl border border-stone-200 hover:border-orange-400 p-4 shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <h3 className="font-bold text-sm text-stone-900 group-hover:text-orange-600 transition">
                  {scheme.name}
                </h3>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed mb-3">
                {scheme.benefit}
              </p>
              <div className="text-[11px] text-stone-500 mb-3 bg-stone-50 group-hover:bg-orange-50/40 p-2.5 rounded-xl border border-stone-100 transition">
                <span className="font-semibold text-stone-700 block mb-0.5">Eligibility:</span>
                {scheme.eligibility}
              </div>
            </div>

            <div>
              <div className="text-[11px] text-stone-500 flex items-center gap-1.5 mb-3">
                <PhoneCall className="w-3.5 h-3.5 text-stone-400" />
                <span className="font-medium">Helpline: {scheme.helpline}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAskSchemeVoice && onAskSchemeVoice(scheme);
                }}
                className="w-full py-2.5 px-3 bg-stone-100 group-hover:bg-orange-600 group-hover:text-white text-stone-800 text-xs font-bold rounded-xl transition border border-stone-200 group-hover:border-transparent flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Volume2 className="w-3.5 h-3.5 text-orange-600 group-hover:text-white" />
                <span>Hear Voice Explanation →</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
