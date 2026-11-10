"""
Sovereign Indic Reasoning Engine (Powered by Gnani Evon v3.3 architecture)
Tailored for Indian Agriculture, APMC Mandi Commerce, Crop Protection, and Rural Micro-Enterprises.
"""

from typing import Dict, Any, List
import re
from .mandi_data import MANDI_PRICES, GOVT_SCHEMES, search_mandi_prices

# Comprehensive Knowledge Base for Crop Pest, Disease, Nutrient & Agronomy Advisory
CROP_DISEASES = {
    "yellow_leaves": {
        "title": "Nitrogen Chlorosis & Early Leaf Yellowing",
        "symptoms": ["yellow leaves", "पीले पत्ते", "पीलापन", "ಹಳದಿ ಎಲೆಗಳು", "పసుపు ఆకులు", "pale foliage", "nitrogen deficiency", "chlorosis"],
        "diagnosis": "Nitrogen deficiency or early-stage Chlorosis / physiological stress.",
        "remedy": "Apply top-dressing of Neem Coated Urea (25-30 kg/acre) or foliar spray of water-soluble NPK 19:19:19 @ 5g/L water. For rapid greening, mix Chelated Zinc (12% EDTA) @ 1g/L.",
        "organic_remedy": "Spray Vermiwash (100ml/L water) or Jeevamrut (200 L/acre with irrigation).",
        "warning": "Do not apply excessive urea under waterlogged or high-humidity standing water conditions.",
        "prevention": "Ensure proper drainage and conduct biennial soil testing.",
        "voice_hi": "पत्तियों में पीलेपन के लिए यूरिया व जिंक या 19 19 19 खाद का छिड़काव करें।",
        "voice_te": "ఆకులు పసుపు రంగు మారితే యూరియా మరియు జింక్ పిచికారీ చేయండి.",
        "voice_kn": "ಎಲೆಗಳು ಹಳದಿಯಾಗಿದ್ದರೆ ಯೂರಿಯಾ ಮತ್ತು ಸತು ಸಿಂಪಡಿಸಿ.",
        "voice_en": "For yellow leaves, apply top dressing urea or NPK 19:19:19 spray."
    },
    "leaf_blight": {
        "title": "Early & Late Leaf Blight (Fungal Disease)",
        "symptoms": ["blight", "झुलसा", "brown spots", "धब्बे", "काला धब्बा", "మచ్చలు", "ರೋಗ", "leaf spot", "alternaria"],
        "diagnosis": "Early / Late Leaf Blight caused by Alternaria or Phytophthora fungal infection.",
        "remedy": "Spray Mancozeb 75% WP @ 2.5g/L water or Copper Oxychloride 50% WP @ 3g/L. In severe infection, apply systemic fungicide Azoxystrobin + Difenoconazole @ 1ml/L.",
        "organic_remedy": "Foliar spray of Trichoderma harzianum @ 5g/L or fermented butter milk (chaas) @ 50ml/L.",
        "warning": "Spray during early morning or late afternoon; avoid spraying in bright midday sun.",
        "prevention": "Maintain row spacing for air circulation and destroy infected crop residues.",
        "voice_hi": "झुलसा व धब्बा रोग की रोकथाम के लिए साफ फफूंदनाशक या नीम तेल का छिड़काव करें।",
        "voice_te": "ఆకు మచ్చ మరియు బ్లైట్ తెగులు నివారణకు సాఫ్ లేదా వేప నూనెను పిచికారీ చేయండి.",
        "voice_kn": "ಎಲೆ ಚುಕ್ಕೆ ರೋಗಕ್ಕೆ ಶಿಲೀಂಧ್ರನಾಶಕ ಅಥವಾ ಬೇವಿನ ಎಣ್ಣೆ ಸಿಂಪಡಿಸಿ.",
        "voice_en": "For leaf blight disease, spray Mancozeb or systemic fungicide Saaf."
    },
    "stem_borer": {
        "title": "Stem Borer & Shoot Borer (Larval Infestation)",
        "symptoms": ["stem borer", "तना छेदक", "dead heart", "deadheart", "ಕಾಂಡ ಕೊರೆಯುವ ಹುಳು", "కాండం తొలుచు పురుగు", "మొగి పురుగు", "dry central shoot", "borer", "shoot borer"],
        "diagnosis": "Stem Borer / Shoot Borer (Scirpophaga / Chilo larvae causing dead heart symptom).",
        "remedy": "Apply Cartap Hydrochloride 4G granules @ 7-8 kg/acre in standing water or soil, or spray Chlorantraniliprole 18.5% SC @ 0.4 ml/L (60ml/acre).",
        "organic_remedy": "Install 5-6 Pheromone traps per acre and release Trichogramma egg parasitoids @ 50,000/acre.",
        "warning": "Maintain a 14-day pre-harvest waiting interval after chemical spray.",
        "prevention": "Clip seedling tips before transplanting to remove egg masses.",
        "voice_hi": "तना छेदक कीट के नियंत्रण के लिए कोराजन या कारटाप हाइड्रोक्लोराइड का उपयोग करें।",
        "voice_te": "కాండం తొలుచు పురుగు నివారణకు కోరాజెన్ లేదా కార్టాప్ హైడ్రోక్లోరైడ్ వాడండి.",
        "voice_kn": "ಕಾಂಡ ಕೊರೆಯುವ ಹುಳು ನಿಯಂತ್ರಣಕ್ಕೆ ಕ್ಲೋರಾಂಟ್ರಾನಿಲಿಪ್ರೋಲ್ ಸಿಂಪಡಿಸಿ.",
        "voice_en": "For stem borer infestation, apply Cartap Hydrochloride granules or Coragen."
    },
    "pink_bollworm": {
        "title": "Pink Bollworm in Cotton (गुलाबी सुंडी)",
        "symptoms": ["pink bollworm", "bollworm", "गुलाबी सुंडी", "गुलाबी इल्ली", "कपास का कीड़ा", "rosette flower", "kapas keeda", "cotton pest"],
        "diagnosis": "Pink Bollworm (Pectinophora gossypiella) infestation damaging cotton squares and bolls.",
        "remedy": "Spray Emamectin Benzoate 5% SG @ 0.5g/L water or Chlorantraniliprole 18.5% SC @ 0.3ml/L. Alternate with Profenofos 50% EC @ 2ml/L.",
        "organic_remedy": "Install 8 Pheromone traps with Gossyplure septa per acre. Spray Neem Seed Kernel Extract (NSKE 5%) @ 50ml/L.",
        "warning": "Rotate chemical modes of action to prevent insecticide resistance.",
        "prevention": "Collect and destroy rosette flowers and premature fallen squares daily.",
        "voice_hi": "कपास में गुलाबी सुंडी नियंत्रण के लिए इमामेक्टिन या कोराजन का छिड़काव करें।",
        "voice_te": "పత్తిలో గులాబీ రంగు పురుగు నివారణకు ఇమామెక్టిన్ లేదా కోరాజెన్ పిచికారీ చేయండి.",
        "voice_kn": "ಹತ್ತಿಯ ಗುಲಾಬಿ ಹುಳು ನಿಯಂತ್ರಣಕ್ಕೆ ಇಮಾಮೆಕ್ಟಿನ್ ಅಥವಾ ಬೇವಿನ ಎಣ್ಣೆ ಸಿಂಪಡಿಸಿ.",
        "voice_en": "For cotton pink bollworm, spray Emamectin Benzoate or Coragen."
    },
    "rice_blast": {
        "title": "Blast Disease & Brown Plant Hopper in Paddy (झोंका रोग)",
        "symptoms": ["blast", "झोंका", "rice blast", "paddy disease", "neck blast", "bph", "भूरा फुदका", "धान का रोग", "hopper burn", "అగ్గి తెగులు", "వరి తెగులు"],
        "diagnosis": "Paddy Blast (Pyricularia oryzae) or Brown Plant Hopper (Nilaparvata lugens) infestation.",
        "remedy": "For blast: Spray Tricyclazole 75% WP @ 0.6g/L or Isoprothiolane 40% EC @ 1.5ml/L. For BPH hopper: Spray Pymetrozine 50% WDG @ 0.6g/L or Triflumezopyrim 10% SC @ 0.5ml/L.",
        "organic_remedy": "Spray Pseudomonas fluorescens @ 5g/L water at 15-day intervals.",
        "warning": "Drain standing water from paddy field for 2-3 days if BPH hopper burn starts.",
        "prevention": "Avoid excess nitrogenous fertilizer; balance with muriate of potash.",
        "voice_hi": "धान में झोंका रोग व भूरा फुदका के लिए ट्राइसाइक्लाजोल या चेस का छिड़काव करें।",
        "voice_te": "వరిలో అగ్గి తెగులు నివారణకు ట్రైసైక్లాజోల్ లేదా పైమెట్రోజైన్ పిచికారీ చేయండి.",
        "voice_kn": "ಭತ್ತದ ಬೆಂಕಿರೋಗ ನಿಯಂತ್ರಣಕ್ಕೆ ಟ್ರೈಸೈಕ್ಲಾಜೋಲ್ ಸಿಂಪಡಿಸಿ.",
        "voice_en": "For paddy blast and hopper, spray Tricyclazole or Pymetrozine."
    },
    "wheat_rust": {
        "title": "Yellow Rust & Brown Rust in Wheat (पीला रतुआ)",
        "symptoms": ["rust", "yellow rust", "पीला रतुआ", "रतुआ", "brown rust", "wheat disease", "गेहूं का रोग", "stripe rust"],
        "diagnosis": "Stripe Rust / Yellow Rust (Puccinia striiformis) on wheat foliage.",
        "remedy": "Spray Propiconazole 25% EC (Tilt) @ 1ml/L water (200ml in 200L water/acre) immediately upon first stripe detection. Repeat after 15 days if cloudy weather persists.",
        "organic_remedy": "Foliar spray of Cow urine (Gau Mutra 10%) mixed with Hing (asafetida 2g/L).",
        "warning": "Do not delay spraying once yellow pustule stripes appear on leaves.",
        "prevention": "Sow rust-resistant varieties like HD-2967, DBW-187, or PBW-725.",
        "voice_hi": "गेहूं में पीला रतुआ दिखने पर टिल्ट यानी प्रोपिकोनाजोल दवा का तुरंत छिड़काव करें।",
        "voice_te": "గోధుమలో పసుపు రంగు తెగులు నివారణకు ప్రొపికొనాజోల్ పిచికారీ చేయండి.",
        "voice_kn": "ಗೋಧಿಯ ಹಳದಿ ರೋಗಕ್ಕೆ ಪ್ರೊಪಿಕೊನಾಜೋಲ್ ಸಿಂಪಡಿಸಿ.",
        "voice_en": "For yellow rust in wheat, immediately spray Propiconazole fungicide."
    },
    "leaf_curl": {
        "title": "Leaf Curl Virus & Whitefly Vector in Tomato / Chilli (पत्ता मरोड़)",
        "symptoms": ["leaf curl", "पत्ता मरोड़", "मरोड़िया", "सफेद मक्खी", "whitefly", "thrips", "chilli disease", "curling leaves", "चुर्रा मुर्रा", "తామర పురుగులు", "ఆకు ముడుత", "నల్లి", "ముడుచు"],
        "diagnosis": "Chilli / Tomato Leaf Curl Geminivirus transmitted by Bemisia tabaci (whitefly) and thrips.",
        "remedy": "Control whitefly vector: Spray Diafenthiuron 50% WP @ 1.2g/L or Acetamiprid 20% SP @ 0.3g/L or Cyantraniliprole 10.26% OD @ 1.2ml/L.",
        "organic_remedy": "Install 15-20 Yellow and Blue Sticky Traps per acre. Spray Neem Oil 10,000 ppm @ 2ml/L water.",
        "warning": "Rogue out and bury severely stunted viral-infected plants to stop garden-wide spread.",
        "prevention": "Use silver reflective plastic mulch to deter whiteflies and thrips.",
        "voice_hi": "टमाटर व मिर्च में पत्ता मरोड़ और सफेद मक्खी के लिए एसिटामिप्रिड या नीम तेल डालें।",
        "voice_te": "ఆకు ముడుత మరియు తెల్లదోమ నివారణకు ఎసిటామిప్రిడ్ లేదా వేప నూనె పిచికారీ చేయండి.",
        "voice_kn": "ಎಲೆ ಮುದುರು ರೋಗಕ್ಕೆ ಅಸಿಟಾಮಿಪ್ರಿಡ್ ಅಥವಾ ಬೇವಿನ ಎಣ್ಣೆ ಸಿಂಪಡಿಸಿ.",
        "voice_en": "For leaf curl virus and whiteflies, spray Acetamiprid or neem oil."
    },
    "powdery_mildew": {
        "title": "Powdery Mildew in Mustard, Vegetables & Fruits (सफेद चूर्ण / छाछिया)",
        "symptoms": ["powdery mildew", "सफेद चूर्ण", "छाछिया", "white powder", "mildew", "सरसों का रोग", "फफूंद"],
        "diagnosis": "Powdery Mildew (Erysiphe / Leveillula species) fungal white coating on leaf surface.",
        "remedy": "Spray Wettable Sulphur 80% WP @ 2.5g/L water or Hexaconazole 5% SC @ 1.5ml/L or Dinocap 48% EC @ 1ml/L.",
        "organic_remedy": "Spray baking soda (sodium bicarbonate 5g/L) mixed with 2ml liquid soap.",
        "warning": "Do not spray sulphur during high noon temperature (>32°C) to prevent foliar scorching.",
        "prevention": "Ensure good sunlight penetration and prune dense lower canopy foliage.",
        "voice_hi": "सफेद चूर्ण रोग की रोकथाम के लिए घुलनशील सल्फर या हेक्साकोनाजोल का छिड़काव करें।",
        "voice_te": "బూడిద తెగులు నివారణకు సల్ఫర్ లేదా హెక్సాకోనాజోల్ పిచికారీ చేయండి.",
        "voice_kn": "ಬೂದಿ ರೋಗಕ್ಕೆ ಗಂಧಕದ ಪುಡಿ ಅಥವಾ ಹೆಕ್ಸಾಕೊನಾಜೋಲ್ ಸಿಂಪಡಿಸಿ.",
        "voice_en": "For powdery mildew, spray wettable sulphur or Hexaconazole."
    },
    "wilt_root_rot": {
        "title": "Fusarium Wilt & Root Rot in Pulses & Vegetables (उकठा व जड़ गलन)",
        "symptoms": ["wilt", "root rot", "उकठा", "जड़ गलन", "सूख रहा है", "सूखना", "fusarium", "collar rot", "damping off"],
        "diagnosis": "Fusarium Wilt or Rhizoctonia / Pythium Root Rot leading to vascular browning and drooping.",
        "remedy": "Drench root zone with Carbendazim 12% + Mancozeb 63% WP (Saaf) @ 2g/L water or Metalaxyl + Mancozeb @ 2.5g/L.",
        "organic_remedy": "Soil treatment with Trichoderma viride enriched farmyard manure @ 2.5 kg/acre.",
        "warning": "Improve field drainage immediately; avoid flood irrigation in standing crop.",
        "prevention": "Mandatory seed treatment with Carbendazim @ 2g/kg seed before sowing.",
        "voice_hi": "उकठा व जड़ गलन के लिए साफ फफूंदनाशक या ट्राइकोडर्मा से जड़ का शोधन करें।",
        "voice_te": "ఎండు తెగులు మరియు వేరు కుళ్లు నివారణకు సాఫ్ లేదా ట్రైకోడెర్మ వాడండి.",
        "voice_kn": "ಸೊರಗು ರೋಗಕ್ಕೆ ಟ್ರೈಕೋಡರ್ಮ ಅಥವಾ ಕಾರ್ಬೆಂಡಾಜಿಮ್ ಬಳಸಿ.",
        "voice_en": "For wilt and root rot, drench roots with Saaf fungicide or Trichoderma."
    },
    "mustard_aphid": {
        "title": "Aphids / Chepa in Mustard & Cole Crops (माहू / चेपा कीट)",
        "symptoms": ["aphid", "chepa", "माहू", "चेपा", "लाही", "मोयला", "mustard aphid", "greenfly", "sarson keeda"],
        "diagnosis": "Mustard Aphid (Lipaphis erysimi) sucking sap from inflorescence and tender siliquae pods.",
        "remedy": "Spray Dimethoate 30% EC (Rogor) @ 1.7ml/L water or Thiamethoxam 25% WDG @ 0.3g/L (60g/acre) when 10% plant infestation observed.",
        "organic_remedy": "Foliar spray of 5% Neem Seed Kernel Extract (NSKE) or ginger-garlic-chilli paste extract @ 20ml/L.",
        "warning": "Spray in late afternoon to protect foraging honeybee pollinators.",
        "prevention": "Timely sowing of mustard before October 25 escapes peak aphid emergence."
    },
    "fall_armyworm": {
        "title": "Fall Armyworm in Maize & Sorghum (फॉल आर्मीवॉर्म)",
        "symptoms": ["fall armyworm", "armyworm", "आर्मीवॉर्म", "मक्का का कीड़ा", "maize pest", "whorl borer", "corn caterpillar"],
        "diagnosis": "Fall Armyworm (Spodoptera frugiperda) feeding inside central whorls with ragged windowing.",
        "remedy": "Apply Chlorantraniliprole 18.5% SC @ 0.4ml/L or Spinetoram 11.7% SC @ 0.5ml/L directed directly into the central plant whorl.",
        "organic_remedy": "Apply dry sand mixed with ash (9:1) into whorls, or spray Bacillus thuringiensis (Bt) @ 2g/L.",
        "warning": "Target application directly into the central whorl where larvae hide.",
        "prevention": "Intercrop maize with cowpea or desmodium to repel ovipositing moths."
    },
    "flower_drop": {
        "title": "Flower & Fruit Dropping in Tomato, Cotton & Chilli (फूल-फल झड़ना)",
        "symptoms": ["flower drop", "fruit drop", "फूल झड़ना", "फूल गिरना", "फल गिरना", "flowers falling", "planofix", "fruit setting"],
        "diagnosis": "Hormonal imbalance, temperature extremity or boron deficiency causing abscission.",
        "remedy": "Spray Alpha Naphthyl Acetic Acid 4.5% SL (Planofix) @ 0.25ml/4.5L water (approx. 4ml in 15L backpack tank) + Soluble Boron (20%) @ 1g/L at flowering onset.",
        "organic_remedy": "Spray Panchagavya (30ml/L water) or seaweed extract @ 2ml/L.",
        "warning": "Strictly do not overdose Planofix; excess concentration causes flower burn.",
        "prevention": "Maintain consistent soil moisture and avoid moisture stress at anthesis."
    },
    "fertilizer_dosage": {
        "title": "Scientific Fertilizer & Nutrition Schedule (खाद व पोषण गणना)",
        "symptoms": ["fertilizer", "khad", "urea", "dap", "खाद", "यूरिया", "डीएपी", "पोटाश", "fertilizer dose", "kitna dale", "कितना डालें", "npk dose"],
        "diagnosis": "Nutritional management advisory based on Indian Council of Agricultural Research (ICAR) benchmarks.",
        "remedy": "Standard 1-acre recommendation: Basal dose at sowing: 50 kg DAP + 25 kg MOP + 10 kg Zinc Sulphate (21%). Top-dressing at first irrigation: 45 kg Neem Coated Urea. Second top-dressing: 35 kg Urea. Nano Urea foliar spray: 4ml/L water at tillering.",
        "organic_remedy": "Apply 3-4 tonnes well-decomposed FYM or 1 tonne vermicompost with 2 kg Azotobacter/acre.",
        "warning": "Never mix DAP and zinc sulphate together directly in the same tank.",
        "prevention": "Use Soil Health Card advisory to prevent excess nitrogen and save ₹1,500/acre."
    },
    "wheat_irrigation": {
        "title": "Critical Irrigation Stages in Wheat & Field Crops (सिंचाई सलाहकार)",
        "symptoms": ["irrigation", "sinchai", "water", "पानी", "सिंचाई", "पहली सिंचाई", "irrigation schedule", "watering"],
        "diagnosis": "Crop water scheduling based on critical phonological growth stages.",
        "remedy": "In wheat, ensure first irrigation at Crown Root Initiation (CRI) stage at 20-25 days after sowing. Second at Tillering (40-45 DAS), third at Jointing (60-65 DAS), fourth at Flowering (80-85 DAS), and fifth at Milking/Grain Filling (100-105 DAS).",
        "organic_remedy": "Practice organic straw mulching to conserve 25-30% soil moisture.",
        "warning": "Avoid heavy flood irrigation during high wind days (>15 km/h) at grain stage to prevent crop lodging.",
        "prevention": "Adopt micro-irrigation (drip or sprinkler) to save 40% water under PMKSY subsidy."
    },
    "weed_control": {
        "title": "Weed Management & Selective Herbicide Advisory (खरपतवार नियंत्रण)",
        "symptoms": ["weed", "herbicide", "खरपतवार", "घास", "gullidanda", "phalaris", "खरपतवार नाशक", "weedicide", "कचरा"],
        "diagnosis": "Weed infestation competing for sunlight, soil nutrients, and moisture.",
        "remedy": "In wheat: For Phalaris minor (mandusi/gullidanda), spray Clodinafop-propargyl 15% WP @ 160g/acre or Sulfosulfuron 75% WG @ 13.5g/acre at 30-35 DAS using flat fan nozzle in 150L water. In soybean/pulses: Spray Imazethapyr 10% SL @ 400ml/acre at 15-20 DAS.",
        "organic_remedy": "Hand hoeing / wheel weeding at 20 and 40 DAS or live mulching.",
        "warning": "Always use flood jet or flat fan nozzle with hood; do not use hollow cone nozzle for herbicides.",
        "prevention": "Use certified weed-free seed and clean machinery before harvesting."
    }
}

