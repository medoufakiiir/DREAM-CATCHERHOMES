import { Link, useParams } from 'react-router-dom'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import Seo from '@/components/Seo'
import PageHero from '@/components/PageHero'
import Reveal from '@/components/ui/Reveal'
import NotFound from '@/pages/NotFound'
import { posts, getPost, readingTime, Post } from '@/content/posts'
import { SITE } from '@/lib/site'
import { cn } from '@/lib/utils'

const fmtDate = (iso: string, lang: string) =>
  new Date(iso + 'T00:00:00').toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

/** Renders **bold** and [text](/path) inside a paragraph. */
function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g)
  return (
    <>
      {parts.map((part, i) => {
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
        if (link) {
          const [, label, href] = link
          return href.startsWith('/')
            ? <Link key={i} to={href} className="text-gold underline underline-offset-4 decoration-gold/40 hover:decoration-gold">{label}</Link>
            : <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="text-gold underline underline-offset-4">{label}</a>
        }
        if (part.startsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>
        return part
      })}
    </>
  )
}

function PostCard({ post, big = false }: { post: Post; big?: boolean }) {
  const { dark, lang } = useApp()
  return (
    <Link to={`/journal/${post.slug}`} className={cn('group block', big && 'md:grid md:grid-cols-2 md:gap-12 md:items-center')}>
      <div className={cn('overflow-hidden', big ? 'aspect-[4/3]' : 'aspect-[3/2]')}>
        <img src={post.cover} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105" />
      </div>
      <div className={big ? 'pt-6 md:pt-0' : 'pt-6'}>
        <p className={cn('eyebrow', dark ? 'text-sand-400' : 'text-ocean-300')}>
          {post.tags[0]} · {fmtDate(post.date, lang)} · {readingTime(post)} min
        </p>
        <h2 className={cn('font-heading mt-3 group-hover:text-gold transition-colors', big ? 'text-4xl sm:text-5xl' : 'text-3xl', dark ? 'text-sand-100' : 'text-ocean-500')}>{post.title}</h2>
        <p className={cn('font-body text-sm leading-relaxed mt-3', dark ? 'text-sand-300/80' : 'text-ocean-400')}>{post.description}</p>
        <span className="inline-flex items-center gap-2 mt-5 font-body text-[11px] uppercase tracking-[0.22em] font-semibold text-gold">
          Read <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}

export function JournalIndex() {
  const { dark } = useApp()
  const [first, ...rest] = posts
  return (
    <div className={dark ? 'bg-ocean-900' : 'bg-white'}>
      <Seo
        title="Journal — Mirleft travel guides"
        description="Local guides to Mirleft and Morocco's southern Atlantic coast: things to do, surfing, getting here and the best time to visit."
      />
      <PageHero image="/photo26.jpg" label="Journal" title="Stories & guides from Mirleft" sub="Local tips for planning your stay on Morocco's wild Atlantic coast." />
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Reveal><PostCard post={first} big /></Reveal>
          <div className="grid md:grid-cols-3 gap-x-8 gap-y-16 mt-20 sm:mt-28">
            {rest.map((p, i) => <Reveal key={p.slug} delay={i * 0.08}><PostCard post={p} /></Reveal>)}
          </div>
        </div>
      </section>
    </div>
  )
}

export function JournalPost() {
  const { slug = '' } = useParams()
  const { dark, lang, tr } = useApp()
  const post = getPost(slug)
  if (!post) return <NotFound />
  const more = posts.filter(p => p.slug !== post.slug).slice(0, 3)
  const text = dark ? 'text-sand-200/90' : 'text-ocean-400'
  const head = dark ? 'text-sand-100' : 'text-ocean-500'

  return (
    <div className={dark ? 'bg-ocean-900' : 'bg-white'}>
      <Seo
        title={post.title}
        description={post.description}
        image={post.cover}
        type="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.description,
          image: SITE.url + post.cover,
          datePublished: post.date,
          dateModified: post.date,
          author: { '@type': 'Organization', name: SITE.name },
          publisher: { '@type': 'Organization', name: SITE.name, logo: { '@type': 'ImageObject', url: SITE.url + '/logo.png' } },
          mainEntityOfPage: `${SITE.url}/journal/${post.slug}`,
        }}
      />
      <PageHero image={post.cover} label={`${post.tags[0]} · ${readingTime(post)} min read`} title={post.title} />

      <article className="max-w-2xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
        <div className="flex items-center justify-between mb-10">
          <Link to="/journal" className={cn('inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.2em]', text, 'hover:text-gold')}>
            <ArrowLeft size={13} /> Journal
          </Link>
          <time dateTime={post.date} className={cn('font-body text-xs', text)}>{fmtDate(post.date, lang)}</time>
        </div>
        <p className={cn('font-heading text-2xl sm:text-3xl leading-snug mb-10', head)}>{post.description}</p>
        <div className="font-body text-[17px] leading-[1.85]">
          {post.body.map((b, i) =>
            'h2' in b ? <h2 key={i} className={cn('font-heading text-3xl mt-12 mb-4', head)}>{b.h2}</h2>
            : 'ul' in b ? <ul key={i} className={cn('list-disc pl-5 space-y-2 mb-6 marker:text-gold', text)}>{b.ul.map(li => <li key={li}><Rich text={li} /></li>)}</ul>
            : <p key={i} className={cn('mb-6', text)}><Rich text={b.p} /></p>
          )}
        </div>

        <div className={cn('mt-16 p-8 sm:p-10', dark ? 'bg-ocean-800' : 'bg-sand-50')}>
          <p className={cn('font-heading text-3xl mb-3', head)}>{tr.x.c_title}</p>
          <p className={cn('font-body text-sm mb-6', text)}>{tr.x.c_sub}</p>
          <Link to="/booking" className="inline-flex items-center gap-3 bg-gold hover:bg-gold-600 text-white font-body text-[11px] uppercase tracking-[0.22em] font-semibold px-7 py-4 transition-colors">
            {tr.home.cta_btn} <ArrowRight size={14} />
          </Link>
        </div>
      </article>

      <section className={cn('py-20', dark ? 'bg-ocean-800' : 'bg-sand-50')}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <h2 className={cn('font-heading text-4xl mb-12', head)}>Keep reading</h2>
          <div className="grid md:grid-cols-3 gap-8">{more.map(p => <PostCard key={p.slug} post={p} />)}</div>
        </div>
      </section>
    </div>
  )
}
