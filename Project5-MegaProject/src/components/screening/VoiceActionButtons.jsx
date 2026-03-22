import { Mic, Volume2 } from 'lucide-react';

function VoiceActionButtons({
  isListening,
  tapToSpeak,
  listening,
  listenInstructions,
  onMicClick,
  onListenInstructions
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <button
        onClick={onMicClick}
        className={`flex h-40 w-full items-center justify-center gap-3 rounded-2xl border-4 border-blue-600 bg-blue-600 text-2xl font-semibold text-white ${
          isListening ? 'animate-pulse' : ''
        }`}
        aria-label={isListening ? listening : tapToSpeak}
      >
        <Mic className="h-8 w-8" />
        {isListening ? listening : tapToSpeak}
      </button>

      <button
        onClick={onListenInstructions}
        className="flex h-40 w-full items-center justify-center gap-3 rounded-2xl border-2 border-blue-200 bg-blue-50 text-2xl font-semibold text-blue-800"
      >
        <Volume2 className="h-8 w-8" />
        {listenInstructions}
      </button>
    </div>
  );
}

export default VoiceActionButtons;