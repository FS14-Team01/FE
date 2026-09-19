# 프론트엔드 배포 가이드

## 배포 정보

- 배포 플랫폼: Netlify
- 배포 브랜치: `main`

## 배포 절차

1. GitHub 저장소와 Netlify를 연결한다.
2. 배포 브랜치로 `main`을 선택한다.
3. Build settings와 Environment variables를 입력한다.
4. `Deploy`를 실행한다.
5. 이후 `main` 브랜치에 변경사항이 병합되면 자동으로 다시 배포된다.

환경변수를 변경한 경우 `Deploys → Trigger deploy`에서 다시 배포한다. 캐시 문제가 의심되면 `Clear cache and deploy site`를 실행한다.

## Netlify 설정

### Build settings

| 항목 | 값 |
| --- | --- |
| Branch to deploy | `main` |
| Base Directory | 비워두기 |
| Build Command | `npm run build` |
| Publish Directory | `.next` |
| Functions Directory | 기본값 유지 |

### Environment variables

| Key | Value |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | 배포한 Render 백엔드 주소 |
| `NODE_VERSION` | `20` |

`NEXT_PUBLIC_API_URL` 마지막에는 `/`를 붙이지 않는다.

## 백엔드 연결

Netlify 배포가 완료되면 Render 백엔드의 `FRONTEND_URL`에 발급된 Netlify 주소를 등록한다.

```env
FRONTEND_URL=https://<netlify-site-name>.netlify.app
```

`FRONTEND_URL` 마지막에는 `/`를 붙이지 않는다.

## 배포 후 확인

- 페이지와 이미지 표시
- 회원가입 및 로그인
- 포토카드 생성
- 새로고침 후 로그인 유지
- 백엔드 API 요청

## 주의사항

- 실제 환경변수나 비밀키를 Git에 올리지 않는다.
- `.env.local`은 로컬 개발에만 사용한다.
- `main` 브랜치에는 PR을 통해 병합한다.
