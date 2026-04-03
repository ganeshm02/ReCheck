import { X, CheckCircle, AlertCircle, AlertTriangle, TrendingUp, Target } from 'lucide-react'

function ResultModal({ data, type, onClose }) {
  console.log('[ResultModal] Rendered — type:', type, 'data:', data)

  if (!data) return null

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  const getScoreClass = (score) => {
    if (score >= 75) return 'high'
    if (score >= 50) return 'medium'
    return 'low'
  }

  const getStatusClass = (status) => {
    const s = status?.toLowerCase()
    if (s?.includes('good') || s?.includes('strong') || s?.includes('excellent')) return 'good'
    if (s?.includes('poor') || s?.includes('weak') || s?.includes('missing') || s?.includes('critical')) return 'poor'
    return 'needs-work'
  }

  const getBreakdownPercent = (score, max) => {
    return max > 0 ? Math.round((score / max) * 100) : 0
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal__header">
          <h2 className="modal__title">
            {type === 'ats' ? 'ATS Analysis Results' : 'Resume Optimization Results'}
          </h2>
          <button className="modal__close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal__body">
          {type === 'ats' ? (
            <ATSResults data={data} getScoreClass={getScoreClass} getStatusClass={getStatusClass} getBreakdownPercent={getBreakdownPercent} />
          ) : (
            <OptimizeResults data={data} getScoreClass={getScoreClass} getStatusClass={getStatusClass} />
          )}
        </div>
      </div>
    </div>
  )
}

