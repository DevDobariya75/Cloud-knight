import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { analyzeSymptoms } from '../utils/analyzeSymptoms';
import { getPollyInstructionsAudio, getPrediction } from '../services/api';
import StepProgress from '../components/screening/StepProgress';
import VoiceActionButtons from '../components/screening/VoiceActionButtons';
import TranscriptEditor from '../components/screening/TranscriptEditor';
import SubmitSection from '../components/screening/SubmitSection';

function Screening() {
  const navigate = useNavigate();
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const { language, text, transcript, setTranscript, setPrediction } = useAppContext();

  const handleMicClick = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsListening(true);
      setMessage('Speech API unavailable, using demo transcript.');
      setTimeout(() => {
        setTranscript('I am forgetting names and feeling confused in the evening');
        setIsListening(false);
      }, 1800);
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setMessage('');
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const capturedText = event.results?.[0]?.[0]?.transcript?.trim() || '';
      setTranscript(capturedText);
      const routed = analyzeSymptoms(capturedText);
      setMessage(routed.message);
    };

    recognition.onerror = () => {
      setMessage('Could not capture voice. Please try again.');
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleListenInstructions = async () => {
    const instructionText =
      language === 'hi'
        ? 'कृपया स्पष्ट बोलें। अपनी हाल की याददाश्त के बारे में 15 से 20 सेकंड तक बताएं।'
        : 'Please speak clearly. Describe your recent memory changes for 15 to 20 seconds.';

    try {
      const pollyResponse = await getPollyInstructionsAudio({
        text: instructionText,
        language
      });

      if (pollyResponse?.audioUrl) {
        const audio = new Audio(pollyResponse.audioUrl);
        await audio.play();
        return;
      }
    } catch {
    }

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(instructionText);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSubmit = async () => {
    if (!transcript.trim()) {
      setMessage('Please capture speech before submitting.');
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage('Submitting voice data to diagnosis API...');
      const apiData = await getPrediction(transcript.trim());
      setPrediction(apiData);
      navigate('/result', { state: { prediction: apiData } });
    } catch {
      setMessage('API request failed. Showing fallback local analysis.');
      const fallback = analyzeSymptoms(transcript);
      const apiData = {
        prediction: fallback.workflow === 'alzheimer' ? 'Alzheimer Risk Signal' : 'Low Alzheimer Signal',
        risk: fallback.risk,
        confidence: fallback.risk === 'High' ? '0.86' : fallback.risk === 'Medium' ? '0.71' : '0.58',
        message: fallback.message
      };
      setPrediction(apiData);
      navigate('/result', { state: { prediction: apiData } });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6">
      <section className="mx-auto max-w-4xl space-y-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-blue-100">
        <StepProgress stepLabel={text.stepLabel} title={text.assessmentTitle} />

        <VoiceActionButtons
          isListening={isListening}
          tapToSpeak={text.tapToSpeak}
          listening={text.listening}
          listenInstructions={text.listenInstructions}
          onMicClick={handleMicClick}
          onListenInstructions={handleListenInstructions}
        />

        <TranscriptEditor
          capturedText={text.capturedText}
          transcript={transcript}
          setTranscript={setTranscript}
          apiHint={text.apiHint}
          editHint={text.editHint}
          placeholder={text.transcriptPlaceholder}
          message={message}
        />

        <SubmitSection isSubmitting={isSubmitting} submitLabel={text.submit} onSubmit={handleSubmit} />
      </section>
    </main>
  );
}

export default Screening;