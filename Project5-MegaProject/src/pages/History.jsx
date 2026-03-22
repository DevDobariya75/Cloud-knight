import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';
import { getAssessments } from '../services/api';
import { Clock, TrendingUp, TrendingDown, Minus } from 'lucide-react';

function History() {
  const { user } = useAuth();
  const { text, setPrediction } = useAppContext();
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAssessments();
  }, [user]);

  const loadAssessments = async () => {
    try {
      setLoading(true);
      setError('');
      
      let userId = user?.email;
      if (!userId) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          userId = JSON.parse(storedUser).email;
        }
      }

      if (!userId) {
        setError('Please log in to view assessment history');
        setLoading(false);
        return;
      }

      console.log('Loading assessments for userId:', userId);
      const data = await getAssessments(userId);
      console.log('Assessments loaded successfully:', data);
      
      // Sort by timestamp (newest first)
      const sortedAssessments = (data.assessments || []).sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
      
      setAssessments(sortedAssessments);
    } catch (err) {
      console.error('Failed to load assessments:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load assessment history';
      console.error('Error details:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        message: errorMessage,
        url: err.config?.url
      });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel) => {
    const level = String(riskLevel).toLowerCase();
    if (level === 'high') return 'text-red-700 bg-red-50 border-red-200';
    if (level === 'medium') return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    return 'text-green-700 bg-green-50 border-green-200';
  };

  const getRiskIcon = (riskLevel) => {
    const level = String(riskLevel).toLowerCase();
    if (level === 'high') return <TrendingUp className="h-5 w-5" />;
    if (level === 'medium') return <Minus className="h-5 w-5" />;
    return <TrendingDown className="h-5 w-5" />;
  };

  const formatDate = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return timestamp;
    }
  };

  const viewDetails = (assessment) => {
    // Reconstruct the prediction object and navigate to result page
    const predictionData = {
      prediction: assessment.prediction,
      probability: assessment.probability,
      probability_score: assessment.probability,
      risk_classification: assessment.riskLevel,
      features: assessment.features,
      other_data: assessment.otherData
    };
    
    setPrediction(predictionData);
    navigate('/result', { state: { prediction: predictionData } });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent"></div>
              <p className="mt-4 text-lg text-slate-600">Loading assessment history...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6">
      <section className="mx-auto max-w-6xl">
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-blue-100 sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-blue-800">Assessment History</h1>
              <p className="mt-2 text-lg text-slate-600">
                View your previous Alzheimer's risk assessments
              </p>
            </div>
            <button
              onClick={() => navigate('/assessment')}
              className="rounded-xl bg-blue-700 px-5 py-3 text-lg font-semibold text-white hover:bg-blue-800 transition"
            >
              New Assessment
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl bg-red-50 p-6 ring-1 ring-red-200">
            <p className="text-lg font-semibold text-red-700">{error}</p>
          </div>
        )}

        {!error && assessments.length === 0 && (
          <div className="rounded-2xl bg-white p-12 shadow-sm ring-1 ring-blue-100 text-center">
            <Clock className="mx-auto h-16 w-16 text-slate-300" />
            <h2 className="mt-4 text-2xl font-semibold text-slate-900">No assessments yet</h2>
            <p className="mt-2 text-lg text-slate-600">
              Take your first assessment to see your history here
            </p>
            <button
              onClick={() => navigate('/assessment')}
              className="mt-6 rounded-xl bg-blue-700 px-6 py-3 text-lg font-semibold text-white hover:bg-blue-800 transition"
            >
              Start Assessment
            </button>
          </div>
        )}

        {!error && assessments.length > 0 && (
          <div className="space-y-4">
            {assessments.map((assessment, index) => (
              <div
                key={assessment.timestamp || index}
                className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-blue-100 hover:shadow-md transition cursor-pointer"
                onClick={() => viewDetails(assessment)}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-slate-400" />
                      <span className="text-lg font-semibold text-slate-900">
                        {formatDate(assessment.timestamp)}
                      </span>
                    </div>
                    
                    <div className="mt-3 grid gap-3 sm:grid-cols-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-500">Prediction</p>
                        <p className="mt-1 text-base font-bold text-slate-900">
                          {assessment.prediction === 0 || 
                           assessment.prediction === 'No Alzheimer\'s' || 
                           assessment.prediction === 'Low' ||
                           assessment.riskLevel === 'Low'
                            ? 'No Alzheimer\'s' 
                            : 'Alzheimer\'s Detected'}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-semibold text-slate-500">Probability</p>
                        <p className="mt-1 text-base font-bold text-slate-900">
                          {(assessment.probability * 100).toFixed(1)}%
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-semibold text-slate-500">Risk Level</p>
                        <div className={`mt-1 inline-flex items-center gap-2 rounded-lg border px-3 py-1 text-base font-bold ${getRiskColor(assessment.riskLevel)}`}>
                          {getRiskIcon(assessment.riskLevel)}
                          {String(assessment.riskLevel).charAt(0).toUpperCase() + String(assessment.riskLevel).slice(1)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        viewDetails(assessment);
                      }}
                      className="rounded-lg bg-blue-100 px-4 py-2 text-base font-semibold text-blue-700 hover:bg-blue-200 transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default History;
