import { Download, MapPin } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

function tByLanguage(language, messages) {
  return messages[language] || messages.en;
}

function getLocalizedRiskLabel(riskLevel, text) {
  if (riskLevel === 'High') {
    return text.high;
  }
  if (riskLevel === 'Medium') {
    return text.medium;
  }
  return text.low;
}

function getLocalizedPredictionLabel(rawLabel, language, text) {
  const normalized = String(rawLabel || '').toLowerCase();
  if (!normalized) {
    return text.pendingReview;
  }
  if (normalized.includes('no alzheimer') || normalized.includes('not detected')) {
    return tByLanguage(language, {
      en: 'No Alzheimer\'s',
      hi: 'अल्ज़ाइमर नहीं मिला',
      ta: 'அல்சைமர் இல்லை',
      ur: 'الزائمر نہیں ملا',
      gu: 'અલ્ઝાઇમર મળ્યું નથી'
    });
  }
  if (normalized.includes('detected') || normalized.includes('alzheim')) {
    return tByLanguage(language, {
      en: String(rawLabel),
      hi: 'अल्ज़ाइमर का संकेत मिला',
      ta: 'அல்சைமர் அறிகுறி கண்டறியப்பட்டது',
      ur: 'الزائمر کی علامت پائی گئی',
      gu: 'અલ્ઝાઇમરનો સંકેત મળ્યો'
    });
  }
  return String(rawLabel);
}

