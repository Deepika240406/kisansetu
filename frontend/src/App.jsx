import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import VoiceDesk from './components/VoiceDesk';
import MandiTicker from './components/MandiTicker';
import NoiseLab from './components/NoiseLab';
import SchemeNavigator from './components/SchemeNavigator';
import ModelsOverview from './components/ModelsOverview';
import { checkHealth } from './services/api';
import { Heart, Volume2, Shield, ArrowUp } from 'lucide-react';

export default function App() {
  const [health, setHealth] = useState(null);
  const voiceDeskRef = useRef(null);

  useEffect(() => {
    loadHealth();
  }, []);

  const loadHealth = async () => {
    const data = await checkHealth();
    setHealth(data);
  };

  const scrollToVoiceDesk = () => {
    if (voiceDeskRef.current) {
      voiceDeskRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToNoiseLab = () => {
    const el = document.getElementById('noise-lab');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const [externalTrigger, setExternalTrigger] = useState(null);

  const handleSelectCropForVoice = (item) => {
    scrollToVoiceDesk();
    let prompt = "";
    let lang = "hi-IN";

    if (item.crop_key === "tomato" || item.state === "Karnataka") {
      prompt = "ಕೋಲಾರ ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಟೊಮೇಟೊ ಬೆಲೆ ಎಷ್ಟು ಇದೆ?";
      lang = "kn-IN";
    } else if (item.crop_key === "cotton" || item.state === "Telangana") {
      prompt = "వరంగల్ మార్కెట్‌లో పత్తి ప్రస్తుత ధర ఎంత ఉంది?";
      lang = "te-IN";
    } else if (item.crop_key === "onion") {
      prompt = "आज लासलगाव नासिक मंडी में प्याज का क्या भाव चल रहा है?";
      lang = "hi-IN";
    } else if (item.crop_key === "wheat") {
      prompt = "आज खन्ना मंडी में गेहूं का क्या भाव चल रहा है और क्या हमें अभी बेचना चाहिए?";
      lang = "hi-IN";
    } else if (item.crop_key === "soybean") {
      prompt = "आज इंदौर मंडी में सोयाबीन का क्या भाव चल रहा है?";
      lang = "hi-IN";
    } else if (item.crop_key === "mustard") {
      prompt = "आज भरतपुर मंडी में सरसों का ताजा भाव क्या है?";
      lang = "hi-IN";
    } else if (item.crop_key === "paddy") {
      prompt = "आज करनाल अनाज मंडी में बासमती धान का क्या भाव चल रहा है?";
      lang = "hi-IN";
    } else if (item.crop_key === "potato") {
      prompt = "आज आगरा मंडी में आलू का क्या भाव चल रहा है?";
      lang = "hi-IN";
    } else {
      prompt = `आज ${item.market} में ${item.crop} का क्या भाव चल रहा है?`;
      lang = "hi-IN";
    }

    setExternalTrigger({
      text: prompt,
      lang: lang,
      cropName: item.crop,
      timestamp: Date.now()
    });
  };

  const handleAskSchemeVoice = (scheme) => {
    scrollToVoiceDesk();
    const prompt = typeof scheme === 'string' ? scheme : scheme.voicePrompt;
    const name = typeof scheme === 'string' ? 'Welfare Scheme' : scheme.name;
    setExternalTrigger({
      text: prompt,
      lang: "hi-IN",
      schemeName: name,
      timestamp: Date.now()
    });
  };

  return (
    <div className="min-h-screen bg-bharat-sand text-stone-900 flex flex-col selection:bg-orange-200">
      
      {/* Navigation */}
      <Navbar 
        health={health} 
        onKeyUpdated={loadHealth} 
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Banner */}
        <HeroSection 
          onStartVoice={scrollToVoiceDesk}
          onOpenNoiseLab={scrollToNoiseLab}
        />

        {/* Core Interactive Voice Assistant */}
        <VoiceDesk voiceDeskRef={voiceDeskRef} externalTrigger={externalTrigger} />

        {/* Live APMC Mandi Prices Desk */}
        <MandiTicker onSelectCropForVoice={handleSelectCropForVoice} />

        {/* 8kHz Telephony Noise Canceller Lab (Targeting Award 04) */}
        <NoiseLab />

        {/* Government Welfare Schemes */}
        <SchemeNavigator onAskSchemeVoice={handleAskSchemeVoice} />

        {/* Models Overview: Prisma, Timbre & Evon */}
        <ModelsOverview />
      </main>

      {/* Footer */}
      <footer className="bg-stone-950 text-stone-400 py-12 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-stone-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-bharat-saffron flex items-center justify-center text-white font-bold">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-lg text-white">KisanSetu <span className="text-bharat-saffron">AI</span></span>
                <p className="text-xs text-stone-500">Sovereign Indian Multilingual AI Voice Desk</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-stone-400">
              <a href="https://www.gnani.ai/internship" target="_blank" rel="noreferrer" className="hover:text-white transition">
                Gnani AI Challenge 2026
              </a>
              <a href="https://docs.gnani.ai" target="_blank" rel="noreferrer" className="hover:text-white transition">
                Developer API Docs
              </a>
              <a href="https://app.gnani.ai/voice" target="_blank" rel="noreferrer" className="hover:text-white transition">
                API Dashboard
              </a>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
            <div>
              Built with ❤️ on <strong>Gnani Prisma v3.0</strong>, <strong>Timbre v3.0</strong> & <strong>Evon v3.3</strong>.
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>100% Sovereign Indic Architecture</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
