import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SITE } from '@/lib/site'

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

/** Sets title, description, canonical, Open Graph tags and optional JSON-LD for the current page. */
export default function Seo({ title, description, image, type = 'website', jsonLd }: {
  title: string
  description?: string
  image?: string
  type?: 'website' | 'article'
  jsonLd?: object
}) {
  const { pathname } = useLocation()

  useEffect(() => {
    const full = title.includes('DreamCatcher') ? title : `${title} · DreamCatcher Homes Mirleft`
    const url = SITE.url + pathname
    document.title = full
    if (description) {
      setMeta('name', 'description', description)
      setMeta('property', 'og:description', description)
    }
    setMeta('property', 'og:title', full)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:type', type)
    if (image) setMeta('property', 'og:image', SITE.url + image)
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = url

    // Drop page-level JSON-LD from a previous page (or the prerendered HTML)
    document.head.querySelectorAll('script[data-page]').forEach(el => el.remove())
    if (!jsonLd) return
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.dataset.page = 'true'
    script.text = JSON.stringify(jsonLd)
    document.head.appendChild(script)
    return () => script.remove()
  }, [title, description, image, type, jsonLd, pathname])

  return null
}
