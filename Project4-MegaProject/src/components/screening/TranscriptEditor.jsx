function TranscriptEditor({
  capturedText,
  transcript,
  setTranscript,
  apiHint,
  editHint,
  placeholder,
  message
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-base font-semibold text-slate-700">{capturedText}</p>
      <p className="mt-1 text-sm text-slate-600">{editHint}</p>
      <textarea
        value={transcript}
        onChange={(event) => setTranscript(event.target.value)}
        placeholder={placeholder}
        rows={4}
        className="mt-3 w-full rounded-xl border border-slate-300 bg-white p-3 text-xl text-slate-900"
      />
      <p className="mt-2 text-base text-slate-600">{apiHint}</p>
      {message ? <p className="mt-2 text-base font-medium text-blue-700">{message}</p> : null}
    </div>
  );
}

export default TranscriptEditor;