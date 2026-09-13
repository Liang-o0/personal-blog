import { createApp } from 'vue'
import './assets/main.css'
import App from './App.vue'
import router from './router'

const siteUrl = 'https://britliang.top'
const upsertMeta = (name, content, property = false) => {
  const attr = property ? 'property' : 'name'
  let el = document.head.querySelector(`meta[${attr}="${name}"]`)
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, name); document.head.appendChild(el) }
  el.setAttribute('content', content)
}

router.afterEach((to) => {
  const title = to.name === 'About' ? '关于我 · PWL Journal' : to.name === 'Post' ? `${to.params.slug} · PWL Journal` : 'PWL Journal'
  const description = 'PWL 的个人博客，分享前端开发、技术实践与生活记录。'
  document.title = title
  upsertMeta('description', description)
  upsertMeta('og:title', title, true); upsertMeta('og:description', description, true)
  upsertMeta('og:url', siteUrl + to.fullPath, true)
  let link = document.head.querySelector('link[rel="canonical"]')
  if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link) }
  link.href = siteUrl + to.fullPath
  let ld = document.head.querySelector('#site-jsonld')
  if (!ld) { ld = document.createElement('script'); ld.id = 'site-jsonld'; ld.type = 'application/ld+json'; document.head.appendChild(ld) }
  ld.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': to.name === 'Post' ? 'BlogPosting' : 'WebSite', name: title, description, url: siteUrl + to.fullPath, author: { '@type': 'Person', name: 'PWL' } })
})

createApp(App).use(router).mount('#app')
