import { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { talentService } from '@services/talent.service';
import { Card } from '@components/ui/Card';

export function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecommendations() {
      try {
        const res = await talentService.getAIRecommendations('Senior Full Stack Node and React Developer with Microservices');
        setRecommendations(res);
      } catch (err) {
        console.error('Failed to load AI recommendations', err);
      } finally {
        setLoading(false);
      }
    }
    loadRecommendations();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-surface-50 flex items-center gap-2">
          <Sparkles size={20} className="text-primary-400" />
          <span>AI Candidate Recommendations & Skill Gap Analysis</span>
        </h1>
        <p className="text-xs text-surface-400">
          Powered by Google Gemini API. Contextual job fit explanations and candidate selection recommendations.
        </p>
      </div>

      {loading ? (
        <p className="text-xs text-surface-400">Analyzing job descriptions and candidate vectors with AI...</p>
      ) : (
        <Card className="p-6 bg-surface-900 border-surface-800 space-y-4">
          <h3 className="text-xs font-bold text-surface-100 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>AI Recruiter Executive Summary</span>
          </h3>
          <p className="text-xs text-surface-200 leading-relaxed bg-surface-950 p-4 rounded-xl font-mono">
            {recommendations?.aiSummary}
          </p>

          <div className="space-y-2 pt-2">
            <h4 className="text-3xs font-mono uppercase text-surface-400">Recommended Core Skill Keywords:</h4>
            <div className="flex flex-wrap gap-2">
              {recommendations?.recommendedSkills?.map((skill, idx) => (
                <span key={idx} className="text-3xs font-mono font-bold bg-primary-500/10 text-primary-300 border border-primary-500/30 px-2.5 py-1 rounded-lg">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
