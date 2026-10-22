// Multilingual Crop Matrix and Category Definitions for Agro Link Market
// Supports 7 Languages: English (en), Tamil (ta), Marathi (mr), Hindi (hi), Telugu (te), Kannada (kn), Malayalam (ml)

export const CROP_CATEGORIES = [
  {
    id: 'Fruits',
    name: {
      en: 'Fruits',
      ta: 'பழங்கள்',
      mr: 'फळे',
      hi: 'फल',
      te: 'పండ్లు',
      kn: 'ಹಣ್ಣುಗಳು',
      ml: 'പഴങ്ങൾ'
    }
  },
  {
    id: 'Vegetables',
    name: {
      en: 'Vegetables',
      ta: 'காய்கறிகள்',
      mr: 'भाजीपाला',
      hi: 'सब्जियां',
      te: 'కూరగాయలు',
      kn: 'ತರಕಾರಿಗಳು',
      ml: 'பച്ചക്കറികൾ'
    }
  },
  {
    id: 'Cereals & Grains',
    name: {
      en: 'Cereals & Grains',
      ta: 'தானியங்கள் & பருப்புகள்',
      mr: 'धान्य व कधान्ये',
      hi: 'अनाज और खाद्यान्न',
      te: 'ధాన్యాలు & గింజలు',
      kn: 'ಧಾನ್ಯಗಳು',
      ml: 'ധാന്യങ്ങൾ'
    }
  },
  {
    id: 'Oilseeds',
    name: {
      en: 'Oilseeds',
      ta: 'எண்ணெய் வித்துக்கள்',
      mr: 'गिणती तेलबिया',
      hi: 'तिलहन',
      te: 'నూనె గింజలు',
      kn: 'ಎಣ್ಣೆಕಾಳುಗಳು',
      ml: 'എണ്ണക്കുരുക്കൾ'
    }
  },
  {
    id: 'Pulses',
    name: {
      en: 'Pulses',
      ta: 'பருப்பு வகைகள்',
      mr: 'डाळी',
      hi: 'दलहन',
      te: 'పప్పుధాన్యాలు',
      kn: 'ಬೇಳೆಕಾಳುಗಳು',
      ml: 'പയറുവർഗ്ഗങ്ങൾ'
    }
  },
  {
    id: 'Fiber Crops',
    name: {
      en: 'Fiber Crops',
      ta: 'நார் பயிர்கள்',
      mr: 'कापूस व धागा पिके',
      hi: 'रेशेदार फसलें',
      te: 'పీచు పంటలు',
      kn: 'ನಾರಿನ ಬೆಳೆಗಳು',
      ml: 'നാര് വിളകൾ'
    }
  },
  {
    id: 'Leafy Greens',
    name: {
      en: 'Leafy Greens',
      ta: 'கீரை வகைகள்',
      mr: 'पालेभाज्या',
      hi: 'पातेदार सब्जियां',
      te: 'ఆకుకూరలు',
      kn: 'ಸொಪ್ಪುಗಳು',
      ml: 'ഇലക്കറികൾ'
    }
  }
];