# Indian Crop Dictionary for Dynamic Understanding
INDIAN_CROPS = {
    "wheat": {"names": ["wheat", "gehu", "गेहूं", "ಗೋಧಿ", "గోధుమ", "कनक"], "season": "Rabi", "type": "Cereal"},
    "rice": {"names": ["rice", "paddy", "dhan", "धान", "चावल", "ಅಕ್ಕಿ", "వరి", "बासमती", "basmati"], "season": "Kharif", "type": "Cereal"},
    "cotton": {"names": ["cotton", "kapas", "कपास", "ಹತ್ತಿ", "పత్తి", "पत्ती"], "season": "Kharif", "type": "Commercial"},
    "tomato": {"names": ["tomato", "tamatar", "टमाटर", "ಟೊಮೇಟೊ", "టమోటా"], "season": "Year-round", "type": "Vegetable"},
    "onion": {"names": ["onion", "pyaz", "pyaaz", "प्याज़", "प्याज", "ಈರುಳ್ಳಿ", "ఉల్లిపాయ", "कांदा"], "season": "Rabi/Kharif", "type": "Vegetable"},
    "potato": {"names": ["potato", "aaloo", "aalu", "आलू", "ಆಲೂಗಡ್ಡೆ", "బంగాళాదుంప", "बटाटा"], "season": "Rabi", "type": "Tuber"},
    "mustard": {"names": ["mustard", "sarson", "सरसों", "सौंफ", "ಸಾಸಿವೆ", "ఆవాలు", "राई"], "season": "Rabi", "type": "Oilseed"},
    "soybean": {"names": ["soybean", "soya", "सोयाबीन", "ಸೋಯಾಬೀನ್", "సోయాబీన్"], "season": "Kharif", "type": "Oilseed"},
    "maize": {"names": ["maize", "makka", "corn", "मक्का", "ಜೋಳ", "మొక్కజొన్న", "भुट्टा"], "season": "Kharif", "type": "Cereal"},
    "gram": {"names": ["gram", "chana", "चना", "ಕಡಲೆ", "శనగలు", "छोले", "bengal gram"], "season": "Rabi", "type": "Pulse"},
    "sugarcane": {"names": ["sugarcane", "ganna", "गन्ना", "ಕಬ್ಬು", "చెరకు", "ऊँस"], "season": "Annual", "type": "Commercial"},
    "chilli": {"names": ["chilli", "mirch", "मिर्च", "ಮೆಣಸಿನಕಾಯಿ", "మిరపకాయ", "मिरची"], "season": "Year-round", "type": "Spice/Vegetable"},
    "groundnut": {"names": ["groundnut", "peanut", "moongphali", "मूंगफली", "ಕಡಲೆಕಾಯಿ", "వేరుశనగ"], "season": "Kharif", "type": "Oilseed"},
    "turmeric": {"names": ["turmeric", "haldi", "हल्दी", "ಅರಿಶಿನ", "పసుపు"], "season": "Annual", "type": "Spice"},
    "garlic": {"names": ["garlic", "lahsun", "लहसुन", "ಬೆಳ್ಳುಳ್ಳಿ", "వెల్లుల్లి"], "season": "Rabi", "type": "Spice"},
    "ginger": {"names": ["ginger", "adrak", "अदरक", "ಶುಂಠಿ", "అల్లం"], "season": "Annual", "type": "Spice"}
}

