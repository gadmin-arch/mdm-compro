import crypto from 'node:crypto'

function base64url(input: string | Buffer): string {
  const buf = typeof input === 'string' ? Buffer.from(input) : input
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

/**
 * Obtains an OAuth2 access token for Google Indexing API using standard Service Account JWT.
 * Implemented natively using Node.js crypto to avoid heavy dependencies (like googleapis).
 */
async function getGoogleAccessToken(clientEmail: string, privateKey: string): Promise<string | null> {
  const now = Math.floor(Date.now() / 1000)
  const header = { alg: 'RS256', typ: 'JWT' }
  const claimSet = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  }

  const encodedHeader = base64url(JSON.stringify(header))
  const encodedClaimSet = base64url(JSON.stringify(claimSet))
  const signatureInput = `${encodedHeader}.${encodedClaimSet}`

  const signer = crypto.createSign('RSA-SHA256')
  signer.update(signatureInput)
  signer.end()

  const formattedKey = privateKey.replace(/\\n/g, '\n')
  const signature = base64url(signer.sign(formattedKey))
  const jwt = `${signatureInput}.${signature}`

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    console.error('[Google Indexing] Failed to fetch access token:', errText)
    return null
  }

  const data = (await res.json()) as { access_token?: string }
  return data.access_token || null
}

/**
 * Direct push notification to Google Indexing API.
 * Notifies Googlebot to immediately crawl/index or remove a URL.
 */
export async function submitToGoogleIndexing(
  url: string,
  type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED',
): Promise<boolean> {
  const clientEmail =
    process.env.GOOGLE_INDEXING_CLIENT_EMAIL || process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey =
    process.env.GOOGLE_INDEXING_PRIVATE_KEY || process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY

  if (!clientEmail || !privateKey) {
    return false
  }

  try {
    const token = await getGoogleAccessToken(clientEmail, privateKey)
    if (!token) return false

    const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ url, type }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error(`[Google Indexing] Submission failed for ${url}:`, err)
      return false
    }

    console.log(`[Google Indexing] Successfully submitted ${url} (${type}) to Google Search`)
    return true
  } catch (error) {
    console.error('[Google Indexing] Error submitting URL:', error)
    return false
  }
}

/**
 * Submits URL to the IndexNow protocol (supported by Microsoft Bing, Yandex, Seznam, Naver).
 */
export async function submitToIndexNow(url: string): Promise<boolean> {
  const key = process.env.INDEXNOW_KEY
  if (!key) return false
  const host = new URL(url).hostname

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host,
        key,
        urlList: [url],
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

/**
 * Dispatches an automated crawl notification to Google & IndexNow when a page is published or updated.
 * Non-blocking: executes in the background.
 */
export async function notifySearchEngines(
  pathOrUrl: string,
  type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED',
) {
  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://multidayamitra.co.id'
  const baseUrl = (rawUrl.includes('localhost') ? rawUrl : 'https://multidayamitra.co.id').replace(/\/$/, '')
  const fullUrl = pathOrUrl.startsWith('http')
    ? pathOrUrl
    : `${baseUrl}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`

  void Promise.allSettled([
    submitToGoogleIndexing(fullUrl, type),
    submitToIndexNow(fullUrl),
  ]).catch(() => {})
}
