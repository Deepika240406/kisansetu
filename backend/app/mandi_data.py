"""
Mandi and Government Schemes Database for Bharat Farmers
Contains APMC Mandi commodity rates, MSP benchmarks, and welfare schemes.
"""

MANDI_PRICES = [
    {
        "id": "1",
        "crop": "Wheat (गेहूं)",
        "crop_key": "wheat",
        "market": "Khanna Mandi",
        "district": "Ludhiana",
        "state": "Punjab",
        "variety": "Sharbati",
        "min_price": 2275,
        "max_price": 2550,
        "modal_price": 2420,
        "unit": "₹/Quintal",
        "msp": 2275,
        "status": "above_msp",
        "trend": "+2.5% this week"
    },
    {
        "id": "2",
        "crop": "Tomato (टमाटर)",
        "crop_key": "tomato",
        "market": "Kolar APMC",
        "district": "Kolar",
        "state": "Karnataka",
        "variety": "Hybrid Local",
        "min_price": 1800,
        "max_price": 2600,
        "modal_price": 2200,
        "unit": "₹/Quintal",
        "msp": None,
        "status": "volatile",
        "trend": "+8.4% surging due to rain"
    },
    {
        "id": "3",
        "crop": "Onion (प्याज़)",
        "crop_key": "onion",
        "market": "Lasalgaon Mandi",
        "district": "Nashik",
        "state": "Maharashtra",
        "variety": "Red Garwa",
        "min_price": 1900,
        "max_price": 3100,
        "modal_price": 2650,
        "unit": "₹/Quintal",
        "msp": None,
        "status": "high_demand",
        "trend": "Stable high demand"
    },
    {
        "id": "4",
        "crop": "Cotton (कपास)",
        "crop_key": "cotton",
        "market": "Warangal APMC",
        "district": "Warangal",
        "state": "Telangana",
        "variety": "Medium Staple",
        "min_price": 6800,
        "max_price": 7450,
        "modal_price": 7120,
        "unit": "₹/Quintal",
        "msp": 6620,
        "status": "above_msp",
        "trend": "+1.8% export demand"
    },
    {
        "id": "5",
        "crop": "Soybean (सोयाबीन)",
        "crop_key": "soybean",
        "market": "Indore Mandi",
        "district": "Indore",
        "state": "Madhya Pradesh",
        "variety": "Yellow-9305",
        "min_price": 4400,
        "max_price": 4900,
        "modal_price": 4680,
        "unit": "₹/Quintal",
        "msp": 4600,
        "status": "above_msp",
        "trend": "Strong oil mill bids"
    },
    {
        "id": "6",
        "crop": "Mustard / Sarson (सरसों)",
        "crop_key": "mustard",
        "market": "Bharatpur Mandi",
        "district": "Bharatpur",
        "state": "Rajasthan",
        "variety": "Black Seed",
        "min_price": 5350,
        "max_price": 5850,
        "modal_price": 5650,
        "unit": "₹/Quintal",
        "msp": 5650,
        "status": "at_msp",
        "trend": "Winter sowing arrivals steady"
    },
    {
        "id": "7",
        "crop": "Paddy / Rice (धान)",
        "crop_key": "paddy",
        "market": "Karnal Grain Market",
        "district": "Karnal",
        "state": "Haryana",
        "variety": "Basmati 1121",
        "min_price": 3800,
        "max_price": 4500,
        "modal_price": 4250,
        "unit": "₹/Quintal",
        "msp": 2183,
        "status": "premium",
        "trend": "Basmati exports robust"
    },
    {
        "id": "8",
        "crop": "Potato (आलू)",
        "crop_key": "potato",
        "market": "Agra Mandi",
        "district": "Agra",
        "state": "Uttar Pradesh",
        "variety": "Jyoti / Kufri",
        "min_price": 1200,
        "max_price": 1650,
        "modal_price": 1450,
        "unit": "₹/Quintal",
        "msp": None,
        "status": "normal",
        "trend": "New season stock coming"
    }
]