function ATSResults({ data, getScoreClass, getStatusClass, getBreakdownPercent }) {
  const scoreClass = getScoreClass(data.overall_score)

  return (
    <>
      <div className={`score-circle score-circle--${scoreClass}`}>
        <span className="score-circle__value">{data.overall_score}</span>
        <span className="score-circle__label">ATS Score</span>
      </div>

      <p className="result-summary">{data.summary}</p>

      {data.score_breakdown && (
        <div className="result-section">
          <h3 className="result-section__title">
            <Target size={18} />
            Score Breakdown
          </h3>
          <div className="score-breakdown">
            {Object.entries(data.score_breakdown).map(([key, val]) => {
              const pct = getBreakdownPercent(val.score, val.max)
              const cls = pct >= 70 ? 'high' : pct >= 45 ? 'medium' : 'low'
              return (
                <div key={key} className="score-breakdown__item">
                  <p className="score-breakdown__name">
                    {key.replace(/_/g, ' ')}
                  </p>
                  <div className="score-breakdown__bar">
                    <div
                      className={`score-breakdown__fill score-breakdown__fill--${cls}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="score-breakdown__value">{val.score}/{val.max}</p>
                  {val.feedback && <p className="score-breakdown__feedback">{val.feedback}</p>}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {data.matched_keywords?.length > 0 && (
        <div className="result-section">
          <h3 className="result-section__title">
            <CheckCircle size={18} className="result-list__icon--success" />
            Matched Keywords ({data.matched_keywords.length})
          </h3>
          <div className="keyword-tags">
            {data.matched_keywords.map((kw, i) => (
              <span key={i} className="keyword-tag keyword-tag--matched">{kw}</span>
            ))}
          </div>
        </div>
      )}

      {data.missing_keywords?.length > 0 && (
        <div className="result-section">
          <h3 className="result-section__title">
            <AlertCircle size={18} className="result-list__icon--error" />
            Missing Keywords ({data.missing_keywords.length})
          </h3>
          <div className="keyword-tags">
            {data.missing_keywords.map((kw, i) => (
              <span key={i} className="keyword-tag keyword-tag--missing">{kw}</span>
            ))}
          </div>
        </div>
      )}

      {data.strengths?.length > 0 && (
        <div className="result-section">
          <h3 className="result-section__title">
            <CheckCircle size={18} className="result-list__icon--success" />
            Strengths
          </h3>
          <ul className="result-list">
            {data.strengths.map((s, i) => (
              <li key={i} className="result-list__item">
                <CheckCircle size={14} className="result-list__icon result-list__icon--success" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.weaknesses?.length > 0 && (
        <div className="result-section">
          <h3 className="result-section__title">
            <AlertTriangle size={18} className="result-list__icon--warning" />
            Weaknesses
          </h3>
          <ul className="result-list">
            {data.weaknesses.map((w, i) => (
              <li key={i} className="result-list__item">
                <AlertTriangle size={14} className="result-list__icon result-list__icon--warning" />
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.improvements?.length > 0 && (
        <div className="result-section">
          <h3 className="result-section__title">
            <TrendingUp size={18} />
            Recommended Improvements
          </h3>
          <ul className="result-list">
            {data.improvements.map((imp, i) => (
              <li key={i} className="result-list__item">
                <TrendingUp size={14} className="result-list__icon" />
                {imp}
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.section_feedback?.length > 0 && (
        <div className="result-section">
          <h3 className="result-section__title">Section-by-Section Feedback</h3>
          {data.section_feedback.map((sf, i) => (
            <div key={i} className="section-card">
              <div>
                <span className={`section-card__status section-card__status--${getStatusClass(sf.status)}`}>
                  {sf.status}
                </span>
              </div>
              <div>
                <p className="section-card__name">{sf.section}</p>
                <p className="section-card__feedback">{sf.feedback}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

function OptimizeResults({ data, getScoreClass, getStatusClass }) {
  const scoreClass = getScoreClass(data.readiness_score)

  return (
    <>
      <div className={`score-circle score-circle--${scoreClass}`}>
        <span className="score-circle__value">{data.readiness_score}</span>
        <span className="score-circle__label">Readiness</span>
      </div>

      <p className="result-summary">{data.overall_assessment}</p>

      {data.keyword_analysis && (
        <div className="result-section">
          <h3 className="result-section__title">
            <Target size={18} />
            Keyword Analysis
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: '1.5' }}>
            {data.keyword_analysis.feedback}
          </p>

          {data.keyword_analysis.present_keywords?.length > 0 && (
            <div style={{ marginBottom: '0.75rem' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--success)' }}>
                Present Keywords
              </p>
              <div className="keyword-tags">
                {data.keyword_analysis.present_keywords.map((kw, i) => (
                  <span key={i} className="keyword-tag keyword-tag--matched">{kw}</span>
                ))}
              </div>
            </div>
          )}

          {data.keyword_analysis.suggested_keywords?.length > 0 && (
            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--accent)' }}>
                Suggested Keywords to Add
              </p>
              <div className="keyword-tags">
                {data.keyword_analysis.suggested_keywords.map((kw, i) => (
                  <span key={i} className="keyword-tag keyword-tag--suggested">{kw}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {data.achievement_rewrites?.length > 0 && (
        <div className="result-section">
          <h3 className="result-section__title">
            <TrendingUp size={18} />
            Achievement Rewrites
          </h3>
          {data.achievement_rewrites.map((rw, i) => (
            <div key={i} className="rewrite-card">
              <p className="rewrite-card__label rewrite-card__label--original">Original</p>
              <p className="rewrite-card__text">{rw.original}</p>
              <p className="rewrite-card__label rewrite-card__label--improved">Improved</p>
              <p className="rewrite-card__text">{rw.improved}</p>
              <p className="rewrite-card__reason">{rw.reason}</p>
            </div>
          ))}
        </div>
      )}

      {data.skills_suggestions && (
        <div className="result-section">
          <h3 className="result-section__title">Skills Enhancement</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: '1.5' }}>
            {data.skills_suggestions.feedback}
          </p>

          {data.skills_suggestions.add?.length > 0 && (
            <div style={{ marginBottom: '0.5rem' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--success)' }}>Add</p>
              <div className="keyword-tags">
                {data.skills_suggestions.add.map((s, i) => (
                  <span key={i} className="keyword-tag keyword-tag--suggested">{s}</span>
                ))}
              </div>
            </div>
          )}

          {data.skills_suggestions.remove?.length > 0 && (
            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--error)' }}>Consider Removing</p>
              <div className="keyword-tags">
                {data.skills_suggestions.remove.map((s, i) => (
                  <span key={i} className="keyword-tag keyword-tag--missing">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {data.summary_rewrite && (
        <div className="result-section">
          <h3 className="result-section__title">Professional Summary Rewrite</h3>
          <div className="rewrite-card">
            <p className="rewrite-card__label rewrite-card__label--original">Current Assessment</p>
            <p className="rewrite-card__text">{data.summary_rewrite.current_assessment}</p>
            <p className="rewrite-card__label rewrite-card__label--improved">Suggested Summary</p>
            <p className="rewrite-card__text">{data.summary_rewrite.suggested_summary}</p>
          </div>
        </div>
      )}

      {data.section_feedback?.length > 0 && (
        <div className="result-section">
          <h3 className="result-section__title">Section Feedback</h3>
          {data.section_feedback.map((sf, i) => (
            <div key={i} className="section-card">
              <div>
                <span className={`section-card__status section-card__status--${getStatusClass(sf.status)}`}>
                  {sf.status}
                </span>
              </div>
              <div>
                <p className="section-card__name">{sf.section}</p>
                <p className="section-card__feedback">{sf.feedback}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {data.strengths?.length > 0 && (
        <div className="result-section">
          <h3 className="result-section__title">
            <CheckCircle size={18} className="result-list__icon--success" />
            Strengths
          </h3>
          <ul className="result-list">
            {data.strengths.map((s, i) => (
              <li key={i} className="result-list__item">
                <CheckCircle size={14} className="result-list__icon result-list__icon--success" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.critical_improvements?.length > 0 && (
        <div className="result-section">
          <h3 className="result-section__title">
            <AlertCircle size={18} className="result-list__icon--error" />
            Critical Improvements
          </h3>
          <ul className="result-list">
            {data.critical_improvements.map((c, i) => (
              <li key={i} className="result-list__item">
                <AlertCircle size={14} className="result-list__icon result-list__icon--error" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.industry_tips?.length > 0 && (
        <div className="result-section">
          <h3 className="result-section__title">Industry Tips</h3>
          <ul className="result-list">
            {data.industry_tips.map((tip, i) => (
              <li key={i} className="result-list__item">
                <TrendingUp size={14} className="result-list__icon" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}

export default ResultModal
