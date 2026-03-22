import { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Mic } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { getPrediction, saveAssessment } from "../services/api";

const FIELD_LABELS = {
  hi: {
    Age: 'उम्र',
    Gender: 'लिंग',
    Ethnicity: 'जातीय समूह',
    EducationLevel: 'शिक्षा स्तर',
    BMI: 'बीएमआई (BMI)',
    Smoking: 'धूम्रपान',
    AlcoholConsumption: 'शराब सेवन',
    PhysicalActivity: 'शारीरिक गतिविधि',
    DietQuality: 'आहार गुणवत्ता',
    SleepQuality: 'नींद की गुणवत्ता',
    FamilyHistoryAlzheimers: 'अल्ज़ाइमर का पारिवारिक इतिहास',
    CardiovascularDisease: 'हृदय-वाहिका रोग',
    Diabetes: 'मधुमेह',
    Depression: 'अवसाद',
    HeadInjury: 'सिर की चोट',
    Hypertension: 'उच्च रक्तचाप',
    SystolicBP: 'सिस्टोलिक बीपी',
    DiastolicBP: 'डायस्टोलिक बीपी',
    CholesterolTotal: 'कुल कोलेस्ट्रॉल',
    CholesterolLDL: 'एलडीएल कोलेस्ट्रॉल',
    CholesterolHDL: 'एचडीएल कोलेस्ट्रॉल',
    CholesterolTriglycerides: 'ट्राइग्लिसराइड्स',
    MMSE: 'एमएमएसई (MMSE)',
    FunctionalAssessment: 'कार्यात्मक आकलन',
    MemoryComplaints: 'याददाश्त की शिकायत',
    BehavioralProblems: 'व्यवहार संबंधी समस्याएँ',
    ADL: 'दैनिक गतिविधियाँ (ADL)',
    Confusion: 'भ्रम',
    Disorientation: 'दिशाभ्रम',
    PersonalityChanges: 'व्यक्तित्व में बदलाव',
    DifficultyCompletingTasks: 'कार्य पूरा करने में कठिनाई',
    Forgetfulness: 'भूलने की प्रवृत्ति',
    DoctorInCharge_XXXconfid: 'डॉक्टर का विश्वास स्तर'
  },
  ta: {
    Age: 'வயது',
    Gender: 'பாலினம்',
    Ethnicity: 'இனக்குழு',
    EducationLevel: 'கல்வி நிலை',
    BMI: 'BMI',
    Smoking: 'புகைபிடித்தல்',
    AlcoholConsumption: 'மதுபானம்',
    PhysicalActivity: 'உடற்பயிற்சி',
    DietQuality: 'உணவு தரம்',
    SleepQuality: 'தூக்க தரம்',
    FamilyHistoryAlzheimers: 'அல்சைமர் குடும்ப வரலாறு',
    CardiovascularDisease: 'இதய-இரத்த நாள நோய்',
    Diabetes: 'நீரிழிவு',
    Depression: 'மன அழுத்தம்',
    HeadInjury: 'தலை காயம்',
    Hypertension: 'உயர் இரத்த அழுத்தம்',
    SystolicBP: 'சிஸ்டாலிக் BP',
    DiastolicBP: 'டையாஸ்டாலிக் BP',
    CholesterolTotal: 'மொத்த கொலஸ்ட்ரால்',
    CholesterolLDL: 'LDL கொலஸ்ட்ரால்',
    CholesterolHDL: 'HDL கொலஸ்ட்ரால்',
    CholesterolTriglycerides: 'டிரைகிளிசரைட்ஸ்',
    MMSE: 'MMSE',
    FunctionalAssessment: 'செயல்திறன் மதிப்பீடு',
    MemoryComplaints: 'நினைவக குறைபாடு புகார்',
    BehavioralProblems: 'நடத்தை சிக்கல்கள்',
    ADL: 'ADL',
    Confusion: 'குழப்பம்',
    Disorientation: 'திசை குழப்பம்',
    PersonalityChanges: 'நற்பண்பு மாற்றம்',
    DifficultyCompletingTasks: 'பணிகளை முடிக்க சிரமம்',
    Forgetfulness: 'மறதி',
    DoctorInCharge_XXXconfid: 'மருத்துவர் நம்பிக்கை நிலை'
  },
  ur: {
    Age: 'عمر',
    Gender: 'جنس',
    Ethnicity: 'نسلی گروپ',
    EducationLevel: 'تعلیم کی سطح',
    BMI: 'BMI',
    Smoking: 'تمباکو نوشی',
    AlcoholConsumption: 'شراب نوشی',
    PhysicalActivity: 'جسمانی سرگرمی',
    DietQuality: 'غذا کا معیار',
    SleepQuality: 'نیند کا معیار',
    FamilyHistoryAlzheimers: 'الزائمر خاندانی تاریخ',
    CardiovascularDisease: 'دل اور شریان کی بیماری',
    Diabetes: 'ذیابیطس',
    Depression: 'ڈپریشن',
    HeadInjury: 'سر کی چوٹ',
    Hypertension: 'بلند فشار خون',
    SystolicBP: 'سسٹولک BP',
    DiastolicBP: 'ڈایاسٹولک BP',
    CholesterolTotal: 'کل کولیسٹرول',
    CholesterolLDL: 'LDL کولیسٹرول',
    CholesterolHDL: 'HDL کولیسٹرول',
    CholesterolTriglycerides: 'ٹرائی گلیسرائیڈ',
    MMSE: 'MMSE',
    FunctionalAssessment: 'فعالیاتی جانچ',
    MemoryComplaints: 'یادداشت شکایات',
    BehavioralProblems: 'رویہ جاتی مسائل',
    ADL: 'ADL',
    Confusion: 'الجھن',
    Disorientation: 'سمت کا فقدان',
    PersonalityChanges: 'شخصیت میں تبدیلی',
    DifficultyCompletingTasks: 'کام مکمل کرنے میں دشواری',
    Forgetfulness: 'بھولنے کی عادت',
    DoctorInCharge_XXXconfid: 'ڈاکٹر اعتماد سطح'
  },
  gu: {
    Age: 'ઉંમર',
    Gender: 'લિંગ',
    Ethnicity: 'જાતિ જૂથ',
    EducationLevel: 'શિક્ષણ સ્તર',
    BMI: 'BMI',
    Smoking: 'ધૂમ્રપાન',
    AlcoholConsumption: 'મદ્યપાન',
    PhysicalActivity: 'શારીરિક પ્રવૃત્તિ',
    DietQuality: 'આહાર ગુણવત્તા',
    SleepQuality: 'ઊંઘની ગુણવત્તા',
    FamilyHistoryAlzheimers: 'અલ્ઝાઇમર કુટુંબ ઇતિહાસ',
    CardiovascularDisease: 'હૃદય-રક્તવાહિની રોગ',
    Diabetes: 'મધુમેહ',
    Depression: 'ડિપ્રેશન',
    HeadInjury: 'માથાની ઇજા',
    Hypertension: 'ઉચ્ચ રક્તચાપ',
    SystolicBP: 'સિસ્ટોલિક BP',
    DiastolicBP: 'ડાયસ્ટોલિક BP',
    CholesterolTotal: 'કુલ કોલેસ્ટ્રોલ',
    CholesterolLDL: 'LDL કોલેસ્ટ્રોલ',
    CholesterolHDL: 'HDL કોલેસ્ટ્રોલ',
    CholesterolTriglycerides: 'ટ્રાઇગ્લિસરાઇડ્સ',
    MMSE: 'MMSE',
    FunctionalAssessment: 'કાર્યાત્મક મૂલ્યાંકન',
    MemoryComplaints: 'યાદશક્તિ ફરિયાદો',
    BehavioralProblems: 'વર્તન સમસ્યાઓ',
    ADL: 'ADL',
    Confusion: 'ગૂંચવણ',
    Disorientation: 'દિશા ભ્રમ',
    PersonalityChanges: 'વ્યક્તિત્વ ફેરફાર',
    DifficultyCompletingTasks: 'કાર્ય પૂર્ણ કરવા મુશ્કેલી',
    Forgetfulness: 'ભૂલકણપણું',
    DoctorInCharge_XXXconfid: 'ડોક્ટર વિશ્વાસ સ્તર'
  }
};

