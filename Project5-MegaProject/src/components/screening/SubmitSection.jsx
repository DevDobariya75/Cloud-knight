import { ArrowRight } from 'lucide-react';

function SubmitSection({ isSubmitting, submitLabel, onSubmit }) {
  return (
    <button
      onClick={onSubmit}
      disabled={isSubmitting}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-4 text-xl font-semibold text-white sm:w-auto disabled:bg-blue-400"
    >
      {isSubmitting ? 'Submitting...' : submitLabel}
      <ArrowRight className="h-5 w-5" />
    </button>
  );
}

export default SubmitSection;