function buildHighRiskReasons(prediction, language) {
  const features = Array.isArray(prediction?.features) ? prediction.features : [];
  const reasons = [];

  const age = Number(features[0]);
  const smoking = Number(features[5]);
  const familyHistory = Number(features[10]);
  const cardiovascularDisease = Number(features[11]);
  const diabetes = Number(features[12]);
  const depression = Number(features[13]);
  const hypertension = Number(features[15]);
  const systolicBP = Number(features[16]);
  const diastolicBP = Number(features[17]);
  const totalCholesterol = Number(features[18]);
  const ldl = Number(features[19]);
  const mmse = Number(features[22]);
  const memoryComplaints = Number(features[24]);
  const confusion = Number(features[27]);
  const disorientation = Number(features[28]);
  const difficultyTasks = Number(features[30]);
  const forgetfulness = Number(features[31]);
  const isHindi = language === 'hi';
  const isTamil = language === 'ta';
  const isUrdu = language === 'ur';
  const isGujarati = language === 'gu';

  if (!Number.isNaN(age) && age >= 65) {
    reasons.push(
      isHindi
        ? `उम्र ${age} वर्ष है, जो संज्ञानात्मक गिरावट का महत्वपूर्ण जोखिम कारक है।`
        : isTamil
          ? `வயது ${age}, இது அறிவாற்றல் குறைவு அபாயத்திற்கு முக்கிய காரணி.`
          : isUrdu
            ? `عمر ${age} ہے، جو ادراکی کمی کے خطرے کا اہم عامل ہے۔`
            : isGujarati
              ? `ઉંમર ${age} છે, જે જ્ઞાનાત્મક ઘટાડા માટે મહત્વપૂર્ણ જોખમ કારક છે.`
              : `Age is ${age}, which is an important risk factor for cognitive decline.`
    );
  }
  if (!Number.isNaN(mmse) && mmse > 0 && mmse <= 24) {
    reasons.push(
      isHindi
        ? `MMSE स्कोर ${mmse} है, जो उल्लेखनीय संज्ञानात्मक कमी दर्शाता है।`
        : isTamil
          ? `MMSE மதிப்பெண் ${mmse}; குறிப்பிடத்தக்க அறிவாற்றல் குறைவை சுட்டிக்காட்டுகிறது.`
          : isUrdu
            ? `MMSE اسکور ${mmse} ہے، جو نمایاں ادراکی کمزوری ظاہر کرتا ہے۔`
            : isGujarati
              ? `MMSE સ્કોર ${mmse} છે, જે નોંધપાત્ર જ્ઞાનાત્મક ક્ષતિ દર્શાવે છે.`
              : `MMSE score is ${mmse}, indicating notable cognitive impairment.`
    );
  }
  if (memoryComplaints === 1 || forgetfulness === 1 || difficultyTasks === 1) {
    reasons.push(
      isHindi
        ? 'याददाश्त की शिकायत, भूलने की प्रवृत्ति या कार्य पूरा करने में कठिनाई मौजूद है।'
        : isTamil
          ? 'நினைவக குறைபாடு / மறதி / பணிகளை முடிக்க சிரமம் உள்ளது.'
          : isUrdu
            ? 'یادداشت شکایات / بھولنے کی عادت / کام مکمل کرنے میں دشواری موجود ہے۔'
            : isGujarati
              ? 'યાદશક્તિ ફરિયાદ / ભૂલકણપણું / કાર્ય પૂર્ણ કરવાની મુશ્કેલી હાજર છે.'
              : 'Memory complaints / forgetfulness / task-completion difficulty are present.'
    );
  }
  if (confusion === 1 || disorientation === 1) {
    reasons.push(
      isHindi
        ? 'भ्रम या दिशाभ्रम के लक्षण दर्ज हैं।'
        : isTamil
          ? 'குழப்பம் அல்லது திசைகுழப்ப அறிகுறிகள் பதிவாகியுள்ளன.'
          : isUrdu
            ? 'الجھن یا سمت کے فقدان کی علامات موجود ہیں۔'
            : isGujarati
              ? 'ગૂંચવણ અથવા દિશા ભ્રમના લક્ષણો નોંધાયા છે.'
              : 'Confusion or disorientation symptoms are reported.'
    );
  }
  if (familyHistory === 1) {
    reasons.push(
      isHindi
        ? 'अल्ज़ाइमर का पारिवारिक इतिहास मौजूद है।'
        : isTamil
          ? 'அல்சைமர் குடும்ப வரலாறு உள்ளது.'
          : isUrdu
            ? 'الزائمر کی خاندانی تاریخ موجود ہے۔'
            : isGujarati
              ? 'અલ્ઝાઇમરનું કુટુંબ ઇતિહાસ હાજર છે.'
              : 'Family history of Alzheimer’s is present.'
    );
  }
  if (hypertension === 1 || (!Number.isNaN(systolicBP) && systolicBP >= 140) || (!Number.isNaN(diastolicBP) && diastolicBP >= 90)) {
    reasons.push(
      isHindi
        ? 'रक्तचाप प्रोफाइल में वास्कुलर जोखिम दिखता है (उच्च रक्तचाप / बढ़ा हुआ BP)।'
        : isTamil
          ? 'இரத்த அழுத்த நிலை vaskular அபாயத்தை குறிக்கிறது (உயர் BP).'
          : isUrdu
            ? 'بلڈ پریشر پروفائل عروقی خطرہ دکھاتی ہے (بلند فشار خون / زیادہ BP)۔'
            : isGujarati
              ? 'બ્લડ પ્રેશર પ્રોફાઇલ વાસ્ક્યુલર જોખમ સૂચવે છે (ઉચ્ચ BP).'
              : 'Blood pressure profile suggests vascular risk (hypertension / elevated BP).'
    );
  }
  if (cardiovascularDisease === 1 || diabetes === 1) {
    reasons.push(
      isHindi
        ? 'हृदय-वाहिका रोग या मधुमेह मौजूद है, जो डिमेंशिया जोखिम बढ़ा सकता है।'
        : isTamil
          ? 'இதய நோய் அல்லது நீரிழிவு உள்ளது; இது dementia அபாயத்தை அதிகரிக்கலாம்.'
          : isUrdu
            ? 'دل کی بیماری یا ذیابیطس موجود ہے، جو ڈیمنشیا خطرہ بڑھا سکتی ہے۔'
            : isGujarati
              ? 'હૃદયરોગ અથવા મધુમેહ હાજર છે, જે ડિમેન્શિયા જોખમ વધારી શકે છે.'
              : 'Cardiovascular disease or diabetes is present, which can increase dementia risk.'
    );
  }
  if ((!Number.isNaN(totalCholesterol) && totalCholesterol >= 220) || (!Number.isNaN(ldl) && ldl >= 130)) {
    reasons.push(
      isHindi
        ? 'कोलेस्ट्रॉल मार्कर बढ़े हुए हैं (कुल कोलेस्ट्रॉल/LDL)।'
        : isTamil
          ? 'கொலஸ்ட்ரால் மதிப்புகள் உயர்ந்துள்ளன (மொத்தம்/LDL).'
          : isUrdu
            ? 'کولیسٹرول مارکر بلند ہیں (کل کولیسٹرول/LDL)۔'
            : isGujarati
              ? 'કોલેસ્ટ્રોલ માર્કર્સ વધેલા છે (કુલ/LDL).' 
              : 'Cholesterol markers are elevated (total cholesterol/LDL).'
    );
  }
  if (depression === 1) {
    reasons.push(
      isHindi
        ? 'अवसाद दर्ज है, जो संज्ञानात्मक गिरावट के जोखिम में योगदान कर सकता है।'
        : isTamil
          ? 'மனஅழுத்தம் பதிவாகியுள்ளது; இது அறிவாற்றல் குறைவு அபாயத்திற்கு காரணமாகலாம்.'
          : isUrdu
            ? 'ڈپریشن رپورٹ ہوا ہے اور ادراکی کمی کے خطرے میں اضافہ کر سکتا ہے۔'
            : isGujarati
              ? 'ડિપ્રેશન નોંધાયેલ છે અને જ્ઞાનાત્મક ઘટાડાના જોખમમાં ફાળો આપી શકે છે.'
              : 'Depression is reported and can contribute to cognitive decline risk.'
    );
  }
  if (smoking === 1) {
    reasons.push(
      isHindi
        ? 'धूम्रपान अतिरिक्त लाइफस्टाइल जोखिम कारक के रूप में मौजूद है।'
        : isTamil
          ? 'புகைபிடித்தல் கூடுதல் வாழ்க்கைமுறை அபாய காரணி.'
          : isUrdu
            ? 'تمباکو نوشی اضافی طرزِ زندگی خطرہ عامل ہے۔'
            : isGujarati
              ? 'ધૂમ્રપાન વધારાના જીવનશૈલી જોખમ કારક તરીકે હાજર છે.'
              : 'Smoking is present as an additional lifestyle risk factor.'
    );
  }

  return reasons.slice(0, 4);
}

