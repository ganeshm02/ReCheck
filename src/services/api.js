const API_BASE = '/api'

export async function analyzeATS(resumeText, jobDescription) {
  console.log('[API] Calling /api/analyze-ats')
  console.log('[API] Resume text length:', resumeText.length)
  console.log('[API] Job description length:', jobDescription.length)

  const response = await fetch(`${API_BASE}/analyze-ats`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resumeText, jobDescription })
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error('[API] ATS analyze error:', response.status, errorData)
    throw new Error(errorData.error || `Server error: ${response.status}`)
  }

  const data = await response.json()
  console.log('[API] ATS analyze response:', data)
  return data
}

export async function optimizeResume(resumeText, jobTitle, industry) {
  console.log('[API] Calling /api/optimize')
  console.log('[API] Resume text length:', resumeText.length)
  console.log('[API] Job title:', jobTitle)
  console.log('[API] Industry:', industry)

  const response = await fetch(`${API_BASE}/optimize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resumeText, jobTitle, industry })
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error('[API] Optimize error:', response.status, errorData)
    throw new Error(errorData.error || `Server error: ${response.status}`)
  }

  const data = await response.json()
  console.log('[API] Optimize response:', data)
  return data
}
