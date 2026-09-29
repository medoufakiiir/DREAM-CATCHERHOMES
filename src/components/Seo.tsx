import { useEffect } from 'react'

/** Sets the document title and meta description for the current page. */
export default function Seo({ title, description }: { title: string; description?: string }) {
  useEffect(() => {
    document.title = title.includes('DreamCatcher') ? title : `${title} · DreamCatcher Homes Mirleft`
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    }
  }, [title, description])
  return null
}