GOVT_SCHEMES = [
    {
        "code": "pm_kisan",
        "name": "PM-KISAN Samman Nidhi",
        "hindi_name": "प्रधानमंत्री किसान सम्मान निधि",
        "benefit": "₹6,000 per year in 3 direct DBT installments of ₹2,000 directly to bank account.",
        "eligibility": "All landholding farmer families across India with cultivable agricultural land.",
        "documents": "Aadhaar Card, Land Ownership Record (Khata/Khasra/ROR), Bank Account linked with NPCI/Aadhaar.",
        "procedure": "Visit pmkisan.gov.in -> Farmer Corner -> Check Beneficiary Status / Complete e-KYC via OTP.",
        "helpline": "155261 / 1800-115-526",
        "portal": "https://pmkisan.gov.in"
    },
    {
        "code": "pmfby",
        "name": "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
        "hindi_name": "प्रधानमंत्री फसल बीमा योजना",
        "benefit": "Comprehensive financial protection against non-preventable crop damage from drought, floods, unseasonal rain, hailstorms & pest outbreaks.",
        "premium": "1.5% for Rabi crops, 2.0% for Kharif crops, 5.0% for Annual Commercial / Horticultural crops.",
        "eligibility": "All farmers growing notified crops in notified areas, including sharecroppers and tenant farmers.",
        "documents": "Sowing Certificate, Land Possession Certificate, Bank Passbook, Aadhaar Card.",
        "procedure": "Report crop damage within 72 hours on the Crop Insurance App, nearest Agriculture Officer, or toll-free helpline.",
        "helpline": "1800-180-1551",
        "portal": "https://pmfby.gov.in"
    },
    {
        "code": "kcc",
        "name": "Kisan Credit Card (KCC)",
        "hindi_name": "किसान क्रेडिट कार्ड योजना",
        "benefit": "Subsidized institutional credit up to ₹3,00,000 at 4% effective annual interest rate (7% base minus 3% prompt repayment incentive). Zero collateral required up to ₹1.60 lakh.",
        "eligibility": "All farmers, owner cultivators, tenant farmers, oral lessees, sharecroppers, and SHGs/JLGs of farmers.",
        "documents": "Aadhaar Card, PAN Card, Land Records (Khatauni/Pahani/7-12 extract), Sowing declaration, 2 passport photos.",
        "procedure": "Submit simple 1-page application at any Public Sector / Regional Rural Bank branch or through CSC / Jan Samarth portal.",
        "helpline": "1800-11-22-11 / 1800-180-1111",
        "portal": "https://jansamarth.in"
    },
    {
        "code": "soil_health",
        "name": "Soil Health Card Scheme (मृदा स्वास्थ्य कार्ड)",
        "hindi_name": "राष्ट्रीय मृदा स्वास्थ्य कार्ड योजना",
        "benefit": "Free 12-parameter soil nutrient lab testing (NPK, Secondary nutrients S, Micro-nutrients Zn, Fe, Cu, Mn, Bo, and physical parameters pH, EC, OC) every 2 years with customized fertilizer dosage advisory.",
        "eligibility": "All farmers across all States and Union Territories in notified Gram Panchayats.",
        "documents": "Soil sample collected from 0.5-2.0 hectare plot, Farmer identity details, Land survey number.",
        "procedure": "Soil samples collected by State Agriculture Department or submitted at local Krishi Vigyan Kendra (KVK). Report issued within 3-4 weeks.",
        "impact": "Eliminates excessive urea/DAP usage by 20-25%, boosts crop yield by 10-15% and protects soil ecology.",
        "helpline": "1800-180-1551 (Kisan Call Centre)",
        "portal": "https://soilhealth.dac.gov.in"
    }
]

def search_mandi_prices(query: str):
    """Search mandi prices by crop name, aliases, or location keyword."""
    q = query.lower().strip()
    results = []
    
    # Multilingual aliases for high-accuracy voice search
    aliases = {
        "wheat": ["wheat", "gehu", "गेहूं", "ಗೋಧಿ", "గోధుమ", "khanna"],
        "tomato": ["tomato", "tamatar", "टमाटर", "ಟೊಮೇಟೊ", "టమోటా", "kolar"],
        "onion": ["onion", "pyaz", "pyaaz", "प्याज़", "प्याज", "ಈರುಳ್ಳಿ", "ఉల్లిపాయ", "nashik", "lasalgaon"],
        "cotton": ["cotton", "kapas", "कपास", "ಹತ್ತಿ", "పత్తి", "warangal"],
        "soybean": ["soybean", "soya", "सोयाबीन", "ಸೋಯಾಬೀನ್", "సోయాబీన్", "indore"],
        "mustard": ["mustard", "sarson", "सरसों", "ಸಾಸಿವೆ", "ఆవాలు", "bharatpur"],
        "paddy": ["paddy", "rice", "chawal", "dhan", "धान", "ಅಕ್ಕಿ", "వరి", "basmati", "karnal"],
        "potato": ["potato", "aaloo", "aalu", "आलू", "ಆಲೂಗಡ್ಡೆ", "బంగాళాదుంప", "agra"]
    }
    
    for item in MANDI_PRICES:
        ck = item["crop_key"]
        words = aliases.get(ck, [ck])
        
        matched = False
        for w in words:
            if w.lower() in q:
                matched = True
                break
                
        if not matched:
            if (item["crop_key"] in q or
                item["market"].lower() in q or
                item["district"].lower() in q or
                item["state"].lower() in q or
                q in item["crop"].lower() or 
                q in item["crop_key"] or 
                q in item["market"].lower()):
                matched = True
                
        if matched:
            results.append(item)
            
    return results if results else MANDI_PRICES