const OPTION_LABELS = {
  Male: { hi: 'पुरुष', ta: 'ஆண்', ur: 'مرد', gu: 'પુરુષ' },
  Female: { hi: 'महिला', ta: 'பெண்', ur: 'خاتون', gu: 'સ્ત્રી' },
  Other: { hi: 'अन्य', ta: 'மற்றவை', ur: 'دیگر', gu: 'અન્ય' },
  'Group 0': { hi: 'समूह 0', ta: 'குழு 0', ur: 'گروپ 0', gu: 'જૂથ 0' },
  'Group 1': { hi: 'समूह 1', ta: 'குழு 1', ur: 'گروپ 1', gu: 'જૂથ 1' },
  'Group 2': { hi: 'समूह 2', ta: 'குழு 2', ur: 'گروپ 2', gu: 'જૂથ 2' },
  High: { hi: 'खराब', ta: 'மோசம்', ur: 'خراب', gu: 'નબળું' },
  Medium: { hi: 'मध्यम', ta: 'மிதம்', ur: 'درمیانہ', gu: 'મધ્યમ' },
  Moderate: { hi: 'मध्यम', ta: 'மிதம்', ur: 'درمیانہ', gu: 'મધ્યમ' },
  Low: { hi: 'अच्छा', ta: 'நன்று', ur: 'اچھا', gu: 'સારું' },
  Poor: { hi: 'खराब', ta: 'மோசம்', ur: 'خراب', gu: 'નબળું' },
  Average: { hi: 'औसत', ta: 'சராசரி', ur: 'اوسط', gu: 'સરેરાશ' },
  Good: { hi: 'अच्छा', ta: 'நன்று', ur: 'اچھा', gu: 'સારું' },
  No: { hi: 'नहीं', ta: 'இல்லை', ur: 'نہیں', gu: 'ના' },
  Yes: { hi: 'हाँ', ta: 'ஆம்', ur: 'ہاں', gu: 'હા' }
};

