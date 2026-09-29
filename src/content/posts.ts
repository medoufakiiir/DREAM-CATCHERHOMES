import raw from './posts.json'

export type Block = { p: string } | { h2: string } | { ul: string[] }
export interface Post {
  slug: string
  title: string
  description: string
  date: string
  cover: string
  tags: string[]
  body: Block[]
}

export const posts = (raw as Post[]).slice().sort((a, b) => b.date.localeCompare(a.date))
export const getPost = (slug: string) => posts.find(p => p.slug === slug)

export const readingTime = (p: Post) => {
  const words = p.body.map(b => ('p' in b ? b.p : 'h2' in b ? b.h2 : b.ul.join(' '))).join(' ').split(/\s+/).length
  return Math.max(2, Math.round(words / 200))
}
