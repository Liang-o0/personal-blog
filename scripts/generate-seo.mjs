import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { glob } from 'node:fs'
const files = ['src/posts/guide.md','src/posts/welcome.md']
const urls = files.map(f => `/post/${f.split('/').pop().replace('.md','')}`)
const base = 'https://britliang.top'
const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/','/about',...urls].map(u=>`<url><loc>${base}${u}</loc></url>`).join('')}</urlset>`
await mkdir('public', { recursive: true })
await writeFile('public/sitemap.xml', xml)
await writeFile('public/feed.xml', `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>PWL Journal</title><link>${base}/</link><description>PWL 的个人博客</description>${files.map(f=>`<item><title>${f}</title><link>${base}/post/${f.split('/').pop().replace('.md','')}</link></item>`).join('')}</channel></rss>`)