const FEATURE_SCHEMA = [
  { key: 'Age', type: 'number', placeholder: '72' },
  {
    key: 'Gender',
    type: 'select',
    options: [
      { label: 'Male', value: 0 },
      { label: 'Female', value: 1 },
      { label: 'Other', value: 2 }
    ]
  },
  {
    key: 'Ethnicity',
    type: 'select',
    options: [
      { label: 'Group 0', value: 0 },
      { label: 'Group 1', value: 1 },
      { label: 'Group 2', value: 2 }
    ]
  },
  {
    key: 'EducationLevel',
    type: 'select',
    options: [
      { label: 'High', value: 0 },
      { label: 'Medium', value: 1 },
      { label: 'Low', value: 2 }
    ]
  },
  { key: 'BMI', type: 'number', placeholder: '24.1' },
  {
    key: 'Smoking',
    type: 'select',
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 1 }
    ]
  },
  {
    key: 'AlcoholConsumption',
    type: 'select',
    options: [
      { label: 'High', value: 0 },
      { label: 'Moderate', value: 1 },
      { label: 'Low', value: 2 }
    ]
  },
  {
    key: 'PhysicalActivity',
    type: 'select',
    options: [
      { label: 'High', value: 0 },
      { label: 'Moderate', value: 1 },
      { label: 'Low', value: 2 }
    ]
  },
  {
    key: 'DietQuality',
    type: 'select',
    options: [
      { label: 'Poor', value: 0 },
      { label: 'Average', value: 1 },
      { label: 'Good', value: 2 }
    ]
  },
  {
    key: 'SleepQuality',
    type: 'select',
    options: [
      { label: 'Poor', value: 0 },
      { label: 'Average', value: 1 },
      { label: 'Good', value: 2 }
    ]
  },
  {
    key: 'FamilyHistoryAlzheimers',
    type: 'select',
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 1 }
    ]
  },
  {
    key: 'CardiovascularDisease',
    type: 'select',
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 1 }
    ]
  },
  {
    key: 'Diabetes',
    type: 'select',
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 1 }
    ]
  },
  {
    key: 'Depression',
    type: 'select',
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 1 }
    ]
  },
  {
    key: 'HeadInjury',
    type: 'select',
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 1 }
    ]
  },
  {
    key: 'Hypertension',
    type: 'select',
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 1 }
    ]
  },
  { key: 'SystolicBP', type: 'number', placeholder: '128' },
  { key: 'DiastolicBP', type: 'number', placeholder: '82' },
  { key: 'CholesterolTotal', type: 'number', placeholder: '190' },
  { key: 'CholesterolLDL', type: 'number', placeholder: '110' },
  { key: 'CholesterolHDL', type: 'number', placeholder: '55' },
  { key: 'CholesterolTriglycerides', type: 'number', placeholder: '160' },
  { key: 'MMSE', type: 'number', placeholder: '0-30' },
  {
    key: 'FunctionalAssessment',
    type: 'select',
    options: [
      { label: 'High', value: 0 },
      { label: 'Moderate', value: 1 },
      { label: 'Low', value: 2 }
    ]
  },
  {
    key: 'MemoryComplaints',
    type: 'select',
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 1 }
    ]
  },
  {
    key: 'BehavioralProblems',
    type: 'select',
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 1 }
    ]
  },
  {
    key: 'ADL',
    type: 'select',
    options: [
      { label: 'High', value: 0 },
      { label: 'Moderate', value: 1 },
      { label: 'Low', value: 2 }
    ]
  },
  {
    key: 'Confusion',
    type: 'select',
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 1 }
    ]
  },
  {
    key: 'Disorientation',
    type: 'select',
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 1 }
    ]
  },
  {
    key: 'PersonalityChanges',
    type: 'select',
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 1 }
    ]
  },
  {
    key: 'DifficultyCompletingTasks',
    type: 'select',
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 1 }
    ]
  },
  {
    key: 'Forgetfulness',
    type: 'select',
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 1 }
    ]
  },
  {
    key: 'DoctorInCharge_XXXconfid',
    type: 'select',
    options: [
      { label: 'High', value: 0 },
      { label: 'Moderate', value: 1 },
      { label: 'Low', value: 2 }
    ]
  }
];