function getShortConclusion({ predictionLabel, riskLevel, probabilityScore, language }) {
  const probabilityNumber = Number(probabilityScore);
  const probabilityText = Number.isNaN(probabilityNumber) ? null : `${(probabilityNumber * 100).toFixed(1)}%`;
  const isHindi = language === 'hi';
  const isTamil = language === 'ta';
  const isUrdu = language === 'ur';
  const isGujarati = language === 'gu';

  if (riskLevel === 'High') {
    if (isHindi) {
      return probabilityText
        ? `स्क्रीनिंग में अल्ज़ाइमर की संभावना (${predictionLabel}) उच्च जोखिम (${probabilityText}) के साथ दिखती है। क्लिनिकल फॉलो-अप की सलाह है।`
        : `स्क्रीनिंग में अल्ज़ाइमर की संभावना (${predictionLabel}) उच्च जोखिम के साथ दिखती है। क्लिनिकल फॉलो-अप की सलाह है।`;
    }
    if (isTamil) {
      return probabilityText
        ? `ஸ்கிரீனிங்கில் அல்சைமர் சாத்தியம் (${predictionLabel}) மற்றும் அதிக அபாயம் (${probabilityText}) காணப்படுகிறது. மருத்துவர் ஆலோசனை பெறவும்.`
        : `ஸ்கிரீனிங்கில் அல்சைமர் சாத்தியம் (${predictionLabel}) மற்றும் அதிக அபாயம் காணப்படுகிறது. மருத்துவர் ஆலோசனை பெறவும்.`;
    }
    if (isUrdu) {
      return probabilityText
        ? `اسکریننگ میں الزائمر امکان (${predictionLabel}) اور زیادہ رسک (${probabilityText}) ظاہر ہوتا ہے۔ کلینیکل فالو اپ تجویز ہے۔`
        : `اسکریننگ میں الزائمر امکان (${predictionLabel}) اور زیادہ رسک ظاہر ہوتا ہے۔ کلینیکل فالو اپ تجویز ہے۔`;
    }
    if (isGujarati) {
      return probabilityText
        ? `સ્ક્રીનિંગમાં અલ્ઝાઇમરની શક્યતા (${predictionLabel}) સાથે ઊંચું જોખમ (${probabilityText}) દેખાય છે. ક્લિનિકલ ફોલો-અપ કરો.`
        : `સ્ક્રીનિંગમાં અલ્ઝાઇમરની શક્યતા (${predictionLabel}) સાથે ઊંચું જોખમ દેખાય છે. ક્લિનિકલ ફોલો-અપ કરો.`;
    }
    return probabilityText
      ? `Screening indicates likely Alzheimer’s (${predictionLabel}) with high risk (${probabilityText}). Clinical follow-up is recommended.`
      : `Screening indicates likely Alzheimer’s (${predictionLabel}) with high risk. Clinical follow-up is recommended.`;
  }

  if (riskLevel === 'Medium') {
    if (isHindi) {
      return probabilityText
        ? `स्क्रीनिंग में मध्यम जोखिम (${probabilityText}) दिखता है। कृपया लक्षणों की निगरानी करें और क्लिनिकल सलाह लें।`
        : 'स्क्रीनिंग में मध्यम जोखिम दिखता है। कृपया लक्षणों की निगरानी करें और क्लिनिकल सलाह लें।';
    }
    if (isTamil) {
      return probabilityText
        ? `ஸ்கிரீனிங்கில் மிதமான அபாயம் (${probabilityText}) உள்ளது. அறிகுறிகளை கண்காணித்து மருத்துவர் ஆலோசனை பெறவும்.`
        : 'ஸ்கிரீனிங்கில் மிதமான அபாயம் உள்ளது. அறிகுறிகளை கண்காணித்து மருத்துவர் ஆலோசனை பெறவும்.';
    }
    if (isUrdu) {
      return probabilityText
        ? `اسکریننگ میں درمیانہ رسک (${probabilityText}) ہے۔ علامات کی نگرانی کریں اور کلینیکل مشورہ لیں۔`
        : 'اسکریننگ میں درمیانہ رسک ہے۔ علامات کی نگرانی کریں اور کلینیکل مشورہ لیں۔';
    }
    if (isGujarati) {
      return probabilityText
        ? `સ્ક્રીનિંગમાં મધ્યમ જોખમ (${probabilityText}) દેખાય છે. લક્ષણોનું નિરીક્ષણ કરો અને ક્લિનિકલ સલાહ લો.`
        : 'સ્ક્રીનિંગમાં મધ્યમ જોખમ દેખાય છે. લક્ષણોનું નિરીક્ષણ કરો અને ક્લિનિકલ સલાહ લો.';
    }
    return probabilityText
      ? `Screening indicates moderate risk (${probabilityText}). Please monitor symptoms and consider a clinical consultation.`
      : 'Screening indicates moderate risk. Please monitor symptoms and consider a clinical consultation.';
  }

  if (isHindi) {
    return probabilityText
      ? `स्क्रीनिंग में वर्तमान जोखिम कम (${probabilityText}) है और इस परीक्षण में अल्ज़ाइमर का मजबूत संकेत नहीं मिला।`
      : 'स्क्रीनिंग में वर्तमान जोखिम कम है और इस परीक्षण में अल्ज़ाइमर का मजबूत संकेत नहीं मिला।';
  }
  if (isTamil) {
    return probabilityText
      ? `ஸ்கிரீனிங்கில் தற்போதைய அபாயம் குறைவு (${probabilityText}); இந்த சோதனையில் அல்சைமர் வலுவான சிக்னல் இல்லை.`
      : 'ஸ்கிரீனிங்கில் தற்போதைய அபாயம் குறைவு; இந்த சோதனையில் அல்சைமர் வலுவான சிக்னல் இல்லை.';
  }
  if (isUrdu) {
    return probabilityText
      ? `اسکریننگ میں موجودہ رسک کم (${probabilityText}) ہے اور اس ٹیسٹ میں الزائمر کا مضبوط اشارہ نہیں ملا۔`
      : 'اسکریننگ میں موجودہ رسک کم ہے اور اس ٹیسٹ میں الزائمر کا مضبوط اشارہ نہیں ملا۔';
  }
  if (isGujarati) {
    return probabilityText
      ? `સ્ક્રીનિંગમાં હાલનું જોખમ ઓછું (${probabilityText}) છે અને આ ટેસ્ટમાં અલ્ઝાઇમરનો મજબૂત સંકેત નથી.`
      : 'સ્ક્રીનિંગમાં હાલનું જોખમ ઓછું છે અને આ ટેસ્ટમાં અલ્ઝાઇમરનો મજબૂત સંકેત નથી.';
  }

  return probabilityText
    ? `Screening indicates low current risk (${probabilityText}) and no strong Alzheimer’s signal in this test.`
    : 'Screening indicates low current risk and no strong Alzheimer’s signal in this test.';
}

