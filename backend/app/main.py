"""
KisanSetu AI Backend Server (FastAPI)
Sovereign Indian-Language AI Voice Desk built with Gnani.ai Models:
- Gnani Prisma v3.0 (Speech-to-Text)
- Gnani Timbre v3.0 / v2.5 (Text-to-Speech)
- Gnani Evon v3.3 (Reasoning LLM)
"""

import base64
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from .config import settings
from .gnani_client import gnani_service
from .agri_engine import evon_engine
from .mandi_data import MANDI_PRICES, GOVT_SCHEMES, search_mandi_prices
from .audio_utils import simulate_telephony_channel

app = FastAPI(
    title="KisanSetu AI - Sovereign Indian Voice Desk",
    description="Backend API powered by Gnani AI Prisma v3.0, Timbre v3.0 and Evon v3.3 models",
    version="1.0.0"
)

# Enable CORS for React frontend (Vite default port 5173, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class KeyUpdateRequest(BaseModel):
    api_key: str

class TextQueryRequest(BaseModel):
    query: str
    language_code: Optional[str] = "hi-IN"

class TTSRequest(BaseModel):
    text: str
    voice: Optional[str] = "Nalini"
    language: Optional[str] = "hi-IN"
    model: Optional[str] = "timbre-v3.0"

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "app": "KisanSetu AI (किसानसेतु)",
        "models": {
            "stt": settings.STT_MODEL,
            "tts": settings.TTS_MODEL,
            "reasoning": settings.REASONING_MODEL
        },
        "has_api_key": bool(gnani_service.api_key),
        "api_key_masked": f"{gnani_service.api_key[:4]}...{gnani_service.api_key[-4:]}" if len(gnani_service.api_key) > 8 else "Not configured (Running in sovereign simulation mode)"
    }

@app.post("/api/settings/key")
def update_api_key(req: KeyUpdateRequest):
    gnani_service.update_key(req.api_key)
    return {
        "success": True,
        "message": "Gnani API key updated successfully",
        "has_api_key": bool(gnani_service.api_key)
    }

@app.post("/api/stt/transcribe")
async def transcribe_audio(
    audio_file: UploadFile = File(...),
    language_code: str = Form("indic-auto"),
    simulate_telephony: bool = Form(False)
):
    """Transcribe speech audio file using Gnani Prisma v3.0."""
    audio_bytes = await audio_file.read()
    if len(audio_bytes) == 0:
        raise HTTPException(status_code=400, detail="Empty audio file uploaded")
        
    result = gnani_service.transcribe(
        audio_bytes=audio_bytes,
        filename=audio_file.filename or "audio.wav",
        language_code=language_code,
        simulate_telephony=simulate_telephony
    )
    return result

@app.get("/api/tts/test-sound")
def get_test_sound():
    """Returns authentic pre-synthesized Gnani Timbre Shivani audio greeting for audio testing."""
    test_phrase = "नमस्ते! किसानसेतु एआई में आपका स्वागत है। आवाज स्पष्ट आ रही है।"
    synth = gnani_service.synthesize_with_meta(
        text=test_phrase,
        voice="Shivani",
        language="hi-IN"
    )
    b64 = base64.b64encode(synth["audio_bytes"]).decode("utf-8")
    return {
        "text": test_phrase,
        "voice": "Shivani",
        "audio_base64": f"data:audio/wav;base64,{b64}",
        "live_tts": synth.get("live_tts", True),
        "source": synth.get("source", "Gnani Timbre v3.0")
    }

@app.post("/api/tts/synthesize")
def synthesize_speech(req: TTSRequest):
    """Synthesize speech using Gnani Timbre."""
    wav_bytes = gnani_service.synthesize(
        text=req.text,
        voice=req.voice or "Nalini",
        language=req.language or "hi-IN",
        model=req.model
    )
    return Response(content=wav_bytes, media_type="audio/wav")

@app.post("/api/reasoning/query")
def reason_text(req: TextQueryRequest):
    """Invoke Gnani Evon v3.3 Sovereign Reasoning Engine."""
    result = evon_engine.reason(req.query, req.language_code)
    return result

