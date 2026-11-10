import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    GNANI_API_KEY: str = os.getenv(
        "GNANI_API_KEY", 
        "vach_1ytE2CY5X2EB4dzDf1pWRtQmGLr3zc44ChtMg0grjY6sdOFWGW5lVCbge96t6452XpfnKplinIR3BHTUKVd9g9Dxsl7Tgnnn_a0878562001ab5541135315b9b2e7f1a"
    )
    GNANI_STT_URL: str = os.getenv("GNANI_STT_URL", "https://api.vachana.ai/stt/v3")
    GNANI_TTS_URL: str = os.getenv("GNANI_TTS_URL", "https://api.vachana.ai/api/v1/tts/inference")
    
    # Models
    STT_MODEL: str = os.getenv("STT_MODEL", "prisma-v3.0")
    TTS_MODEL: str = os.getenv("TTS_MODEL", "timbre-v3.0")
    REASONING_MODEL: str = os.getenv("REASONING_MODEL", "evon-v3.3-30B")
    
    # Defaults
    DEFAULT_LANGUAGE: str = "hi-IN"
    DEFAULT_VOICE: str = "Shivani"
    
    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
