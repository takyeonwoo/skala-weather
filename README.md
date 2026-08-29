# skala-weather

**Full-Stack Engineering — Frontend Framework: Vue.js 실습 프로젝트**

판교 1반 P032 탁연우

Vue 3로 만든 날씨 대시보드다. 강의 커리큘럼의 Hands-on 과제 1~7을 한 애플리케이션 안에 각각 독립된 화면으로 구현했고, 여기에 대한민국 시/도 날씨 지도(Appendix)를 추가로 붙였다.

**배포 주소** — https://skala-weather-omega.vercel.app

**저장소** — https://github.com/takyeonwoo/skala-weather

---

## 목차

1. [실행 방법](#실행-방법)
2. [배포](#배포)
3. [프로젝트 구조](#프로젝트-구조)
4. [과제별 구현 내용](#과제별-구현-내용)
5. [트러블슈팅](#트러블슈팅)
6. [배운 점 / 알게 된 점](#배운-점--알게-된-점)
7. [느낀 점](#느낀-점)
8. [과제 완료 현황 및 개선 여지](#과제-완료-현황-및-개선-여지)

---

## 실행 방법

### 1) 의존성 설치

```bash
npm install
```

### 2) 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성한다. (`.gitignore`의 `*.local` 규칙으로 Git 추적에서 자동 제외된다.)

```
OPENWEATHER_API_KEY=발급받은_OpenWeatherMap_키
DATA_GO_KR_KEY=공공데이터포털_일반인증키_Decoding
```

| 변수 | 발급처 | 용도 |
| --- | --- | --- |
| `OPENWEATHER_API_KEY` | [openweathermap.org](https://openweathermap.org/) | 과제 6 실시간 날씨, 5일 예보, 지도 기온 |
| `DATA_GO_KR_KEY` | [공공데이터포털](https://www.data.go.kr) | 지도 강수량 (기상청 초단기실황) |

> **`VITE_` 접두사를 붙이지 않는다.** Vite는 `VITE_`로 시작하는 변수만 클라이언트 번들에 넣는데, 이 프로젝트는 키를 브라우저에 안 내려보내려고 서버리스 프록시를 경유한다. 접두사를 붙이면 키가 번들에 그대로 박혀서 숨긴 의미가 없어진다. (자세한 내용: [배포 › API 키 은닉](#api-키-은닉))
>
> **`.env` 파일은 dev 서버 시작 시점에만 읽힌다.** 값을 바꿨다면 반드시 서버를 재시작해야 한다.
>
> **공공데이터포털 키는 반드시 Decoding 버전을 사용한다.** Encoding 키는 이미 퍼센트 인코딩된 문자열이라, 쿼리를 조립할 때 `%`가 `%25`로 한 번 더 인코딩된다. 그러면 기상청이 등록되지 않은 키로 보고 403 `SERVICE_KEY_IS_NOT_REGISTERED_ERROR`를 반환한다.

### 3) 개발 서버 실행

```bash
npm run dev
```

### 4) 빌드

```bash
npm run build
npm run preview
```

### 라우트 목록

| 경로 | 화면 | 대응 과제 |
| --- | --- | --- |
| `/` | 과제 목록 (홈) | — |
| `/weather` | 날씨 Mockup | 과제 1 |
| `/weather2` | 날씨 (컴포지션) | 과제 2 |
| `/weather3` | 날씨 (컴포넌트) | 과제 3 |
| `/weather4`, `/weather4/:cityId` | 라우터 적용 + 상세 | 과제 4 |
| `/weather5`, `/weather5/:cityId` | 스토어 적용 + 상세 | 과제 5 |
| `/weather6`, `/weather6/:cityId` | 실시간 날씨 + 5일 예보 | 과제 6, 7 |
| `/weather-map` | 대한민국 날씨 지도 | Appendix |
| `/about` | 서비스 소개 | 과제 4 |
| `/compare/:cityA/:cityB` | 도시 비교 | 과제 4 (추가 view) |
| `/:pathMatch(.*)*` | 404 Not Found | 과제 4 (Catch-all) |

---

## 배포

Vercel에 배포했다. `main` 브랜치에 push하면 자동으로 재배포된다.

https://skala-weather-omega.vercel.app

### 구성

| 항목 | 값 |
| --- | --- |
| Framework Preset | **Vite** (Vue CLI가 아니므로 `Vue.js` 프리셋이 아니다) |
| Build Command | `npm run build` |
| Output Directory | `dist` |

### 배포에 필요한 두 가지 설정

**1) 환경 변수** — Vercel 프로젝트 설정에 아래 두 개를 등록한다. `.env.local`은 Git에 안 올라가니까 Vercel은 이 값을 모른다.

| Key | Environments |
| --- | --- |
| `OPENWEATHER_API_KEY` | Production, Preview |
| `DATA_GO_KR_KEY` | Production, Preview |

`Development`는 `vercel dev`로 돌릴 때만 쓰이니 이 프로젝트에는 필요 없다. 그리고 환경 변수를 나중에 추가하거나 고치면 자동 재배포가 안 된다. Deployments 탭에서 Redeploy를 눌러야 반영된다.

**2) SPA 라우팅** — `vercel.json`이 모든 경로를 `index.html`로 넘긴다.

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

이게 없으면 `/weather4/city_01` 같은 주소로 직접 접속하거나 새로고침할 때 404가 난다. 링크를 눌러 이동하는 건 Vue Router가 처리하니 괜찮은데, 서버로 요청이 바로 들어가는 경우는 서버 쪽 설정이 있어야 한다.

### API 키 은닉

키가 필요한 API는 브라우저가 직접 부르지 않는다. OpenWeatherMap(현재 날씨·5일 예보)과 기상청 초단기실황은 서버리스 함수(`api/weather.js`)를 거치고, 키는 그 안에서만 붙는다. 함수는 `source` 화이트리스트에 있는 세 곳(`current`, `forecast`, `kma`)만 중계하고 나머지는 400으로 막는다. 키가 필요 없는 Open-Meteo(미세먼지)만 브라우저에서 바로 호출한다.

```
브라우저 ──> /api/weather?source=current&q=Seoul ──> Vercel 함수 ──[키 추가]──> OpenWeatherMap
                                                        ↑ 키는 여기에만 존재
```

개발 환경에서도 같은 경로를 쓴다. `vite.config.js`의 `api-dev-server` 플러그인이 dev 서버의 `/api/weather`에 같은 함수를 물려주기 때문에, `npm run dev`와 배포본이 동일하게 동작한다.

배포하고 개발자 도구 Network 탭을 확인해보니 `appid=`나 `serviceKey=`가 붙은 요청은 하나도 없었고, 빌드 번들에서도 키 문자열이 안 나왔다.

---

## 프로젝트 구조

```
api/
└── weather.js                   # 서버리스 프록시 (API 키 은닉, 화이트리스트)
vercel.json                      # SPA 라우팅 (모든 경로 → index.html)
src/
├── main.js                      # Pinia, Router, Element Plus 전역 등록
├── App.vue                      # 네비게이션 바 + UnitToggler + RouterView
├── router/
│   └── index.js                 # 라우트 정의 (Lazy Loading, 동적 경로, Catch-all)
├── stores/
│   ├── configStore.js           # 섭씨/화씨 단위 전역 상태
│   ├── favoriteStore.js         # 즐겨찾기 도시 전역 상태
│   └── counter.js               # 스캐폴드 기본 (미사용, 문법 참고용)
├── data/
│   └── koreaRegions.js          # 시/도 SVG 경계 + 좌표 데이터 (17개)
├── components/exercise/
│   ├── BaseDashboardCard.vue    # slot 기반 공통 박스
│   ├── SearchBar.vue            # props / update-query emit
│   ├── DisplaySettings.vue      # props / update-* emit
│   ├── WeatherCard.vue          # 과제 3·4용 카드
│   ├── WeatherCardUnit.vue      # 과제 5용 카드 (단위 변환 + 즐겨찾기)
│   ├── UnitToggler.vue          # 전역 단위 전환 버튼
│   └── KoreaMap.vue             # 인라인 SVG 지도
└── views/                       # 페이지 단위 컴포넌트 14개
```

### 설계 원칙

**과제별 파일을 의도적으로 분리했다.** 과제 1~7이 같은 날씨 앱을 점진적으로 발전시키는 구조라 하나의 화면을 계속 덮어쓰는 방식도 가능했지만, 그렇게 하면 **각 과제에서 무슨 문법을 썼는지 기록이 사라진다.** 예를 들어 과제 1은 `computed` 없이 순수 디렉티브만으로 구현했는데, 과제 2의 코드로 덮어쓰면 그 사실이 남지 않는다.

그래서 각 과제를 독립된 뷰로 두고, 홈 화면에서 과제 목록으로 진입하도록 구성했다. 코드 중복은 생기지만 **커리큘럼의 학습 단계를 그대로 보존하는 것**이 이 프로젝트에서는 더 가치 있다고 판단했다.

---

## 과제별 구현 내용

### 과제 1 — Weather Mockup

`/weather` · `views/WeatherView.vue`

순수 Vue 디렉티브만으로 정적 Mockup을 만들었다.

| 요구사항 | 구현 |
| --- | --- |
| 배열 렌더링 | `v-for` + `:key="city.id"` |
| 조건부 렌더링 | `v-if` / `v-else`로 25도 기준 배지 분기 |
| 양방향 바인딩 | `:value` + `@input` (한글 IME 즉시 동기화) |
| 이벤트 및 수식어 | `@click` (카드 선택), `@click.stop` (버블링 차단) |
| 본인 데이터 추가 | 도시 8개로 확장, `humidity`·`wind` 필드 추가, `v-show` 토글 |

### 과제 2 — Weather Composition

`/weather2` · `views/WeatherView2.vue`

| 요구사항 | 구현 |
| --- | --- |
| 반응형 상태 | `searchQuery`, `selectedCityInfo`, `weatherList` |
| Computed | `filteredWeatherList` — 검색어 포함 필터링 |
| watch | `selectedCityInfo` 감시 → 상태바 문구 변경 로그 |
| watchEffect | `searchQuery` 자동 추적 → 타이핑마다 로그 |
| 검색 결과 분기 | `v-if` / `v-else` — 결과가 있으면 목록, 없으면 안내 문구 |
| 본인 추가 | `sortByTemp` 상태 + `sortedWeatherList` computed + 정렬 watch |

`'서울'.includes('')`가 `true`이기 때문에 `filteredWeatherList`는 검색어가 비어 있을 때 따로 분기를 안 해도 전체가 나온다.

### 과제 3 — Weather Component

`/weather3` · `views/WeatherParent.vue`

기능은 그대로 둔채로 4개 컴포넌트로 쪼갰고, 쪼개기 전후 동작이 같은지 브라우저에서 항목별로 대조하였다.

```
WeatherParent (모든 반응형 데이터 보유)
  └ BaseDashboardCard (slot으로 박스 디자인 공통화)
      ├ SearchBar        props: search-query / emits: update-query
      ├ DisplaySettings  props: show-details, sort-by-temp / emits: update-*
      └ WeatherCard      props: city-item, show-details / emits: select-card, click-detail
```

slot으로 넘긴 자식은 눈으로는 `BaseDashboardCard` 안에 있지만 컴파일은 부모 스코프에서 된다. 그래서 `BaseDashboardCard`가 props를 중계할 필요가 없다.

### 과제 4 — Weather Router

`/weather4` · `views/WeatherHomeView.vue`, `WeatherDetailView.vue`, `WeatherAboutView.vue`, `NotFoundView.vue`, `CompareView.vue`

| 요구사항 | 구현 |
| --- | --- |
| Lazy Loading | 전 라우트 `component: () => import(...)` |
| Catch-all | `path: '/:pathMatch(.*)*'` — **반드시 목록 마지막** |
| Navigation Bar | `App.vue`에 `RouterLink` + `RouterView` |
| Programmatic Navigation | `window.alert()` 제거 → `router.push('/weather4/' + id)` |
| 동적 경로 매칭 | `/weather4/:cityId` → `route.params.cityId`로 Mock Data 조회 |
| 본인 추가 view | `CompareView` — 다중 동적 세그먼트 `/compare/:cityA/:cityB` (188p) |

### 과제 5 — Weather Store

`/weather5` · `views/WeatherStoreView.vue`, `WeatherStoreDetailView.vue`

```js
// stores/configStore.js
state    unit         'celsius' | 'fahrenheit'
getters  unitSymbol   '℃' | '℉'
actions  toggleUnit   토글
```

추가 Store로 `favoriteStore.js`를 만들었다. `favoriteIds` 배열 상태에 `favoriteCount` getter, `toggleFavorite`/`isFavorite` action 구성이다. 대시보드에서 즐겨찾기를 누르고 상세 페이지로 넘어가도 개수가 그대로인 걸로 전역 상태가 맞다는 걸 확인했다.

### 과제 6 — Weather Axios

`/weather6` · `views/WeatherAxiosView.vue`, `WeatherForecastView.vue`

| 요구사항 | 구현 |
| --- | --- |
| 실제 날씨 데이터 | OpenWeatherMap Current Weather API, 8개 도시 `Promise.all` 동시 조회 |
| OpenWeatherMap API 추가 | 5 day / 3 hour Forecast API |
| 기타 외부 API 추가 | 기상청 초단기실황, Open-Meteo Air Quality (지도에서 활용) |

예보 응답의 `list`는 3시간 간격으로 40개가 온다. `dt_txt`가 `"2026-08-28 12:00:00"` 형식인 걸 이용해 매일 정오만 골라 리스트를 5개로 줄였다.

```js
res.data.list.filter((item) => item.dt_txt.includes('12:00:00'))
```

### 과제 7 — Weather UI Library

Element Plus를 선택하였으며, 과제 6의 실시간 날씨 화면(`WeatherAxiosView.vue`)에 적용했다.

| 기존 | Element Plus |
| --- | --- |
| `<li>` 카드 | `<el-card shadow="hover">` |
| `<button>` | `<el-button type="primary">` |
| 로딩 문구 | `v-loading` 디렉티브 |
| `<span class="badge">` | `<el-tag type="danger" / "info">` |
| 에러 `<p>` | `<el-alert type="error" show-icon>` |


### Appendix — 대한민국 날씨 지도

`/weather-map` · `views/WeatherMapView.vue`, `components/exercise/KoreaMap.vue`

전국의 17개 시/도를 클릭 가능한 인라인 SVG로 그리고, 지표별로 각기 다른 색을 칠한다.

| 모드 | 데이터 소스 | 색 등급 기준 |
| --- | --- | --- |
| 기온 | OpenWeatherMap | 자체 구간 (20 / 25 / 30도 4단계) |
| 강수량 | 기상청 초단기실황 `RN1` + `PTY` | **기상청 예보 용어 강수 강도** |
| 미세먼지 | Open-Meteo Air Quality `pm2_5` | **환경부 대기환경기준** |

- 지도 SVG: [Wikimedia Commons — Map_of_South_Korea-blank.svg](https://commons.wikimedia.org/wiki/File:Map_of_South_Korea-blank.svg) (Public Domain)
- 지역을 클릭하면 상세 카드에 현재 모드의 지표를 크게 띄운다. 지도 색과 카드 헤더 색은 같은 등급 함수를 써서 어긋나지 않게 했다.

---

## 트러블슈팅

### Vue 문법

#### TS-01. 화면 구조 오류

두번째 Hands on으로 넘어가면서 화면 구조를 새로 짜다가 Vite 에러 오버레이가 나왔다.

```
[vue/compiler-sfc] Identifier 'selectCity' has already been declared. (26:6)
```

`<template>`은 새 코드로 바꿔놓고 `<script setup>`은 기존 함수를 지우지 않은 채 새 함수를 밑에 붙여둔 상태라, `const selectCity`가 18행과 26행에 두 번 선언되어 있었다. 이전 선언을 지우면 끝나는 문제였지만, 이런 어중간한 상태가 리팩터링 중에 계속 만들어졌다. template과 script를 같이 고쳐야 하는 작업에서는 한쪽만 반영된 채로 저장하기가 쉬워서, 그 뒤로는 고칠 위치를 먼저 확인하고 하나씩 지워가면서 작업했다.


#### TS-02. watcher는 도는데 화면만 안 바뀜

정렬 체크박스를 눌렀더니 콘솔에는 `[본인 watch] 정렬 기준 변경: false → true`가 잘 찍히는데 정작 카드 순서는 그대로였다. watch가 돌고 있다는 건 반응성 자체는 살아있다는 뜻이라서 computed 쪽이 잘못됐나 싶어 들여다봤는데, `sortedWeatherList`는 멀쩡하게 만들어놓고 `v-for`는 여전히 `filteredWeatherList`를 바라보고 있었다.

상태를 아무리 잘 만들어도 화면이 그걸 읽지 않으면 아무 일도 일어나지 않는다는 걸 여기서 확인했고, 그 뒤로는 computed를 새로 만들 때마다 이걸 실제로 누가 읽고 있는지를 같이 확인하게 됐다.

#### TS-03. `onMounted`가 다시 실행되지 않음

도시 비교 페이지에서 도시 두 개를 고르고 비교하기를 누르면 주소창은 `/compare/첫번째도시번호/두번째도시번호`로 바뀌는데 표가 안 바뀌었는데, 이상한 건 새로고침을 하면 또 제대로 나온다는 점이었다. 찾아보니 같은 컴포넌트 안에서 `route.params`만 바뀌는 경우 Vue는 컴포넌트를 새로 만들지 않고 재사용하기 때문에, 마운트가 다시 일어나지 않아 `onMounted`도 다시 돌지 않는 거였다.

```js
const cityA = computed(() => mockWeatherData.find((c) => c.id === route.params.cityA))
```

그래서 `onMounted`에서 `ref`에 담아두는 방식을 버리고 `route.params`에서 바로 파생시키는 `computed`로 바꿨더니 해결됐다. 한편 `WeatherDetailView`는 항상 대시보드를 거쳐 들어오기 때문에 같은 구조여도 `onMounted`로 문제가 없었다. 화면에 머문 채로 파라미터만 바뀌는 `CompareView`라서 문제가 됐던 거고, 같은 기능이라도 진입 경로에 따라 써야 하는 도구가 달라질 수 있다는 걸 알게되었다.

#### TS-04. `defineProps` 반환값 오류

`props.tempMap`을 참조하는 곳에서 에러가 났는데, 한참 들여다보다가 `defineProps({...})`를 호출만 해놓고 반환값을 아무 데도 받지 않은 채 `<script>`에서 `props`를 쓰고 있었다는 걸 발견했다. 심지어 props가 `ref`인 줄 알고 `.value`까지 붙여놔서 틀린 게 두 겹이었다.

```js
const props = defineProps({ ... })   // template 전용이면 const 불필요
const temp = props.tempMap[id]        // .value 없이 접근
```

`<template>`에서만 쓸 거라면 `defineProps({...})`만 호출해도 되지만, `<script>`에서도 쓰려면 반환값을 받아둬야 한다. 이 프로젝트 안에서도 `SearchBar`는 전자고 `WeatherCard`와 `KoreaMap`은 후자라서 컴포넌트마다 모양이 달랐는데, 그게 처음에 헷갈렸던 원인이었다.

---

### API 연동

#### TS-05. 504 Gateway Timeout

17개 시/도의 미세먼지를 에어코리아 API를 통해 불러오는데 일부 지역만 성공하고 나머지는 504 에러가 발생했다. 게다가 새로고침을 할 때마다 성공하는 지역이 바뀌었다. 처음에는 서버가 불안정한 탓으로 생각했는데, 방금 전 시도에서 됐던 지역이 다음 시도에서 안 될 이유가 없다는 생각이 들어서 지역별로 요청 시간을 재봤다.

```
서울  122ms    (정상)
인천  115ms    (정상)
경기  5016ms   (5초)
강원  10925ms  (11초) ← 이후 요청부터 타임아웃
```

같은 서버에 같은 코드로 같은 순간에 보낸 요청인데 100ms짜리와 11초짜리가 섞여 있었다. 원인은 `Promise.all`로 17개의 요청을 동시에 보낸 데 있었다. 에어코리아가 동시 접속을 내부에서 줄 세워 처리하는데, 그 대기 시간이 게이트웨이 타임아웃을 넘긴 요청부터 504가 떨어지는 구조였던 것이다. 요청을 4개씩 청크로 나눠서도 보내봤지만 여전히 실패해서 결국 완전 순차로 바꿨고, 한 지역이 실패해도 나머지는 계속 돌 수 있도록 지역별 `try/catch`도 같이 넣었다.

#### TS-06. 429 Too Many Requests

API 요청을 순차로 바꿔서 504는 잡았는데, 이번에는 대부분의 요청이 429로 실패하기 시작했다.

```
[warn] 경기 미세먼지 조회 실패, 건너뜀: Request failed with status code 429
```

알고 보니 해당 API의 일일 트래픽 한도가 500회였는데, 디버깅하는 과정에서 새로고침을 반복하며 한 번에 호출이 17회씩 쌓이면서 한도를 모두 소진해버렸다. 이를 초기화될 때까지 기다릴 수 없어서, 키 없이 쓸 수 있는 Open-Meteo Air Quality로 교체하기로 했다.

```js
// 좌표 17개를 콤마로 이어붙여 요청 1번으로 전 지역 조회
const latitude  = koreaRegions.map((r) => r.lat).join(',')
const longitude = koreaRegions.map((r) => r.lon).join(',')
axios.get(AIR_URL, { params: { latitude, longitude, current: 'pm2_5' } })
```

| | 변경 전 (에어코리아) | 변경 후 (Open-Meteo) |
| --- | --- | --- |
| API 키 | 필요 | 불필요 |
| 요청 수 | 17회 순차 | 1회 |
| 일일 한도 | 있음 | 무관 |

API를 교체하면서 좌표 17개를 이어붙여 한 번에 조회하는 방식으로 바꿨더니 요청이 1회로 줄었고, 에러도 전부 사라졌다. 재시도 로직을 정교하게 짜는 것보다 애초에 호출 횟수를 줄이는 쪽이 훨씬 확실한 해결이었다. 개발하는 동안 API를 얼마나 호출하고 있는지 전혀 파악하지 못하고 있었는데, 트래픽도 관리해야 하는 자원이라는 걸 이때 다시금 깨달았다.

#### TS-07. OpenWeatherMap의 언어

OpenWeatherMap이 한국어를 지원한다고 하여 `lang=kr`을 붙였는데 지명이 계속 영문으로 나왔다. 파라미터를 잘못 쓴건가 싶어 문서를 찾다가, 같은 좌표로 언어만 바꿔서(영/한) 두번 호출하여 직접 비교해봤다.

| 필드 | `lang=kr` | `lang=en` |
| --- | --- | --- |
| `weather[0].description` | 온흐림 | overcast clouds |
| `name` | Seoul | Seoul |

결과를 놓고 보니 `lang`은 날씨에 대한 설명(`description`)만 번역하고 지명(`name`)은 번역해주지 않았다. 문서를 읽으면서 추측만 거듭하는 것보다 조건 두 개를 나란히 호출해서 비교하는 쪽이 훨씬 확실했고, 이 결과를 보고 나서 UI 상에서 "클릭한 지역"과 "실제 관측 지점"을 분리해서 보여주기로 정했다.

---

### CSS / 레이아웃

#### TS-08. 전역 규칙이 지역 규칙을 이기는 경우

지도 범례에 `display: flex; flex-wrap: wrap`을 줬는데도 항목이 계속 세로로 쌓였다. flex를 줬는데 왜 세로로 쌓이지 싶어서 `getComputedStyle()`로 실제 적용된 값을 확인해보니 `flex-direction`이 `column`으로 잡혀 있었다.

```css
.practice-section ul {
  display: flex;
  flex-direction: column;   /* ← 범례도 .practice-section 안의 ul */
}
```

원인은 `main.css`에 넣어둔 전역 규칙이었다. 범례도 결국 `.practice-section` 안의 `ul`이니 이 규칙에 걸리는 게 당연했고, `.legend`에 `flex-direction`을 따로 지정하지 않아 전역값이 그대로 남아 있었다.

#### TS-09. 범례를 고쳤더니 지도 레이아웃이 통째로 깨짐

범례를 가로로 바꾸자마자 이번에는 지도와 상세 카드가 위아래로 갈라졌다. 따라가보니 범례가 가로로 펼쳐지면서 `.info-panel`의 폭이 424px까지 늘어났고, 지도 480px + 패널 424px + gap 32px이 컨테이너 폭을 넘어가면서 `flex-wrap: wrap`이 발동했다.

이것을 `.info-panel { width: 280px; flex-shrink: 0; }`으로 폭을 고정하여 해결했다. 자식 하나의 내용물이 바뀌었을 뿐인데 형제 요소의 배치까지 무너질 수 있다는 걸 확인했으며, 콘텐츠에 따라 폭이 정해지는 요소는 언제든 커질 수 있으니 레이아웃을 지탱하는 쪽에는 폭을 명시해두는 게 안전하다는 결론을 얻었다.

#### TS-10. 화면 절반이 비어 있던 이유

모든 페이지에서 콘텐츠가 화면 왼쪽 절반에만 나오고 있었다. 한동안은 그대로 사용했는데, 지도를 만들면서부터는 화면이 좁아 작업을 진행하기 어려웠다.

```css
@media (min-width: 1024px) {
  #app { display: grid; grid-template-columns: 1fr 1fr; }
}
```

원인은 Vue 스캐폴드가 기본으로 깔아준 `main.css`의 이 규칙이었다. 원래는 왼쪽에 로고, 오른쪽에 문서 링크를 배치하려고 들어 있던 건데, 스캐폴드 콘텐츠를 다 지우면서 이 규칙이 남아있는 걸 모르고 있었다. 블록을 지우니 바로 해결됐다. 스캐폴드가 만들어준 것 중 안 쓰는 부분을 정리하지 않고 두면 한참 뒤에 원인을 알 수 없는 현상으로 돌아온다는 걸 알게됐다.

---

### 기타

#### TS-11. Element Plus 컴포넌트가 렌더링되지 않음

`<el-button>`이 화면에 나오지 않았다. import도 했고 CSS도 불러왔는데 태그가 그대로 무시되는 상태였는데, 원인은 `main.js`에서 `app.use(ElementPlus)`가 `app.mount('#app')` 뒤에 있었던 것이었다. Vue는 `mount()` 시점에 첫 렌더링을 하기 때문에 그때까지 등록되지 않은 컴포넌트는 해석에 실패하고, 나중에 `use()`를 호출해도 이미 그려진 화면은 다시 그려지지 않는다.

`use()`를 `mount()` 앞으로 옮기니 바로 나왔다. 강의자료 예제에도 그 순서로 되어 있었는데, 그 순서에 이유가 있다는 걸 이때 알았다.

---

## 배운 점 / 알게 된 점

### Vue

- `:key`에 `index`를 쓰면 목록 순서가 바뀔 때 같은 index가 다른 데이터를 가리키게 되면서 Vue가 DOM을 잘못 재사용하고, 입력값이나 상태가 엉뚱한 카드에 옮겨 붙는 버그가 여기서 나온다는 걸 알게 됐다.
- `v-if`와 `v-show`는 비슷한 기능이라고만 생각했는데, 토글이 잦은 곳에는 CSS만 건드리는 `v-show`가, 초기 렌더 비용을 아끼고 싶은 곳에는 DOM을 아예 만들지 않는 `v-if`가 맞다는 식으로 쓰임새가 갈렸다.
- `v-model`이 `:value` + `@input`의 축약이라는 건 직접 풀어 써보고 나서야 정확히 이해됐다. 풀어 쓰면 한글 IME로 조합하는 중에도 값이 바로 동기화되기 때문에, 실시간 검색창에서는 그 차이가 눈에 보인다.
- slot으로 넘긴 내용은 자식 컴포넌트 안에 그려지지만 컴파일은 부모 스코프에서 된다. 보이는 위치와 스코프가 다를 수 있다는 걸 이해하고 나니 쓸데없는 props 중계를 만들지 않게 됐다.
- 같은 기능이라도 화면에 머문 채 파라미터만 바뀌는 화면이면 `computed`로 파생시켜야 하고, 매번 새로 진입하는 화면이면 `onMounted`로 충분하다. 상황에 따라 맞는 도구가 갈린다.
- Pinia에서 state나 getters를 구조분해하면 반응성이 끊긴다는 것도 알게 됐다. `storeToRefs()`로 감싸거나 `store.xxx` 형태로 접근해야 한다.

### API 연동

- 재시도 로직을 정교하게 만드는 것보다 호출 횟수 자체를 17회에서 1회로 줄이는 쪽이 나았다. 이미 생긴 문제를 잘 처리하는 것보다 문제가 생길 여지를 없애는 게 근본적인 해결이라는 걸 이 일을 통해 배웠다.

### 디버깅 방법론

추측하는 것보다 측정하는 것이 더 빠르다고 느꼈다. "왜 안 되지?"를 붙잡고 고민하는 시간보다 실제로 뭐가 나갔는지 확인하는 시간이 훨씬 생산적이어서, 요청은 `performance.getEntriesByType('resource')`로, 스타일은 `getComputedStyle()`로, 화면에 실제 그려진 내용은 `innerHTML` 검색으로 확인하는 습관이 생겼다. 재현 조건을 실제 조건과 맞추는 것도 중요했다.

---

## 느낀 점

시작할 때는 이 과제가 코드를 쓰는 일이라고 생각했는데, 막상 해보니 대부분의 시간은 왜 안 되는지를 알아내는 데 들어갔다. 과제 1~5의 순수 Vue 문법 부분은 강의자료를 따라가다보면 크게 막히는 곳 없이 실습할 수 있었다. API 키 인코딩, 서버 동시성, 트래픽 한도, SVG 좌표계처럼 강의자료 이외의 내용에 대해 시간을 많이 투자하였다.

과제 5까지는 코드를 직접 입력하고 적용해보며 강의자료를 위주로 참고하였고, 그 이후 외부 API를 연동하고 SVG 지도에서 지역을 선택해 그 지역의 날씨를 확인하는 기능을 만드는 과정은 바이브 코딩으로 시도했다. AI와 함께 코드를 만들어 가면서 서버리스 프록시 등 몰랐던 개념들을 접하며 배울 수 있었고, 배포까지 직접 해보면서 직접 만든 서비스가 이런 방식으로 상용화될 수 있다는 것을 알게 된 점이 특히 재미있었다.

같은 증상이 전혀 다른 원인에서 나올 수 있다는 건 미세먼지를 붙이면서 직접 겪었다. "미세먼지가 안 나온다"는 증상 하나를 두고 이중 인코딩(403), 동시 요청 과부하(504), 트래픽 소진(429)까지 세 가지 다른 원인을 차례로 통과했는데, 고칠 때마다 이번에는 해결됐으리라 기대했지만, 새로고침할 때마다 새로운 에러를 만났다. 그래도 그때마다 다음에 뭘 해야 할지는 에러 코드가 알려줬다.

코드는 그대로인데 결과가 달라지니 처음에는 당연히 서버 탓을 했는데, 파고들어 보니 된다고 확인했을 때의 방법(순차 재시도)과 앱이 실제로 하는 일(동시 요청)이 애초에 다른 조건이었다. 검증하는 방법이 틀리면 검증 결과도 믿을 수 없다는 걸 이 문제로 배웠다.

---

## 과제 완료 현황 및 개선 여지

### 과제 8 — Build & Deployment (274p) — 완료

[Vercel 배포](https://skala-weather-omega.vercel.app)로 호스팅했고, 빌드·배포 과정에서 확인한 항목은 다음과 같다.

| 확인 | 결과 |
| --- | --- |
| ESLint·oxlint 검사 | Error 0건 |
| `npm run build` | 성공 |
| API 키 | `.gitignore`(`*.local`) + 서버리스 프록시 — 번들·네트워크에서 미검출 |
| 실시간 날씨 데이터 | 카드 8장 정상 |
| 지도 3개 모드 | 기온·강수량·미세먼지 모두 동작 |
| 중첩 경로 직접 접속 (`/weather4/city_01`) | 200 (SPA rewrite 동작) |
| 정의되지 않은 경로 (`/kk`) | NotFound 화면 |

### 개선 여지

- **`displayTemp` 중복** — 섭씨/화씨 변환 함수가 6개 파일에 거의 똑같이 들어가 있다. Composable(`useDisplayTemp`)로 묶으면 한 곳으로 줄어든다.

---

## 데이터 출처

| 데이터 | 제공처 | 라이선스 / 조건 |
| --- | --- | --- |
| 현재 날씨, 5일 예보 | [OpenWeatherMap](https://openweathermap.org/) | Free Tier (60 calls/min) |
| 시간당 강수량, 강수 형태 | [기상청 초단기실황조회](https://www.data.go.kr) | 공공데이터포털 |
| 초미세먼지(PM2.5) | [Open-Meteo Air Quality](https://open-meteo.com/) | 비상업적 이용 무료, 키 불필요 |
| 대한민국 시/도 SVG | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Map_of_South_Korea-blank.svg) | Public Domain (제작: Ksiom) |
| 미세먼지 등급 기준 | 환경부 대기환경기준 | — |
| 강수 강도 기준 | 기상청 예보 용어 (시간당 3/15/30mm) | — |