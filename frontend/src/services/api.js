const API_BASE = (import.meta.env && import.meta.env.VITE_API_URL)
  ? (import.meta.env.VITE_API_URL.endsWith('/api') ? import.meta.env.VITE_API_URL : `${import.meta.env.VITE_API_URL}/api`)
  : (typeof window !== 'undefined' && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"))
    ? "http://localhost:8000/api"
    : "/api";

export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return await res.json();
  } catch (err) {
    return { status: "offline", error: err.message };
  }
}

export async function updateApiKey(apiKey) {
  const res = await fetch(`${API_BASE}/settings/key`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: apiKey }),
  });
  return await res.json();
}

export async function queryVoiceAssistant({
  audioBlob,
  textQuery,
  languageCode = "indic-auto",
  simulateTelephony = false,
  voice = "Nalini",
}) {
  const formData = new FormData();
  if (audioBlob) {
    formData.append("audio_file", audioBlob, "voice_input.wav");
  }
  if (textQuery) {
    formData.append("text_query", textQuery);
  }
  formData.append("language_code", languageCode);
  formData.append("simulate_telephony", simulateTelephony);
  formData.append("voice", voice);

  const res = await fetch(`${API_BASE}/pipeline/voice-assistant`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Failed voice assistant request: ${res.statusText}`);
  }
  return await res.json();
}

export async function fetchMandiPrices(query = "") {
  const url = query ? `${API_BASE}/mandi/prices?q=${encodeURIComponent(query)}` : `${API_BASE}/mandi/prices`;
  const res = await fetch(url);
  return await res.json();
}

export async function fetchGovtSchemes() {
  const res = await fetch(`${API_BASE}/schemes`);
  return await res.json();
}

export async function getTestSound() {
  const res = await fetch(`${API_BASE}/tts/test-sound`);
  if (!res.ok) throw new Error("Failed to load test sound");
  return await res.json();
}

export async function simulateTelephonyNoise(audioBlob, noiseType = "tractor", noiseLevel = 0.3) {
  const formData = new FormData();
  formData.append("audio_file", audioBlob, "original.wav");
  formData.append("noise_type", noiseType);
  formData.append("noise_level", noiseLevel);

  const res = await fetch(`${API_BASE}/audio/noise-test`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Noise simulation failed");
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}
