const VERCEL_URL = 'https://marketing-arthurwheildon0-6755s-projects.vercel.app'

export async function onRequest(context) {
  const url = new URL(context.request.url)
  const target = new URL(url.pathname + url.search, VERCEL_URL)

  const response = await fetch(target.toString(), {
    method: context.request.method,
    headers: context.request.headers,
    body: ['GET', 'HEAD'].includes(context.request.method) ? undefined : context.request.body,
    redirect: 'follow',
  })

  return response
}
