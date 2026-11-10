import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Award, Video, Share2, Sparkles } from 'lucide-react';

export default function SubmissionGuideModal({ isOpen, onClose }) {
  const [copiedKey, setCopiedKey] = useState(null);

  if (!isOpen) return null;

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const socialPostCopy = `🚀 Proud to introduce KisanSetu AI (किसानसेतु) — Built for the #GreatIndianAIInternshipChallenge by @GnaniAi! 🇮🇳

KisanSetu AI is a sovereign multilingual voice operating desk built natively on Gnani AI's proprietary speech & reasoning stack:
✨ Speech-to-Text: Gnani Prisma v3.0 (Streaming under 200ms with code-mixing & 8kHz telephony noise cancellation)
🧠 Reasoning: Gnani Evon v3.3 (30B MoE Indic reasoning for APMC Mandi rates & crop diagnostics)
🔊 Text-to-Speech: Gnani Timbre v3.0 (Indic prosody with lakh & crore numerals)

🌾 Built to solve real Bharat problems for farmers and rural kirana stores across Hindi, Kannada, Telugu, Tamil, Marathi & Hinglish.

Watch our 60-second live demo below! 👇
#GnaniAI #GreatIndianAIInternshipChallenge #SovereignAI #BuildForIndia #AIforBharat`;

  const videoScript = `[0:00 - 0:10] Hook: "Rural India doesn't interact through keyboards — they communicate through voice and telephony calls with heavy tractor and field noise. Meet KisanSetu AI."
[0:10 - 0:25] Demo 1 (Prisma STT + Evon): Speak in Kannada or Hindi: "What is today's tomato modal price in Kolar Mandi?" Show instant 200ms transcription on Prisma v3.0 and Evon's structured Mandi price card.
[0:25 - 0:40] Demo 2 (Timbre TTS + Crop Doctor): Ask about yellow leaf symptoms. Watch Evon diagnose leaf blight and Timbre v3.0 speak the remedy with natural Indic prosody.
[0:40 - 0:50] Demo 3 (Noise Lab): Turn on 8kHz Telephony Noise Simulation and demonstrate how Gnani Prisma transcribes noisy phone calls where standard models fail.
[0:50 - 1:00] Conclusion: "Built on Gnani's Sovereign Stack for the Great Indian AI Internship Challenge. Powering India's 140 million farming families."`;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative my-8 animate-in fade-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1 rounded bg-orange-100 text-bharat-saffron">
            <Award className="w-5 h-5" />
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900">
            Hackathon Submission Kit & Demo Pitch
          </h2>
        </div>
        <p className="text-xs text-stone-500 mb-6">
          Everything required to submit and win the <strong>Great Indian AI Internship Challenge</strong> before Nov 10, 11:59 PM IST.
        </p>

        <div className="space-y-6">
          
          {/* Section 1: Ready-to-Post LinkedIn & X Draft */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-bharat-saffron" />
                1. LinkedIn & X (Twitter) Post Copy
              </span>
              <button
                onClick={() => copyToClipboard(socialPostCopy, 'social')}
                className="flex items-center gap-1 text-xs font-bold text-bharat-saffron hover:underline"
              >
                {copiedKey === 'social' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Post Text</span>
                  </>
                )}
              </button>
            </div>
            <pre className="text-xs text-stone-700 bg-white p-3 rounded-xl border border-stone-200 whitespace-pre-wrap font-sans leading-relaxed max-h-48 overflow-y-auto">
              {socialPostCopy}
            </pre>
            <p className="text-[11px] text-stone-500 mt-2">
              ⚠️ Remember to nominate your live post link in the official Google/Submission form!
            </p>
          </div>

          {/* Section 2: 60-Second Video Demo Script */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                <Video className="w-4 h-4 text-emerald-600" />
                2. 60-Second Video Demo Script (Targeting Demo Day Drop Award)
              </span>
              <button
                onClick={() => copyToClipboard(videoScript, 'script')}
                className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
              >
                {copiedKey === 'script' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Script</span>
                  </>
                )}
              </button>
            </div>
            <pre className="text-xs text-stone-700 bg-white p-3 rounded-xl border border-stone-200 whitespace-pre-wrap font-mono leading-relaxed max-h-44 overflow-y-auto">
              {videoScript}
            </pre>
          </div>

          {/* Section 3: Official Links & Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <a
              href="https://app.gnani.ai/voice"
              target="_blank"
              rel="noreferrer"
              className="p-3 bg-white border border-stone-200 rounded-xl flex items-center justify-between hover:border-bharat-saffron transition group"
            >
              <div>
                <span className="text-xs font-bold text-stone-900 group-hover:text-bharat-saffron block">
                  Gnani Developer Console
                </span>
                <span className="text-[11px] text-stone-500">Claim 5,000 API credits & keys</span>
              </div>
              <ExternalLink className="w-4 h-4 text-stone-400 group-hover:text-bharat-saffron" />
            </a>

            <a
              href="https://docs.gnani.ai"
              target="_blank"
              rel="noreferrer"
              className="p-3 bg-white border border-stone-200 rounded-xl flex items-center justify-between hover:border-bharat-saffron transition group"
            >
              <div>
                <span className="text-xs font-bold text-stone-900 group-hover:text-bharat-saffron block">
                  Gnani API Documentation
                </span>
                <span className="text-[11px] text-stone-500">Prisma STT & Timbre reference</span>
              </div>
              <ExternalLink className="w-4 h-4 text-stone-400 group-hover:text-bharat-saffron" />
            </a>
          </div>

        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition"
          >
            Got it, Let's Build!
          </button>
        </div>

      </div>
    </div>
  );
}