export const CROPS_DATA = [
  // Fruits
  {
    id: 'Mango',
    category: 'Fruits',
    names: {
      en: 'Mango',
      ta: 'மாம்பழம்',
      mr: 'आंबा',
      hi: 'आम',
      te: 'మామిడి',
      kn: 'ಮಾವು',
      ml: 'മാങ്ങ'
    }
  },
  {
    id: 'Grapes',
    category: 'Fruits',
    names: {
      en: 'Grapes',
      ta: 'திராட்சை',
      mr: 'द्राक्षे',
      hi: 'अंगूर',
      te: 'ద్రాక్ష',
      kn: 'ದ್ರಾಕ್ಷಿ',
      ml: 'മുന്തിരി'
    }
  },
  {
    id: 'Watermelon',
    category: 'Fruits',
    names: {
      en: 'Watermelon',
      ta: 'தர்பூசணி',
      mr: 'कलिंगड',
      hi: 'तरबूज',
      te: 'పుచ్చకాయ',
      kn: 'ಕಲ್ಲಂಗಡಿ',
      ml: 'തണ്ണിമത്തൻ'
    }
  },

  // Vegetables
  {
    id: 'Cucumber',
    category: 'Vegetables',
    names: {
      en: 'Cucumber',
      ta: 'வெள்ளரிக்காய்',
      mr: 'काकडी',
      hi: 'खीरा / ककड़ी',
      te: 'దోసకాయ',
      kn: 'ಸೌತೆಕಾಯಿ',
      ml: 'വെള്ളരിക്ക'
    }
  },
  {
    id: 'Tomato',
    category: 'Vegetables',
    names: {
      en: 'Tomato',
      ta: 'தக்காளி',
      mr: 'टोमॅटो',
      hi: 'टमाटर',
      te: 'టమోటా',
      kn: 'ಟೊಮೆಟೊ',
      ml: 'தக்காளி'
    }
  },
  {
    id: 'Potato',
    category: 'Vegetables',
    names: {
      en: 'Potato',
      ta: 'உருளைக்கிழங்கு',
      mr: 'बटाटा',
      hi: 'आलू',
      te: 'బంగాళాదుంప',
      kn: 'ಆಲೂಗಡ್ಡೆ',
      ml: 'உരുളക്കിഴങ്ങ്'
    }
  },
  {
    id: 'Onion',
    category: 'Vegetables',
    names: {
      en: 'Onion',
      ta: 'வெங்காயம்',
      mr: 'कांदा',
      hi: 'प्याज',
      te: 'ఉల్లిపాయ',
      kn: 'ఈరుಳ್ಳಿ',
      ml: 'സവാള'
    }
  },

  // Cereals & Grains
  {
    id: 'Rice',
    category: 'Cereals & Grains',
    names: {
      en: 'Rice',
      ta: 'நெல் / அரிசி',
      mr: 'तांदूळ',
      hi: 'चावल / धान',
      te: 'బియ్యం / వరి',
      kn: 'ಅಕ್ಕಿ / ಭತ್ತ',
      ml: 'അരി / നെല്ല്'
    }
  },
  {
    id: 'Corn (Maize)',
    category: 'Cereals & Grains',
    names: {
      en: 'Corn (Maize)',
      ta: 'மக்காச்சோளம்',
      mr: 'मका',
      hi: 'मक्का',
      te: 'మొక్కజొన్న',
      kn: 'ಮೆಕ್ಕೆಜೋಳ',
      ml: 'ചോളം'
    }
  },
  {
    id: 'Wheat',
    category: 'Cereals & Grains',
    names: {
      en: 'Wheat',
      ta: 'கோதுமை',
      mr: 'गहू',
      hi: 'गेहूँ',
      te: 'గోధుమ',
      kn: 'ಗೋಧಿ',
      ml: 'ഗോതമ്പ്'
    }
  },

  // Oilseeds
  {
    id: 'Soybean',
    category: 'Oilseeds',
    names: {
      en: 'Soybean',
      ta: 'சோயாபீன்',
      mr: 'सोयाबीन',
      hi: 'सोयाबीन',
      te: 'సోయాబీన్',
      kn: 'ಸೋಯಾಬೀನ್',
      ml: 'സോയാബീൻ'
    }
  },
  {
    id: 'Mustard',
    category: 'Oilseeds',
    names: {
      en: 'Mustard',
      ta: 'கடுகு',
      mr: 'मोहरी',
      hi: 'सरसों',
      te: 'ఆవాలు',
      kn: 'சಾಸಿವೆ',
      ml: 'கടുക്'
    }
  },

  // Pulses
  {
    id: 'Chickpeas',
    category: 'Pulses',
    names: {
      en: 'Chickpeas',
      ta: 'கொண்டைக்கடலை',
      mr: 'हरभरा',
      hi: 'चना',
      te: 'శనగలు',
      kn: 'ಕಡಲೆ',
      ml: 'கடല'
    }
  },

  // Fiber Crops
  {
    id: 'Cotton',
    category: 'Fiber Crops',
    names: {
      en: 'Cotton',
      ta: 'பருத்தி',
      mr: 'कापूस',
      hi: 'कपास',
      te: 'పత్తి',
      kn: 'ಹತ್ತಿ',
      ml: 'പരുത്തി'
    }
  },

  // Leafy Greens
  {
    id: 'Spinach',
    category: 'Leafy Greens',
    names: {
      en: 'Spinach',
      ta: 'பாலக்கீரை',
      mr: 'पालक',
      hi: 'पालक',
      te: 'పాలకూర',
      kn: 'ಪಾಲಕ್',
      ml: 'പാലക്'
    }
  },
  {
    id: 'Amaranth',
    category: 'Leafy Greens',
    names: {
      en: 'Amaranth',
      ta: 'தண்டுக்கீரை',
      mr: 'राजगिरा / माठ',
      hi: 'चौलाई',
      te: 'తోటకూర',
      kn: 'ದಂಟು',
      ml: 'ചീര'
    }
  },
  {
    id: 'Coriander',
    category: 'Leafy Greens',
    names: {
      en: 'Coriander',
      ta: 'கொத்தமல்லி',
      mr: 'கோத்தமல்லி',
      hi: 'धनिया',
      te: 'కొత్తిమీర',
      kn: 'ಕೊತ್ತಂಬರಿ',
      ml: 'മല്ലിയില'
    }
  },
  {
    id: 'Fenugreek Leaves',
    category: 'Leafy Greens',
    names: {
      en: 'Fenugreek Leaves',
      ta: 'வெந்தயக்கீரை',
      mr: 'मेथी',
      hi: 'मेथी',
      te: 'మెంతికూర',
      kn: 'ಮೆಂತ್ಯ ಸೊಪ್ಪು',
      ml: 'ഉലുവയില'
    }
  },
  {
    id: 'Drumstick Leaves',
    category: 'Leafy Greens',
    names: {
      en: 'Drumstick Leaves',
      ta: 'முருங்கைக்கீரை',
      mr: 'शेवग्याची पाने',
      hi: 'सहजन के पत्ते',
      te: 'మునగాకు',
      kn: 'ನುಗ್ಗೆ ಸೊಪ್ಪು',
      ml: 'മുരിങ്ങയില'
    }
  }
];

// Helper function to resolve localized crop name from any canonical ID or string
export const getCropName = (cropInput, lang = 'en') => {
  if (!cropInput) return '';
  const cleanInput = String(cropInput).trim().toLowerCase();
  
  const match = CROPS_DATA.find(c => 
    c.id.toLowerCase() === cleanInput ||
    c.names.en.toLowerCase() === cleanInput ||
    Object.values(c.names).some(n => String(n).toLowerCase() === cleanInput)
  );

  if (match) {
    return match.names[lang] || match.names.en || cropInput;
  }

  return cropInput;
};

// Helper function to resolve category name
export const getCategoryName = (catInput, lang = 'en') => {
  if (!catInput) return '';
  const cleanInput = String(catInput).trim().toLowerCase();
  const match = CROP_CATEGORIES.find(c => c.id.toLowerCase() === cleanInput || c.name.en.toLowerCase() === cleanInput);
  if (match) {
    return match.name[lang] || match.name.en || catInput;
  }
  return catInput;
};
