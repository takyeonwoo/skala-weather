const UPSTREAMS = {
  current: {
    url: 'https://api.openweathermap.org/data/2.5/weather',
    keyParam: 'appid',
    envName: 'OPENWEATHER_API_KEY',
  },
  forecast: {
    url: 'https://api.openweathermap.org/data/2.5/forecast',
    keyParam: 'appid',
    envName: 'OPENWEATHER_API_KEY',
  },
  kma: {
    url: 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst',
    keyParam: 'serviceKey',
    envName: 'DATA_GO_KR_KEY',
  },
}

export async function proxyWeather(query) {
  const { source, ...params } = query

  const upstream = UPSTREAMS[source]
  if (!upstream) {
    return { status: 400, body: { error: `허용되지 않은 source: ${source}` } }
  }

  const apiKey = process.env[upstream.envName]
  if (!apiKey) {
    return { status: 500, body: { error: `서버에 ${upstream.envName} 환경변수가 없습니다.` } }
  }

  const target = new URL(upstream.url)
  for (const [key, value] of Object.entries(params)) {
    target.searchParams.set(key, value)
  }
  target.searchParams.set(upstream.keyParam, apiKey)

  try {
    const response = await fetch(target)
    const text = await response.text()

    let body
    try {
      body = JSON.parse(text)
    } catch {
      body = { error: '업스트림이 JSON이 아닌 응답을 반환했습니다.', raw: text.slice(0, 200) }
    }

    return { status: response.status, body }
  } catch (error) {
    return { status: 502, body: { error: '업스트림 요청 실패', detail: error.message } }
  }
}

export default async function handler(req, res) {
  const { status, body } = await proxyWeather(req.query)
  res.status(status).json(body)
}
