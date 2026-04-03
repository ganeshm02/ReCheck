import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ResumeChecker from './components/ResumeChecker'
import BlogSection from './components/BlogSection'
import BlogModal from './components/BlogModal'
import Footer from './components/Footer'
import ResultModal from './components/ResultModal'

function App() {
  const [resultData, setResultData] = useState(null)
  const [resultType, setResultType] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [activeBlog, setActiveBlog] = useState(null)

  const handleResult = (data, type) => {
    console.log('[App] Received result:', type, data)
    setResultData(data)
    setResultType(type)
    setShowResult(true)
  }

  const closeResult = () => {
    setShowResult(false)
    setResultData(null)
    setResultType(null)
  }

  const openBlog = (blogId) => {
    console.log('[App] Opening blog:', blogId)
    setActiveBlog(blogId)
  }

  const closeBlog = () => {
    setActiveBlog(null)
  }

  return (
    <>
      <Navbar />
      <Hero />
      <ResumeChecker onResult={handleResult} />
      <BlogSection onOpenBlog={openBlog} />
      <Footer />

      {showResult && (
        <ResultModal
          data={resultData}
          type={resultType}
          onClose={closeResult}
        />
      )}

      {activeBlog !== null && (
        <BlogModal
          blogId={activeBlog}
          onClose={closeBlog}
        />
      )}
    </>
  )
}

export default App
