import { defineConfig, type Plugin, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { createHash, randomUUID } from 'node:crypto'

function md5Hex(input: string) {
  return createHash('md5').update(input, 'utf8').digest('hex')
}

function buildUpgradeLinkSignature(params: {
  body: string
  nonce: string
  secretKey: string
  timestamp: string
  url: string
}) {
  const bodyPart = params.body ? `body=${params.body}&` : ''
  const signStr = `${bodyPart}nonce=${params.nonce}&secretKey=${params.secretKey}&timestamp=${params.timestamp}&url=${params.url}`
  return md5Hex(signStr)
}

function normalizeEnvValue(raw: string | undefined) {
  const value = (raw ?? '').trim()
  if (!value) return ''
  const strippedQuotes = value.replace(/^['"]|['"]$/g, '')
  const prefixMatch = strippedQuotes.match(/^(AccessKey|SecretKey)\s*=\s*(.+)$/i)
  return (prefixMatch?.[2] ?? strippedQuotes).trim()
}

function formatRfc3339Local(date: Date) {
  const pad2 = (n: number) => String(n).padStart(2, '0')
  const year = date.getFullYear()
  const month = pad2(date.getMonth() + 1)
  const day = pad2(date.getDate())
  const hours = pad2(date.getHours())
  const minutes = pad2(date.getMinutes())
  const seconds = pad2(date.getSeconds())

  const offsetMinutes = -date.getTimezoneOffset()
  const sign = offsetMinutes >= 0 ? '+' : '-'
  const abs = Math.abs(offsetMinutes)
  const offsetHours = pad2(Math.floor(abs / 60))
  const offsetMins = pad2(abs % 60)

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${sign}${offsetHours}:${offsetMins}`
}

function upgradeLinkStatsProxy(): Plugin {
  const routePrefix = '/api/upgradelink/app/statistics'
  const apiOrigin = 'https://api.upgrade.toolsetlink.com'

  return {
    name: 'upgradelink-stats-proxy',
    configureServer(server) {
      server.middlewares.use(routePrefix, async (req, res) => {
        try {
          const url = new URL(req.url ?? '', 'http://localhost')
          const appKey = url.searchParams.get('appKey') ?? process.env.UPGRADELINK_APP_KEY ?? ''
          const accessKey = normalizeEnvValue(process.env.UPGRADELINK_ACCESS_KEY)
          const secretKey = normalizeEnvValue(process.env.UPGRADELINK_SECRET_KEY)

          if (!appKey) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
            res.end(
              JSON.stringify({
                code: 400002,
                msg: '参数缺失: appKey（请在 .env 配置 UPGRADELINK_APP_KEY 或请求带 appKey）',
                traceId: '',
                docs: '',
              })
            )
            return
          }

          if (!accessKey || !secretKey) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
            res.end(
              JSON.stringify({
                code: 500,
                msg: '缺少服务端签名配置：UPGRADELINK_ACCESS_KEY / UPGRADELINK_SECRET_KEY（请在 .env 填正确值）',
                traceId: '',
                docs: '',
              })
            )
            return
          }

          const upstreamPath = `/v1/app/statistics/info?appKey=${encodeURIComponent(appKey)}`
          const timestamp = formatRfc3339Local(new Date())
          const nonce = randomUUID().replaceAll('-', '')
          const signature = buildUpgradeLinkSignature({
            body: '',
            nonce,
            secretKey,
            timestamp,
            url: upstreamPath,
          })

          const upstreamRes = await fetch(`${apiOrigin}${upstreamPath}`, {
            method: 'GET',
            headers: {
              'X-Timestamp': timestamp,
              'X-Nonce': nonce,
              'X-AccessKey': accessKey,
              'X-Signature': signature,
              Accept: 'application/json',
            },
          })

          const text = await upstreamRes.text()
          res.statusCode = upstreamRes.status
          res.setHeader('Content-Type', upstreamRes.headers.get('content-type') ?? 'application/json; charset=utf-8')
          res.end(text)
        } catch (error) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(
            JSON.stringify({
              code: 500,
              msg: error instanceof Error ? error.message : 'Unknown error',
              traceId: '',
              docs: '',
            })
          )
        }
      })
    },
  }
}

function upgradeLinkAppReportProxy(): Plugin {
  const routePrefix = '/api/upgradelink/app/report'
  const apiOrigin = 'https://api.upgrade.toolsetlink.com'

  return {
    name: 'upgradelink-app-report-proxy',
    configureServer(server) {
      server.middlewares.use(routePrefix, async (req, res) => {
        try {
          if ((req.method ?? '').toUpperCase() !== 'POST') {
            res.statusCode = 405
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
            res.end(JSON.stringify({ code: 405, msg: 'Method Not Allowed', traceId: '', docs: '' }))
            return
          }

          const accessKey = normalizeEnvValue(process.env.UPGRADELINK_ACCESS_KEY)
          const secretKey = normalizeEnvValue(process.env.UPGRADELINK_SECRET_KEY)

          if (!accessKey || !secretKey) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
            res.end(
              JSON.stringify({
                code: 500,
                msg: '缺少服务端签名配置：UPGRADELINK_ACCESS_KEY / UPGRADELINK_SECRET_KEY（请在 .env 填正确值）',
                traceId: '',
                docs: '',
              })
            )
            return
          }

          const chunks: Buffer[] = []
          await new Promise<void>((resolve, reject) => {
            req.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)))
            req.on('end', () => resolve())
            req.on('error', (err) => reject(err))
          })

          const rawBody = Buffer.concat(chunks).toString('utf8').trim()
          const jsonBody = rawBody ? (JSON.parse(rawBody) as Record<string, unknown>) : {}

          const appKey = (jsonBody.appKey as string | undefined) ?? process.env.UPGRADELINK_APP_KEY ?? ''
          if (!appKey) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
            res.end(
              JSON.stringify({
                code: 400002,
                msg: '参数缺失: appKey（请在 .env 配置 UPGRADELINK_APP_KEY 或请求体带 appKey）',
                traceId: '',
                docs: '',
              })
            )
            return
          }

          const bodyTimestamp = typeof jsonBody.timestamp === 'string' && jsonBody.timestamp.trim() ? jsonBody.timestamp.trim() : ''
          const timestamp = bodyTimestamp || formatRfc3339Local(new Date())
          const requestBody = JSON.stringify({ ...jsonBody, appKey, timestamp })
          const upstreamPath = '/v1/app/report'
          const nonce = randomUUID().replaceAll('-', '')
          const signature = buildUpgradeLinkSignature({
            body: requestBody,
            nonce,
            secretKey,
            timestamp,
            url: upstreamPath,
          })

          const upstreamRes = await fetch(`${apiOrigin}${upstreamPath}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Timestamp': timestamp,
              'X-Nonce': nonce,
              'X-AccessKey': accessKey,
              'X-Signature': signature,
              Accept: 'application/json',
            },
            body: requestBody,
          })

          const text = await upstreamRes.text()
          res.statusCode = upstreamRes.status
          res.setHeader('Content-Type', upstreamRes.headers.get('content-type') ?? 'application/json; charset=utf-8')
          res.end(text)
        } catch (error) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(
            JSON.stringify({
              code: 500,
              msg: error instanceof Error ? error.message : 'Unknown error',
              traceId: '',
              docs: '',
            })
          )
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  for (const [key, value] of Object.entries(env)) process.env[key] = value

  return {
    plugins: [react(), tailwindcss(), upgradeLinkStatsProxy(), upgradeLinkAppReportProxy()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
