# 프론트엔드 배포 가이드

## 구성

- 플랫폼: Netlify
- 테스트 브랜치: `deploy-test`
- 운영 브랜치: `main` 예정

## 환경 변수

Netlify의 **Environment variables**에 등록한다.

| 변수 | 설명 |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Render 백엔드 주소. 끝에 `/`를 붙이지 않는다. |

실제 값은 `.env.example`이나 Git에 올리지 않는다.

## Netlify 설정

| 항목 | 값 |
| --- | --- |
| Runtime | `Next.js` |
| Base directory | `/` |
| Build command | `npm run build` |
| Publish directory | `.next` |

## 테스트 배포

1. `deploy-test` 브랜치를 GitHub에 push한다.
2. Netlify에서 조직의 FE 저장소와 `deploy-test` 브랜치를 연결한다.
3. `NEXT_PUBLIC_API_URL`을 등록하고 배포한다.
4. 발급된 Netlify 주소를 백엔드의 `FRONTEND_URL`에 등록한다.

## 확인 항목

- 페이지 및 이미지 표시
- Render API 요청
- 회원가입과 로그인
- 포토카드 생성

## 트러블슈팅

- 이 프로젝트는 동적 경로를 사용하므로 `output: "export"` 방식의 폴더 배포를 사용하지 않는다.
- `publish directory cannot be the same as base directory` 오류가 나면 Publish directory가 `.next`인지 확인한다.
- API가 `localhost`를 호출하면 `NEXT_PUBLIC_API_URL`을 확인하고 다시 배포한다.

## 정식 배포 예정

- `main` 브랜치 운영 배포
- GitHub Actions CI
- PR Preview 및 자동 배포
