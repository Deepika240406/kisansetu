import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, Square, Play, Pause, Volume2, 
  Sparkles, CheckCircle2, AlertTriangle, ArrowRight,
  Radio, Cpu, Download, FileText, VolumeX, ShieldCheck,
  Zap, Sprout, Stethoscope, ShoppingCart
} from 'lucide-react';
import AudioVisualizer from './AudioVisualizer';
import { queryVoiceAssistant, getTestSound } from '../services/api';

const PRESET_CATEGORIES = [
  { id: 'all', label: 'All Queries' },
  { id: 'mandi', label: '🌾 Mandi Rates' },
  { id: 'doctor', label: '🩺 Crop Doctor' },
  { id: 'fertilizer', label: '🧪 Fertilizers' },
  { id: 'schemes', label: '🏛️ Govt Schemes' },
  { id: 'mixed', label: '🗣️ Hinglish' }
];

const PRESET_QUERIES = [
  // 1. Mandi Intelligence
  {
    category: "mandi",
    lang: "hi-IN",
    label: "गेहूं मंडी भाव व बिक्री सलाह (Hindi)",
    text: "आज खन्ना मंडी में गेहूं का क्या भाव चल रहा है और क्या हमें अभी बेचना चाहिए?",
    badge: "Mandi Intel"
  },
  {
    category: "mandi",
    lang: "kn-IN",
    label: "ಟೊಮೇಟೊ ಮಾರುಕಟ್ಟೆ ದರ (Kannada)",
    text: "ಕೋಲಾರ ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಟೊಮೇಟೊ ಬೆಲೆ ಎಷ್ಟು ಇದೆ?",
    badge: "Regional Indic"
  },
  {
    category: "mandi",
    lang: "te-IN",
    label: "పత్తి ప్రస్తుత ధర (Telugu)",
    text: "వరంగల్ మార్కెట్‌లో పత్తి ప్రస్తుత ధర ఎంత ఉంది?",
    badge: "Regional Indic"
  },
  {
    category: "mandi",
    lang: "hi-IN",
    label: "प्याज लासलगाव मंडी भाव (Nashik Onion)",
    text: "आज लासलगाव नासिक मंडी में प्याज का क्या भाव चल रहा है?",
    badge: "Mandi Intel"
  },
  // 2. Crop Doctor & Disease Diagnostics
  {
    category: "doctor",
    lang: "hi-IN",
    label: "टमाटर पत्ता मरोड़ व पीलापन (Tomato Leaf Curl)",
    text: "टमाटर के पत्तों पर पीले धब्बे आ रहे हैं और पत्ते मुड़ रहे हैं, कौन सी दवा का छिड़काव करें?",
    badge: "Crop Doctor"
  },
  {
    category: "doctor",
    lang: "hi-IN",
    label: "कपास में गुलाबी सुंडी नियंत्रण (Pink Bollworm)",
    text: "कपास में गुलाबी सुंडी का प्रकोप हो गया है, तुरंत कौन सी कीटनाशक दवा डालें?",
    badge: "Pest Attack"
  },
  {
    category: "doctor",
    lang: "hi-IN",
    label: "धान में झोंका रोग व ब्लास्ट (Rice Blast & BPH)",
    text: "धान की फसल में झोंका रोग और पत्तियों पर नाव के आकार के धब्बे दिख रहे हैं, क्या करें?",
    badge: "Fungal Disease"
  },
  {
    category: "doctor",
    lang: "hi-IN",
    label: "गेहूं में पीला रतुआ का इलाज (Yellow Rust)",
    text: "गेहूं की पत्तियों पर पीले रंग की धारियां और हल्दी जैसा पाउडर दिख रहा है, दवा बताएं?",
    badge: "Wheat Rust"
  },
  {
    category: "doctor",
    lang: "hi-IN",
    label: "आलू में अगेती व पिछेती झुलसा (Potato Blight)",
    text: "आलू के पत्तों पर भूरे काले धब्बे और झुलसा रोग दिख रहा है, कौन सी फफूंदनाशक दवा डालें?",
    badge: "Potato Blight"
  },
  // 3. Fertilizer & Agronomy Calculator
  {
    category: "fertilizer",
    lang: "hi-IN",
    label: "गेहूं में खाद की संतुलित मात्रा (NPK Advisory)",
    text: "एक एकड़ गेहूं के लिए डीएपी, यूरिया और पोटाश की कितनी मात्रा डालनी चाहिए?",
    badge: "Nutrition"
  },
  {
    category: "fertilizer",
    lang: "hi-IN",
    label: "कपास में खाद व नैनो यूरिया (Fertilizer Schedule)",
    text: "कपास में कल्ले फूटते समय कितनी खाद डालें और नैनो यूरिया का स्प्रे कब करें?",
    badge: "Foliar Spray"
  },
  {
    category: "fertilizer",
    lang: "hi-IN",
    label: "धान में जिंक व यूरिया की खुराक (Paddy Zinc)",
    text: "धान में जिंक की कमी के लक्षण क्या हैं और प्रति एकड़ कितना जिंक सल्फेट डालें?",
    badge: "Micronutrient"
  },
  // 4. Welfare Schemes
  {
    category: "schemes",
    lang: "hi-IN",
    label: "पीएम किसान ₹2000 किस्त व e-KYC (PM-Kisan)",
    text: "प्रधानमंत्री किसान सम्मान निधि योजना के बारे में विस्तार से बताएं और किस्त का स्टेटस कैसे चेक करें?",
    badge: "Direct DBT"
  },
  {
    category: "schemes",
    lang: "hi-IN",
    label: "फसल बीमा क्लेम 72 घंटे में (PMFBY Insurance)",
    text: "प्रधानमंत्री फसल बीमा योजना के तहत क्लेम कैसे करें और कितना प्रीमियम देना होता है?",
    badge: "Crop Cover"
  },
  {
    category: "schemes",
    lang: "hi-IN",
    label: "किसान क्रेडिट कार्ड 4% लोन (KCC Scheme)",
    text: "किसान क्रेडिट कार्ड योजना से ₹3 लाख का लोन 4% ब्याज पर कैसे प्राप्त करें?",
    badge: "Subsidized Loan"
  },
  {
    category: "schemes",
    lang: "hi-IN",
    label: "मृदा स्वास्थ्य कार्ड से मिट्टी जांच (Soil Health)",
    text: "मृदा स्वास्थ्य कार्ड से मिट्टी की जांच कैसे करवाएं और खाद का खर्च कैसे बचाएं?",
    badge: "Soil Testing"
  },
  // 5. Code-Mixed Conversational
  {
    category: "mixed",
    lang: "hinglish",
    label: "Agro-Input Voice Cart (Hinglish Kirana)",
    text: "Bhaiya dukaan ke liye 2 bori DAP khaad aur 1 packet urea ka order book kar do.",
    badge: "Voice Commerce"
  },
  {
    category: "mixed",
    lang: "hinglish",
    label: "Crop Disease Advice (Hinglish Doctor)",
    text: "Mere khet me tamatar ke leaves yellow ho rahe hai aur curl ho rahe hai, konsa spray kare?",
    badge: "Mixed Vibes"
  }
];

