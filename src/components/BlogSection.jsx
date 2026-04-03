import { ArrowRight } from 'lucide-react'

const BLOGS = [
  {
    id: 0,
    tag: 'ATS Guide',
    title: 'How to Beat ATS Systems in 2026',
    excerpt: 'Learn the insider strategies to get your resume past automated screening systems and into the hands of recruiters.',
    image: '/images/blog-1.png'
  },
  {
    id: 1,
    tag: 'Resume Tips',
    title: 'Resume Writing Best Practices',
    excerpt: 'Master the art of resume writing with proven techniques that highlight your achievements and grab attention.',
    image: '/images/blog-2.png'
  },
  {
    id: 2,
    tag: 'Templates',
    title: 'Top Resume Templates for 2026',
    excerpt: 'Discover the most effective and ATS-friendly resume templates that will make your application stand out.',
    image: '/images/blog-3.png'
  }
]

function BlogSection({ onOpenBlog }) {
  console.log('[BlogSection] Rendered')

  return (
    <section className="blog">
      <h2 className="blog__title">Resume Resources & Tips</h2>
      <p className="blog__subtitle">
        Expert advice to help you craft the perfect resume and ace the ATS
      </p>

      <div className="blog__grid">
        {BLOGS.map(blog => (
          <article
            key={blog.id}
            className="blog__card"
            onClick={() => onOpenBlog(blog.id)}
          >
            <div className="blog__card-image">
              <img
                src={blog.image}
                alt={blog.title}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.parentElement.innerHTML = `<div style="height:200px;display:flex;align-items:center;justify-content:center;background:var(--bg-input);color:var(--text-muted);font-size:0.85rem">Image Placeholder (380×220 px)</div>`
                }}
              />
            </div>
            <div className="blog__card-body">
              <span className="blog__card-tag">{blog.tag}</span>
              <h3 className="blog__card-title">{blog.title}</h3>
              <p className="blog__card-excerpt">{blog.excerpt}</p>
              <span className="blog__card-link">
                Read More <ArrowRight size={14} />
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default BlogSection