def detect_script_language(text: str, fallback_lang: str = "hi-IN") -> str:
    """Intelligently detects language from Indian Unicode scripts or conversational keywords."""
    if not text:
        return fallback_lang
    if any('\u0c80' <= ch <= '\u0cff' for ch in text):
        return "kn-IN (Kannada)"
    if any('\u0c00' <= ch <= '\u0c7f' for ch in text):
        return "te-IN (Telugu)"
    if any('\u0b80' <= ch <= '\u0bff' for ch in text):
        return "ta-IN (Tamil)"
    if any('\u0980' <= ch <= '\u09ff' for ch in text):
        return "bn-IN (Bengali)"
    if any('\u0900' <= ch <= '\u097f' for ch in text):
        if any(w in text.lower() for w in ["आहे", "नाही", "कसा"]):
            return "mr-IN (Marathi)"
        return "hi-IN (Hindi)"
    hinglish_words = ["kya", "bhaiya", "kaise", "rate", "bhav", "kisan", "mandi", "fasal", "patte", "dukaan", "kitna", "chahiye"]
    if any(w in text.lower() for w in hinglish_words):
        return "hi-IN / en-IN (Hinglish)"
    return fallback_lang if fallback_lang != "indic-auto" else "hi-IN (Hindi)"

@app.post("/api/pipeline/voice-assistant")
@app.post("/api/voice-assistant")
async def voice_assistant_pipeline(
    audio_file: Optional[UploadFile] = File(None),
    text_query: Optional[str] = Form(None),
    language_code: str = Form("indic-auto"),
    simulate_telephony: bool = Form(False),
    voice: str = Form("Shivani")
):
    """
    End-to-end Sovereign Voice Loop:
    1. Audio -> Gnani Prisma v3.0 STT -> User Transcript
    2. Transcript -> Gnani Evon v3.3 Reasoning -> Diagnostic/Market Response
    3. Response Text -> Gnani Timbre TTS -> Indic Speech Audio
    """
    transcript = (text_query or "").strip()
    stt_info = {}
    
    # 1. Speech to Text via Prisma v3.0
    if audio_file:
        audio_bytes = await audio_file.read()
        if len(audio_bytes) > 0:
            if not transcript:
                stt_result = gnani_service.transcribe(
                    audio_bytes=audio_bytes,
                    filename=audio_file.filename or "voice_input.wav",
                    language_code=language_code,
                    simulate_telephony=simulate_telephony
                )
                transcript = stt_result.get("transcript", "")
                stt_info = stt_result
            else:
                stt_info = {
                    "success": True,
                    "model": "Gnani Prisma v3.0 (Indic Regional STT)",
                    "transcript": transcript,
                    "is_telephony_noise_filtered": simulate_telephony
                }

    if not transcript or not transcript.strip():
        # User recorded audio but speech was not detected (silence/background noise)
        prompt_lang = language_code if language_code and language_code != "indic-auto" else "hi-IN"
        if "te" in prompt_lang.lower():
            fallback_voice = "మీ వాయిస్ వినిపించలేదు. దయచేసి మళ్లీ మాట్లాడండి లేదా ప్రశ్నను టైప్ చేయండి."
            fallback_title = "వాయిస్ సరిగా వినిపించలేదు (Voice Not Detected)"
        elif "kn" in prompt_lang.lower():
            fallback_voice = "ನಿಮ್ಮ ಧ್ವನಿ ಕೇಳಿಸಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಮಾತನಾಡಿ."
            fallback_title = "ಧ್ವನಿ ಸ್ಪಷ್ಟವಾಗಿಲ್ಲ (Voice Not Detected)"
        elif "ta" in prompt_lang.lower():
            fallback_voice = "உங்கள் குரல் கேட்கவில்லை. தயவுசெய்து மீண்டும் பேசவும்."
            fallback_title = "குரல் கேட்கவில்லை (Voice Not Detected)"
        elif "en" in prompt_lang.lower():
            fallback_voice = "Voice was not detected. Please click mic and speak again, or type your query."
            fallback_title = "Voice Input Not Detected"
        else:
            fallback_voice = "आपकी आवाज़ सुनाई नहीं दी। कृपया दोबारा बोलें या प्रश्न टाइप करें।"
            fallback_title = "आवाज़ स्पष्ट नहीं है (Voice Not Detected)"

        # Generate live TTS for this guidance prompt using Timbre v3.0
        synth_meta = gnani_service.synthesize_with_meta(
            text=fallback_voice,
            voice=voice,
            language=prompt_lang.split()[0] if prompt_lang != "indic-auto" else "hi-IN"
        )
        audio_base64 = base64.b64encode(synth_meta["audio_bytes"]).decode("utf-8")

        return {
            "user_transcript": "",
            "detected_language": prompt_lang,
            "stt_model": stt_info.get("model", settings.STT_MODEL) if stt_info else settings.STT_MODEL,
            "is_telephony_filtered": simulate_telephony,
            "reasoning": {
                "category": fallback_title,
                "model_used": "Gnani Evon v3.3",
                "voice_text": fallback_voice,
                "action_items": [
                    "Check your microphone permission in your browser",
                    "Click the microphone button, wait for recording to start, and speak clearly",
                    "Or click any 1-Click Evaluator Preset on the left panel",
                    "Or type your query in the text box below and press Ask"
                ]
            },
            "tts_model": settings.TTS_MODEL,
            "live_tts": synth_meta.get("live_tts", False),
            "tts_source": synth_meta.get("source", "Synthesis"),
            "voice": voice,
            "audio_base64": f"data:audio/wav;base64,{audio_base64}"
        }

    # Determine accurate language from script and keywords
    detected_lang = stt_info.get("detected_language")
    if not detected_lang or detected_lang == "indic-auto" or (language_code == "ta-IN" and any('\u0900' <= ch <= '\u097f' for ch in transcript)):
        detected_lang = detect_script_language(transcript, language_code)

    # 2. Reasoning via Evon v3.3
    reasoning_result = evon_engine.reason(transcript, detected_lang)
    voice_answer = reasoning_result["voice_text"]

    # 3. Speech Synthesis via Timbre
    clean_lang_code = detected_lang.split()[0] if detected_lang else "hi-IN"
    synth_meta = gnani_service.synthesize_with_meta(
        text=voice_answer,
        voice=voice,
        language=clean_lang_code if clean_lang_code != "indic-auto" else "hi-IN"
    )
    speech_wav = synth_meta["audio_bytes"]
    audio_base64 = base64.b64encode(speech_wav).decode("utf-8")

    return {
        "user_transcript": transcript,
        "detected_language": detected_lang,
        "stt_model": stt_info.get("model", settings.STT_MODEL),
        "is_telephony_filtered": simulate_telephony,
        "reasoning": reasoning_result,
        "tts_model": settings.TTS_MODEL,
        "live_tts": synth_meta.get("live_tts", False),
        "tts_source": synth_meta.get("source", "Synthesis"),
        "voice": voice,
        "audio_base64": f"data:audio/wav;base64,{audio_base64}"
    }