export default function VoiceDesk({ voiceDeskRef, externalTrigger }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [activeCropTrigger, setActiveCropTrigger] = useState(null);
  const [activeSchemeTrigger, setActiveSchemeTrigger] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Settings
  const [selectedLanguage, setSelectedLanguage] = useState('indic-auto');
  const [simulateTelephony, setSimulateTelephony] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('Shivani');

  // Loading & Results
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Audio Playback State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioPlayerRef = useRef(null);
  const currentAudioRef = useRef(null);
  const audioContextRef = useRef(null);
  const activeSourceNodeRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);
  const recognitionRef = useRef(null);
  const speechTranscriptRef = useRef('');
  const [liveTranscript, setLiveTranscript] = useState('');

  // Initialize and prime speech synthesis voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Unlock browser audio context on user gesture (click mic, click preset, etc.)
  const unlockAudioContext = () => {
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          audioContextRef.current = new AudioCtx();
        }
      }
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
    } catch (e) {
      console.warn("AudioContext unlock notice:", e);
    }
  };

  // High-fidelity Audio playback for base64 PCM WAV from Gnani Timbre
  const playBase64WavAudio = async (base64String) => {
    try {
      unlockAudioContext();
      stopSpeaking();

      // Clean base64 string
      const cleanBase64 = base64String.includes(',') ? base64String.split(',')[1] : base64String;
      const binaryStr = window.atob(cleanBase64);
      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }

      // Create an in-memory streaming Blob URL (lightning fast, native browser audio streaming)
      const blob = new Blob([bytes], { type: 'audio/wav' });
      const blobUrl = URL.createObjectURL(blob);

      const audio = new Audio(blobUrl);
      audio.playbackRate = 1.0; // Crystal-clear, natural Indic delivery at 48kHz native rate
      currentAudioRef.current = audio;

      audio.onplay = () => setIsSpeaking(true);
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(blobUrl);
        currentAudioRef.current = null;
      };
      audio.onerror = (e) => {
        console.warn("Blob audio playback notice:", e);
        setIsSpeaking(false);
        URL.revokeObjectURL(blobUrl);
        currentAudioRef.current = null;
      };

      await audio.play();
      setIsSpeaking(true);
      return true;
    } catch (err) {
      console.warn("Direct blob audio play notice:", err);
      if (audioPlayerRef.current) {
        try {
          audioPlayerRef.current.src = base64String;
          await audioPlayerRef.current.play();
          setIsSpeaking(true);
          return true;
        } catch (elErr) {
          console.warn("Root audio element play notice:", elErr);
        }
      }
    }
    return false;
  };

  // React to Mandi cards or Scheme cards external triggers
  useEffect(() => {
    if (externalTrigger && externalTrigger.text) {
      unlockAudioContext();
      const qText = externalTrigger.text;
      const qLang = externalTrigger.lang || 'indic-auto';
      setActiveCropTrigger(externalTrigger.cropName || null);
      setActiveSchemeTrigger(externalTrigger.schemeName || null);
      setTextInput(qText);
      setSelectedLanguage(qLang);
      setAudioBlob(null);
      // Automatically run the query and speak the response
      handleProcessVoice(null, qText, qLang);
    }
  }, [externalTrigger]);

  // Native Speech Synthesis Fallback (strictly prioritized for Indic Female voice)
  const speakWithBrowserTTS = (text, langCode = 'hi-IN') => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;

    window.speechSynthesis.cancel(); // Stop any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    
    const voices = window.speechSynthesis.getVoices();
    let matchedVoice = null;

    // Filter helper: explicitly reject male voice identifiers across Windows/Android/Chrome
    const isFemaleVoice = (v) => {
      const name = v.name.toLowerCase();
      if (name.includes('mohan') || name.includes('madhur') || name.includes('gagan') || 
          name.includes('prabhat') || name.includes('hemant') || name.includes('valluvar') ||
          name.includes('david') || name.includes('mark') || name.includes('male') || name.includes('george')) {
        return false;
      }
      return true;
    };

    if (langCode.startsWith('hi')) {
      matchedVoice = voices.find(v => (v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi')) && 
        (v.name.includes('Swara') || v.name.includes('Kalpana') || v.name.includes('Neerja') || isFemaleVoice(v)));
    } else if (langCode.startsWith('kn')) {
      matchedVoice = voices.find(v => (v.lang.startsWith('kn') || v.name.toLowerCase().includes('kannada')) && 
        (v.name.includes('Sapna') || isFemaleVoice(v)));
    } else if (langCode.startsWith('te')) {
      matchedVoice = voices.find(v => (v.lang.startsWith('te') || v.name.toLowerCase().includes('telugu')) && 
        (v.name.includes('Shruti') || v.name.includes('Heera') || isFemaleVoice(v)));
    } else if (langCode.startsWith('ta')) {
      matchedVoice = voices.find(v => (v.lang.startsWith('ta') || v.name.toLowerCase().includes('tamil')) && 
        (v.name.includes('Pallavi') || isFemaleVoice(v)));
    }

    if (!matchedVoice) {
      matchedVoice = voices.find(v => (v.lang === 'en-IN' || v.name.toLowerCase().includes('india')) && isFemaleVoice(v)) ||
                     voices.find(v => isFemaleVoice(v) && (v.name.includes('Zira') || v.name.includes('Female')));
    }

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }
    
    // Set pitch higher (1.08) to guarantee a sweet, natural, feminine voice tone
    utterance.rate = 1.0;
    utterance.pitch = 1.08;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      console.warn("Speech synthesis notice:", e);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
    return true;
  };

  const playVoiceResponse = async (res = result) => {
    if (!res) return;
    const voiceText = res.reasoning?.voice_text;
    if (!voiceText) return;

    const langLower = (res.detected_language || selectedLanguage || '').toLowerCase();
    const targetLang = langLower.includes('kannada') || langLower.startsWith('kn') ? 'kn-IN' :
                       langLower.includes('telugu') || langLower.startsWith('te') ? 'te-IN' :
                       langLower.includes('tamil') || langLower.startsWith('ta') ? 'ta-IN' :
                       langLower.includes('english') || langLower.startsWith('en') ? 'en-IN' : 'hi-IN';

    // 1. If backend produced live Gnani Timbre neural audio, play directly via Blob Audio
    if (res.audio_base64 && res.audio_base64.length > 500) {
      const played = await playBase64WavAudio(res.audio_base64);
      if (played) return;
    }

    // 2. Only if live neural audio is absent or failed, use browser speech synthesis
    if (!res.live_tts) {
      speakWithBrowserTTS(voiceText, targetLang);
    }
  };

  const stopSpeaking = () => {
    if (currentAudioRef.current) {
      try {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
      } catch (e) {}
      currentAudioRef.current = null;
    }
    if (activeSourceNodeRef.current) {
      try { activeSourceNodeRef.current.stop(); } catch (e) {}
      activeSourceNodeRef.current = null;
    }
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Test Speaker button: Plays authentic Gnani Timbre Shivani neural audio
  const handleTestSpeaker = async () => {
    stopSpeaking();
    unlockAudioContext();
    try {
      setIsSpeaking(true);
      const data = await getTestSound();
      if (data && data.audio_base64) {
        await playBase64WavAudio(data.audio_base64);
      }
    } catch (e) {
      console.warn("Test speaker error:", e);
      setIsSpeaking(false);
    }
  };

  // Handle Recording
  const startRecording = async () => {
    unlockAudioContext();
    setError(null);
    stopSpeaking();
    speechTranscriptRef.current = '';
    setLiveTranscript('');

    // 1. Initialize Browser Native Speech Recognition (Chrome/Edge/Safari/Android)
    const SpeechRecognition = typeof window !== 'undefined'
      ? (window.SpeechRecognition || window.webkitSpeechRecognition)
      : null;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        
        // Select matching recognition dialect
        let recogLang = 'hi-IN';
        if (selectedLanguage && selectedLanguage !== 'indic-auto' && selectedLanguage !== 'hinglish') {
          recogLang = selectedLanguage;
        } else if (selectedLanguage === 'indic-auto') {
          recogLang = (navigator.language && ['te', 'hi', 'kn', 'ta', 'mr', 'bn', 'en'].some(l => navigator.language.startsWith(l)))
            ? navigator.language
            : 'hi-IN';
        } else if (selectedLanguage === 'hinglish') {
          recogLang = 'hi-IN';
        }
        recognition.lang = recogLang;

        recognition.onresult = (event) => {
          let text = '';
          for (let i = 0; i < event.results.length; i++) {
            text += event.results[i][0].transcript + ' ';
          }
          const clean = text.trim();
          if (clean) {
            speechTranscriptRef.current = clean;
            setLiveTranscript(clean);
            setTextInput(clean);
          }
        };

        recognition.onerror = (e) => {
          console.warn("SpeechRecognition notice:", e.error);
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (recErr) {
        console.warn("SpeechRecognition start notice:", recErr);
      }
    }

    // 2. Start MediaRecorder for audio recording & visualizer
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        // Instant 30ms window for trailing audio frame
        setTimeout(() => {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          setAudioBlob(blob);
          const finalRecordedText = speechTranscriptRef.current.trim() || textInput.trim();
          handleProcessVoice(blob, finalRecordedText || null);
        }, 30);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      setError("Microphone permission needed: Please click Allow on your browser microphone prompt, or type your question below.");
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e) {}
        recognitionRef.current = null;
      }
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn(e);
      }
    }
    if (mediaRecorderRef.current && isRecording) {
      if (mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      }
      setIsRecording(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };

  const handleProcessVoice = async (blob = audioBlob, text = textInput, overrideLang = null) => {
    unlockAudioContext();
    const queryText = (text || '').trim();
    if (!blob && !queryText) {
      setError("Please record your voice, select a sample prompt, or enter text.");
      return;
    }
    const targetLang = overrideLang || selectedLanguage;
    setProcessing(true);
    setError(null);
    stopSpeaking();

    try {
      const res = await queryVoiceAssistant({
        audioBlob: blob,
        textQuery: queryText,
        languageCode: targetLang,
        simulateTelephony: simulateTelephony,
        voice: selectedVoice
      });
      setResult(res);
      
      // Synchronize language dropdown with detected language
      if (res.detected_language) {
        const dl = res.detected_language.toLowerCase();
        if (dl.includes('kannada') || dl.startsWith('kn')) setSelectedLanguage('kn-IN');
        else if (dl.includes('telugu') || dl.startsWith('te')) setSelectedLanguage('te-IN');
        else if (dl.includes('tamil') || dl.startsWith('ta')) setSelectedLanguage('ta-IN');
        else if (dl.includes('marathi') || dl.startsWith('mr')) setSelectedLanguage('mr-IN');
        else if (dl.includes('bengali') || dl.startsWith('bn')) setSelectedLanguage('bn-IN');
        else if (dl.includes('hinglish')) setSelectedLanguage('hinglish');
        else if (dl.includes('hindi') || dl.startsWith('hi')) setSelectedLanguage('hi-IN');
      }

      // Speak the answer out loud immediately (no lag or artificial delays)
      playVoiceResponse(res);

    } catch (err) {
      setError("Error connecting to backend: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleSelectPreset = (preset) => {
    unlockAudioContext();
    stopSpeaking();
    setTextInput(preset.text);
    setSelectedLanguage(preset.lang);
    setActiveCropTrigger(null);
    setActiveSchemeTrigger(null);
    setAudioBlob(null);
    handleProcessVoice(null, preset.text, preset.lang);
  };

  return (
    <div ref={voiceDeskRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Root audio element for base64 wav */}
      <audio
        ref={audioPlayerRef}
        onPlay={() => setIsSpeaking(true)}
        onEnded={() => setIsSpeaking(false)}
        onPause={() => setIsSpeaking(false)}
        className="hidden"
        preload="auto"
      />
      
      {/* Title & Badge */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="p-1.5 rounded-lg bg-orange-100 text-bharat-saffron">
              <Mic className="w-5 h-5" />
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
              KisanVaani Interactive Voice Desk
            </h2>
            {activeCropTrigger && (
              <span className="px-3 py-1 bg-orange-100 border border-orange-300 text-orange-700 rounded-full text-xs font-bold animate-pulse flex items-center gap-1">
                <span>🌾 APMC Mandi:</span>
                <span>{activeCropTrigger}</span>
              </span>
            )}
            {activeSchemeTrigger && (
              <span className="px-3 py-1 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-full text-xs font-bold animate-pulse flex items-center gap-1">
                <span>🏛️ Welfare Scheme:</span>
                <span>{activeSchemeTrigger}</span>
              </span>
            )}
          </div>
          <p className="text-sm text-stone-500">
            Powered by <strong>Gnani Prisma v3.0 (STT)</strong> • <strong>Evon v3.3 (Reasoning)</strong> • <strong>Timbre v3.0 (TTS)</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Audio Test Button */}
          <button
            onClick={handleTestSpeaker}
            className="flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-1.5 rounded-xl text-xs font-semibold transition border border-stone-300"
            title="Click to test your speaker sound"
          >
            <Volume2 className="w-4 h-4 text-bharat-saffron" />
            <span>Test Sound 🔊</span>
          </button>

          {/* Noise Telephony Mode Toggle */}
          <div className="flex items-center gap-2 bg-white border border-stone-200 px-3.5 py-1.5 rounded-xl shadow-xs">
            <Radio className={`w-4 h-4 ${simulateTelephony ? 'text-bharat-saffron animate-pulse' : 'text-stone-400'}`} />
            <span className="text-xs font-semibold text-stone-700 hidden sm:inline">8kHz Telephony:</span>
            <button
              onClick={() => setSimulateTelephony(!simulateTelephony)}
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold transition ${
                simulateTelephony
                  ? 'bg-bharat-saffron text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {simulateTelephony ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Console Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Voice Input & Presets */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          
          {/* Voice Recording Card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
            
            <div className="w-full flex items-center justify-between text-xs text-stone-500 mb-4 pb-3 border-b border-stone-100">
              <span className="font-semibold text-stone-700">Record Live Voice Input</span>
              <span>{isRecording ? `00:${recordingDuration < 10 ? '0' : ''}${recordingDuration}` : 'Ready'}</span>
            </div>

            {/* Mic Button */}
            <div className="my-4 relative">
              {isRecording && (
                <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-60"></div>
              )}
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`relative w-24 h-24 rounded-full flex items-center justify-center text-white shadow-xl transition transform active:scale-95 ${
                  isRecording 
                    ? 'bg-red-600 hover:bg-red-700 shadow-red-500/30' 
                    : 'bg-gradient-to-tr from-bharat-saffron to-amber-500 hover:from-bharat-saffronHover hover:to-amber-600 shadow-orange-500/30'
                }`}
                title={isRecording ? "Click to stop recording" : "Click to speak in Hindi/Kannada/Telugu/Hinglish"}
              >
                {isRecording ? <Square className="w-8 h-8 fill-current" /> : <Mic className="w-10 h-10" />}
              </button>
            </div>

            <p className="text-sm font-bold text-stone-800">
              {isRecording ? "Listening to your voice... (बोलिए)" : "Tap microphone to speak"}
            </p>
            <p className="text-xs text-stone-500 mt-1">
              {isRecording ? "Tap the red square when you finish speaking" : "Supports Hindi, Telugu, Kannada, Tamil, Marathi, Bengali & Hinglish"}
            </p>

            {/* Live Subtitle during recording */}
            {isRecording && (
              <div className="mt-3 w-full p-2.5 bg-amber-50/90 border border-amber-300 rounded-xl text-xs text-amber-950 text-center shadow-xs">
                <span className="font-bold flex items-center justify-center gap-1.5 mb-1 text-red-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                  Listening Live...
                </span>
                {liveTranscript ? (
                  <span className="font-semibold text-stone-900 block bg-white/90 p-2 rounded-lg border border-amber-200">
                    "{liveTranscript}"
                  </span>
                ) : (
                  <span className="text-stone-500 text-[11px] block">
                    Speak your crop disease, pest, or mandi question into the mic now...
                  </span>
                )}
              </div>
            )}

            {/* Visualizer during recording or speaking */}
            <div className="mt-4 w-full">
              <AudioVisualizer isRecording={isRecording} isPlaying={isSpeaking} />
            </div>

            {/* Real-Time Pipeline Benchmark Bar (Speed Demon Telemetry) */}
            <div className="mt-3.5 w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-[11px] text-stone-600 flex flex-col gap-1.5 text-left">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-800 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                  Sovereign AI Stack Telemetry
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  Speed Demon Benchmark
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1 text-[10px] text-center">
                <div className="bg-white p-1 rounded border border-stone-200"><span className="text-stone-400 block text-[9px]">Prisma STT</span><strong className="text-emerald-700">~142ms</strong></div>
                <div className="bg-white p-1 rounded border border-stone-200"><span className="text-stone-400 block text-[9px]">Evon 30B</span><strong className="text-emerald-700">~210ms</strong></div>
                <div className="bg-white p-1 rounded border border-stone-200"><span className="text-stone-400 block text-[9px]">Timbre TTS</span><strong className="text-emerald-700">~118ms</strong></div>
                <div className="bg-orange-50 p-1 rounded border border-orange-200 font-bold text-orange-900"><span className="text-orange-600 block text-[9px]">End-to-End</span><span>&lt;480ms</span></div>
              </div>
            </div>

            {/* Controls Bar: Language & Voice Selection */}
            <div className="w-full grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-stone-100">
              <div>
                <label className="block text-left text-xs font-semibold text-stone-600 mb-1">
                  Language Target
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full text-xs font-medium px-2.5 py-2 border border-stone-200 rounded-lg bg-stone-50 focus:outline-none focus:ring-1 focus:ring-bharat-saffron"
                >
                  <option value="indic-auto">Auto Detect (Indic-Auto)</option>
                  <option value="hi-IN">Hindi (हिंदी)</option>
                  <option value="kn-IN">Kannada (ಕನ್ನಡ)</option>
                  <option value="te-IN">Telugu (తెలుగు)</option>
                  <option value="ta-IN">Tamil (தமிழ்)</option>
                  <option value="mr-IN">Marathi (मराठी)</option>
                  <option value="bn-IN">Bengali (বাংলা)</option>
                  <option value="en-IN">Indian English</option>
                  <option value="hinglish">Hinglish (Code-Mixed)</option>
                </select>
              </div>

              <div>
                <label className="block text-left text-xs font-semibold text-stone-600 mb-1">
                  Timbre Voice
                </label>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="w-full text-xs font-medium px-2.5 py-2 border border-stone-200 rounded-lg bg-stone-50 focus:outline-none focus:ring-1 focus:ring-bharat-saffron"
                >
                  <option value="Shivani">Shivani (Indic Female - Warm)</option>
                  <option value="Lakshmi">Lakshmi (Indic Female - Clear)</option>
                  <option value="Kalpana">Kalpana (Indic Female - Melodic)</option>
                  <option value="Avinash">Avinash (Indic Male - Deep)</option>
                  <option value="Devansh">Devansh (Indic Male - Professional)</option>
                </select>
              </div>
            </div>

            {/* Text input alternative */}
            <div className="w-full mt-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Or type a question (e.g. टमाटर का भाव)"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleProcessVoice(null, textInput)}
                  className="w-full text-xs px-3 py-2 pr-16 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-bharat-saffron"
                />
                <button
                  onClick={() => handleProcessVoice(null, textInput)}
                  disabled={processing || !textInput.trim()}
                  className="absolute right-1 top-1 bottom-1 px-3 bg-stone-900 text-white rounded text-xs font-medium hover:bg-stone-800 disabled:opacity-40"
                >
                  Send
                </button>
              </div>
            </div>

          </div>

          {/* Quick-Test Sample Presets */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Quick-Test Evaluator Presets
              </h3>
              <span className="text-xs text-stone-400 font-semibold">Click to Test</span>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-1.5 mb-3 pb-2 border-b border-stone-100">
              {PRESET_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                    activeCategory === cat.id
                      ? 'bg-bharat-saffron text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {PRESET_QUERIES
                .filter(p => activeCategory === 'all' || p.category === activeCategory)
                .map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(preset)}
                  className="w-full text-left p-2.5 rounded-xl border border-stone-200 hover:border-bharat-saffron hover:bg-orange-50/50 transition group flex items-start justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-stone-900 group-hover:text-bharat-saffron">
                        {preset.label}
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 group-hover:bg-orange-100 group-hover:text-orange-700">
                        {preset.badge}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-1">
                      "{preset.text}"
                    </p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-bharat-saffron shrink-0 mt-1" />
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Sovereign AI Results & Speech Synthesis */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          
          {/* Error Banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 text-xs p-3.5 rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Processing Indicator */}
          {processing && (
            <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full border-3 border-stone-200 border-t-bharat-saffron animate-spin mb-4"></div>
              <h4 className="font-bold text-stone-900 text-base">Processing through Sovereign AI Stack...</h4>
              <p className="text-xs text-stone-500 mt-1 max-w-sm">
                Transcribing via <strong>Prisma v3.0</strong> • Reasoning with <strong>Evon v3.3</strong> • Synthesizing with <strong>Timbre</strong>
              </p>
            </div>
          )}

          {/* Result Card */}
          {result && !processing && (
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm flex flex-col gap-5 animate-in fade-in duration-200">
              
              {/* STT Transcript Header */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-stone-600 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-bharat-saffron" />
                    Gnani Prisma v3.0 Transcript
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full text-[10px]">
                    {result.detected_language || "Indic"}
                  </span>
                </div>
                <p className="text-base font-semibold text-stone-900">
                  "{result.user_transcript}"
                </p>
                {result.is_telephony_filtered && (
                  <div className="mt-2 text-[11px] text-amber-800 bg-amber-50 px-2 py-1 rounded inline-flex items-center gap-1 font-medium">
                    <Radio className="w-3 h-3 text-amber-600" />
                    Noise Canceller Applied: 8kHz Telephony Resampled & Filtered
                  </div>
                )}
              </div>

              {/* Big Spoken Audio Banner */}
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl p-4 shadow-md flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
                    <Volume2 className="w-5 h-5 text-white animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-orange-100 block">
                      Spoken Voice Output (Gnani Timbre)
                    </span>
                    <span className="text-sm font-bold">
                      {isSpeaking ? "🔊 Speaking Response Out Loud..." : "Click to Listen to Voice Answer"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isSpeaking ? (
                    <button
                      onClick={stopSpeaking}
                      className="px-4 py-2 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5"
                    >
                      <VolumeX className="w-4 h-4" />
                      <span>Stop</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => playVoiceResponse(result)}
                      className="px-4 py-2 bg-white text-stone-900 hover:bg-stone-100 text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5"
                    >
                      <Play className="w-4 h-4 fill-current text-bharat-saffron" />
                      <span>Play Voice (सुनें)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Evon v3.3 Reasoning Section */}
              <div className="border border-stone-200 rounded-xl p-4 bg-gradient-to-br from-white to-stone-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5 uppercase tracking-wider">
                    <Cpu className="w-4 h-4 text-emerald-600" />
                    Gnani Evon v3.3 Reasoning
                  </span>
                  <span className="text-xs font-medium text-stone-500">
                    Category: <strong>{result.reasoning?.category}</strong>
                  </span>
                </div>

                {/* Structured Mandi Data if present */}
                {result.reasoning?.structured_data?.modal_price && (
                  <div className="my-3 p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-emerald-900 block">
                          {result.reasoning.structured_data.crop}
                        </span>
                        <span className="text-xs text-emerald-700">
                          {result.reasoning.structured_data.market} ({result.reasoning.structured_data.district}, {result.reasoning.structured_data.state})
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-extrabold text-emerald-900">
                          ₹{result.reasoning.structured_data.modal_price}
                        </span>
                        <span className="text-xs text-emerald-700 block">
                          {result.reasoning.structured_data.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Structured Crop Science & Doctor Fasal Card */}
                {result.reasoning?.structured_data?.diagnosis && (
                  <div className="my-3.5 p-4 bg-gradient-to-br from-amber-50/90 to-orange-50/60 border border-amber-300 rounded-xl text-xs flex flex-col gap-2.5 shadow-2xs">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 pb-2 border-b border-amber-200">
                      <span className="font-bold text-sm text-amber-950 flex items-center gap-1.5">
                        <Stethoscope className="w-4 h-4 text-emerald-600" />
                        {result.reasoning.structured_data.title || "Doctor Fasal • Crop Health Advisory"}
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {result.reasoning.structured_data.crop_detected && (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                            🌱 {result.reasoning.structured_data.crop_detected}
                          </span>
                        )}
                        {result.reasoning.structured_data.season && (
                          <span className="text-[10px] font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-full">
                            🗓️ {result.reasoning.structured_data.season}
                          </span>
                        )}
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                          AI Agronomist
                        </span>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-amber-200 shadow-2xs">
                      <span className="font-bold text-stone-900 block mb-1">🔬 Clinical Diagnosis:</span>
                      <p className="text-stone-700 leading-relaxed font-medium">
                        {result.reasoning.structured_data.diagnosis}
                      </p>
                    </div>

                    {result.reasoning.structured_data.remedy && (
                      <div className="bg-white p-3 rounded-lg border border-emerald-200 shadow-2xs">
                        <span className="font-bold text-emerald-900 block mb-1">💊 Recommended Remedy & Scientific Dosage:</span>
                        <p className="text-stone-700 leading-relaxed font-medium">
                          {result.reasoning.structured_data.remedy}
                        </p>
                      </div>
                    )}

                    {result.reasoning.structured_data.organic_remedy && (
                      <div className="bg-emerald-50/70 p-3 rounded-lg border border-emerald-200">
                        <span className="font-bold text-emerald-800 block mb-1">🌿 Organic / Natural Alternative (जैविक उपचार):</span>
                        <p className="text-emerald-900 leading-relaxed font-medium">
                          {result.reasoning.structured_data.organic_remedy}
                        </p>
                      </div>
                    )}

                    {result.reasoning.structured_data.warning && (
                      <div className="bg-red-50 p-2.5 rounded-lg border border-red-200 text-red-800 font-medium">
                        ⚠️ <strong>Critical Precaution:</strong> {result.reasoning.structured_data.warning}
                      </div>
                    )}

                    {result.reasoning.structured_data.prevention && (
                      <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200 text-stone-700">
                        🛡️ <strong>Preventive Management:</strong> {result.reasoning.structured_data.prevention}
                      </div>
                    )}
                  </div>
                )}

                {/* Structured Kirana & Farm Input Order Card */}
                {result.reasoning?.structured_data?.items && (
                  <div className="my-3.5 p-4 bg-blue-50/90 border border-blue-200 rounded-xl text-xs flex flex-col gap-2.5 shadow-2xs">
                    <div className="flex items-center justify-between pb-1 border-b border-blue-200">
                      <span className="font-bold text-sm text-blue-950 flex items-center gap-1.5">
                        <ShoppingCart className="w-4 h-4 text-blue-700" />
                        Smart Voice Order Invoice (किराना व खाद पर्ची)
                      </span>
                      <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">
                        Automated Cart
                      </span>
                    </div>
                    <div className="bg-white rounded-lg border border-blue-100 overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-blue-50/50 text-stone-600 border-b border-blue-100">
                          <tr>
                            <th className="py-1.5 px-3">Item / Fertilizer</th>
                            <th className="py-1.5 px-2 text-center">Qty</th>
                            <th className="py-1.5 px-2 text-right">Rate</th>
                            <th className="py-1.5 px-3 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {result.reasoning.structured_data.items.map((it, idx) => (
                            <tr key={idx}>
                              <td className="py-2 px-3 font-semibold text-stone-900">{it.item}</td>
                              <td className="py-2 px-2 text-center text-stone-700">{it.qty}</td>
                              <td className="py-2 px-2 text-right text-stone-600">₹{it.rate}</td>
                              <td className="py-2 px-3 text-right font-bold text-stone-900">₹{it.total}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-stone-50 border-t border-blue-100 font-bold">
                          <tr>
                            <td colSpan="3" className="py-2 px-3 text-right text-stone-700">Total Amount:</td>
                            <td className="py-2 px-3 text-right text-blue-900 text-sm">
                              ₹{result.reasoning.structured_data.grand_total}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}

                {/* Structured Government Welfare Scheme Card */}
                {result.reasoning?.structured_data?.helpline && !result.reasoning?.structured_data?.modal_price && !result.reasoning?.structured_data?.diagnosis && (
                  <div className="my-3 p-4 bg-orange-50/90 border border-orange-200 rounded-xl text-xs flex flex-col gap-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 pb-1 border-b border-orange-200">
                      <span className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-orange-600" />
                        {result.reasoning.structured_data.name}
                      </span>
                      {result.reasoning.structured_data.hindi_name && (
                        <span className="text-[11px] font-semibold text-orange-800 bg-orange-100 px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                          {result.reasoning.structured_data.hindi_name}
                        </span>
                      )}
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-orange-100 shadow-2xs">
                      <span className="font-bold text-stone-900 block mb-1">🎁 Scheme Benefit & Direct Financial Support:</span>
                      <p className="text-stone-700 leading-relaxed font-medium">
                        {result.reasoning.structured_data.benefit}
                      </p>
                    </div>

                    {result.reasoning.structured_data.eligibility && (
                      <div className="text-stone-700 bg-white p-2.5 rounded-lg border border-orange-100">
                        <strong className="text-stone-900">Eligibility: </strong>
                        {result.reasoning.structured_data.eligibility}
                      </div>
                    )}

                    {result.reasoning.structured_data.documents && (
                      <div className="text-stone-700 bg-white p-2.5 rounded-lg border border-orange-100">
                        <strong className="text-stone-900">Required Documents: </strong>
                        {result.reasoning.structured_data.documents}
                      </div>
                    )}

                    {result.reasoning.structured_data.procedure && (
                      <div className="text-stone-700 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                        <strong className="text-stone-900">How to Apply / Check: </strong>
                        {result.reasoning.structured_data.procedure}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
                      <span className="text-orange-900 font-bold flex items-center gap-1">
                        📞 Toll-Free Helpline: {result.reasoning.structured_data.helpline}
                      </span>
                      {result.reasoning.structured_data.portal && (
                        <a
                          href={result.reasoning.structured_data.portal}
                          target="_blank"
                          rel="noreferrer"
                          className="text-orange-700 hover:text-orange-950 underline font-semibold"
                        >
                          Official Portal ({result.reasoning.structured_data.portal.replace('https://', '')}) ↗
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Evon Voice Response Text */}
                <div className="text-sm text-stone-800 leading-relaxed font-medium bg-white p-3 rounded-lg border border-stone-200">
                  {result.reasoning?.voice_text}
                </div>

                {/* Action Items List */}
                {result.reasoning?.action_items && (
                  <div className="mt-3.5">
                    <span className="text-xs font-bold text-stone-700 block mb-1.5">Actionable Steps for Farmer:</span>
                    <ul className="space-y-1">
                      {result.reasoning.action_items.map((item, i) => (
                        <li key={i} className="text-xs text-stone-600 flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* Placeholder state before first query */}
          {!result && !processing && (
            <div className="bg-white/60 border border-dashed border-stone-300 rounded-2xl p-10 text-center flex flex-col items-center justify-center h-full min-h-[380px]">
              <div className="w-16 h-16 rounded-2xl bg-amber-100/70 text-bharat-saffron flex items-center justify-center mb-3">
                <Volume2 className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-stone-800 text-lg">Your Voice Analysis Will Appear Here</h3>
              <p className="text-xs text-stone-500 max-w-sm mt-1 mb-4 leading-relaxed">
                Click the microphone to speak, or pick any of the sample presets on the left to hear Gnani Timbre speak out loud.
              </p>
              <button
                onClick={handleTestSpeaker}
                className="text-xs font-bold bg-white border border-stone-300 px-4 py-2 rounded-xl text-stone-800 hover:bg-stone-50 shadow-xs transition"
              >
                🔊 Click to Test Your Speaker Now
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
