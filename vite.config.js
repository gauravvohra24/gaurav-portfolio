import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// Domain-dependent SEO tags are only emitted once the real public URL is known.
// Set VITE_SITE_URL (e.g. https://your-site.netlify.app) in .env or the hosting
// provider's environment variables; without it these tags are simply omitted.
function siteMeta(siteUrl) {
  return {
    name: 'site-meta',
    transformIndexHtml(html) {
      if (!siteUrl) return html
      const image = `${siteUrl}/og-image.png`
      return {
        html: html.replace('<meta name="twitter:card" content="summary" />', '<meta name="twitter:card" content="summary_large_image" />'),
        tags: [
          { tag: 'link', attrs: { rel: 'canonical', href: `${siteUrl}/` }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:url', content: `${siteUrl}/` }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:image', content: image }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:image:height', content: '630' }, injectTo: 'head' },
          { tag: 'meta', attrs: { name: 'twitter:image', content: image }, injectTo: 'head' },
        ],
      }
    },
    generateBundle() {
      if (!siteUrl) return
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${siteUrl}/</loc>\n    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n`,
      })
    },
  }
}

// Serves the Netlify Function at /api/leetcode during `vite dev` and `vite preview`,
// so the live LeetCode section works locally exactly as it does on Netlify.
function netlifyFunctionsLocally() {
  const handle = async (req, res, next) => {
    if (!req.url?.startsWith('/api/leetcode')) return next()
    try {
      const mod = await import(new URL('./netlify/functions/leetcode.mjs', import.meta.url).href)
      const response = await mod.default(new Request(`http://localhost${req.url}`))
      res.statusCode = response.status
      response.headers.forEach((value, key) => res.setHeader(key, value))
      res.end(await response.text())
    } catch {
      res.statusCode = 502
      res.setHeader('Content-Type', 'application/json')
      res.end('{"error":"LeetCode data temporarily unavailable"}')
    }
  }
  return {
    name: 'netlify-functions-locally',
    // Block bodies on purpose: a returned value would be treated as a post-hook by Vite.
    configureServer(server) {
      server.middlewares.use(handle)
    },
    configurePreviewServer(server) {
      server.middlewares.use(handle)
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_SITE_URL')
  const siteUrl = (env.VITE_SITE_URL || '').trim().replace(/\/+$/, '')
  return {
    plugins: [react(), siteMeta(siteUrl), netlifyFunctionsLocally()],
  }
})