function getRiskLevel(prediction) {
  const resultText = String(prediction?.result || '').toLowerCase();
  if (resultText.includes('no alzheimer') || resultText.includes('not detected')) {
    return 'Low';
  }
  if (resultText.includes('detected')) {
    return 'High';
  }

  const rawRisk =
    prediction?.risk_classification ||
    prediction?.riskLevel ||
    prediction?.risk ||
    prediction?.risk_level ||
    prediction?.level ||
    '';

  const normalizedRisk = String(rawRisk).toLowerCase();
  if (normalizedRisk.includes('high')) {
    return 'High';
  }
  if (normalizedRisk.includes('medium') || normalizedRisk.includes('moderate')) {
    return 'Medium';
  }
  if (normalizedRisk.includes('low')) {
    return 'Low';
  }

  const numericRisk = Number(rawRisk);
  if (!Number.isNaN(numericRisk)) {
    if (numericRisk === 0) {
      return 'High';
    }
    if (numericRisk === 1) {
      return 'Medium';
    }
    if (numericRisk === 2) {
      return 'Low';
    }
  }

  const numericPrediction = Number(prediction?.prediction);
  if (!Number.isNaN(numericPrediction)) {
    if (numericPrediction === 1) {
      return 'High';
    }
    if (numericPrediction === 0) {
      return 'Low';
    }
    if (numericPrediction === 2) {
      return 'Medium';
    }
  }

  const numericScore = Number(
    prediction?.probability_score || prediction?.probability || prediction?.confidence || prediction?.score || 0
  );

  if (!Number.isNaN(numericScore)) {
    if (numericScore >= 0.7) {
      return 'High';
    }
    if (numericScore >= 0.4) {
      return 'Medium';
    }
  }

  return 'Low';
}

