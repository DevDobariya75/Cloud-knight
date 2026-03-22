import { Brain, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useLoginModal } from '../context/LoginModalContext';

function Home() {
  const navigate = useNavigate();
  const { text } = useAppContext();
  const { isAuthenticated } = useAuth();
  const { openLoginModal, setRedirectAfterLogin } = useLoginModal();

  const handleStartAssessment = () => {
    if (isAuthenticated) {
      navigate('/assessment');
    } else {
      setRedirectAfterLogin('/assessment');
      openLoginModal();
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6">
      <section className="mx-auto max-w-5xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-blue-100 sm:p-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-base font-semibold text-blue-700">
          <Stethoscope className="h-5 w-5" />
          {text.clinicalBadge}
        </div>

        <div className="mt-6 grid items-center gap-6 md:grid-cols-2">
          <div>
            <h1 className="text-3xl font-bold text-blue-800 sm:text-5xl">{text.homeTitle}</h1>
            <p className="mt-4 text-xl text-slate-700">{text.homeDescription}</p>

            <button
              onClick={handleStartAssessment}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-4 text-xl font-semibold text-white"
            >
              <Brain className="h-6 w-6" />
              {text.startScreening}
            </button>
          </div>

          <div className="rounded-2xl bg-blue-50 p-5">
            <h2 className="text-2xl font-semibold text-blue-800">{text.appName}</h2>
            <p className="mt-3 text-lg text-slate-700">{text.tagline}</p>
            <ul className="mt-4 space-y-2 text-lg text-slate-700">
              <li>• {text.step1Title}</li>
              <li>• {text.step2Title}</li>
              <li>• {text.step3Title}</li>
              <li>• {text.step4Title}</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-blue-100 bg-slate-50 p-5">
          <h3 className="text-2xl font-semibold text-blue-800">{text.upcomingPhaseTitle}</h3>
          <p className="mt-2 text-lg text-slate-700">{text.upcomingPhaseNote}</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
              <p className="text-xl font-semibold text-slate-900">{text.tbLabel}</p>
              <p className="mt-1 text-sm font-semibold text-blue-700">{text.comingSoon}</p>
              <p className="mt-2 text-base text-slate-700">{text.tbDetail}</p>
            </div>

            <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
              <p className="text-xl font-semibold text-slate-900">{text.pneumoniaLabel}</p>
              <p className="mt-1 text-sm font-semibold text-blue-700">{text.comingSoon}</p>
              <p className="mt-2 text-base text-slate-700">{text.pneumoniaDetail}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;