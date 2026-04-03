import { useState, useRef } from 'react'
import { Upload, FileText, X, BarChart3, CheckCircle, Sparkles } from 'lucide-react'
import { extractTextFromPDF } from '../services/pdfParser'
import { analyzeATS, optimizeResume } from '../services/api'

const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'Education']

function ResumeChecker({ onResult }) {
  const [activeTab, setActiveTab] = useState('ats')

  const [atsFile, setAtsFile] = useState(null)
  const [atsJobDesc, setAtsJobDesc] = useState('')
  const [atsLoading, setAtsLoading] = useState(false)
  const [atsError, setAtsError] = useState('')

  const [optFile, setOptFile] = useState(null)
  const [optJobTitle, setOptJobTitle] = useState('')
  const [optIndustry, setOptIndustry] = useState('')
  const [optLoading, setOptLoading] = useState(false)
  const [optError, setOptError] = useState('')

  const atsFileRef = useRef(null)
  const optFileRef = useRef(null)
  const [atsDragOver, setAtsDragOver] = useState(false)
  const [optDragOver, setOptDragOver] = useState(false)

  console.log('[ResumeChecker] Rendered — activeTab:', activeTab)

  const validateFile = (file) => {
    if (!file) return 'No file selected.'
    if (file.type !== 'application/pdf') return 'Only PDF files are allowed.'
    if (file.size > 5 * 1024 * 1024) return 'File size must be under 5MB.'
    return null
  }

  const handleFileSelect = (file, setter, errorSetter) => {
    const error = validateFile(file)
    if (error) {
      errorSetter(error)
      console.log('[ResumeChecker] File validation failed:', error)
      return
    }
    errorSetter('')
    setter(file)
    console.log('[ResumeChecker] File selected:', file.name, (file.size / 1024 / 1024).toFixed(2) + 'MB')
  }

  const handleDrop = (e, setter, errorSetter) => {
    e.preventDefault()
    setAtsDragOver(false)
    setOptDragOver(false)
    const file = e.dataTransfer.files[0]
    handleFileSelect(file, setter, errorSetter)
  }

  const handleATSSubmit = async () => {
    if (!atsFile || !atsJobDesc.trim()) {
      setAtsError('Please upload a resume and paste a job description.')
      return
    }
    setAtsError('')
    setAtsLoading(true)
    console.log('[ResumeChecker] ATS analysis started')

    try {
      const resumeText = await extractTextFromPDF(atsFile)
      console.log('[ResumeChecker] PDF text extracted, length:', resumeText.length)
      console.log('[ResumeChecker] First 200 chars:', resumeText.substring(0, 200))

      const result = await analyzeATS(resumeText, atsJobDesc.trim())
      console.log('[ResumeChecker] ATS result received:', result)
      onResult(result, 'ats')
    } catch (err) {
      console.error('[ResumeChecker] ATS error:', err)
      setAtsError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setAtsLoading(false)
    }
  }

  const handleOptimizeSubmit = async () => {
    if (!optFile || !optJobTitle.trim() || !optIndustry) {
      setOptError('Please upload a resume, enter a job title, and select an industry.')
      return
    }
    setOptError('')
    setOptLoading(true)
    console.log('[ResumeChecker] Optimization started')

    try {
      const resumeText = await extractTextFromPDF(optFile)
      console.log('[ResumeChecker] PDF text extracted, length:', resumeText.length)

      const result = await optimizeResume(resumeText, optJobTitle.trim(), optIndustry)
      console.log('[ResumeChecker] Optimization result received:', result)
      onResult(result, 'optimize')
    } catch (err) {
      console.error('[ResumeChecker] Optimize error:', err)
      setOptError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setOptLoading(false)
    }
  }

  return (
    <section id="checker" className="checker">
      <div className="checker__tabs">
        <button
          className={`checker__tab ${activeTab === 'ats' ? 'checker__tab--active' : ''}`}
          onClick={() => setActiveTab('ats')}
        >
          ATS Resume Checker
        </button>
        <button
          className={`checker__tab ${activeTab === 'optimize' ? 'checker__tab--active' : ''}`}
          onClick={() => setActiveTab('optimize')}
        >
          Resume Optimization
        </button>
      </div>

      <div className="checker__panel">
        {activeTab === 'ats' ? (
          <>
            <h2 className="checker__heading">Check Your Resume Against ATS</h2>

            <div className="checker__field-group">
              <label className="checker__label">Paste Job Description</label>
              <textarea
                className="checker__textarea"
                placeholder="Paste the job description here to compare with your resume"
                value={atsJobDesc}
                onChange={(e) => setAtsJobDesc(e.target.value)}
              />
            </div>

            <div
              className={`checker__dropzone ${atsDragOver ? 'checker__dropzone--dragover' : ''}`}
              onClick={() => atsFileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setAtsDragOver(true) }}
              onDragLeave={() => setAtsDragOver(false)}
              onDrop={(e) => handleDrop(e, setAtsFile, setAtsError)}
            >
              <Upload className="checker__dropzone-icon" size={32} />
              <p className="checker__dropzone-text">
                {atsFile ? atsFile.name : 'Upload your resume'}
              </p>
              <p className="checker__dropzone-hint">PDF files only, max 5MB</p>
              <input
                ref={atsFileRef}
                type="file"
                accept=".pdf"
                style={{ display: 'none' }}
                onChange={(e) => handleFileSelect(e.target.files[0], setAtsFile, setAtsError)}
              />
            </div>

            {atsFile && (
              <div className="checker__file-info">
                <FileText size={16} />
                {atsFile.name}
                <button className="checker__file-remove" onClick={() => setAtsFile(null)}>
                  <X size={16} />
                </button>
              </div>
            )}

            {atsError && (
              <p className="checker__error">{atsError}</p>
            )}

            <button
              className={`checker__submit ${atsLoading ? 'checker__submit--loading' : ''}`}
              onClick={handleATSSubmit}
              disabled={atsLoading}
            >
              {atsLoading ? 'Analyzing...' : 'Check ATS Compatibility'}
            </button>
          </>
        ) : (
          <>
            <h2 className="checker__heading">AI-Powered Resume Optimization</h2>

            <div className="checker__optimization-layout">
              <div>
                <div
                  className={`checker__dropzone ${optDragOver ? 'checker__dropzone--dragover' : ''}`}
                  onClick={() => optFileRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setOptDragOver(true) }}
                  onDragLeave={() => setOptDragOver(false)}
                  onDrop={(e) => handleDrop(e, setOptFile, setOptError)}
                >
                  <Upload className="checker__dropzone-icon" size={32} />
                  <p className="checker__dropzone-text">
                    {optFile ? optFile.name : 'Upload your resume'}
                  </p>
                  <p className="checker__dropzone-hint">PDF files only, max 5MB</p>
                  <input
                    ref={optFileRef}
                    type="file"
                    accept=".pdf"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileSelect(e.target.files[0], setOptFile, setOptError)}
                  />
                </div>

                {optFile && (
                  <div className="checker__file-info">
                    <FileText size={16} />
                    {optFile.name}
                    <button className="checker__file-remove" onClick={() => setOptFile(null)}>
                      <X size={16} />
                    </button>
                  </div>
                )}

                <div className="checker__field-group" style={{ marginTop: '1rem' }}>
                  <label className="checker__label">Target Job Title</label>
                  <input
                    className="checker__input"
                    type="text"
                    placeholder="e.g. Product Manager, Software Engineer"
                    value={optJobTitle}
                    onChange={(e) => setOptJobTitle(e.target.value)}
                  />
                </div>

                <div className="checker__field-group">
                  <label className="checker__label">Industry</label>
                  <select
                    className="checker__select"
                    value={optIndustry}
                    onChange={(e) => setOptIndustry(e.target.value)}
                  >
                    <option value="">Select Industry</option>
                    {INDUSTRIES.map(ind => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>

                {optError && (
                  <p className="checker__error">{optError}</p>
                )}

                <button
                  className={`checker__submit ${optLoading ? 'checker__submit--loading' : ''}`}
                  onClick={handleOptimizeSubmit}
                  disabled={optLoading}
                >
                  {optLoading ? 'Optimizing...' : 'Optimize My Resume'}
                </button>
              </div>

              <div className="checker__benefits">
                <h3 className="checker__benefits-title">
                  <BarChart3 size={20} />
                  Resume Optimization Benefits
                </h3>

                <div className="checker__benefit-item">
                  <p className="checker__benefit-name">
                    <CheckCircle size={16} color="var(--accent)" />
                    Keyword Optimization
                  </p>
                  <p className="checker__benefit-desc">
                    Our AI identifies and adds relevant keywords from your target job description.
                  </p>
                </div>

                <div className="checker__benefit-item">
                  <p className="checker__benefit-name">
                    <CheckCircle size={16} color="var(--accent)" />
                    Achievement Highlighting
                  </p>
                  <p className="checker__benefit-desc">
                    We transform job duties into impressive achievements with metrics.
                  </p>
                </div>

                <div className="checker__benefit-item">
                  <p className="checker__benefit-name">
                    <CheckCircle size={16} color="var(--accent)" />
                    Skills Enhancement
                  </p>
                  <p className="checker__benefit-desc">
                    Get suggestions for relevant skills you should add based on industry standards.
                  </p>
                </div>

                <div className="checker__benefit-item">
                  <p className="checker__benefit-name">
                    <Sparkles size={16} color="var(--accent)" />
                    Professional Summary Rewrite
                  </p>
                  <p className="checker__benefit-desc">
                    Create a compelling professional summary that captures attention.
                  </p>
                </div>

                <div className="checker__benefit-highlight">
                  Our AI-powered optimization increased interview callbacks by an average of 65% in user testing.
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default ResumeChecker
