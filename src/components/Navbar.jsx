function Navbar() {
  console.log('[Navbar] Rendered')

  return (
    <nav className="navbar">
      <img
        src="/images/logo.png"
        alt="ReCheck"
        className="navbar__logo"
        onError={(e) => {
          e.target.style.display = 'none'
          const placeholder = document.createElement('div')
          placeholder.className = 'navbar__logo-placeholder'
          placeholder.textContent = 'LOGO (280×50 px)'
          e.target.parentElement.insertBefore(placeholder, e.target)
        }}
      />
    </nav>
  )
}

export default Navbar