class SovereignEvonEngine:
    """
    Simulates sovereign Indic agricultural reasoning using Gnani Evon v3.3 architecture.
    Provides comprehensive coverage across Mandi prices, crop diseases, fertilizers,
    irrigation, government schemes, and rural logistics.
    """
    
    def __init__(self):
        self.model_name = "Gnani Evon v3.3 (30B MoE Indic Reasoning)"
        
    def reason(self, user_query: str, language_code: str = "hi-IN") -> Dict[str, Any]:
        """
        Analyze user query and return comprehensive structured reasoning,
        action items, voice answer text, and source references.
        """
        q = user_query.lower().strip()
        
        # 1. Check for Mandi/Price queries
        mandi_keywords = [
            "rate", "bhav", "price", "mandi", "bhaav", "भाव", "दाम", "मंडी", "ಮಂಡಿ", "ಬೆಲೆ", "ರೇటు",
            "మార్కెట్", "ధర", "quintal", "apmc", "market", "dar", "modal price"
        ]
        is_mandi = any(k in q for k in mandi_keywords)
        
        # 2. Check for Disease/Pest/Nutrient queries
        matched_disease = None
        for key, info in CROP_DISEASES.items():
            if any(sym.lower() in q for sym in info["symptoms"]):
                matched_disease = info
                break
                
        # 3. Check for Scheme queries
        scheme_keywords = [
            "scheme", "pm kisan", "pm-kisan", "pmkisan", "yojana", "bima", "subsidy", "योजना", "बीमा", "अनुदान",
            "पीएम", "पीएम किसान", "किसान सम्मान", "सम्मान निधि", "सम्माൺ", "samman", "nidhi", "6000", "fasal bima", "फसल बीमा", "pmfby",
            "ಸಾಲ", "స్కీమ్", "कार्ड", "card", "मृदा", "मिट्टी", "soil", "kcc", "credit card", "क्रेडिट कार्ड",
            "ऋण", "लोन", "installment", "किस्त", "dbt", "स्वास्थ्य", "రైతు భరోసా", "ಕಿಸಾನ್"
        ]
        is_scheme = any(k in q for k in scheme_keywords)
        
        # 4. Check for Kirana/Order queries
        kirana_keywords = ["order", "bori", "packet", "kirana", "dukaan", "बोरी", "दुकान", "खरीदना", "ఆర్డర్", "order book", "deliver", "डिलीवरी", "चाहिए"]
        is_kirana = any(k in q for k in kirana_keywords) and any(n in q for n in ["bori", "बोरी", "order", "kirana", "dap", "urea", "खाद", "दुकान", "पैकेट"])
        
        # --- A. Mandi Market Intelligence ---
        if is_mandi:
            matched_crops = search_mandi_prices(q)
            primary = matched_crops[0]
            
            # Clean crop and market names for pure spoken Indic delivery (No English or brackets in Hindi TTS)
            crop_spoken_hi = re.sub(r'^[A-Za-z\s]+|\(|\)', '', primary['crop']).strip() or primary['crop']
            if not crop_spoken_hi: crop_spoken_hi = "फसल"
            market_spoken_hi = primary['market'].replace("Mandi", "मंडी").replace("APMC", "").strip()

            # Formulate response based on language script and code
            if language_code.startswith("kn") or any('\u0c80' <= ch <= '\u0cff' for ch in q):
                voice_text = f"ಇಂದು {primary['market']} ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಬೆಲೆ ಕ್ವಿಂಟಾಲ್‌ಗೆ {primary['modal_price']} ರೂಪಾಯಿ ಇದೆ."
            elif language_code.startswith("te") or any('\u0c00' <= ch <= '\u0c7f' for ch in q):
                voice_text = f"ఈరోజు మార్కెట్‌లో సగటు ధర క్వింటాలుకు {primary['modal_price']} రూపాయలు ఉంది."
            elif language_code.startswith("hi") or any('\u0900' <= ch <= '\u097f' for ch in q) or "kya" in q or "bhav" in q or "mandi" in q:
                voice_text = f"आज {market_spoken_hi} में {crop_spoken_hi} का भाव {primary['modal_price']} रुपये प्रति क्विंटल है।"
            else: # English / Hinglish
                voice_clean = primary['crop'].split('(')[0].strip()
                voice_text = f"Today in {primary['market']}, {voice_clean} modal price is {primary['modal_price']} rupees per quintal."
                
            return {
                "category": "Mandi Market Intelligence",
                "model_used": self.model_name,
                "voice_text": voice_text,
                "structured_data": primary,
                "action_items": [
                    f"Check transportation cost to {primary['market']}",
                    f"Compare against MSP benchmark: ₹{primary.get('msp', 'N/A')}",
                    "Grade your produce (cleaning/moisture < 12%) for top band price"
                ],
                "confidence_score": 0.98
            }
            
        # --- B. Rural Kirana & Input Logistics ---
        elif is_kirana:
            voice_text = (
                "आपका किराना व खाद ऑर्डर रिकॉर्ड कर लिया गया है। "
                "2 बोरी DAP खाद (₹2,700) तथा 1 बोरी यूरिया (₹266)। कुल राशि ₹2,966 हुई। क्या आप डिलीवरी पुष्टि करते हैं?"
            )
            return {
                "category": "Rural Kirana & Input Logistics",
                "model_used": self.model_name,
                "voice_text": voice_text,
                "structured_data": {
                    "items": [
                        {"item": "DAP Fertilizer (50kg)", "qty": 2, "rate": 1350, "total": 2700},
                        {"item": "Neem Coated Urea (45kg)", "qty": 1, "rate": 266, "total": 266}
                    ],
                    "grand_total": 2966,
                    "currency": "INR"
                },
                "action_items": [
                    "Order created in rural dealer portal",
                    "Send SMS / WhatsApp confirmation receipt",
                    "UPI payment QR generated for pickup"
                ],
                "confidence_score": 0.98
            }

        # --- C. Crop Protection & Agronomy Diagnostics ---
        elif matched_disease:
            d = matched_disease
            if language_code.startswith("kn") or any('\u0c80' <= ch <= '\u0cff' for ch in q):
                voice_text = d.get("voice_kn") or "ಬೆಳೆ ರಕ್ಷಣೆಗೆ ಸೂಕ್ತ ಔಷಧ ಅಥವಾ ಬೇವಿನ ಎಣ್ಣೆ ಸಿಂಪಡಿಸಿ."
            elif language_code.startswith("te") or any('\u0c00' <= ch <= '\u0c7f' for ch in q):
                voice_text = d.get("voice_te") or "సమస్య నివారణకు సిఫార్సు చేసిన మందు లేదా వేప నూనెను పిచికారీ చేయండి."
            elif language_code.startswith("hi") or any('\u0900' <= ch <= '\u097f' for ch in q) or "dawa" in q or "kare" in q:
                voice_text = d.get("voice_hi") or "फसल सुरक्षा के लिए उचित दवा या नीम तेल का छिड़काव करें।"
            else:
                voice_text = d.get("voice_en") or f"For {d['title']}, spray the recommended treatment detailed below."
                
            return {
                "category": "Crop Protection & Diagnostics",
                "model_used": self.model_name,
                "voice_text": voice_text,
                "structured_data": d,
                "action_items": [
                    "Spray during morning hours (7-9 AM) or evening (4-6 PM)",
                    "Mix recommended chemical strictly with clean borehole water",
                    f"Organic option: {d.get('organic_remedy', 'Neem oil spray')}",
                    "Maintain recommended pre-harvest waiting interval"
                ],
                "confidence_score": 0.97
            }
            
        # --- C. Government Welfare Schemes ---
        elif is_scheme:
            scheme = GOVT_SCHEMES[0]
            if any(k in q for k in ["soil", "mitti", "मृदा", "मिट्टी", "jaanch", "ಮಣ್ಣು", "భూసార"]):
                scheme = GOVT_SCHEMES[3]
            elif any(k in q for k in ["kcc", "credit card", "क्रेडिट कार्ड", "ऋण", "लोन", "loan", "ಕ್ರೆಡಿಟ್", "క్రెడిట్"]):
                scheme = GOVT_SCHEMES[2]
            elif any(k in q for k in ["fasal bima", "pmfby", "bima", "बीमा", "claim", "insurance", "ಕ್ಲೈಮ್", "భీమా"]):
                scheme = GOVT_SCHEMES[1]
            elif any(k in q for k in ["pm kisan", "pm-kisan", "pmkisan", "samman nidhi", "किस्त", "installment", "dbt", "kisan", "पीएम", "सम्मान", "6000"]):
                scheme = GOVT_SCHEMES[0]

            code = scheme.get("code")
            
            if language_code.startswith("kn") or any('\u0c80' <= ch <= '\u0cff' for ch in q):
                if code == "pm_kisan":
                    voice_text = "ಪಿಎಂ ಕಿಸಾನ್ ಯೋಜನೆಯಡಿ ವಾರ್ಷಿಕ ರೂ. 6,000 ನೆರವು ದೊರೆಯುತ್ತದೆ. ವಿವರಗಳಿಗಾಗಿ pmkisan.gov.in ಪರಿಶೀಲಿಸಿ."
                elif code == "pmfby":
                    voice_text = "ಪ್ರಧಾನಮಂತ್ರಿ ಫಸಲ್ ಬಿಮಾ ಯೋಜನೆಯಲ್ಲಿ ಬೆಳೆ ನಷ್ಟಕ್ಕೆ ಪರಿಹಾರ ಪಡೆಯಲು 1800-180-1551 ಗೆ ಕರೆ ಮಾಡಿ."
                elif code == "kcc":
                    voice_text = "ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ ಮೂಲಕ 4% ಬಡ್ಡಿದರದಲ್ಲಿ ರೂ. 3 ಲಕ್ಷದವರೆಗೆ ಕೃಷಿ ಸಾಲ ಸಿಗುತ್ತದೆ."
                else: # soil_health
                    voice_text = "ಮಣ್ಣು ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಮೂಲಕ ಉಚಿತ ಮಣ್ಣು ಪರೀಕ್ಷೆ ನಡೆಸಿ ರಸಗೊಬ್ಬರದ ಖರ್ಚು ಉಳಿಸಿ."
            elif language_code.startswith("te") or any('\u0c00' <= ch <= '\u0c7f' for ch in q):
                if code == "pm_kisan":
                    voice_text = "పీఎం కిసాన్ పథకం కింద రైతులకు ఏడాదికి ₹6,000 సాయం అందుతుంది. స్టేటస్ కోసం pmkisan.gov.in చూడండి."
                elif code == "pmfby":
                    voice_text = "ప్రధానమంత్రి ఫసల్ బీమా యోజన పంట నష్టానికి బీమా రక్షణ ఇస్తుంది. క్లెయిమ్ కోసం 1800-180-1551 కు కాల్ చేయండి."
                elif code == "kcc":
                    voice_text = "కిసాన్ క్రెడిట్ కార్డు ద్వారా 4% రాయితీ వడ్డీకే రూ. 3 లక్షల వరకు పంట రుణాలు లభిస్తాయి."
                else: # soil_health
                    voice_text = "సాయిల్ హెల్త్ కార్డు ద్వారా ఉచితంగా మట్టి పరీక్ష చేయించి ఎరువుల ఖర్చు 25% ఆదా చేసుకోండి."
            elif language_code.startswith("hi") or any('\u0900' <= ch <= '\u097f' for ch in q) or "yojana" in q or "kare" in q:
                if code == "pm_kisan":
                    voice_text = "पीएम किसान योजना में सालाना ₹6,000 तीन किस्तों में सीधे बैंक खाते में मिलते हैं। स्टेटस हेतु pmkisan.gov.in देखें।"
                elif code == "pmfby":
                    voice_text = "प्रधानमंत्री फसल बीमा योजना से नुकसान पर क्लेम मिलता है। 72 घंटे में टोल-फ्री 1800-180-1551 पर सूचित करें।"
                elif code == "kcc":
                    voice_text = "किसान क्रेडिट कार्ड से मात्र 4% रियायती ब्याज पर ₹3 लाख तक का कृषि ऋण मिलता है।"
                else: # soil_health
                    voice_text = "मृदा स्वास्थ्य कार्ड से मिट्टी की निशुल्क जांच करवाएं और खाद का 25% खर्च बचाएं।"
            else: # English / Hinglish
                if code == "pm_kisan":
                    voice_text = "Under PM-KISAN, eligible farmers receive ₹6,000 annually. Check your status at pmkisan.gov.in."
                elif code == "pmfby":
                    voice_text = "PMFBY provides comprehensive crop damage insurance. Call toll-free 1800-180-1551 to register claims."
                elif code == "kcc":
                    voice_text = "Kisan Credit Card provides farm loans up to ₹3,00,000 at a 4% subsidized interest rate."
                else: # soil_health
                    voice_text = "Soil Health Card scheme offers free soil testing to save 25% on fertilizer expenses."

            action_items_map = {
                "pm_kisan": [
                    "Visit pmkisan.gov.in -> 'Beneficiary Status' with Aadhaar/Mobile",
                    "Complete biometric/OTP e-KYC on the portal or CSC center",
                    "Ensure bank account is NPCI-seeded for Direct Benefit Transfer (DBT)",
                    f"Call toll-free helpline {scheme.get('helpline', '155261')} for payment query"
                ],
                "pmfby": [
                    "Report crop damage within 72 hours via Crop Insurance Mobile App",
                    "Submit Sowing Certificate and Land Possession Certificate",
                    f"Call toll-free claim helpline {scheme.get('helpline', '1800-180-1551')}",
                    "Local survey team will visit field within 10 days for assessment"
                ],
                "kcc": [
                    "Obtain latest Land Record (Khatauni / Pahani / 7-12 extract)",
                    "Submit 1-page simplified KCC form at nearest public sector or rural bank",
                    "No collateral or processing fee charged for loans up to ₹1.60 lakh",
                    f"Call National Kisan Helpline {scheme.get('helpline', '1800-11-22-11')}"
                ],
                "soil_health": [
                    "Collect 0.5 kg composite soil sample in 'V' shape (0-15 cm depth)",
                    "Submit sample at nearest Krishi Vigyan Kendra (KVK) or Block Agriculture Office",
                    "Receive 12-parameter nutrient report card with tailored NPK dosage",
                    "Apply recommended bio-fertilizers to save 20-25% on urea & DAP"
                ]
            }

            return {
                "category": "Government Welfare Schemes & MSP Support",
                "model_used": self.model_name,
                "voice_text": voice_text,
                "structured_data": scheme,
                "action_items": action_items_map.get(code, [
                    "Check official scheme eligibility at nearest Agriculture Department office",
                    f"Call toll-free helpline {scheme.get('helpline', '1800-180-1551')}",
                    "Keep Aadhaar and Land Records updated for direct benefits"
                ]),
                "confidence_score": 0.98
            }
            

        # --- E. Dynamic Indic Agronomist Engine (Handles ALL other Crop Questions) ---
        else:
            return self._dynamic_crop_reasoning(q, user_query, language_code)

    def _dynamic_crop_reasoning(self, q: str, raw_query: str, language_code: str) -> Dict[str, Any]:
        """
        Dynamically reasons on any crop question including specific crops,
        unusual pests, weeds, fertilizers, or growth stages.
        """
        # 1. Identify crop mentioned
        detected_crop = None
        for crop_key, crop_meta in INDIAN_CROPS.items():
            if any(name in q for name in crop_meta["names"]):
                detected_crop = (crop_key, crop_meta)
                break
                
        crop_name = detected_crop[1]["names"][0].capitalize() if detected_crop else "Fasal (Crop)"
        crop_hindi = detected_crop[1]["names"][2] if detected_crop and len(detected_crop[1]["names"]) > 2 else "फसल"
        season = detected_crop[1]["season"] if detected_crop else "Season"
        
        # 2. Identify Intent
        is_insect = any(w in q for w in ["keeda", "keede", "कीड़ा", "कीट", "इल्ली", "सुंडी", "insect", "pest", "caterpillar", "worm"])
        is_fungus = any(w in q for w in ["fungus", "phaphoond", "फफूंद", "धब्बा", "सड़न", "गलना", "blight", "rot", "spot"])
        is_fertilizer = any(w in q for w in ["fertilizer", "khad", "urea", "dap", "खाद", "खुराक", "dose", "पोषण", "growth"])
        is_weed = any(w in q for w in ["weed", "ghas", "खरपतवार", "घास", "weedicide", "कचरा"])
        is_irrigation = any(w in q for w in ["water", "sinchai", "पानी", "सिंचाई", "watering", "dry"])
        is_yield = any(w in q for w in ["yield", "upaj", "पैदावार", "उपज", "increase", "उत्पादन"])

        if is_insect:
            title = f"{crop_hindi} में कीट व सुंडी नियंत्रण"
            diagnosis = f"{crop_name} में कीट/इल्ली का प्रकोप (Insect pest infestation)."
            remedy = "Chlorantraniliprole 18.5% SC @ 0.4 ml/L या Emamectin Benzoate 5% SG @ 0.5g/L पानी में मिलाकर छिड़काव करें।"
            organic = "नीम तेल 1500 ppm @ 3-5 ml प्रति लीटर पानी में 1 चम्मच शैम्पू मिलाकर शाम को स्प्रे करें।"
            voice_text = f"{crop_hindi} में कीट नियंत्रण के लिए इमामेक्टिन या नीम तेल का छिड़काव करें।"
        elif is_fungus:
            title = f"{crop_hindi} में फफूंद व रोग नियंत्रण"
            diagnosis = f"{crop_name} में फंगल संक्रमण या पत्ती धब्बा रोग (Fungal foliar disease)."
            remedy = "Mancozeb 75% WP @ 2.5g/L पानी या Carbendazim 12% + Mancozeb 63% (Saaf) @ 2g/L पानी का छिड़काव करें।"
            organic = "ट्राइकोडर्मा विरिडी (Trichoderma viride) @ 5g प्रति लीटर पानी का छिड़काव करें।"
            voice_text = f"{crop_hindi} में फफूंद व रोग नियंत्रण के लिए साफ फफूंदनाशक का छिड़काव करें।"
        elif is_fertilizer or is_yield:
            title = f"{crop_hindi} में संतुलित पोषण व खाद की खुराक"
            diagnosis = f"{crop_name} के लिए संतुलित पोषण व उपज वृद्धि प्रबंधन (ICAR Nutrient Protocol)."
            remedy = "बुवाई के समय 50 kg DAP + 25 kg MOP + 10 kg जिंक सल्फेट डालें। पहली सिंचाई पर 45 kg नीम लेपित यूरिया व नैनो यूरिया (4ml/L) का छिड़काव करें।"
            organic = "खेत में 2-3 ट्रॉली वर्मीकम्पोस्ट तथा 200 लीटर जीवामृत प्रति एकड़ सिंचाई के साथ दें।"
            voice_text = f"{crop_hindi} में अच्छी पैदावार के लिए संतुलित डीएपी, पोटाश और नैनो यूरिया का प्रयोग करें।"
        elif is_weed:
            title = f"{crop_hindi} में खरपतवार प्रबंधन"
            diagnosis = f"{crop_name} में चौड़ी व संकरी पत्ती के खरपतवार (Weed competition)."
            remedy = "फसल के अनुसार अनुशंसित चयनात्मक शाकनाशी का 150-200 लीटर पानी प्रति एकड़ में फ्लैट फैन नोजल से छिड़काव करें।"
            organic = "बुवाई के 20 और 40 दिन बाद हैंड वीडर या खुरपी से निराई-गुड़ाई करें।"
            voice_text = f"{crop_hindi} में खरपतवार नियंत्रण के लिए अनुशंसित शाकनाशी का छिड़काव या निराई करें।"
        elif is_irrigation:
            title = f"{crop_hindi} में सिंचाई प्रबंधन"
            diagnosis = f"{crop_name} में क्रांतिक अवस्थाओं पर जल प्रबंधन (Critical stage irrigation)."
            remedy = "फसल की क्रांतिक अवस्थाओं (जैसे जड़ जमाव, कल्ले फूटना व फूल आना) पर हल्की सिंचाई करें। जलभराव न होने दें।"
            organic = "खेत में पुआल या सूखी घास की 5-7 सेमी मल्चिंग करें जिससे 30% नमी सुरक्षित रहे।"
            voice_text = f"{crop_hindi} में क्रांतिक अवस्थाओं पर हल्की सिंचाई करें और जलभराव न होने दें।"
        else:
            title = f"{crop_hindi} की वैज्ञानिक कृषि सलाह"
            diagnosis = f"{crop_name} ({season} मौसम) के लिए प्रमाणित कृषि प्रबंधन सलाह."
            remedy = "फसल की अच्छी सेहत के लिए नियमित निगरानी रखें, संतुलित एनपीके (4:2:1) अनुपात का पालन करें और कीट दिखने पर तुरंत 1500 ppm नीम तेल का स्प्रे करें।"
            organic = "बीज उपचार के लिए ट्राइकोडर्मा @ 5g/kg तथा जैव उर्वरक एजोटोबैक्टर का उपयोग करें।"
            voice_text = f"{crop_hindi} की अच्छी पैदावार के लिए समय पर संतुलित खाद, पानी और कीट नियंत्रण करें।"
        if language_code.startswith("te") or any('\u0c00' <= ch <= '\u0c7f' for ch in q):
            voice_text = f"{crop_name} పంటలో సమస్య నివారణకు సిఫార్సు చేసిన మందు లేదా వేప నూనెను ఉదయం వేళ పిచికారీ చేయండి."
        elif language_code.startswith("kn") or any('\u0c80' <= ch <= '\u0cff' for ch in q):
            voice_text = f"{crop_name} ಬೆಳೆಯ ರಕ್ಷಣೆಗೆ ಸೂಕ್ತ ಔಷಧ ಅಥವಾ ಬೇವಿನ ಎಣ್ಣೆ ಸಿಂಪಡಿಸಿ."
        elif language_code.startswith("en") or "en-in" in language_code.lower():
            voice_text = f"For {crop_name} crop protection, apply the recommended remedy or neem oil as detailed below."
        else:
            voice_text = f"{crop_hindi} की फसल सुरक्षा के लिए अनुशंसित दवा या नीम तेल का छिड़काव सुबह या शाम करें।"

        structured = {
            "title": title,
            "crop": crop_name,
            "crop_hindi": crop_hindi,
            "season": season,
            "diagnosis": diagnosis,
            "remedy": remedy,
            "organic_remedy": organic,
            "warning": "दवा का छिड़काव सुबह 7-9 बजे या शाम 4-6 बजे करें। तेज धूप में छिड़काव न करें।"
        }

        return {
            "category": "Crop Science & Advisory",
            "model_used": self.model_name,
            "voice_text": voice_text,
            "structured_data": structured,
            "action_items": [
                f"Follow scientific dosage: {remedy[:60]}...",
                f"Organic alternative: {organic[:50]}...",
                "Use clean borehole water for spray tank",
                "Contact nearest Krishi Vigyan Kendra (KVK) for soil testing"
            ],
            "confidence_score": 0.95
        }

evon_engine = SovereignEvonEngine()
