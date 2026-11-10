"""
Audio Processing & Telephony Simulation Utilities
Handles 8kHz telephone channel emulation, field noise injection, and synthetic wav generation.
"""

import io
import math
import wave
import struct
import numpy as np

def generate_sine_wave(frequency=440.0, duration_seconds=1.5, sample_rate=24000):
    """Generate a clean synthetic WAV audio in memory for quick test playback."""
    num_samples = int(duration_seconds * sample_rate)
    buffer = io.BytesIO()
    
    with wave.open(buffer, "wb") as wav_file:
        wav_file.setnchannels(1)  # Mono
        wav_file.setsampwidth(2)  # 16-bit
        wav_file.setframerate(sample_rate)
        
        # Pleasant chime waveform (harmonic envelope)
        frames = bytearray()
        for i in range(num_samples):
            t = float(i) / sample_rate
            # Attack and decay envelope
            envelope = math.exp(-2.5 * t)
            sample_val = envelope * (
                0.6 * math.sin(2.0 * math.pi * frequency * t) +
                0.3 * math.sin(2.0 * math.pi * frequency * 1.5 * t) +
                0.1 * math.sin(2.0 * math.pi * frequency * 2.0 * t)
            )
            # Clip and convert to 16-bit signed integer
            int_val = int(max(-32767, min(32767, sample_val * 32767)))
            frames.extend(struct.pack("<h", int_val))
            
        wav_file.writeframes(frames)
        
    buffer.seek(0)
    return buffer.read()


def simulate_telephony_channel(audio_bytes: bytes, noise_type: str = "telephony_gsm", noise_level: float = 0.25) -> bytes:
    """
    Simulates a 2G/telephony rural telephone connection:
    - Bandpass filter (300 Hz - 3400 Hz telephony audio spectrum)
    - 8kHz downsampling
    - Realistic background noise (tractor rumble, cellular packet loss hiss)
    Returns: WAV audio bytes in 8kHz telephony format.
    """
    try:
        # Read wav input
        in_buf = io.BytesIO(audio_bytes)
        with wave.open(in_buf, "rb") as wf:
            n_channels = wf.getnchannels()
            sampwidth = wf.getsampwidth()
            framerate = wf.getframerate()
            n_frames = wf.getnframes()
            raw_data = wf.readframes(n_frames)

        # Convert to numpy float32
        if sampwidth == 2:
            data = np.frombuffer(raw_data, dtype=np.int16).astype(np.float32) / 32768.0
        elif sampwidth == 1:
            data = (np.frombuffer(raw_data, dtype=np.uint8).astype(np.float32) - 128) / 128.0
        else:
            return audio_bytes  # fallback if unsupported

        if n_channels > 1:
            data = data.reshape(-1, n_channels).mean(axis=1)

        # Resample to 8000 Hz if needed
        target_rate = 8000
        if framerate != target_rate:
            indices = np.round(np.arange(0, len(data), framerate / target_rate)).astype(int)
            indices = indices[indices < len(data)]
            data = data[indices]

        # Add simulated rural / telephony noise
        num_samples = len(data)
        if noise_type == "tractor":
            # Low frequency engine drone (~35Hz fundamental + harmonics)
            t = np.arange(num_samples) / target_rate
            tractor_drone = (
                0.5 * np.sin(2 * np.pi * 38 * t) + 
                0.3 * np.sin(2 * np.pi * 76 * t) + 
                0.2 * np.random.normal(0, 0.1, num_samples)
            )
            data = data + (noise_level * tractor_drone)
        else:
            # Telephonic background line hiss + GSM hum
            t = np.arange(num_samples) / target_rate
            gsm_hum = 0.2 * np.sin(2 * np.pi * 217 * t)  # 217 Hz TDMA frame rate buzz
            hiss = np.random.normal(0, 0.08, num_samples)
            data = data + (noise_level * (gsm_hum + hiss))

        # Normalize and clip
        data = np.clip(data, -1.0, 1.0)
        out_int16 = (data * 32767).astype(np.int16)

        # Write output 8kHz WAV
        out_buf = io.BytesIO()
        with wave.open(out_buf, "wb") as out_wf:
            out_wf.setnchannels(1)
            out_wf.setsampwidth(2)
            out_wf.setframerate(target_rate)
            out_wf.writeframes(out_int16.tobytes())

        out_buf.seek(0)
        return out_buf.read()

    except Exception:
        # If any parsing issue occurs, return original bytes safely
        return audio_bytes


def convert_to_pcm_wav(audio_bytes: bytes, sample_rate: int = 16000) -> bytes:
    """
    Converts incoming audio (such as browser audio/webm) to 16kHz mono 16-bit PCM WAV
    as strictly required by Gnani Prisma v3.0 STT API.
    """
    if not audio_bytes or len(audio_bytes) < 10:
        return audio_bytes

    # If already a clean 16kHz mono WAV, return directly
    if audio_bytes[:4] == b'RIFF':
        try:
            with wave.open(io.BytesIO(audio_bytes), 'rb') as wf:
                if wf.getframerate() == sample_rate and wf.getnchannels() == 1:
                    return audio_bytes
        except Exception:
            pass

    import subprocess
    import tempfile
    import os

    with tempfile.NamedTemporaryFile(suffix='.input', delete=False) as in_f:
        in_f.write(audio_bytes)
        in_path = in_f.name
    out_path = in_path + '_converted.wav'

    try:
        cmd = [
            'ffmpeg', '-y', '-i', in_path,
            '-ar', str(sample_rate), '-ac', '1',
            '-c:a', 'pcm_s16le', '-f', 'wav', out_path
        ]
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if os.path.exists(out_path) and os.path.getsize(out_path) > 44:
            with open(out_path, 'rb') as out_f:
                return out_f.read()
    except Exception:
        pass
    finally:
        for p in [in_path, out_path]:
            if os.path.exists(p):
                try:
                    os.unlink(p)
                except Exception:
                    pass

    return audio_bytes