function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const { prediction: contextPrediction, text, language } = useAppContext();

  const prediction = location.state?.prediction || contextPrediction;

  const rawPredictionLabel =
    prediction?.result || prediction?.prediction || prediction?.label || prediction?.diagnosis || prediction?.result;

  const predictionLabel = getLocalizedPredictionLabel(rawPredictionLabel, language, text);

  const probabilityScore =
    prediction?.probability_score ||
    prediction?.probability ||
    prediction?.confidence ||
    prediction?.score ||
    'N/A';

  const riskLevel = getRiskLevel(prediction);
  const riskClassification = prediction?.risk_classification || riskLevel;
  const localizedRiskLevel = getLocalizedRiskLabel(riskLevel, text);
  const localizedRiskClassification = getLocalizedRiskLabel(riskClassification, text);
  const shortConclusion = getShortConclusion({ predictionLabel: String(predictionLabel), riskLevel, probabilityScore, language });
  const highRiskReasons = riskLevel === 'High' ? buildHighRiskReasons(prediction, language) : [];
  const riskPercent = riskLevel === 'High' ? 92 : riskLevel === 'Medium' ? 62 : 30;

  const riskColor =
    riskLevel === 'High'
      ? 'bg-rose-500'
      : riskLevel === 'Medium'
        ? 'bg-amber-500'
        : 'bg-emerald-500';

  const handleDownloadReport = () => {
    const content = {
      app: 'SwasthyaSetu AI',
      timestamp: new Date().toISOString(),
      prediction
    };

    const blob = new Blob([JSON.stringify(content, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'swasthyasetu-alzheimer-report.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFindPhc = () => {
    window.open('https://www.google.com/maps/search/nearest+public+health+center', '_blank', 'noopener,noreferrer');
  };

  if (!prediction) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6">
        <section className="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-blue-100">
          <h1 className="text-3xl font-bold text-blue-800">{text.resultTitle}</h1>
          <p className="mt-4 text-xl text-slate-700">{text.noData}</p>
          <button
            onClick={() => navigate('/assessment')}
            className="mt-6 rounded-xl bg-blue-700 px-4 py-3 text-lg font-semibold text-white"
          >
            {text.giveTestAgain}
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6">
      <section className="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-blue-100">
        <h1 className="text-3xl font-bold text-blue-800">{text.resultTitle}</h1>
        <p className="mt-1 text-lg text-slate-600">{text.reportSubtitle}</p>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-lg font-semibold text-slate-800">{text.riskLevel}</p>
            <p className="text-lg font-bold text-slate-900">{localizedRiskLevel}</p>
          </div>
          <div className="mt-3 h-4 w-full rounded-full bg-slate-100">
            <div className={`h-4 rounded-full ${riskColor}`} style={{ width: `${riskPercent}%` }} />
          </div>
          <div className="mt-2 flex justify-between text-sm font-semibold text-slate-600">
            <span>{text.low}</span>
            <span>{text.medium}</span>
            <span>{text.high}</span>
          </div>
        </div>

        <div className="mt-6 space-y-4 rounded-xl bg-blue-50 p-5">
          <p className="text-lg text-slate-700">
            <span className="font-semibold text-blue-800">{text.predictionLabel}: </span>
            {String(predictionLabel)}
          </p>
          <p className="text-lg text-slate-700">
            <span className="font-semibold text-blue-800">{text.probabilityScore}: </span>
            {String(probabilityScore)}
          </p>
          <p className="text-lg text-slate-700">
            <span className="font-semibold text-blue-800">{text.riskClassification}: </span>
            {String(localizedRiskClassification)}
          </p>
          {prediction?.cognitive_score !== undefined || prediction?.cognitiveScore !== undefined ? (
            <p className="text-lg text-slate-700">
              <span className="font-semibold text-blue-800">{text.cognitiveScoreResult}: </span>
              {prediction.cognitive_score ?? prediction.cognitiveScore} / 4
            </p>
          ) : null}
        </div>

        <div className="mt-6 space-y-3 rounded-xl border border-blue-100 bg-white p-5">
          <p className="text-lg text-slate-700">
            <span className="font-semibold text-blue-800">{text.shortConclusionTitle}: </span>
            {shortConclusion}
          </p>

          {riskLevel === 'High' ? (
            <div>
              <p className="text-lg font-semibold text-blue-800">{text.whyHighTitle}</p>
              {highRiskReasons.length ? (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-base text-slate-700">
                  {highRiskReasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-base text-slate-700">{text.whyHighFallback}</p>
              )}
            </div>
          ) : null}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            onClick={handleDownloadReport}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-lg font-semibold text-white"
          >
            <Download className="h-5 w-5" />
            {text.downloadReport}
          </button>

          <button
            onClick={handleFindPhc}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-lg font-semibold text-white"
          >
            <MapPin className="h-5 w-5" />
            {text.findPhc}
          </button>
        </div>

        <button
          onClick={() => navigate('/assessment')}
          className="mt-4 w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-lg font-semibold text-blue-700 sm:w-auto"
        >
          {text.giveTestAgain}
        </button>
      </section>
    </main>
  );
}

export default Result;