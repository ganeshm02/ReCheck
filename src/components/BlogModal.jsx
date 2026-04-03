import { X } from 'lucide-react'

const BLOG_CONTENT = [
  {
    title: 'How to Beat ATS Systems in 2026',
    subtitle: 'A comprehensive guide to understanding and optimizing your resume for Applicant Tracking Systems.',
    sections: [
      {
        heading: 'What is an ATS?',
        text: 'An Applicant Tracking System (ATS) is software used by employers to manage the recruitment process. It scans, filters, and ranks resumes based on keywords, formatting, and relevance to the job description.',
      },
      {
        heading: 'Key Strategies',
        bullets: [
          'Use standard section headings (Experience, Education, Skills)',
          'Include exact keywords from the job description',
          'Avoid tables, graphics, and complex formatting',
          'Use a clean, single-column layout',
          'Save your resume as a PDF unless specified otherwise',
          'Quantify your achievements with numbers and metrics',
        ],
      },
      {
        heading: 'Common Mistakes to Avoid',
        bullets: [
          'Using creative fonts and elaborate designs',
          'Submitting image-based resumes',
          'Forgetting to include soft skills mentioned in the job posting',
          'Using abbreviations without spelling them out first',
        ],
      },
    ],
    imagePlaceholder: 'ATS Flowchart Diagram (will be added)',
    links: [
      { text: 'Use our ATS Checker tool', url: '#checker' },
    ],
  },
  {
    title: 'Resume Writing Best Practices',
    subtitle: 'Master the art of resume writing with proven techniques used by career professionals.',
    sections: [
      {
        heading: 'The STAR Method',
        text: 'Structure your bullet points using the STAR method: Situation, Task, Action, Result. This framework ensures each accomplishment tells a complete story.',
      },
      {
        heading: 'Essential Tips',
        bullets: [
          'Lead with a strong professional summary',
          'Use action verbs to begin every bullet point',
          'Tailor your resume for each specific job application',
          'Keep your resume to 1-2 pages maximum',
          'Include relevant certifications and professional development',
          'Proofread meticulously — errors are instant disqualifiers',
        ],
      },
      {
        heading: 'Power Words to Use',
        bullets: [
          'Achieved, Delivered, Implemented, Spearheaded',
          'Optimized, Streamlined, Transformed, Accelerated',
          'Collaborated, Mentored, Facilitated, Coordinated',
        ],
      },
    ],
    imagePlaceholder: 'Before & After Resume Comparison (will be added)',
    links: [
      { text: 'Try our Resume Optimizer', url: '#checker' },
    ],
  },
  {
    title: 'Top Resume Templates for 2026',
    subtitle: 'Discover the most effective resume formats and templates that hiring managers love.',
    sections: [
      {
        heading: 'Choosing the Right Format',
        text: 'The right resume format depends on your experience level and career goals. The three main formats are chronological, functional, and combination.',
      },
      {
        heading: 'Best Templates By Industry',
        bullets: [
          'Technology — Clean, skills-focused with projects section',
          'Finance — Traditional, conservative with certifications highlighted',
          'Healthcare — Credentials-first with relevant clinical experience',
          'Education — Academic achievements with teaching philosophy section',
        ],
      },
      {
        heading: 'Template Must-Haves',
        bullets: [
          'ATS-compatible formatting (no graphics or columns)',
          'Clear visual hierarchy with consistent spacing',
          'Professional font choices (Calibri, Arial, Garamond)',
          'Plenty of white space for readability',
          'Contact information prominently displayed at the top',
        ],
      },
    ],
    imagePlaceholder: 'Resume Template Gallery (will be added)',
    links: [
      { text: 'Analyze your current resume', url: '#checker' },
    ],
  },
]

function BlogModal({ blogId, onClose }) {
  const blog = BLOG_CONTENT[blogId]
  console.log('[BlogModal] Opened blog:', blogId, blog?.title)

  if (!blog) return null

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal blog-modal">
        <div className="modal__header">
          <h2 className="modal__title">{blog.title}</h2>
          <button className="modal__close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="blog-modal__content">
          <p className="blog-modal__subtitle">{blog.subtitle}</p>

          {blog.sections.map((section, i) => (
            <div key={i}>
              <h3 className="blog-modal__section-title">{section.heading}</h3>
              {section.text && <p className="blog-modal__text">{section.text}</p>}
              {section.bullets && (
                <ul className="blog-modal__list">
                  {section.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <div className="blog-modal__image-placeholder">
            {blog.imagePlaceholder}
          </div>

          {blog.links && blog.links.length > 0 && (
            <div className="blog-modal__links">
              <p className="blog-modal__links-title">Related Links</p>
              {blog.links.map((link, i) => (
                <a
                  key={i}
                  className="blog-modal__link"
                  href={link.url}
                  onClick={onClose}
                >
                  {link.text} →
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BlogModal