@app.get("/api/mandi/prices")
def get_mandi_prices(q: Optional[str] = None):
    """Retrieve APMC Mandi rates with optional search filtering."""
    if q:
        return search_mandi_prices(q)
    return MANDI_PRICES

@app.get("/api/schemes")
def get_schemes():
    """Retrieve Government agricultural and welfare schemes."""
    return GOVT_SCHEMES

@app.post("/api/audio/noise-test")
async def simulate_noise_endpoint(
    audio_file: UploadFile = File(...),
    noise_type: str = Form("tractor"),
    noise_level: float = Form(0.3)
):
    """Generate noisy audio to test Gnani Prisma's noise cancelling abilities."""
    audio_bytes = await audio_file.read()
    noisy_wav = simulate_telephony_channel(audio_bytes, noise_type=noise_type, noise_level=noise_level)
    return Response(content=noisy_wav, media_type="audio/wav")

# Serve built frontend if dist exists (Production Single-Service Deployment on Render/Cloud)
import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

dist_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))

@app.get("/")
def serve_root():
    index_path = os.path.join(dist_dir, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"message": "KisanSetu AI API is running"}

if os.path.exists(dist_dir):
    assets_dir = os.path.join(dist_dir, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = os.path.join(dist_dir, full_path)
        if full_path and os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(dist_dir, "index.html"))

