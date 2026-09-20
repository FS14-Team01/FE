# 최애의 포토 Frontend

최애의 포토는 나만의 포토카드를 만들고, 다른 사용자와 거래하거나 교환할 수 있는 서비스입니다. 직접 이미지를 편집해 카드를 만들고, 마이갤러리에서 모은 카드를 관리할 수 있습니다.

이 저장소는 Next.js로 구현한 프론트엔드입니다. 포토카드 제작부터 구매와 교환까지 서비스 이용에 필요한 화면과 API 연동을 담고 있습니다.

## 저장소 구성

| 저장소 | 역할 | 배포 |
| --- | --- | --- |
| [FE](https://github.com/FS14-Team01/FE) | Next.js 프론트엔드 | Netlify |
| [BE](https://github.com/FS14-Team01/BE) | Express API 및 Prisma | Render |

## 링크

| 구분 | URL |
| --- | --- |
| 프론트엔드 | https://fs14-mfp.netlify.app |
| 백엔드 API | https://fs14-mfp.onrender.com |

> 무료 서버를 사용하므로 첫 요청의 응답이 늦을 수 있습니다.

## 주요 기능

- 회원가입, 로그인 및 토큰 기반 인증
- 이미지 편집과 포토카드 생성
- 포토카드 판매, 구매 및 교환
- 마이갤러리와 판매 내역 관리
- 랜덤 포인트 및 알림 관리

## 기술 스택

| 구분 | 기술 |
| --- | --- |
| Framework | Next.js 16, React 19 |
| Server State | TanStack Query |
| HTTP Client | Axios |
| Styling | CSS Modules |
| Image | react-image-crop |
| Deployment | Netlify |

## 시작하기

### 요구사항

- Node.js 20 이상
- npm
- 로컬에서 실행 중인 백엔드 서버

### 설치 및 실행

```bash
npm ci
cp .env.example .env.local
npm run dev
```

브라우저에서 http://localhost:3000으로 접속합니다.

## 환경변수

`.env.local`에 백엔드 API 주소를 등록합니다.

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

API 주소 마지막에는 `/`를 붙이지 않습니다.

## 명령어

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 실행 |
| `npm run lint` | ESLint 검사 |

## 프로젝트 구조

```text
src/
├── app/          # 페이지와 레이아웃
├── components/   # 공통 컴포넌트
├── constants/    # 공통 상수
├── features/     # 기능별 API, 컴포넌트, 훅
├── hooks/        # 공통 훅
├── lib/          # API 클라이언트와 공통 설정
└── providers/    # 전역 Provider
```

## 배포

`main` 브랜치에 변경사항이 병합되면 Netlify에서 자동으로 배포됩니다.

자세한 설정과 재배포 방법은 [DEPLOYMENT.md](./DEPLOYMENT.md)를 참고하세요.
