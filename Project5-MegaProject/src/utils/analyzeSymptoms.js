const tbPneumoniaKeywords = [
  'cough',
  'khansi',
  'fever',
  'bukhar',
  'chest pain',
  'seene me dard',
  'breathlessness',
  'saans',
  'phlegm',
  'sputum'
];

const alzheimerKeywords = [
  'forgetting names',
  'bhoolna',
  'memory loss',
  'yaad nahi',
  'confusion',
  'disoriented',
  'can\'t remember'
];

export function analyzeSymptoms(text = '') {
  const normalizedText = text.toLowerCase();

  const hasTbPneumoniaSignal = tbPneumoniaKeywords.some((keyword) =>
    normalizedText.includes(keyword)
  );
  const hasAlzheimerSignal = alzheimerKeywords.some((keyword) =>
    normalizedText.includes(keyword)
  );

  if (hasTbPneumoniaSignal && hasAlzheimerSignal) {
    return {
      workflow: 'alzheimer',
      risk: 'High',
      message: 'Both memory and respiratory concerns found. Start with memory test, then continue X-ray workflow.'
    };
  }

  if (hasAlzheimerSignal) {
    return {
      workflow: 'alzheimer',
      risk: 'Medium',
      message: 'Memory concern pattern detected. Start voice memory workflow.'
    };
  }

  if (hasTbPneumoniaSignal) {
    return {
      workflow: 'tb_pneumonia',
      risk: 'Medium',
      message: 'Respiratory symptom pattern detected. Continue to X-ray workflow after memory check.'
    };
  }

  return {
    workflow: 'alzheimer',
    risk: 'Low',
    message: 'Start with a voice memory test for early Alzheimer screening.'
  };
}