function Assessment() {
  const { language, text, setPrediction } = useAppContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  const recognitionRef = useRef(null);

  const [answers, setAnswers] = useState({});
  const [otherData, setOtherData] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isListeningOtherData, setIsListeningOtherData] = useState(false);

  const featureVector = useMemo(() => {
    return FEATURE_SCHEMA.map((item) => {
      const rawValue = answers[item.key];
      if (rawValue === '' || rawValue === undefined || rawValue === null) {
        return 0;
      }
      const numericValue = Number(rawValue);
      return Number.isNaN(numericValue) ? 0 : numericValue;
    });
  }, [answers]);

  const captureOtherDataByVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMessage(text.voiceApiMissing);
      return;
    }

    if (isListeningOtherData && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListeningOtherData(true);
      setMessage('');
    };

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.trim() || '';
      setOtherData((prev) => (prev ? `${prev} ${transcript}`.trim() : transcript));
    };

    recognition.onerror = () => {
      setMessage(text.voiceApiMissing);
      setIsListeningOtherData(false);
    };

    recognition.onend = () => {
      setIsListeningOtherData(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const updateAnswer = (key, value) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const getFieldLabel = (fieldKey) => {
    return FIELD_LABELS[language]?.[fieldKey] || fieldKey;
  };

  const getOptionLabel = (optionLabel) => {
    return OPTION_LABELS[optionLabel]?.[language] || optionLabel;
  };

  const handleSubmit = async () => {
    const missingFields = FEATURE_SCHEMA.filter(
      (field) => answers[field.key] === '' || answers[field.key] === undefined || answers[field.key] === null
    );

    if (missingFields.length > 0) {
      setMessage(text.allFieldsRequired);
      return;
    }

    const payload = {
      features: [featureVector]
    };

    try {
      setIsSubmitting(true);
      setMessage('');

      const apiData = await getPrediction(payload);
      if (!apiData || (apiData.prediction === undefined && !apiData.result && !apiData.risk_classification)) {
        throw new Error('Empty model response from API');
      }
      const numericPrediction = Number(apiData?.prediction);
      const mappedRiskFromPrediction =
        numericPrediction === 1 ? 'High' : numericPrediction === 0 ? 'Low' : numericPrediction === 2 ? 'Medium' : null;
      const resultText = String(apiData?.result || '').toLowerCase();
      const riskFromResultText = resultText.includes('no alzheimer') || resultText.includes('not detected')
        ? 'Low'
        : resultText.includes('detected')
          ? 'High'
          : null;

      const enriched = {
        ...apiData,
        features: featureVector,
        other_data: otherData,
        probability_score: apiData?.probability ?? apiData?.probability_score ?? apiData?.confidence,
        risk_classification: apiData?.risk_classification || riskFromResultText || mappedRiskFromPrediction || 'Low'
      };

      // Save assessment to DynamoDB
      try {
        let userId = user?.email;
        if (!userId) {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            userId = JSON.parse(storedUser).email;
          }
        }
        if (!userId) {
          userId = 'anonymous';
        }
        
        console.log('Attempting to save assessment for userId:', userId);
        console.log('IdToken exists:', !!localStorage.getItem('idToken'));
        
        const savePayload = {
          userId,
          features: featureVector,
          otherData: otherData,
          prediction: enriched.risk_classification,
          probability: enriched.probability_score,
          riskLevel: enriched.risk_classification,
          timestamp: new Date().toISOString()
        };
        
        console.log('Save payload:', savePayload);
        
        const saveResult = await saveAssessment(savePayload);
        console.log('Assessment saved successfully:', saveResult);
      } catch (saveError) {
        console.error('Failed to save assessment:', saveError);
        console.error('Error details:', saveError.response?.data || saveError.message);
        // Show error to user but don't block flow
        alert('Warning: Assessment data could not be saved to history. Error: ' + (saveError.response?.data?.message || saveError.message));
      }

      setPrediction(enriched);
      navigate('/result', { state: { prediction: enriched } });
    } catch (error) {
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        (typeof error?.response?.data === 'string' ? error.response.data : '') ||
        error?.message ||
        text.apiFailed;

      setMessage(`${text.apiErrorPrefix}: ${backendMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="px-4 py-6 sm:px-6">
      <section className="mx-auto max-w-6xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-blue-100 sm:p-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-bold text-blue-800">{text.assessmentTitle}</h1>
          <p className="text-xl text-slate-700">{text.assessmentFormSubtitle}</p>
        </header>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURE_SCHEMA.map((field) => (
            <div key={field.key} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <label className="text-base font-semibold text-slate-800">{getFieldLabel(field.key)}</label>

              {field.type === 'number' ? (
                <input
                  type="number"
                  value={answers[field.key] ?? ''}
                  placeholder={field.placeholder || '0'}
                  onChange={(event) => updateAnswer(field.key, event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-lg"
                />
              ) : (
                <select
                  value={answers[field.key] ?? ''}
                  onChange={(event) => updateAnswer(field.key, event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-lg"
                >
                  <option value="">{text.selectOption}</option>
                  {field.options.map((option) => (
                    <option key={`${field.key}-${option.value}`} value={option.value}>
                      {getOptionLabel(option.label)} ({option.value})
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-lg font-semibold text-slate-800">{text.anyOtherData}</p>
              <p className="text-sm text-slate-600">{text.anyOtherDataHint}</p>
            </div>
            <button
              type="button"
              onClick={captureOtherDataByVoice}
              className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-white ${
                isListeningOtherData ? 'bg-blue-500' : 'bg-blue-700'
              }`}
            >
              <Mic className="h-4 w-4" />
              {isListeningOtherData ? text.listening : text.tapToSpeak}
            </button>
          </div>

          <textarea
            rows={4}
            value={otherData}
            onChange={(event) => setOtherData(event.target.value)}
            className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-lg"
          />
        </div>

        <div className="mt-6 rounded-xl bg-blue-50 p-4">
          <p className="text-lg font-semibold text-blue-800">{text.jsonPayloadPreview}</p>
          <pre className="mt-2 overflow-auto rounded-lg bg-white p-3 text-sm text-slate-700 ring-1 ring-blue-100">
{JSON.stringify({ features: [featureVector] }, null, 2)}
          </pre>
        </div>

        {message ? <p className="mt-4 text-lg font-semibold text-blue-700">{message}</p> : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => navigate('/')}
            className="rounded-xl border border-blue-200 bg-white px-5 py-3 text-lg font-semibold text-blue-700"
          >
            {text.back}
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-xl bg-blue-700 px-5 py-3 text-lg font-semibold text-white disabled:opacity-50"
          >
            {isSubmitting ? text.submitting : text.submit}
          </button>
        </div>
      </section>
    </main>
  );
}

export default Assessment;
