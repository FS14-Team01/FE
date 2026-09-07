# ExchangeCard 사용 설명서

`ExchangeCard`는 교환 요청자가 제안한 포토카드와 교환 상태를 표시하는 UI 컴포넌트입니다. 현재 사용자와 교환 제안의 관계에 따라 취소 또는 승인·거절 버튼을 보여줍니다.

컴포넌트는 API 호출, 모달 표시, 교환 상태 변경, 목록 갱신을 직접 처리하지 않습니다. 상위 페이지 또는 `ExchangeOfferSection`에서 데이터를 준비하고 이벤트 콜백을 전달해야 합니다.

## 가져오기

```jsx
import { ExchangeCard } from '@/components/marketplace/ExchangeCard'
```

## 데이터 출처

### 교환 제안

다음 두 목록 API는 동일한 `item` 구조를 반환합니다.

- 요청자가 보낸 제안: `GET /users/me/exchange-offers`
- 판매자가 받은 제안: `GET /sales/:saleId/exchange-offers`

컴포넌트의 `exchangeOffer`에는 목록 API의 `item`을 그대로 전달합니다.

```js
{
  id: '50',
  status: 'PENDING',
  createdAt: '2026-09-02T12:00:00+09:00',
  requester: {
    id: '2',
    nickname: '랍스터',
  },
  offeredCard: {
    id: '11',
    name: "How Far I'll Go",
    imageUrl: 'https://example.com/card.png',
    grade: 'SUPER_RARE',
    category: 'POKEMON',
    description: '여름 바다 풍경을 담은 포토카드입니다.',
  },
  saleListing: {
    id: '30',
    price: 4,
  },
}
```

`offeredCard.description`은 포토카드를 생성할 때 등록한 설명이며 `null`일 수 있습니다. 교환 제안별 별도 메시지는 사용하지 않습니다.

### 판매 정보

교환 대상 카드와 판매자 정보는 `GET /sales/:saleId`로 조회합니다. `ExchangeCard`에는 해당 응답을 `sale`로 전달합니다.

컴포넌트가 역할 판별에 사용하는 최소 필드는 다음과 같습니다.

```js
{
  id: '30',
  seller: {
    id: '1',
    nickname: '판매자',
  },
}
```

카드에 표시하는 가격은 판매 상세 응답이 아니라 `exchangeOffer.saleListing.price`를 사용합니다.

## 기본 사용법

`currentUser`, `sale`, 교환 목록이 모두 준비된 후 렌더링합니다.

```jsx
if (!currentUser?.id || !sale || !exchangeOffers) {
  return <Loading />
}

return exchangeOffers.map((item) => (
  <ExchangeCard
    key={item.id}
    currentUserId={currentUser.id}
    exchangeOffer={item}
    sale={sale}
    isProcessing={processingId === item.id}
    errorMessage={errors[item.id] ?? ''}
    onAccept={({ exchangeOfferId }) =>
      openAcceptModal(exchangeOfferId)
    }
    onReject={({ exchangeOfferId }) =>
      openRejectModal(exchangeOfferId)
    }
    onCancel={({ exchangeOfferId }) =>
      openCancelModal(exchangeOfferId)
    }
  />
))
```

## Props

| 이름 | 필수 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `currentUserId` | 필수 | 없음 | 현재 로그인한 사용자의 ID입니다. |
| `exchangeOffer` | 필수 | 없음 | 교환 목록 API의 `item`입니다. |
| `sale` | 필수 | 없음 | `GET /sales/:saleId` 응답입니다. |
| `isProcessing` | 선택 | `false` | 처리 중이면 버튼을 비활성화하고 문구를 변경합니다. |
| `errorMessage` | 선택 | `''` | 카드 내부에 표시할 오류 문구입니다. |
| `onAccept` | 선택 | 없음 | 판매자가 승인 버튼을 눌렀을 때 실행됩니다. |
| `onReject` | 선택 | 없음 | 판매자가 거절 버튼을 눌렀을 때 실행됩니다. |
| `onCancel` | 선택 | 없음 | 요청자가 취소 버튼을 눌렀을 때 실행됩니다. |
| `className` | 선택 | `''` | 외부에서 추가할 CSS 클래스입니다. |

역할에 필요한 콜백이 전달되지 않으면 해당 버튼은 비활성화됩니다.

## 역할 판별

