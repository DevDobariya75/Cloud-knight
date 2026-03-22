function StepProgress({ stepLabel, title }) {
  return (
    <header className="space-y-3">
      <p className="text-base font-semibold text-blue-700">{stepLabel}</p>
      <div className="h-3 w-full rounded-full bg-blue-100">
        <div className="h-3 w-1/2 rounded-full bg-blue-700" />
      </div>
      <h1 className="text-3xl font-bold text-blue-800">{title}</h1>
    </header>
  );
}

export default StepProgress;