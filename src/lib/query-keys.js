/*
 * React Query key 팩토리. 배열을 직접 쓰지 않고 항상 여기서 만듭니다.
 *
 * 무효화는 남의 도메인까지 건드리므로 key를 기능 폴더에 흩어두면 빠뜨리게 됩니다.
 * [도메인, 범위, 파라미터] 3단 구조이며 앞부분이 겹치면 함께 무효화됩니다.
 * filters의 limit은 값이 바뀌면 다른 요청이라 포함하고,
 * cursor는 useInfiniteQuery가 pageParam으로 관리하므로 넣지 않습니다.
 */

/* 마켓플레이스 판매글 — GET /sales, GET /sales/:saleId */
export const marketKeys = {
  all: ['market'],
  lists: () => [...marketKeys.all, 'list'],
  /** filters: { keyword, grade, category, status, sort, limit } */
  list: (filters) => [...marketKeys.lists(), filters],
  details: () => [...marketKeys.all, 'detail'],
  detail: (saleId) => [...marketKeys.details(), saleId],
};

/* 마이갤러리 — GET /users/me/ownerships */
export const galleryKeys = {
  all: ['gallery'],
  lists: () => [...galleryKeys.all, 'list'],
  /** filters: { keyword, grade, category, sort, limit } */
  list: (filters) => [...galleryKeys.lists(), filters],
};

/* 나의 판매 포토카드 — GET /users/me/sales */
// 명세상 검색·등급·카테고리 필터가 없어 마켓보다 filters가 좁습니다
export const saleKeys = {
  all: ['sale'],
  lists: () => [...saleKeys.all, 'list'],
  /** filters: { status, sort, limit } */
  list: (filters) => [...saleKeys.lists(), filters],
};

/* 포토카드 원본 — GET /photo-cards/:photoCardId */
// 생성 직후 이동하는 상세는 판매글이 아닌 카드 원본이라 marketKeys와 별개입니다
export const photoCardKeys = {
  all: ['photoCard'],
  details: () => [...photoCardKeys.all, 'detail'],
  detail: (photoCardId) => [...photoCardKeys.details(), photoCardId],
};

/* 교환 제안 — GET /sales/:saleId/exchange-offers, GET /users/me/exchange-offers */
export const exchangeKeys = {
  all: ['exchange'],
  received: () => [...exchangeKeys.all, 'received'],
  /** filters: { status, limit } */
  receivedBySale: (saleId, filters) => [
    ...exchangeKeys.received(),
    saleId,
    filters,
  ],
  sent: () => [...exchangeKeys.all, 'sent'],
  /** filters: { status, limit } */
  sentList: (filters) => [...exchangeKeys.sent(), filters],
  // 단건 조회는 제안자와 판매자가 모두 보므로 받은/보낸과 분리합니다
  details: () => [...exchangeKeys.all, 'detail'],
  detail: (exchangeOfferId) => [...exchangeKeys.details(), exchangeOfferId],
};

/* 알림 — GET /notifications */
// 안 읽은 알림은 전용 엔드포인트가 없어 { isRead: false } 목록으로 조회합니다
export const notificationKeys = {
  all: ['notification'],
  lists: () => [...notificationKeys.all, 'list'],
  /** filters: { isRead, type, limit } */
  list: (filters) => [...notificationKeys.lists(), filters],
};

/* 유저 — GET /users/me */
export const userKeys = {
  all: ['user'],
  me: () => [...userKeys.all, 'me'],
};

/* 포인트 — GET /points/me */
export const pointKeys = {
  all: ['point'],
  me: () => [...pointKeys.all, 'me'],
};