컴포넌트는 먼저 교환 제안과 현재 상세 페이지의 판매글이 같은지 확인합니다.

```js
const isMatchingSale = sale.id === exchangeOffer.saleListing.id
```

판매글이 일치할 때 현재 사용자를 다음과 같이 구분합니다.

```js
const isRequester =
  isMatchingSale && currentUserId === exchangeOffer.requester.id

const isSeller =
  isMatchingSale && currentUserId === sale.seller.id
```

| 교환 역할 | 조건 | `PENDING` 상태 UI |
| --- | --- | --- |
| 요청자 | `currentUserId === requester.id` | 취소 버튼 |
| 판매자 | `currentUserId === sale.seller.id` | 승인·거절 버튼 |
| 조회자 | 어느 역할에도 해당하지 않음 | 버튼 없이 `대기 중` 표시 |

판매 상세 페이지의 `buyer` 역할과 교환 제안의 `requester` 역할은 다릅니다. 상위 페이지는 판매자·구매자 영역을 조립하고, `ExchangeCard`는 각 제안에서 요청자·판매자 관계를 확인합니다.

## 버튼 이벤트

모든 버튼 콜백에는 다음 객체가 전달됩니다.

```js
{ exchangeOfferId: '50' }
```

콜백은 상위 컴포넌트에서 모달을 열거나 상태 변경 요청을 시작할 때 사용합니다.

```http
PATCH /exchange-offers/:exchangeOfferId
```

`ExchangeCard`는 API를 직접 호출하거나 응답 상태를 내부에 저장하지 않습니다.

## 상태별 표시

| `exchangeOffer.status` | 표시 내용 |
| --- | --- |
| `PENDING` | 역할에 맞는 처리 버튼 또는 `대기 중` |
| `ACCEPTED` | `승인 완료` |
| `REJECTED` | `거절 완료` |
| `CANCELLED` | `취소됨` |

두 목록 API는 `PENDING` 상태만 반환합니다. 승인·거절·취소 처리 후 서버 목록을 다시 조회하면 처리된 카드는 목록에서 사라집니다. 처리 직후 상위 화면이 응답 상태를 반영한 경우에만 완료 문구가 일시적으로 표시될 수 있습니다.

## `ExchangeOfferSection`에서 사용할 때

- 판매자 영역은 `GET /sales/:saleId/exchange-offers`를 사용합니다.
- 요청자 영역은 `GET /users/me/exchange-offers`를 사용합니다.
- `sale`은 `SaleDetailPage`에서 한 번 조회한 뒤 각 카드에 공유합니다.
- 각 카드가 판매 상세 API를 따로 호출하지 않도록 합니다.

`GET /users/me/exchange-offers`는 여러 판매글의 제안을 반환할 수 있습니다. 현재 판매글의 제안만 표시하려면 서버의 `saleId` 필터 지원이 필요합니다. 페이지네이션된 한 페이지를 클라이언트에서만 필터링하면 해당 판매글의 제안을 놓칠 수 있습니다.

## 컴포넌트 책임 범위

`ExchangeCard`가 담당합니다.

- 교환 제안 카드 UI
- 등급·카테고리·가격·요청자 표시
- 현재 판매글 일치 여부 확인
- 현재 사용자 ID를 기준으로 요청자·판매자·조회자 역할 판별
- 요청자·판매자에 따른 버튼 구분
- 처리 중·오류·완료 상태 표시
- 클릭 이벤트 전달

상위 페이지 또는 기능 컴포넌트가 담당합니다.

- API 호출 및 페이지네이션
- 현재 사용자와 판매 상세 조회
- 승인·거절·취소 확인 모달
- 상태 변경 요청과 서버 캐시 갱신
- 토스트, 오류 복구, 페이지 이동

역할 판별은 버튼 노출을 위한 UI 확인입니다. 실제 작업 권한은 상태 변경 API에서 서버가 다시 검증해야 합니다.

## 스타일

- 데스크톱: 기본 스타일
- 태블릿: `@media (max-width: 1199px)`
- 모바일: `@media (max-width: 743px)`
- 색상: `globals.css`의 전역 색상 변수만 사용

별도의 화면 크기 prop은 필요하지 않습니다. 이미지가 없으면 전역 회색 배경이 표시되고, 설명이 `null`이면 설명 문구를 렌더링하지 않습니다.
