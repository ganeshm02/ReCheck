import { ArrowDown } from 'lucide-react'

function Hero() {
  console.log('[Hero] Rendered')

  const scrollToChecker = () => {
    console.log('[Hero] CTA clicked — scrolling to checker')
    const checker = document.getElementById('checker')
    if (checker) {
      const offset = 80
      const top = checker.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <section className="hero">
      <div className="hero__content">
        <h1 className="hero__title">
          AI-Powered Resume<br />Analyzer & ATS Checker
        </h1>
        <p className="hero__subtitle">
          Get your resume scored against real job descriptions, optimize it for ATS systems, and land more interviews with AI-driven insights.
        </p>
        <button className="hero__cta" onClick={scrollToChecker}>
          Analyze My Resume
          <ArrowDown size={18} />
        </button>
      </div>

      <div className="hero__image-wrapper">
        <img
          src="/images/hero-resume.png"
          alt="Resume mockup"
          className="hero__image"
          onError={(e) => {
            e.target.style.background = 'var(--bg-input)'
            e.target.style.width = '100%'
            e.target.style.maxWidth = '400px'
            e.target.style.height = '520px'
            e.target.style.display = 'flex'
            e.target.style.alignItems = 'center'
            e.target.style.justifyContent = 'center'
            e.target.alt = 'Resume Mockup (400×520 px)'
          }}
        />
      </div>
    </section>
  )
}

export default Hero
